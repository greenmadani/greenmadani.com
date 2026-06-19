import { Router } from "express";
import { supabase, snakeToCamel, mapRows } from "@workspace/db";

const router = Router();

router.get("/categories", async (_req, res) => {
  const { data, error } = await supabase!.from("products").select("*").eq("status", "active");
  if (error) return res.status(500).json({ error: error.message });
  const groups = new Map<string, { slug: string; name: string; count: number }>();
  for (const p of data ?? []) {
    const key = p.category_slug;
    if (!groups.has(key)) groups.set(key, { slug: key, name: p.category, count: 0 });
    groups.get(key)!.count++;
  }
  res.json(Array.from(groups.values()));
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