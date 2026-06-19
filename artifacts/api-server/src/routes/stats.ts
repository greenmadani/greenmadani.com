import { Router } from "express";
import { supabase } from "@workspace/db";

const router = Router();

router.get("/summary", async (_req, res) => {
  const { count: subCount, error: subErr } = await supabase!.from("businesses").select("*", { count: "exact", head: true }).eq("status", "active");
  const { count: prodCount, error: prodErr } = await supabase!.from("products").select("*", { count: "exact", head: true }).eq("status", "active");

  res.json({
    subsidiaries: subCount ?? 12,
    products: prodCount ?? 500,
    farmerServed: 10000,
    yearsActive: 6,
    dealerCount: 2500,
    countriesExported: 8,
  });
});

export default router;