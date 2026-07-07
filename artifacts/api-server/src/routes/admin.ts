import { Router } from "express";
import { supabase, camelToSnake, snakeToCamel, mapRows } from "@workspace/db";
import { requireAdmin } from "../middlewares/auth.js";
import { logAudit } from "../middlewares/audit.js";
import uploadRouter from "./upload.js";

const router = Router();

router.use(requireAdmin);

router.get("/businesses", async (_req, res) => {
  const { data, error } = await supabase!.from("businesses").select("*").order("order");
  if (error) return res.status(500).json({ error: error.message });
  res.json(mapRows(data ?? []));
});

router.post("/businesses", async (req, res) => {
  const { data, error } = await supabase!.from("businesses").insert(camelToSnake(req.body)).select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(snakeToCamel(data![0]));
});

router.put("/businesses/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { data, error } = await supabase!.from("businesses").update(camelToSnake(req.body)).eq("id", id).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(snakeToCamel(data![0]));
});

router.delete("/businesses/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { error } = await supabase!.from("businesses").delete().eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).end();
});

router.post("/businesses/bulk-delete", async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ error: "ids array is required" });
  const { error } = await supabase!.from("businesses").delete().in("id", ids);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).end();
});

router.post("/businesses/bulk-status", async (req, res) => {
  const { ids, status } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ error: "ids array is required" });
  if (!status) return res.status(400).json({ error: "status is required" });
  const { error } = await supabase!.from("businesses").update(camelToSnake({ status })).in("id", ids);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

router.get("/products", async (_req, res) => {
  const { data, error } = await supabase!.from("products").select("*").order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(mapRows(data ?? []));
});

router.post("/products", async (req, res) => {
  const { data, error } = await supabase!.from("products").insert(camelToSnake(req.body)).select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(snakeToCamel(data![0]));
});

router.put("/products/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { data, error } = await supabase!.from("products").update(camelToSnake(req.body)).eq("id", id).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(snakeToCamel(data![0]));
});

router.delete("/products/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { error } = await supabase!.from("products").delete().eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).end();
});

router.post("/products/bulk-delete", async (req, res) => {
  const { ids } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ error: "ids array is required" });
  const { error } = await supabase!.from("products").delete().in("id", ids);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).end();
});

router.post("/products/bulk-status", async (req, res) => {
  const { ids, status } = req.body;
  if (!Array.isArray(ids) || ids.length === 0) return res.status(400).json({ error: "ids array is required" });
  if (!status) return res.status(400).json({ error: "status is required" });
  const { error } = await supabase!.from("products").update(camelToSnake({ status })).in("id", ids);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ success: true });
});

function csvEscape(val: unknown): string {
  if (val === null || val === undefined) return "";
  const str = String(val);
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

const PRODUCT_EXPORT_FIELDS = ["Name", "Category", "CategorySlug", "Description", "LongDescription", "ImageUrl", "Featured", "BusinessSlug", "Tags", "Status"];

router.get("/products/export", async (_req, res) => {
  const { data, error } = await supabase!.from("products").select("*").order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });

  const headers = PRODUCT_EXPORT_FIELDS;
  const csvRows = (data ?? []).map((row: Record<string, unknown>) => [
    csvEscape(row.name),
    csvEscape(row.category),
    csvEscape(row.category_slug),
    csvEscape(row.description),
    csvEscape(row.long_description),
    csvEscape(row.image_url),
    csvEscape(row.featured ? "Yes" : "No"),
    csvEscape(row.business_slug),
    csvEscape(Array.isArray(row.tags) ? (row.tags as string[]).join("|") : ""),
    csvEscape(row.status),
  ].join(","));

  const csv = [headers.join(","), ...csvRows].join("\r\n");

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader("Content-Disposition", 'attachment; filename="products-export.csv"');
  res.status(200).send(csv);
});

import multer from "multer";

const csvUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

