import { Router } from "express";
import { supabase, snakeToCamel, mapRows } from "@workspace/db";

const router = Router();

router.get("/", async (req, res) => {
  const category = req.query.category as string | undefined;
  const limit = parseInt(req.query.limit as string) || 20;
  const offset = parseInt(req.query.offset as string) || 0;

  let query = supabase!.from("news").select("*", { count: "exact" }).eq("status", "published");
  if (category) query = query.eq("category", category);
  query = query.order("published_at", { ascending: false }).range(offset, offset + limit - 1);

  const { data, error, count } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json({ items: mapRows(data ?? []), total: count ?? 0 });
});

router.get("/:slug", async (req, res) => {
  const { data, error } = await supabase!.from("news").select("*").eq("slug", req.params.slug).maybeSingle();
  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: "Article not found" });
  res.json(snakeToCamel(data));
});

export default router;