import { pgTable, serial, jsonb, timestamp } from "drizzle-orm/pg-core";

export const siteSettingsTable = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  settings: jsonb("settings").notNull().$type<SiteSettingsData>().default({
    announcementText: "Welcome to Green Madani International Private Ltd.",
    siteName: "GMI",
    headerLogoUrl: "",
    footerLogoUrl: "",
    tagline: "A diversified business group driving sustainable growth across Bangladesh and beyond.",
    address: "924/C, Taltola Moor, Khilgaon-1219, Dhaka",
    phone: "01340-862454",
    email: "info@greenmadani.com",
    facebookUrl: "",
    twitterUrl: "",
    youtubeUrl: "",
    linkedinUrl: "",
    instagramUrl: "",
    copyrightText: "2026 Green Madani International Private Ltd. All rights reserved.",
  }),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export interface SiteSettingsData {
  announcementText: string;
  siteName: string;
  headerLogoUrl: string;
  footerLogoUrl: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  facebookUrl: string;
  twitterUrl: string;
  youtubeUrl: string;
  linkedinUrl: string;
  instagramUrl: string;
  copyrightText: string;
}
