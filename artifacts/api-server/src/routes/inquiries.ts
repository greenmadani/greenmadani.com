import { Router } from "express";
import { db } from "@workspace/db";
import { contactsTable, businessInquiriesTable } from "@workspace/db";
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
  const data = parsed.data;
  await db.insert(contactsTable).values({
    name: data.name,
    email: data.email,
    phone: data.phone,
    subject: data.subject,
    message: data.message,
  });
  res.status(201).json({ success: true, message: "Thank you for your message. Our team will respond within 24–48 business hours." });
});

router.post("/business", async (req, res) => {
  const parsed = businessInquirySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation failed", details: parsed.error.issues });
    return;
  }
  const data = parsed.data;
  await db.insert(businessInquiriesTable).values({
    name: data.name,
    email: data.email,
    phone: data.phone,
    company: data.company,
    inquiryType: data.inquiryType,
    message: data.message,
    region: data.region,
  });
  res.status(201).json({ success: true, message: "Your inquiry has been received. Our business development team will be in touch shortly." });
});

export default router;
