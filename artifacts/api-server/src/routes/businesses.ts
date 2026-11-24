import { Router } from "express";
import { supabase, snakeToCamel, mapRows } from "@workspace/db";

const router = Router();

router.get("/", async (req, res) => {
  if (!supabase) return res.status(503).json({ error: "Database not configured" });
  const featured = req.query.featured;
  let query = supabase.from("businesses").select("*").eq("status", "active").order("order");
  if (featured !== undefined) {
    query = query.eq("featured", featured === "true");
  }
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  return res.json(mapRows(data ?? []));
});

router.get("/:slug", async (req, res) => {
  if (!supabase) return res.status(503).json({ error: "Database not configured" });
  const { data, error } = await supabase.from("businesses").select("*").eq("slug", req.params.slug).maybeSingle();
  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: "Business not found" });
  return res.json(snakeToCamel(data));
});

export default router;