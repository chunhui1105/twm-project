import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";

export const brandsTable = pgTable("brands", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  imageUrl: text("image_url").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  active: boolean("active").notNull().default(true),
});

export type Brand = typeof brandsTable.$inferSelect;
