import { Router, type IRouter } from "express";
import { db, slidesTable } from "@workspace/db";
import { asc, eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/slides", async (_req, res): Promise<void> => {
  const slides = await db.select().from(slidesTable).orderBy(asc(slidesTable.sortOrder), asc(slidesTable.id));
  res.json(slides);
});

router.post("/slides/reorder", async (req, res): Promise<void> => {
  const { orderedIds } = req.body as { orderedIds: number[] };
  if (!Array.isArray(orderedIds)) { res.status(400).json({ error: "orderedIds must be an array" }); return; }
  await Promise.all(orderedIds.map((id, index) => db.update(slidesTable).set({ sortOrder: index + 1 }).where(eq(slidesTable.id, id))));
  res.status(204).send();
});

router.post("/slides", async (req, res): Promise<void> => {
  const { imageUrl, tag, title, highlight, subtitle, categorySlug } = req.body;
  if (!imageUrl?.trim()) { res.status(400).json({ error: "imageUrl is required" }); return; }
  const [maxRow] = await db.select({ max: slidesTable.sortOrder }).from(slidesTable).orderBy(asc(slidesTable.sortOrder));
  const sortOrder = (maxRow?.max ?? 0) + 1;
  const created = await db.insert(slidesTable).values({ imageUrl, tag: tag || "", title: title || "", highlight: highlight || "", subtitle: subtitle || "", categorySlug: categorySlug || null, sortOrder }).returning();
  res.status(201).json(created[0]);
});

router.patch("/slides/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  const { imageUrl, tag, title, highlight, subtitle, categorySlug } = req.body;
  const updated = await db.update(slidesTable).set({
    ...(imageUrl !== undefined && { imageUrl }),
    ...(tag !== undefined && { tag }),
    ...(title !== undefined && { title }),
    ...(highlight !== undefined && { highlight }),
    ...(subtitle !== undefined && { subtitle }),
    ...(categorySlug !== undefined && { categorySlug: categorySlug || null }),
  }).where(eq(slidesTable.id, id)).returning();
  if (!updated.length) { res.status(404).json({ error: "Slide not found" }); return; }
  res.json(updated[0]);
});

router.delete("/slides/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  const deleted = await db.delete(slidesTable).where(eq(slidesTable.id, id)).returning();
  if (!deleted.length) { res.status(404).json({ error: "Slide not found" }); return; }
  res.status(204).send();
});

export default router;
