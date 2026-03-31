import { Router, type IRouter } from "express";
import { db, ordersTable, cartItemsTable, productsTable } from "@workspace/db";
import { eq, desc, and } from "drizzle-orm";

const router: IRouter = Router();

function formatOrder(order: typeof ordersTable.$inferSelect) {
  return {
    ...order,
    total: parseFloat(order.total as unknown as string),
    createdAt: order.createdAt.toISOString(),
    items: order.items as Array<{
      productId: number;
      productName: string;
      price: number;
      quantity: number;
      subtotal: number;
    }>,
  };
}

router.get("/orders", async (_req, res): Promise<void> => {
  const orders = await db.select().from(ordersTable).orderBy(desc(ordersTable.createdAt));
  res.json(orders.map(formatOrder));
});

router.post("/orders", async (req, res): Promise<void> => {
  const { sessionId, customerName, customerEmail, customerPhone, shippingAddress } = req.body;

  if (!sessionId || !customerName || !customerEmail || !shippingAddress) {
    res.status(400).json({ error: "sessionId, customerName, customerEmail, and shippingAddress are required" });
    return;
  }

  const cartItems = await db
    .select({
      productId: cartItemsTable.productId,
      quantity: cartItemsTable.quantity,
      productName: productsTable.name,
      price: productsTable.price,
    })
    .from(cartItemsTable)
    .innerJoin(productsTable, eq(cartItemsTable.productId, productsTable.id))
    .where(eq(cartItemsTable.sessionId, sessionId));

  if (cartItems.length === 0) {
    res.status(400).json({ error: "Cart is empty" });
    return;
  }

  const items = cartItems.map(item => {
    const price = parseFloat(item.price as unknown as string);
    return {
      productId: item.productId,
      productName: item.productName,
      price,
      quantity: item.quantity,
      subtotal: parseFloat((price * item.quantity).toFixed(2)),
    };
  });

  const total = parseFloat(items.reduce((sum, i) => sum + i.subtotal, 0).toFixed(2));

  const [order] = await db.insert(ordersTable).values({
    customerName,
    customerEmail,
    customerPhone: customerPhone ?? null,
    shippingAddress,
    items,
    total: String(total),
    status: "pending",
  }).returning();

  // Clear cart after order
  await db.delete(cartItemsTable).where(eq(cartItemsTable.sessionId, sessionId));

  res.status(201).json(formatOrder(order));
});

router.get("/orders/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const [order] = await db.select().from(ordersTable).where(eq(ordersTable.id, id));

  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  res.json(formatOrder(order));
});

router.patch("/orders/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const { status } = req.body;

  if (!status) {
    res.status(400).json({ error: "status is required" });
    return;
  }

  const [updated] = await db.update(ordersTable).set({ status }).where(eq(ordersTable.id, id)).returning();

  if (!updated) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  res.json(formatOrder(updated));
});

export default router;
