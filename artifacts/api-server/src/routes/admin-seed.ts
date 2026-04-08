import { Router } from "express";
import { seedIfEmpty } from "../seeder";

const router = Router();

router.post("/api/admin/force-seed", async (_req, res) => {
  try {
    await seedIfEmpty();
    res.json({ ok: true, message: "Seed completed" });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: String(err?.message ?? err) });
  }
});

export default router;
