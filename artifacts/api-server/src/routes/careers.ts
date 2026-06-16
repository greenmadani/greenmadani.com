import { Router } from "express";
import { db } from "@workspace/db";
import { jobsTable, applicationsTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
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

  const conditions = [eq(jobsTable.status, "open")];
  if (department) conditions.push(eq(jobsTable.department, department));

  const whereClause = conditions.length === 1 ? conditions[0] : and(...conditions);
  const rows = await db.select().from(jobsTable).where(whereClause).orderBy(desc(jobsTable.postedAt));

  res.json(rows.map(j => ({
    id: j.id,
    title: j.title,
    department: j.department,
    location: j.location,
    type: j.type,
    description: j.description,
    requirements: j.requirements,
    postedAt: j.postedAt.toISOString(),
    status: j.status,
  })));
});

router.post("/apply", async (req, res) => {
  const parsed = applicationSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Validation failed", details: parsed.error.issues });
    return;
  }
  const data = parsed.data;
  await db.insert(applicationsTable).values({
    jobId: data.jobId ? String(data.jobId) : null,
    fullName: data.fullName,
    email: data.email,
    phone: data.phone,
    positionApplying: data.positionApplying,
    linkedinUrl: data.linkedinUrl,
    coverLetter: data.coverLetter,
  });
  res.status(201).json({ success: true, message: "Your application has been submitted successfully. We will contact you soon." });
});

export default router;
