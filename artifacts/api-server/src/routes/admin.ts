import { Router } from "express";
import { supabase, camelToSnake, snakeToCamel, mapRows } from "@workspace/db";
import { requireAdmin } from "../middlewares/auth";

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
  res.json(result.settings);
});

export default router;