router.post("/products/import", csvUpload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No CSV file provided" });
    }

    const content = file.buffer.toString("utf-8");
    const lines = content.split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) {
      return res.status(400).json({ error: "CSV must have a header row and at least one data row" });
    }

    const parseCSVLine = (line: string): string[] => {
      const result: string[] = [];
      let current = "";
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (inQuotes) {
          if (ch === '"') {
            if (i + 1 < line.length && line[i + 1] === '"') {
              current += '"';
              i++;
            } else {
              inQuotes = false;
            }
          } else {
            current += ch;
          }
        } else {
          if (ch === '"') {
            inQuotes = true;
          } else if (ch === ",") {
            result.push(current.trim());
            current = "";
          } else {
            current += ch;
          }
        }
      }
      result.push(current.trim());
      return result;
    };

    const headers = parseCSVLine(lines[0]).map((h) => h.trim());
    const expectedHeaders = PRODUCT_EXPORT_FIELDS;

    const headerMap: Record<string, number> = {};
    for (const h of expectedHeaders) {
      const idx = headers.findIndex((ch) => ch.toLowerCase() === h.toLowerCase());
      if (idx >= 0) headerMap[h] = idx;
    }

    const { data: categories } = await supabase!.from("categories").select("*").eq("type", "product");
    const categoryMap: Record<string, { slug: string; name: string }> = {};
    for (const cat of (categories ?? [])) {
      categoryMap[cat.slug.toLowerCase()] = { slug: cat.slug, name: cat.name };
      categoryMap[cat.name.toLowerCase()] = { slug: cat.slug, name: cat.name };
    }

    const inserted: Record<string, unknown>[] = [];
    const errors: { row: number; message: string }[] = [];

    for (let i = 1; i < lines.length; i++) {
      const rowNum = i + 1;
      const values = parseCSVLine(lines[i]);

      const getVal = (field: string): string => {
        const idx = headerMap[field];
        return idx !== undefined ? (values[idx] ?? "") : "";
      };

      const name = getVal("Name");
      const categoryVal = getVal("Category");
      const categorySlugVal = getVal("CategorySlug");

      if (!name) {
        errors.push({ row: rowNum, message: "Name is required" });
        continue;
      }
      if (!categoryVal && !categorySlugVal) {
        errors.push({ row: rowNum, message: "Either Category or CategorySlug is required" });
        continue;
      }

      let resolvedCategory = categoryVal;
      let resolvedSlug = categorySlugVal;

      if (categorySlugVal && categoryMap[categorySlugVal.toLowerCase()]) {
        const match = categoryMap[categorySlugVal.toLowerCase()];
        resolvedCategory = resolvedCategory || match.name;
        resolvedSlug = match.slug;
      } else if (categoryVal && categoryMap[categoryVal.toLowerCase()]) {
        const match = categoryMap[categoryVal.toLowerCase()];
        resolvedCategory = match.name;
        resolvedSlug = match.slug;
      }

      if (!resolvedSlug) {
        resolvedSlug = categorySlugVal || categoryVal.toLowerCase().replace(/\s+/g, "-");
      }

      const tagsRaw = getVal("Tags");
      const tags = tagsRaw ? tagsRaw.split("|").filter(Boolean).map((t) => t.trim()) : [];

      const row: Record<string, unknown> = {
        name,
        category: resolvedCategory || categoryVal,
        category_slug: resolvedSlug,
        description: getVal("Description") || " ",
        long_description: getVal("LongDescription") || null,
        image_url: getVal("ImageUrl") || null,
        featured: getVal("Featured")?.toLowerCase() === "yes" || getVal("Featured")?.toLowerCase() === "true",
        business_slug: getVal("BusinessSlug") || null,
        tags,
        status: getVal("Status") || "active",
      };

      inserted.push(row);
    }

    let successCount = 0;
    if (inserted.length > 0) {
      const { data: result, error: insertError } = await supabase!.from("products").insert(inserted).select();
      if (insertError) {
        return res.status(500).json({ error: `Import failed: ${insertError.message}`, inserted: 0, errors: [{ row: 0, message: insertError.message }] });
      }
      successCount = result?.length ?? 0;
    }

    res.status(201).json({ inserted: successCount, errors: errors.length > 0 ? errors : undefined });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Import failed";
    res.status(500).json({ error: message, inserted: 0 });
  }
});

router.get("/news", async (_req, res) => {
  const { data, error } = await supabase!.from("news").select("*").order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(mapRows(data ?? []));
});

router.post("/news", async (req, res) => {
  const { data, error } = await supabase!.from("news").insert(camelToSnake(req.body)).select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(snakeToCamel(data![0]));
});

router.put("/news/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { data, error } = await supabase!.from("news").update(camelToSnake(req.body)).eq("id", id).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(snakeToCamel(data![0]));
});

router.delete("/news/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { error } = await supabase!.from("news").delete().eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).end();
});

router.get("/jobs", async (_req, res) => {
  const { data, error } = await supabase!.from("jobs").select("*").order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(mapRows(data ?? []));
});

router.post("/jobs", async (req, res) => {
  const { data, error } = await supabase!.from("jobs").insert(camelToSnake(req.body)).select();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(snakeToCamel(data![0]));
});

router.put("/jobs/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { data, error } = await supabase!.from("jobs").update(camelToSnake(req.body)).eq("id", id).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(snakeToCamel(data![0]));
});

router.delete("/jobs/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { error } = await supabase!.from("jobs").delete().eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  res.status(204).end();
});

router.get("/contacts", async (_req, res) => {
  const { data, error } = await supabase!.from("contacts").select("*").order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(mapRows(data ?? []));
});

