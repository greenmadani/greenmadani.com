import { Router } from "express";
import { db } from "@workspace/db";
import { productsTable } from "@workspace/db";
import { eq, and, desc, sql } from "drizzle-orm";

const router = Router();

router.get("/categories", async (req, res) => {
  const rows = await db.select({
    categorySlug: productsTable.categorySlug,
    category: productsTable.category,
    count: sql<number>`count(*)::int`,
  })
    .from(productsTable)
    .where(eq(productsTable.status, "active"))
    .groupBy(productsTable.categorySlug, productsTable.category);

  res.json(rows.map(r => ({
    slug: r.categorySlug,
    name: r.category,
    description: null,
    count: r.count,
  })));
});

router.get("/", async (req, res) => {
  const category = req.query.category as string | undefined;
  const featured = req.query.featured;
  const limit = parseInt(req.query.limit as string) || 50;
  const offset = parseInt(req.query.offset as string) || 0;

  const conditions = [eq(productsTable.status, "active")];
  if (category) conditions.push(eq(productsTable.categorySlug, category));
  if (featured !== undefined) conditions.push(eq(productsTable.featured, featured === "true"));

  const whereClause = conditions.length === 1 ? conditions[0] : and(...conditions);
  const rows = await db.select().from(productsTable).where(whereClause).orderBy(desc(productsTable.createdAt)).limit(limit).offset(offset);
  const [countRow] = await db.select({ count: sql<number>`count(*)::int` }).from(productsTable).where(whereClause);

  res.json({
    items: rows.map(p => ({
      id: p.id,
      name: p.name,
      category: p.category,
      categorySlug: p.categorySlug,
      description: p.description,
      longDescription: p.longDescription,
      imageUrl: p.imageUrl,
      featured: p.featured,
      businessSlug: p.businessSlug,
      tags: p.tags,
    })),
    total: countRow?.count ?? 0,
  });
});

router.get("/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }
  const [product] = await db.select().from(productsTable).where(eq(productsTable.id, id)).limit(1);
  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json({
    id: product.id,
    name: product.name,
    category: product.category,
    categorySlug: product.categorySlug,
    description: product.description,
    longDescription: product.longDescription,
    imageUrl: product.imageUrl,
    featured: product.featured,
    businessSlug: product.businessSlug,
    tags: product.tags,
  });
});

export default router;
