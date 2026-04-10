import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
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
import adminSeedRouter from "./admin-seed";
import adminAuthRouter, { requireAdminAuth } from "./admin-auth";

const router: IRouter = Router();

// Public login endpoint (must be before the auth middleware)
router.use(adminAuthRouter);

// Protect all mutating requests except:
//   - cart (customers add/remove items)
//   - POST /orders (customers place orders)
const PUBLIC_MUTATION_PATHS = [
  /^\/cart(\/|$)/,
  /^\/orders$/,
];

router.use((req: Request, res: Response, next: NextFunction): void => {
  if (req.method === "GET" || req.method === "HEAD" || req.method === "OPTIONS") {
    return next();
  }
  const isPublic = PUBLIC_MUTATION_PATHS.some(pattern => pattern.test(req.path));
  if (isPublic) return next();
  return requireAdminAuth(req, res, next);
});

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
