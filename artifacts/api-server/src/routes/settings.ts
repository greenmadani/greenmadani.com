import { Router } from "express";
import { supabase } from "@workspace/db";

const router = Router();

router.get("/", async (_req, res) => {
  const { data, error } = await supabase!.from("site_settings").select("settings").limit(1).maybeSingle();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data?.settings ?? {});
});

export default router;