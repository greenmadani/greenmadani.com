import { Router } from "express";
import { supabase, snakeToCamel, mapRows } from "@workspace/db";

const router = Router();

router.get("/categories", async (_req, res) => {
  const { data: catData, error: catError } = await supabase!.from("categories").select("*").eq("type", "product").order("order");
  if (catError) return res.status(500).json({ error: catError.message });

  const { data: prodData, error: prodError } = await supabase!.from("products").select("category_slug").eq("status", "active");
  if (prodError) return res.status(500).json({ error: prodError.message });

  const productCounts = new Map<string, number>();
  for (const p of prodData ?? []) {
    productCounts.set(p.category_slug, (productCounts.get(p.category_slug) ?? 0) + 1);
  }

  const result = (catData ?? []).map((c) => ({
    slug: c.slug,
    name: c.name,
    count: productCounts.get(c.slug) ?? 0,
  }));

  res.json(result);
});

router.get("/", async (req, res) => {
  const category = req.query.category as string | undefined;
  const featured = req.query.featured;
  const limit = parseInt(req.query.limit as string) || 50;
  const offset = parseInt(req.query.offset as string) || 0;

  let query = supabase!.from("products").select("*", { count: "exact" }).eq("status", "active");
  if (category) query = query.eq("category_slug", category);
  if (featured !== undefined) query = query.eq("featured", featured === "true");
  query = query.order("created_at", { ascending: false }).range(offset, offset + limit - 1);

  const { data, error, count } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json({ items: mapRows(data ?? []), total: count ?? 0 });
});

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });
  const { data, error } = await supabase!.from("products").select("*").eq("id", id).maybeSingle();
  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: "Product not found" });
  res.json(snakeToCamel(data));
});

export default router;