import { Router, type IRouter } from "express";
import { db, cartItemsTable, productsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router: IRouter = Router();

async function buildCart(sessionId: string) {
  const cartItems = await db
    .select({
      id: cartItemsTable.id,
      sessionId: cartItemsTable.sessionId,
      productId: cartItemsTable.productId,
      quantity: cartItemsTable.quantity,
      productName: productsTable.name,
      price: productsTable.price,
      imageUrl: productsTable.imageUrl,
    })
    .from(cartItemsTable)
    .innerJoin(productsTable, eq(cartItemsTable.productId, productsTable.id))
    .where(eq(cartItemsTable.sessionId, sessionId));

  const items = cartItems.map(item => {
    const price = parseFloat(item.price as unknown as string);
    return {
      productId: item.productId,
      productName: item.productName,
      price,
      quantity: item.quantity,
      imageUrl: item.imageUrl,
      subtotal: parseFloat((price * item.quantity).toFixed(2)),
    };
  });

  const total = parseFloat(items.reduce((sum, i) => sum + i.subtotal, 0).toFixed(2));
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return { sessionId, items, total, itemCount };
}

router.get("/cart", async (req, res): Promise<void> => {
  const sessionId = req.query.sessionId as string;

  if (!sessionId) {
    res.status(400).json({ error: "sessionId is required" });
    return;
  }

  const cart = await buildCart(sessionId);
  res.json(cart);
});

router.post("/cart", async (req, res): Promise<void> => {
  const { sessionId, productId, quantity } = req.body;

  if (!sessionId || !productId || quantity == null) {
    res.status(400).json({ error: "sessionId, productId, and quantity are required" });
    return;
  }

  const existing = await db
    .select()
    .from(cartItemsTable)
    .where(and(eq(cartItemsTable.sessionId, sessionId), eq(cartItemsTable.productId, productId)));

  if (existing.length > 0) {
    await db
      .update(cartItemsTable)
      .set({ quantity: existing[0].quantity + quantity })
      .where(and(eq(cartItemsTable.sessionId, sessionId), eq(cartItemsTable.productId, productId)));
  } else {
    await db.insert(cartItemsTable).values({ sessionId, productId, quantity });
  }

  const cart = await buildCart(sessionId);
  res.json(cart);
});

router.patch("/cart/:sessionId/items/:productId", async (req, res): Promise<void> => {
  const sessionId = Array.isArray(req.params.sessionId) ? req.params.sessionId[0] : req.params.sessionId;
  const rawProductId = Array.isArray(req.params.productId) ? req.params.productId[0] : req.params.productId;
  const productId = parseInt(rawProductId, 10);
  const { quantity } = req.body;

  if (quantity <= 0) {
    await db
      .delete(cartItemsTable)
      .where(and(eq(cartItemsTable.sessionId, sessionId), eq(cartItemsTable.productId, productId)));
  } else {
    await db
      .update(cartItemsTable)
      .set({ quantity })
      .where(and(eq(cartItemsTable.sessionId, sessionId), eq(cartItemsTable.productId, productId)));
  }

  const cart = await buildCart(sessionId);
  res.json(cart);
});

router.delete("/cart/:sessionId/items/:productId", async (req, res): Promise<void> => {
  const sessionId = Array.isArray(req.params.sessionId) ? req.params.sessionId[0] : req.params.sessionId;
  const rawProductId = Array.isArray(req.params.productId) ? req.params.productId[0] : req.params.productId;
  const productId = parseInt(rawProductId, 10);

  await db
    .delete(cartItemsTable)
    .where(and(eq(cartItemsTable.sessionId, sessionId), eq(cartItemsTable.productId, productId)));

  const cart = await buildCart(sessionId);
  res.json(cart);
});

export default router;
