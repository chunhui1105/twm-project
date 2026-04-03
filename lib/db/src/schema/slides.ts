import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";

export const slidesTable = pgTable("slides", {
  id: serial("id").primaryKey(),
  imageUrl: text("image_url").notNull(),
  tag: text("tag").notNull().default(""),
  title: text("title").notNull().default(""),
  highlight: text("highlight").notNull().default(""),
  subtitle: text("subtitle").notNull().default(""),
  categorySlug: text("category_slug"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export type Slide = typeof slidesTable.$inferSelect;
