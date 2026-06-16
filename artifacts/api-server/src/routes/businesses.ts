import { Router } from "express";
import { db } from "@workspace/db";
import { businessesTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  const featured = req.query.featured;
  let query = db.select().from(businessesTable).where(eq(businessesTable.status, "active")).orderBy(asc(businessesTable.order));
  const rows = await query;
  const filtered = featured !== undefined ? rows.filter(b => b.featured === (featured === "true")) : rows;
  res.json(filtered.map(b => ({
    id: b.id,
    name: b.name,
    slug: b.slug,
    industry: b.industry,
    description: b.description,
    longDescription: b.longDescription,
    imageUrl: b.imageUrl,
    colorAccent: b.colorAccent,
    featured: b.featured,
    order: b.order,
    services: b.services,
    targetAudience: b.targetAudience,
    website: b.website,
  })));
});

router.get("/:slug", async (req, res) => {
  const [business] = await db.select().from(businessesTable).where(eq(businessesTable.slug, req.params.slug)).limit(1);
  if (!business) {
    res.status(404).json({ error: "Business not found" });
    return;
  }
  res.json({
    id: business.id,
    name: business.name,
    slug: business.slug,
    industry: business.industry,
    description: business.description,
    longDescription: business.longDescription,
    imageUrl: business.imageUrl,
    colorAccent: business.colorAccent,
    featured: business.featured,
    order: business.order,
    services: business.services,
    targetAudience: business.targetAudience,
    website: business.website,
  });
});

export default router;
