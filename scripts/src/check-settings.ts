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
const { data, error } = await supabase.from("site_settings").select("settings").limit(1).maybeSingle();
if (error) { console.error(error.message); process.exit(1); }
if (!data) { console.log("No settings found"); process.exit(0); }
const s = data.settings as Record<string, any>;
console.log("facebookUrl:", s.facebookUrl || "(not set)");
console.log("twitterUrl:", s.twitterUrl || "(not set)");
console.log("youtubeUrl:", s.youtubeUrl || "(not set)");
console.log("linkedinUrl:", s.linkedinUrl || "(not set)");
console.log("instagramUrl:", s.instagramUrl || "(not set)");
console.log("showSocialInFooter:", s.showSocialInFooter);
console.log("tagline:", s.tagline);
