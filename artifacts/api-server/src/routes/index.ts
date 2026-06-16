import { Router, type IRouter } from "express";
import healthRouter from "./health";
import businessesRouter from "./businesses";
import productsRouter from "./products";
import newsRouter from "./news";
import careersRouter from "./careers";
import inquiriesRouter from "./inquiries";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/businesses", businessesRouter);
router.use("/products", productsRouter);
router.use("/news", newsRouter);
router.use("/careers", careersRouter);
router.use("/inquiries", inquiriesRouter);
router.use("/stats", statsRouter);

export default router;
