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

export default router;
