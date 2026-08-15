import { Router } from "express";
import { supabase, camelToSnake, snakeToCamel, mapRows } from "@workspace/db";
import { requireAdmin } from "../middlewares/auth.js";
import { logAudit } from "../middlewares/audit.js";

const router = Router();

router.use(requireAdmin);

function crudRoutes(entity: string, table: string) {
  router.get(`/${entity}`, async (_req, res) => {
    const { data, error } = await supabase!.from(table).select("*").order("created_at", { ascending: false });
    if (error) return res.status(500).json({ error: error.message });
    return res.json(mapRows(data ?? []));
  });

  router.post(`/${entity}`, async (req, res) => {
    const { data, error } = await supabase!.from(table).insert(camelToSnake(req.body)).select();
    if (error) return res.status(500).json({ error: error.message });
    await logAudit("create", table, data![0].id, req.body);
    return res.status(201).json(snakeToCamel(data![0]));
  });

  router.put(`/${entity}/:id`, async (req, res) => {
    const id = parseInt(req.params.id);
    const { data, error } = await supabase!.from(table).update(camelToSnake(req.body)).eq("id", id).select();
    if (error) return res.status(500).json({ error: error.message });
    await logAudit("update", table, id, req.body);
    return res.json(snakeToCamel(data![0]));
  });

  router.delete(`/${entity}/:id`, async (req, res) => {
    const id = parseInt(req.params.id);
    const { error } = await supabase!.from(table).delete().eq("id", id);
    if (error) return res.status(500).json({ error: error.message });
    await logAudit("delete", table, id);
    return res.status(204).end();
  });
}

crudRoutes("crops", "crops");
crudRoutes("diseases", "diseases");
crudRoutes("seasons", "seasons");

router.get("/advisory-inquiries", async (_req, res) => {
  const { data, error } = await supabase!.from("advisory_inquiries").select("*").order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  return res.json(mapRows(data ?? []));
});

router.delete("/advisory-inquiries/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const { error } = await supabase!.from("advisory_inquiries").delete().eq("id", id);
  if (error) return res.status(500).json({ error: error.message });
  await logAudit("delete", "advisory_inquiries", id);
  return res.status(204).end();
});

export default router;
