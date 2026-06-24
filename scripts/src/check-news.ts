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

const { data, error } = await supabase.from("news").select("id, title, category, image_url, slug").order("id");
if (error) {
  console.error("Error:", error.message);
  process.exit(1);
}
if (!data || data.length === 0) {
  console.log("No news articles found.");
  process.exit(0);
}
for (const n of data) {
  console.log(`${n.id} | ${n.title} | ${n.category} | image: ${n.image_url || "NONE"}`);
}
