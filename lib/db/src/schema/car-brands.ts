import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";

export const carBrandsTable = pgTable("car_brands", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  origin: text("origin").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const carModelsTable = pgTable("car_models", {
  id: serial("id").primaryKey(),
  brandId: integer("brand_id").notNull(),
  name: text("name").notNull(),
  years: text("years").notNull().default(""),
  imageUrl: text("image_url"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export type CarBrand = typeof carBrandsTable.$inferSelect;
export type CarModel = typeof carModelsTable.$inferSelect;
