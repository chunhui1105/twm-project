import { Router, type IRouter } from "express";
import { db, categoriesTable } from "@workspace/db";
import { asc, eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/categories", async (req, res): Promise<void> => {
  const categories = await db
    .select()
    .from(categoriesTable)
    .orderBy(asc(categoriesTable.name));

  res.json(categories);
});

router.post("/categories", async (req, res): Promise<void> => {
  const { name, description, imageUrl } = req.body;

  if (!name?.trim()) {
    res.status(400).json({ error: "Name is required" });
    return;
  }

  const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  const created = await db
    .insert(categoriesTable)
    .values({ name: name.trim(), slug, description, imageUrl })
    .returning();

  res.status(201).json(created[0]);
});

router.patch("/categories/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);
  const { name, description, imageUrl } = req.body;

  const updated = await db
    .update(categoriesTable)
    .set({
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(imageUrl !== undefined && { imageUrl }),
    })
    .where(eq(categoriesTable.id, id))
    .returning();

  if (!updated.length) {
    res.status(404).json({ error: "Category not found" });
    return;
  }

  res.json(updated[0]);
});

router.delete("/categories/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id);

  const deleted = await db
    .delete(categoriesTable)
    .where(eq(categoriesTable.id, id))
    .returning();

  if (!deleted.length) {
    res.status(404).json({ error: "Category not found" });
    return;
  }

  res.status(204).send();
});

export default router;
