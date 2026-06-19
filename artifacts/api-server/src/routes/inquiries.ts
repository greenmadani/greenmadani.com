import { Router } from "express";
import { supabase, camelToSnake } from "@workspace/db";
import { z } from "zod";

const router = Router();

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(1),
  message: z.string().min(10),
});

const businessInquirySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(1),
  company: z.string().optional(),
  inquiryType: z.enum(["distributor", "investor", "partnership", "export", "other"]),
  message: z.string().min(10),
  region: z.string().optional(),
});

router.post("/contact", async (req, res) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation failed", details: parsed.error.issues });
    return;
  }
  const { error } = await supabase!.from("contacts").insert(camelToSnake(parsed.data));
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ success: true, message: "Thank you for your message. Our team will respond within 24–48 business hours." });
});

router.post("/business", async (req, res) => {
  const parsed = businessInquirySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation failed", details: parsed.error.issues });
    return;
  }
  const { error } = await supabase!.from("business_inquiries").insert(camelToSnake(parsed.data));
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ success: true, message: "Your inquiry has been received. Our business development team will be in touch shortly." });
});

export default router;