import { Router, type IRouter } from "express";
import { db, brandsTable } from "@workspace/db";
import { asc, eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/brands", async (_req, res): Promise<void> => {
  const brands = await db.select().from(brandsTable).orderBy(asc(brandsTable.sortOrder), asc(brandsTable.id));
  res.json(brands);
});

router.post("/brands/reorder", async (req, res): Promise<void> => {
  const { orderedIds } = req.body as { orderedIds: number[] };
  if (!Array.isArray(orderedIds)) { res.status(400).json({ error: "orderedIds must be an array" }); return; }
  await Promise.all(orderedIds.map((id, index) => db.update(brandsTable).set({ sortOrder: index + 1 }).where(eq(brandsTable.id, id))));
  res.status(204).send();
});

router.post("/brands", async (req, res): Promise<void> => {
  const { name, imageUrl, active } = req.body;
  if (!name?.trim()) { res.status(400).json({ error: "name is required" }); return; }
  if (!imageUrl?.trim()) { res.status(400).json({ error: "imageUrl is required" }); return; }
  const [maxRow] = await db.select({ max: brandsTable.sortOrder }).from(brandsTable).orderBy(asc(brandsTable.sortOrder));
  const sortOrder = (maxRow?.max ?? 0) + 1;
  const created = await db.insert(brandsTable).values({ name, imageUrl, sortOrder, active: active ?? true }).returning();
  res.status(201).json(created[0]);
});

router.patch("/brands/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  const { name, imageUrl, active } = req.body;
  const updated = await db.update(brandsTable).set({
    ...(name !== undefined && { name }),
    ...(imageUrl !== undefined && { imageUrl }),
    ...(active !== undefined && { active }),
  }).where(eq(brandsTable.id, id)).returning();
  if (!updated.length) { res.status(404).json({ error: "Brand not found" }); return; }
  res.json(updated[0]);
});

router.delete("/brands/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  const deleted = await db.delete(brandsTable).where(eq(brandsTable.id, id)).returning();
  if (!deleted.length) { res.status(404).json({ error: "Brand not found" }); return; }
  res.status(204).send();
});

export default router;
