import { Router } from "express";
import { supabase, camelToSnake, mapRows } from "@workspace/db";
import { z } from "zod";

const router = Router();

const applicationSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(1),
  positionApplying: z.string().min(1),
  linkedinUrl: z.string().optional(),
  coverLetter: z.string().optional(),
  jobId: z.number().nullable().optional(),
});

router.get("/", async (req, res) => {
  const department = req.query.department as string | undefined;
  let query = supabase!.from("jobs").select("*").eq("status", "open");
  if (department) query = query.eq("department", department);
  query = query.order("posted_at", { ascending: false });
  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(mapRows(data ?? []));
});

router.post("/apply", async (req, res) => {
  const parsed = applicationSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation failed", details: parsed.error.issues });
    return;
  }
  const data = parsed.data;
  const { error } = await supabase!.from("applications").insert(camelToSnake({ ...data, jobId: data.jobId ? String(data.jobId) : null }));
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ success: true, message: "Your application has been submitted successfully. We will contact you soon." });
});

export default router;