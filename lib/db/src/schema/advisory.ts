import { pgTable, text, serial, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const cropsTable = pgTable("crops", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  englishName: text("english_name"),
  category: text("category").notNull(),
  season: text("season"),
  soilType: text("soil_type"),
  fertilizerNotes: text("fertilizer_notes"),
  irrigationNotes: text("irrigation_notes"),
  seedVarietyRef: text("seed_variety_ref"),
  expectedYield: text("expected_yield"),
  imageUrl: text("image_url"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const diseasesTable = pgTable("diseases", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  cropId: integer("crop_id").references(() => cropsTable.id, { onDelete: "set null" }),
  cropName: text("crop_name"),
  category: text("category").notNull(),
  symptoms: jsonb("symptoms").notNull().$type<string[]>().default([]),
  causeType: text("cause_type"),
  causeNotes: text("cause_notes"),
  treatmentText: text("treatment_text").notNull(),
  preventionSteps: jsonb("prevention_steps").notNull().$type<string[]>().default([]),
  relatedProductIds: jsonb("related_product_ids").notNull().$type<number[]>().default([]),
  imageUrl: text("image_url"),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const seasonsTable = pgTable("seasons", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  englishName: text("english_name"),
  description: text("description"),
  months: text("months"),
  sowingWindow: text("sowing_window"),
  transplantingWindow: text("transplanting_window"),
  harvestWindow: text("harvest_window"),
  applicableCrops: jsonb("applicable_crops").notNull().$type<string[]>().default([]),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const advisoryInquiriesTable = pgTable("advisory_inquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  district: text("district"),
  crop: text("crop"),
  question: text("question").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const weatherCacheTable = pgTable("weather_cache", {
  id: serial("id").primaryKey(),
  district: text("district").notNull().unique(),
  fetchedAt: timestamp("fetched_at", { withTimezone: true }).notNull(),
  payloadJson: jsonb("payload_json").notNull(),
});

export const insertCropSchema = createInsertSchema(cropsTable).omit({ id: true, createdAt: true });
export const insertDiseaseSchema = createInsertSchema(diseasesTable).omit({ id: true, createdAt: true });
export const insertSeasonSchema = createInsertSchema(seasonsTable).omit({ id: true, createdAt: true });
export const insertAdvisoryInquirySchema = createInsertSchema(advisoryInquiriesTable).omit({ id: true, createdAt: true });

export type InsertCrop = z.infer<typeof insertCropSchema>;
export type Crop = typeof cropsTable.$inferSelect;
export type InsertDisease = z.infer<typeof insertDiseaseSchema>;
export type Disease = typeof diseasesTable.$inferSelect;
export type InsertSeason = z.infer<typeof insertSeasonSchema>;
export type Season = typeof seasonsTable.$inferSelect;
export type InsertAdvisoryInquiry = z.infer<typeof insertAdvisoryInquirySchema>;
export type AdvisoryInquiry = typeof advisoryInquiriesTable.$inferSelect;
export type WeatherCache = typeof weatherCacheTable.$inferSelect;
