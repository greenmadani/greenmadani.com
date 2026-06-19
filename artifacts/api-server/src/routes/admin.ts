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