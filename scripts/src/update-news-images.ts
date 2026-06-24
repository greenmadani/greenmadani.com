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

const w800 = "w=800&auto=format&fit=crop";

const imageUpdates: Record<number, string> = {
  1: `https://images.unsplash.com/photo-1778858761689-283a96e7a572?${w800}`,  // Sustainable Farming - farmers in rice paddy
  2: `https://images.unsplash.com/photo-1768483018807-bd0b9ab86539?${w800}`,  // Beauty - skincare products
  3: `https://images.unsplash.com/photo-1779517935077-ea91ddfaf8e6?${w800}`,     // Foods ISO - food factory conveyor
  4: `https://images.unsplash.com/photo-1700457551715-1a841c35c0f3?${w800}`,  // Hospitality - beach resort pool
  5: `https://images.unsplash.com/photo-1623461487986-9400110de28e?${w800}`,  // Scholarship - graduation
  6: `https://images.unsplash.com/photo-1762098069270-66f50cdb1a84?${w800}`,  // R&D - green rice paddy field
};

for (const [id, url] of Object.entries(imageUpdates)) {
  const { data, error } = await supabase
    .from("news")
    .update({ image_url: url })
    .eq("id", Number(id))
    .select("id, title");

  if (error) {
    console.error(`Failed to update ID ${id}:`, error.message);
  } else {
    console.log(`✓ ID ${id}: ${data?.[0]?.title} → image updated`);
  }
}

console.log("\nDone!");
