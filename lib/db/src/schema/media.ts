import { pgTable, text, serial, integer, timestamp, uuid } from "drizzle-orm/pg-core";

export const mediaTable = pgTable("media", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  url: text("url").notNull(),
  bucket: text("bucket").notNull(),
  path: text("path").notNull(),
  alt: text("alt"),
  uploadedBy: uuid("uploaded_by"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
