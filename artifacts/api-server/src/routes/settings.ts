import { Router } from "express";
import { supabase } from "@workspace/db";

const router = Router();

const defaults = {
  siteName: "Green Madani International Private Ltd.",
  tagline: "Building Bangladesh's Most Diversified Industrial Group",
  announcementText: "Welcome to Green Madani International — Better Food, Better Life, Our Food, Our Life",
  seoTitle: "Green Madani International Private Ltd. — Better Food, Better Life, Our Food, Our Life",
  seoDescription: "Green Madani International Private Ltd. is a diversified business group operating across 12 integrated verticals — from agriculture and food to healthcare, education, hospitality, and media.",
  address: "924/C, Taltola Moor, Khilgaon-1219, Dhaka, Bangladesh",
  phone: "01340-862454",
  email: "info@greenmadani.com",
  copyrightText: "© 2026 Green Madani International Private Ltd. All Rights Reserved.",
  facebookUrl: "https://facebook.com/greenmadaniinternational",
  twitterUrl: "https://twitter.com/greenmadaniintl",
  linkedinUrl: "https://linkedin.com/company/green-madani-international",
  youtubeUrl: "https://youtube.com/@greenmadaniinternational",
  instagramUrl: "https://instagram.com/greenmadaniinternational",
};

router.get("/", async (_req, res) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  const { data, error } = await supabase!.from("site_settings").select("settings").limit(1).maybeSingle();
  if (error) return res.status(500).json({ error: error.message });
  const settings = data?.settings ?? {};
  res.json({ ...defaults, ...settings });
});

export default router;