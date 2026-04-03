import { Router, type IRouter } from "express";
import healthRouter from "./health";
import categoriesRouter from "./categories";
import productsRouter from "./products";
import cartRouter from "./cart";
import ordersRouter from "./orders";
import storageRouter from "./storage";
import slidesRouter from "./slides";
import brandsRouter from "./brands";
import contactInfoRouter from "./contact-info";
import carBrandsRouter from "./car-brands";

const router: IRouter = Router();

router.use(healthRouter);
router.use(storageRouter);
router.use(slidesRouter);
router.use(brandsRouter);
router.use(contactInfoRouter);
router.use(carBrandsRouter);
router.use(categoriesRouter);
router.use(productsRouter);
router.use(cartRouter);
router.use(ordersRouter);

export default router;
