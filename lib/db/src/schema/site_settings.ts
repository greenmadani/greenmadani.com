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
    announcementEnabled: true,
    announcementBgColor: "#1a472a",
    announcementTextColor: "#ffffff",
    announcementDismissible: true,
    ctaButtonText: "Explore Our Businesses",
    ctaButtonLink: "/businesses",
    navItems: [],
    footerColumns: [],
    privacyPolicyUrl: "",
    termsUrl: "",
    footerBgColor: "#1a1a2e",
    showSocialInFooter: true,
    primaryColor: "#1a472a",
    accentColor: "#c8a951",
    footerColor: "#1a1a2e",
    bgColor: "#ffffff",
    seoTitle: "",
    seoDescription: "",
    seoOgImage: "",
    seoKeywords: "",
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

  // Top Bar
  announcementEnabled: boolean;
  announcementBgColor: string;
  announcementTextColor: string;
  announcementDismissible: boolean;

  // Header
  ctaButtonText: string;
  ctaButtonLink: string;
  navItems: { label: string; href: string; isExternal?: boolean }[];

  // Footer
  footerColumns: { title: string; links: { label: string; href: string }[] }[];
  privacyPolicyUrl: string;
  termsUrl: string;
  footerBgColor: string;
  showSocialInFooter: boolean;

  // Branding
  primaryColor: string;
  accentColor: string;
  footerColor: string;
  bgColor: string;

  // SEO
  seoTitle: string;
  seoDescription: string;
  seoOgImage: string;
  seoKeywords: string;
}
