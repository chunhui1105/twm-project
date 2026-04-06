import { Router, type IRouter } from "express";
import { db, productsTable, categoriesTable, reviewsTable } from "@workspace/db";
import { eq, ilike, and, gte, lte, desc, asc, sql, count, avg } from "drizzle-orm";

const router: IRouter = Router();

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

router.get("/products/featured", async (_req, res): Promise<void> => {
  const products = await db
    .select({
      id: productsTable.id,
      name: productsTable.name,
      slug: productsTable.slug,
      description: productsTable.description,
      price: productsTable.price,
      compareAtPrice: productsTable.compareAtPrice,
      imageUrl: productsTable.imageUrl,
      imageUrls: productsTable.imageUrls,
      videoUrl: productsTable.videoUrl,
      categoryId: productsTable.categoryId,
      categoryName: categoriesTable.name,
      brand: productsTable.brand,
      sku: productsTable.sku,
      stock: productsTable.stock,
      featured: productsTable.featured,
      rating: productsTable.rating,
      reviewCount: productsTable.reviewCount,
      tags: productsTable.tags,
      categoryIds: productsTable.categoryIds,
      carBrandIds: productsTable.carBrandIds,
      carModelIds: productsTable.carModelIds,
      variations: productsTable.variations,
      createdAt: productsTable.createdAt,
    })
    .from(productsTable)
    .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
    .where(eq(productsTable.featured, true))
    .orderBy(desc(productsTable.createdAt))
    .limit(8);

  res.json(products.map(p => ({
    ...p,
    price: parseFloat(p.price as unknown as string),
    compareAtPrice: p.compareAtPrice ? parseFloat(p.compareAtPrice as unknown as string) : null,
    rating: p.rating ? parseFloat(p.rating as unknown as string) : null,
    createdAt: p.createdAt.toISOString(),
  })));
});

router.get("/products/stats", async (_req, res): Promise<void> => {
  const [totalProducts] = await db.select({ count: count() }).from(productsTable);
  const [totalCategories] = await db.select({ count: count() }).from(categoriesTable);
  const [featuredCount] = await db.select({ count: count() }).from(productsTable).where(eq(productsTable.featured, true));
  const outOfStockResult = await db.select({ count: count() }).from(productsTable).where(eq(productsTable.stock, 0));
  const [avgPriceResult] = await db.select({ avg: avg(productsTable.price) }).from(productsTable);

  const topCategoryResult = await db
    .select({ name: categoriesTable.name, productCount: categoriesTable.productCount })
    .from(categoriesTable)
    .orderBy(desc(categoriesTable.productCount))
    .limit(1);

  res.json({
    totalProducts: totalProducts.count,
    totalCategories: totalCategories.count,
    featuredCount: featuredCount.count,
    outOfStock: outOfStockResult[0].count,
    avgPrice: avgPriceResult.avg ? parseFloat(avgPriceResult.avg as unknown as string) : 0,
    topCategory: topCategoryResult[0]?.name ?? null,
  });
});

router.get("/products", async (req, res): Promise<void> => {
  const { categoryId, search, minPrice, maxPrice, featured, page = "1", limit = "12" } = req.query as Record<string, string>;

  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 12;
  const offset = (pageNum - 1) * limitNum;

  const conditions = [];
  if (categoryId) conditions.push(eq(productsTable.categoryId, parseInt(categoryId, 10)));
  if (search) conditions.push(ilike(productsTable.name, `%${search}%`));
  if (minPrice) conditions.push(gte(productsTable.price, minPrice));
  if (maxPrice) conditions.push(lte(productsTable.price, maxPrice));
  if (featured === "true") conditions.push(eq(productsTable.featured, true));

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [{ total }] = await db
    .select({ total: count() })
    .from(productsTable)
    .where(whereClause);

  const products = await db
    .select({
      id: productsTable.id,
      name: productsTable.name,
      slug: productsTable.slug,
      description: productsTable.description,
      price: productsTable.price,
      compareAtPrice: productsTable.compareAtPrice,
      imageUrl: productsTable.imageUrl,
      imageUrls: productsTable.imageUrls,
      videoUrl: productsTable.videoUrl,
      categoryId: productsTable.categoryId,
      categoryName: categoriesTable.name,
      brand: productsTable.brand,
      sku: productsTable.sku,
      stock: productsTable.stock,
      featured: productsTable.featured,
      rating: productsTable.rating,
      reviewCount: productsTable.reviewCount,
      tags: productsTable.tags,
      categoryIds: productsTable.categoryIds,
      carBrandIds: productsTable.carBrandIds,
      carModelIds: productsTable.carModelIds,
      variations: productsTable.variations,
      createdAt: productsTable.createdAt,
    })
    .from(productsTable)
    .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
    .where(whereClause)
    .orderBy(desc(productsTable.createdAt))
    .limit(limitNum)
    .offset(offset);

  const formatted = products.map(p => ({
    ...p,
    price: parseFloat(p.price as unknown as string),
    compareAtPrice: p.compareAtPrice ? parseFloat(p.compareAtPrice as unknown as string) : null,
    rating: p.rating ? parseFloat(p.rating as unknown as string) : null,
    createdAt: p.createdAt.toISOString(),
  }));

  res.json({
    products: formatted,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum),
  });
});

