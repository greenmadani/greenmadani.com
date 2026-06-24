import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const envContent = readFileSync(resolve(__dirname, "../../artifacts/api-server/.env"), "utf-8");
const env: Record<string, string> = {};
for (const line of envContent.split("\n")) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) continue;
  const idx = trimmed.indexOf("=");
  if (idx === -1) continue;
  env[trimmed.slice(0, idx).trim()] = trimmed.slice(idx + 1).trim();
}

const supabase = createClient(env.SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!);

// Get existing settings
const { data: existing } = await supabase.from("site_settings").select("id, settings").limit(1).maybeSingle();
if (!existing) { console.log("No settings row found"); process.exit(1); }

const settings = { ...existing.settings as Record<string, any> };

settings.facebookUrl = "https://facebook.com/greenmadaniinternational";
settings.twitterUrl = "https://twitter.com/greenmadaniintl";
settings.linkedinUrl = "https://linkedin.com/company/green-madani-international";
settings.youtubeUrl = "https://youtube.com/@greenmadaniinternational";
settings.instagramUrl = "https://instagram.com/greenmadaniinternational";
settings.showSocialInFooter = true;
settings.tagline = "Building Bangladesh's Most Diversified Industrial Group — connecting agriculture, food, healthcare, hospitality, education, and beyond.";

const { error } = await supabase
  .from("site_settings")
  .update({ settings, updated_at: new Date().toISOString() })
  .eq("id", existing.id);

if (error) console.error("Failed:", error.message);
else console.log("Site settings updated with social URLs!");
