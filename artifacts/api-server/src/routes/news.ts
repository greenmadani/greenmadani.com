import { Router } from "express";
import { db } from "@workspace/db";
import { newsTable } from "@workspace/db";
import { eq, and, desc, sql } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  const category = req.query.category as string | undefined;
  const limit = parseInt(req.query.limit as string) || 20;
  const offset = parseInt(req.query.offset as string) || 0;

  const conditions = [eq(newsTable.status, "published")];
  if (category) conditions.push(eq(newsTable.category, category));

  const whereClause = conditions.length === 1 ? conditions[0] : and(...conditions);
  const rows = await db.select().from(newsTable).where(whereClause).orderBy(desc(newsTable.publishedAt)).limit(limit).offset(offset);
  const [countRow] = await db.select({ count: sql<number>`count(*)::int` }).from(newsTable).where(whereClause);

  res.json({
    items: rows.map(n => ({
      id: n.id,
      title: n.title,
      slug: n.slug,
      excerpt: n.excerpt,
      content: n.content,
      category: n.category,
      imageUrl: n.imageUrl,
      authorName: n.authorName,
      authorAvatarUrl: n.authorAvatarUrl,
      publishedAt: n.publishedAt.toISOString(),
      tags: n.tags,
    })),
    total: countRow?.count ?? 0,
  });
});

router.get("/:slug", async (req, res) => {
  const [article] = await db.select().from(newsTable).where(eq(newsTable.slug, req.params.slug)).limit(1);
  if (!article) {
    res.status(404).json({ error: "Article not found" });
    return;
  }
  res.json({
    id: article.id,
    title: article.title,
    slug: article.slug,
    excerpt: article.excerpt,
    content: article.content,
    category: article.category,
    imageUrl: article.imageUrl,
    authorName: article.authorName,
    authorAvatarUrl: article.authorAvatarUrl,
    publishedAt: article.publishedAt.toISOString(),
    tags: article.tags,
  });
});

export default router;