router.post("/products", async (req, res): Promise<void> => {
  const { name, description, price, compareAtPrice, imageUrl, imageUrls, videoUrl, categoryId, categoryIds, carBrandIds, carModelIds, variations, brand, sku, stock, featured, tags } = req.body;

  if (!name || price == null) {
    res.status(400).json({ error: "name and price are required" });
    return;
  }

  const slug = slugify(name);

  const [product] = await db.insert(productsTable).values({
    name,
    slug,
    description: description ?? null,
    price: String(price),
    compareAtPrice: compareAtPrice != null ? String(compareAtPrice) : null,
    imageUrl: imageUrl ?? null,
    imageUrls: imageUrls ?? [],
    videoUrl: videoUrl ?? null,
    categoryId: categoryId ?? null,
    categoryIds: categoryIds ?? [],
    carBrandIds: carBrandIds ?? [],
    carModelIds: carModelIds ?? [],
    variations: variations ?? [],
    brand: brand ?? null,
    sku: sku ?? null,
    stock: stock ?? 0,
    featured: featured ?? false,
    tags: tags ?? [],
  }).returning();

  if (categoryId) {
    await db.execute(sql`UPDATE categories SET product_count = product_count + 1 WHERE id = ${categoryId}`);
  }

  const result = await db
    .select({
      id: productsTable.id,
      name: productsTable.name,
      slug: productsTable.slug,
      description: productsTable.description,
      price: productsTable.price,
      compareAtPrice: productsTable.compareAtPrice,
      imageUrl: productsTable.imageUrl,
      imageUrls: productsTable.imageUrls,
      videoUrl: productsTable.videoUrl,
      categoryId: productsTable.categoryId,
      categoryIds: productsTable.categoryIds,
      carBrandIds: productsTable.carBrandIds,
      carModelIds: productsTable.carModelIds,
      variations: productsTable.variations,
      categoryName: categoriesTable.name,
      brand: productsTable.brand,
      sku: productsTable.sku,
      stock: productsTable.stock,
      featured: productsTable.featured,
      rating: productsTable.rating,
      reviewCount: productsTable.reviewCount,
      tags: productsTable.tags,
      createdAt: productsTable.createdAt,
    })
    .from(productsTable)
    .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
    .where(eq(productsTable.id, product.id));

  const p = result[0];
  res.status(201).json({
    ...p,
    price: parseFloat(p.price as unknown as string),
    compareAtPrice: p.compareAtPrice ? parseFloat(p.compareAtPrice as unknown as string) : null,
    rating: p.rating ? parseFloat(p.rating as unknown as string) : null,
    createdAt: p.createdAt.toISOString(),
  });
});

router.get("/products/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const result = await db
    .select({
      id: productsTable.id,
      name: productsTable.name,
      slug: productsTable.slug,
      description: productsTable.description,
      price: productsTable.price,
      compareAtPrice: productsTable.compareAtPrice,
      imageUrl: productsTable.imageUrl,
      imageUrls: productsTable.imageUrls,
      videoUrl: productsTable.videoUrl,
      categoryId: productsTable.categoryId,
      categoryIds: productsTable.categoryIds,
      carBrandIds: productsTable.carBrandIds,
      carModelIds: productsTable.carModelIds,
      variations: productsTable.variations,
      categoryName: categoriesTable.name,
      brand: productsTable.brand,
      sku: productsTable.sku,
      stock: productsTable.stock,
      featured: productsTable.featured,
      rating: productsTable.rating,
      reviewCount: productsTable.reviewCount,
      tags: productsTable.tags,
      createdAt: productsTable.createdAt,
    })
    .from(productsTable)
    .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
    .where(eq(productsTable.id, id));

  if (!result[0]) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  const p = result[0];
  res.json({
    ...p,
    price: parseFloat(p.price as unknown as string),
    compareAtPrice: p.compareAtPrice ? parseFloat(p.compareAtPrice as unknown as string) : null,
    rating: p.rating ? parseFloat(p.rating as unknown as string) : null,
    createdAt: p.createdAt.toISOString(),
  });
});

