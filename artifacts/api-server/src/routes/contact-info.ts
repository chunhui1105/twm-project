import { Router, type IRouter } from "express";
import { db, contactInfoTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/contact-info", async (_req, res): Promise<void> => {
  const rows = await db.select().from(contactInfoTable).orderBy(contactInfoTable.id);
  res.json(rows);
});

router.patch("/contact-info/:key", async (req, res): Promise<void> => {
  const { key } = req.params;
  const { value } = req.body;
  if (value === undefined) { res.status(400).json({ error: "value is required" }); return; }
  const updated = await db.update(contactInfoTable)
    .set({ value })
    .where(eq(contactInfoTable.key, key))
    .returning();
  if (!updated.length) { res.status(404).json({ error: "Key not found" }); return; }
  res.json(updated[0]);
});

export default router;
