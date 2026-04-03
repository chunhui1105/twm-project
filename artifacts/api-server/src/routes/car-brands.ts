import { Router, type IRouter } from "express";
import { db, carBrandsTable, carModelsTable } from "@workspace/db";
import { eq, asc } from "drizzle-orm";

const router: IRouter = Router();

// GET /car-brands — all brands with their models
router.get("/car-brands", async (_req, res): Promise<void> => {
  const brands = await db.select().from(carBrandsTable).orderBy(asc(carBrandsTable.sortOrder), asc(carBrandsTable.name));
  const models = await db.select().from(carModelsTable).orderBy(asc(carModelsTable.brandId), asc(carModelsTable.sortOrder), asc(carModelsTable.name));
  const result = brands.map(b => ({
    ...b,
    models: models.filter(m => m.brandId === b.id),
  }));
  res.json(result);
});

// POST /car-brands
router.post("/car-brands", async (req, res): Promise<void> => {
  const { name, origin } = req.body;
  if (!name?.trim()) { res.status(400).json({ error: "name is required" }); return; }
  const maxOrder = await db.select().from(carBrandsTable).orderBy(asc(carBrandsTable.sortOrder));
  const nextOrder = maxOrder.length > 0 ? (maxOrder[maxOrder.length - 1].sortOrder + 1) : 1;
  const [created] = await db.insert(carBrandsTable).values({ name: name.trim(), origin: origin?.trim() ?? "", sortOrder: nextOrder }).returning();
  res.status(201).json({ ...created, models: [] });
});

// PATCH /car-brands/:id
router.patch("/car-brands/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  const { name, origin } = req.body;
  const [updated] = await db.update(carBrandsTable).set({
    ...(name !== undefined && { name }),
    ...(origin !== undefined && { origin }),
  }).where(eq(carBrandsTable.id, id)).returning();
  if (!updated) { res.status(404).json({ error: "Not found" }); return; }
  res.json(updated);
});

// DELETE /car-brands/:id
router.delete("/car-brands/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  await db.delete(carModelsTable).where(eq(carModelsTable.brandId, id));
  await db.delete(carBrandsTable).where(eq(carBrandsTable.id, id));
  res.status(204).send();
});

// POST /car-brands/reorder
router.post("/car-brands/reorder", async (req, res): Promise<void> => {
  const { orderedIds } = req.body as { orderedIds: number[] };
  if (!Array.isArray(orderedIds)) { res.status(400).json({ error: "orderedIds required" }); return; }
  await Promise.all(orderedIds.map((id, i) => db.update(carBrandsTable).set({ sortOrder: i + 1 }).where(eq(carBrandsTable.id, id))));
  res.status(204).send();
});

// POST /car-brands/:brandId/models
router.post("/car-brands/:brandId/models", async (req, res): Promise<void> => {
  const brandId = parseInt(req.params.brandId);
  const { name, years } = req.body;
  if (!name?.trim()) { res.status(400).json({ error: "name is required" }); return; }
  const existing = await db.select().from(carModelsTable).where(eq(carModelsTable.brandId, brandId)).orderBy(asc(carModelsTable.sortOrder));
  const nextOrder = existing.length > 0 ? (existing[existing.length - 1].sortOrder + 1) : 1;
  const [created] = await db.insert(carModelsTable).values({ brandId, name: name.trim(), years: years?.trim() ?? "", sortOrder: nextOrder }).returning();
  res.status(201).json(created);
});

// PATCH /car-brands/:brandId/models/:id
router.patch("/car-brands/:brandId/models/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  const { name, years, imageUrl } = req.body;
  const [updated] = await db.update(carModelsTable).set({
    ...(name !== undefined && { name }),
    ...(years !== undefined && { years }),
    ...(imageUrl !== undefined && { imageUrl }),
  }).where(eq(carModelsTable.id, id)).returning();
  if (!updated) { res.status(404).json({ error: "Not found" }); return; }
  res.json(updated);
});

// DELETE /car-brands/:brandId/models/:id
router.delete("/car-brands/:brandId/models/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  await db.delete(carModelsTable).where(eq(carModelsTable.id, id));
  res.status(204).send();
});

export default router;
