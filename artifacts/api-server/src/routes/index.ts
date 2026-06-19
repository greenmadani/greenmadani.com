import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import businessesRouter from "./businesses.js";
import productsRouter from "./products.js";
import newsRouter from "./news.js";
import careersRouter from "./careers.js";
import inquiriesRouter from "./inquiries.js";
import statsRouter from "./stats.js";
import adminRouter from "./admin.js";
import settingsRouter from "./settings.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/businesses", businessesRouter);
router.use("/products", productsRouter);
router.use("/news", newsRouter);
router.use("/careers", careersRouter);
router.use("/inquiries", inquiriesRouter);
router.use("/stats", statsRouter);
router.use("/admin", adminRouter);
router.use("/settings", settingsRouter);

export default router;