router.patch("/products/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const { name, description, price, compareAtPrice, imageUrl, imageUrls, videoUrl, categoryId, categoryIds, carBrandIds, carModelIds, variations, brand, sku, stock, featured, tags } = req.body;

  const updateData: Record<string, unknown> = {};
  if (name !== undefined) { updateData.name = name; updateData.slug = slugify(name); }
  if (description !== undefined) updateData.description = description;
  if (price !== undefined) updateData.price = String(price);
  if (compareAtPrice !== undefined) updateData.compareAtPrice = compareAtPrice != null ? String(compareAtPrice) : null;
  if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
  if (imageUrls !== undefined) updateData.imageUrls = imageUrls;
  if (videoUrl !== undefined) updateData.videoUrl = videoUrl;
  if (categoryId !== undefined) updateData.categoryId = categoryId;
  if (categoryIds !== undefined) updateData.categoryIds = categoryIds;
  if (carBrandIds !== undefined) updateData.carBrandIds = carBrandIds;
  if (carModelIds !== undefined) updateData.carModelIds = carModelIds;
  if (variations !== undefined) updateData.variations = variations;
  if (brand !== undefined) updateData.brand = brand;
  if (sku !== undefined) updateData.sku = sku;
  if (stock !== undefined) updateData.stock = stock;
  if (featured !== undefined) updateData.featured = featured;
  if (tags !== undefined) updateData.tags = tags;

  const [updated] = await db.update(productsTable).set(updateData).where(eq(productsTable.id, id)).returning();

  if (!updated) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  const result = await db
    .select({
      id: productsTable.id,
      name: productsTable.name,
      slug: productsTable.slug,
      description: productsTable.description,
      price: productsTable.price,
      compareAtPrice: productsTable.compareAtPrice,
      imageUrl: productsTable.imageUrl,
      imageUrls: productsTable.imageUrls,
      videoUrl: productsTable.videoUrl,
      categoryId: productsTable.categoryId,
      categoryIds: productsTable.categoryIds,
      carBrandIds: productsTable.carBrandIds,
      carModelIds: productsTable.carModelIds,
      variations: productsTable.variations,
      categoryName: categoriesTable.name,
      brand: productsTable.brand,
      sku: productsTable.sku,
      stock: productsTable.stock,
      featured: productsTable.featured,
      rating: productsTable.rating,
      reviewCount: productsTable.reviewCount,
      tags: productsTable.tags,
      createdAt: productsTable.createdAt,
    })
    .from(productsTable)
    .leftJoin(categoriesTable, eq(productsTable.categoryId, categoriesTable.id))
    .where(eq(productsTable.id, id));

  const p = result[0];
  res.json({
    ...p,
    price: parseFloat(p.price as unknown as string),
    compareAtPrice: p.compareAtPrice ? parseFloat(p.compareAtPrice as unknown as string) : null,
    rating: p.rating ? parseFloat(p.rating as unknown as string) : null,
    createdAt: p.createdAt.toISOString(),
  });
});

router.delete("/products/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const [deleted] = await db.delete(productsTable).where(eq(productsTable.id, id)).returning();

  if (!deleted) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  if (deleted.categoryId) {
    await db.execute(sql`UPDATE categories SET product_count = GREATEST(product_count - 1, 0) WHERE id = ${deleted.categoryId}`);
  }

  res.sendStatus(204);
});

router.get("/products/:id/reviews", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const reviews = await db
    .select()
    .from(reviewsTable)
    .where(eq(reviewsTable.productId, id))
    .orderBy(desc(reviewsTable.createdAt));

  res.json(reviews.map(r => ({ ...r, createdAt: r.createdAt.toISOString() })));
});

router.post("/products/:id/reviews", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const { reviewerName, rating, title, comment } = req.body;

  if (!reviewerName || rating == null) {
    res.status(400).json({ error: "reviewerName and rating are required" });
    return;
  }

  const [review] = await db.insert(reviewsTable).values({
    productId: id,
    reviewerName,
    rating,
    title: title ?? null,
    comment: comment ?? null,
  }).returning();

  // Update product rating and review count
  const reviews = await db.select({ rating: reviewsTable.rating }).from(reviewsTable).where(eq(reviewsTable.productId, id));
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  await db.update(productsTable).set({
    rating: String(avgRating.toFixed(2)),
    reviewCount: reviews.length,
  }).where(eq(productsTable.id, id));

  res.status(201).json({ ...review, createdAt: review.createdAt.toISOString() });
});

export default router;
