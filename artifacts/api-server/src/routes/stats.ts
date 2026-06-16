import { Router } from "express";
import { db } from "@workspace/db";
import { businessesTable, productsTable, jobsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";

const router = Router();

router.get("/summary", async (req, res) => {
  const [subsidiaries] = await db.select({ count: sql<number>`count(*)::int` }).from(businessesTable).where(eq(businessesTable.status, "active"));
  const [products] = await db.select({ count: sql<number>`count(*)::int` }).from(productsTable).where(eq(productsTable.status, "active"));

  res.json({
    subsidiaries: subsidiaries?.count ?? 12,
    products: products?.count ?? 500,
    farmerServed: 10000,
    yearsActive: 6,
    dealerCount: 2500,
    countriesExported: 8,
  });
});

export default router;
