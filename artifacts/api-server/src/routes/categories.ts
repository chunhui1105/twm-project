import { Router, type IRouter } from "express";
import { db, categoriesTable, productsTable } from "@workspace/db";
import { asc, eq, sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/categories", async (req, res): Promise<void> => {
  const rows = await db.execute<{
    id: number; name: string; slug: string; description: string | null;
    imageUrl: string | null; sortOrder: number; productCount: number;
  }>(sql`
    SELECT c.id, c.name, c.slug, c.description, c.image_url AS "imageUrl",
           c.sort_order AS "sortOrder",
           COUNT(p.id)::int AS "productCount"
    FROM categories c
    LEFT JOIN products p ON c.id = ANY(p.category_ids)
    GROUP BY c.id
    ORDER BY c.sort_order ASC, c.name ASC
  `);

  res.json(rows.rows);
});

router.post("/categories/reorder", async (req, res): Promise<void> => {
  const { orderedIds } = req.body as { orderedIds: number[] };

  if (!Array.isArray(orderedIds)) {
    res.status(400).json({ error: "orderedIds must be an array" });
    return;
  }

  await Promise.all(
    orderedIds.map((id, index) =>
      db.update(categoriesTable)
        .set({ sortOrder: index + 1 })
        .where(eq(categoriesTable.id, id))
    )
  );

  res.status(204).send();
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
