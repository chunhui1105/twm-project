import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { createHmac } from "crypto";

const router: IRouter = Router();

function getExpectedToken(): string {
  const secret = process.env.SESSION_SECRET ?? "fallback-secret";
  return createHmac("sha256", secret).update("twm-admin-v1").digest("hex");
}

// POST /admin/login
router.post("/admin/login", (req: Request, res: Response): void => {
  const { password } = req.body as { password?: string };
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminPassword) {
    res.status(503).json({ error: "Admin password not configured" });
    return;
  }

  if (!password || password !== adminPassword) {
    res.status(401).json({ error: "Incorrect password" });
    return;
  }

  res.json({ token: getExpectedToken() });
});

// Middleware — call this on routes that require admin access
export function requireAdminAuth(req: Request, res: Response, next: NextFunction): void {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const token = auth.slice(7);
  if (token !== getExpectedToken()) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  next();
}

export default router;
