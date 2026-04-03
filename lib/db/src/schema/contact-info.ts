import { pgTable, text, serial } from "drizzle-orm/pg-core";

export const contactInfoTable = pgTable("contact_info", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  label: text("label").notNull(),
  value: text("value").notNull().default(""),
});

export type ContactInfo = typeof contactInfoTable.$inferSelect;