router.put("/contacts/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { data, error } = await supabase!.from("contacts").update(camelToSnake(req.body)).eq("id", id).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(snakeToCamel(data![0]));
});

router.get("/business-inquiries", async (_req, res) => {
  const { data, error } = await supabase!.from("business_inquiries").select("*").order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(mapRows(data ?? []));
});

router.put("/business-inquiries/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { data, error } = await supabase!.from("business_inquiries").update(camelToSnake(req.body)).eq("id", id).select();
  if (error) return res.status(500).json({ error: error.message });
  res.json(snakeToCamel(data![0]));
});

router.get("/site-settings", async (_req, res) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  const { data, error } = await supabase!.from("site_settings").select("*").limit(1).maybeSingle();
  if (error) return res.status(500).json({ error: error.message });
  if (data) {
    res.json(data.settings);
  } else {
    const { data: inserted, error: insertError } = await supabase!.from("site_settings").insert({ settings: {} }).select().single();
    if (insertError) return res.status(500).json({ error: insertError.message });
    res.json(inserted.settings);
  }
});

router.put("/site-settings", async (req, res) => {
  const { data: existing, error: selectError } = await supabase!.from("site_settings").select("*").limit(1).maybeSingle();
  if (selectError) return res.status(500).json({ error: selectError.message });
  let result;
  if (existing) {
    const { data, error } = await supabase!.from("site_settings").update({ settings: req.body, updated_at: new Date().toISOString() }).eq("id", existing.id).select().single();
    if (error) return res.status(500).json({ error: error.message });
    result = data;
  } else {
    const { data, error } = await supabase!.from("site_settings").insert({ settings: req.body }).select().single();
    if (error) return res.status(500).json({ error: error.message });
    result = data;
  }
  await logAudit("update", "site_settings", result?.id, req.body);
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.json(result.settings);
});

// ---- Categories ----

router.get("/categories", async (_req, res) => {
  const { data, error } = await supabase!.from("categories").select("*").order("order");
  if (error) return res.status(500).json({ error: error.message });
  res.json(mapRows(data ?? []));
});

router.post("/categories", async (req, res) => {
  const { data, error } = await supabase!.from("categories").insert(camelToSnake(req.body)).select();
  if (error) return res.status(500).json({ error: error.message });
  await logAudit("create", "categories", data![0].id, req.body);
  res.status(201).json(snakeToCamel(data![0]));
});

router.put("/categories/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { data, error } = await supabase!.from("categories").update(camelToSnake(req.body)).eq("id", id).select();
  if (error) return res.status(500).json({ error: error.message });
  await logAudit("update", "categories", id, req.body);
  res.json(snakeToCamel(data![0]));
});

router.delete("/categories/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { error } = await supabase!.from("categories").delete().eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  await logAudit("delete", "categories", id);
  res.status(204).end();
});

// ---- Applications ----

router.get("/applications", async (_req, res) => {
  const { data, error } = await supabase!.from("applications").select("*, jobs:job_id(title)").order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  const mapped = (data ?? []).map((r: Record<string, unknown>) => {
    const { jobs, ...rest } = r;
    return snakeToCamel({ ...rest, jobTitle: (jobs as Record<string, unknown> | null)?.title ?? null });
  });
  res.json(mapped);
});

router.put("/applications/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { data, error } = await supabase!.from("applications").update(camelToSnake(req.body)).eq("id", id).select();
  if (error) return res.status(500).json({ error: error.message });
  await logAudit("update", "applications", id, req.body);
  res.json(snakeToCamel(data![0]));
});

// ---- Export ----

const EXPORT_ENTITIES = ["contacts", "business-inquiries", "applications"] as const;

router.get("/:entity/export", async (req, res) => {
  const { entity } = req.params;
  if (!EXPORT_ENTITIES.includes(entity as typeof EXPORT_ENTITIES[number])) {
    return res.status(400).json({ error: `Unsupported entity. Supported: ${EXPORT_ENTITIES.join(", ")}` });
  }

  const tableMap: Record<string, string> = {
    "contacts": "contacts",
    "business-inquiries": "business_inquiries",
    "applications": "applications",
  };
  const tableName = tableMap[entity];

  const { data, error } = await supabase!.from(tableName).select("*").order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });

  if (!data || data.length === 0) {
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", `attachment; filename="${entity}-export.csv"`);
    return res.status(200).send("No data found");
  }

  const headers = Object.keys(data[0]);
  const csvRows = data.map((row: Record<string, unknown>) =>
    headers.map((h) => {
      const val = row[h];
      if (val === null || val === undefined) return "";
      const str = String(val);
      if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    }).join(",")
  );

  const csv = [headers.join(","), ...csvRows].join("\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename="${entity}-export.csv"`);
  res.status(200).send(csv);
});

// ---- Upload routes ----

router.use(uploadRouter);

export default router;