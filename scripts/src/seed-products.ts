import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import crypto from "crypto";

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

const supabaseUrl = env.SUPABASE_URL!;
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, serviceRoleKey);

const BUCKET = "site-media";
const IMAGES_DIR = resolve(__dirname, "../../product-images");

interface ProductData {
  name: string;
  category: string;
  categorySlug: string;
  description: string;
  longDescription?: string;
  featured?: boolean;
  businessSlug?: string;
  tags?: string[];
  status?: string;
}

// ============================================================
// EDIT THIS SECTION: Define your products here.
// Each entry corresponds to an image file in product-images/
// (first image -> first product, second image -> second product, etc.)
// ============================================================
// Products ordered to match alphabetical image sort order:
// 1. Green-Power-Cattle-Growth-Dairy.webp
// 2. Green-Power-Cattle-Growth.webp
// 3. Green-Power-Corn-Seed.webp
// 4. Green-Power-Fastest-Fish-Growth.webp
// 5. Green-Power-Fish-Growth.webp
// 6. Green-Power-Growth.webp
// 7. Green-Power-Nishinda.webp
// 8. Green-Power-P-G-R.webp
const products: ProductData[] = [
  {
    name: "Miracle Cattle Growth Dairy",
    category: "Livestock Products",
    categorySlug: "livestock-products",
    description: "Specialized dairy cattle feed supplement for increased milk production and improved herd health.",
    longDescription: "Miracle Cattle Growth Dairy is a targeted nutritional supplement formulated specifically for dairy cattle to support peak milk production and overall herd wellness. Enriched with calcium, phosphorus, and essential minerals, it strengthens bones, improves feed efficiency, and enhances milk yield and quality. Regular feeding helps maintain body condition during lactation cycles, reduces the risk of metabolic disorders, and supports reproductive health. Ideal for dairy farmers aiming to maximize productivity while ensuring the long-term health of their herd.",
    featured: false,
    businessSlug: "gmi-power-agro",
    tags: ["dairy cattle", "milk production", "feed supplement", "calcium", "livestock"],
    status: "active",
  },
  {
    name: "Miracle Cattle Growth Poultry",
    category: "Livestock Products",
    categorySlug: "livestock-products",
    description: "Dicalcium phosphate feed supplement for poultry and cattle. Promotes strong bone development and faster healthy growth.",
    longDescription: "Miracle Cattle Growth Poultry is a premium dicalcium phosphate (DCP) feed supplement formulated to meet the calcium and phosphorus requirements of poultry and cattle. Proper calcium-phosphorus balance is essential for strong skeletal development, efficient feed conversion, and optimal growth rates. This supplement supports eggshell quality in laying hens, weight gain in broilers, and overall health in cattle. Manufactured under strict quality controls, it mixes easily with regular feed and is suitable for all stages of livestock development.",
    featured: true,
    businessSlug: "gmi-power-agro",
    tags: ["dicalcium phosphate", "cattle feed", "poultry feed", "calcium supplement", "livestock"],
    status: "active",
  },
  {
    name: "Miracle Corn Seeds (Hybrid Maize)",
    category: "Seeds",
    categorySlug: "seeds",
    description: "High-yield hybrid maize seeds (Single Cross) featuring long cobs with complete tip filling for maximum harvest quality.",
    longDescription: "Miracle Corn Seeds are premium hybrid maize seeds developed using Single Cross technology to deliver exceptional yields and robust plant health. These seeds produce plants with strong stalks, long cobs, and complete tip filling — ensuring no kernel is wasted. The hybrid variety offers excellent disease resistance, drought tolerance, and adaptability to diverse growing conditions across Bangladesh. Farmers can expect consistently high yields of quality maize suitable for both human consumption and animal feed markets.",
    featured: true,
    businessSlug: "gmi-power-agro",
    tags: ["hybrid maize", "corn seeds", "single cross", "high yield", "seeds"],
    status: "active",
  },
  {
    name: "Miracle Fastest Fish Growth",
    category: "Fisheries Products",
    categorySlug: "fisheries-products",
    description: "Organic fish growth solution that accelerates healthy fish development without harmful hormones. 1 liter bottle.",
    longDescription: "Miracle Fastest Fish Growth is an organic fish growth solution formulated to accelerate healthy weight gain and development in farmed fish without the use of synthetic hormones or harmful chemicals. This 1-liter solution contains a proprietary blend of natural growth promoters, essential amino acids, vitamins, and minerals that enhance feed conversion, boost immunity, and improve survival rates. Suitable for use in ponds, tanks, and commercial aquaculture operations, it helps fish farmers achieve market-ready size faster while maintaining the highest standards of food safety and quality.",
    featured: true,
    businessSlug: "gmi-power-agro",
    tags: ["fish growth", "aquaculture", "organic", "feed supplement", "fisheries"],
    status: "active",
  },
  {
    name: "Fish Growth Geo Lite Mix",
    category: "Fisheries Products",
    categorySlug: "fisheries-products",
    description: "Mineral pond mix for fish and shrimp aquaculture. Enhances water quality and promotes natural food production.",
    longDescription: "Fish Growth Geo Lite Mix is a specially formulated pond mineral mix designed to create an optimal growing environment for fish and shrimp. It enriches pond water with essential minerals and trace elements that promote the growth of natural plankton — the primary food source for many aquaculture species. Regular application improves water quality, stabilizes pH levels, increases dissolved oxygen, and reduces toxic ammonia. The result is healthier, faster-growing fish and shrimp with lower feed costs and higher survival rates.",
    featured: false,
    businessSlug: "gmi-power-agro",
    tags: ["pond mineral mix", "aquaculture", "shrimp", "water quality", "fisheries"],
    status: "active",
  },
  {
    name: "GP Growth (Boron Mix)",
    category: "Agriculture Inputs",
    categorySlug: "agriculture-inputs",
    description: "Soluble boron fertilizer that improves root development, flowering, and fruit setting across a wide range of crops.",
    longDescription: "GP Growth (Boron Mix) is a high-quality soluble boron fertilizer designed to correct boron deficiencies and promote optimal plant development. Boron is an essential micronutrient that plays a critical role in cell wall formation, root growth, flower development, and fruit setting. This easy-to-apply formula dissolves readily in water for foliar spray or soil application, ensuring rapid uptake by plants. Regular use leads to stronger root systems, more abundant flowering, improved fruit set, and higher overall crop quality and yield.",
    featured: false,
    businessSlug: "gmi-power-agro",
    tags: ["boron fertilizer", "micronutrient", "plant growth", "flowering", "fruit setting"],
    status: "active",
  },
  {
    name: "Miracle Nishinda",
    category: "Farming Products",
    categorySlug: "farming-products",
    description: "Organic pesticide based on Nishinda plant extract. Effectively kills plant insects using an American formula — safe for crops and the environment.",
    longDescription: "Miracle Nishinda is an organic pesticide developed using an American formula that harnesses the natural insecticidal properties of the Nishinda plant (Vitex negundo). It provides effective control against a wide range of plant insects including aphids, caterpillars, whiteflies, and leafhoppers. Unlike chemical pesticides, Miracle Nishinda is biodegradable, leaves no harmful residues, and is safe for beneficial insects when used as directed. It is the ideal choice for farmers seeking organic crop protection solutions that deliver results without compromising environmental stewardship.",
    featured: true,
    businessSlug: "gmi-power-agro",
    tags: ["organic pesticide", "nishinda", "insecticide", "natural pest control", "farming"],
    status: "active",
  },
  {
    name: "Green Power PGR (4 CPA)",
    category: "Plant Growth Solutions",
    categorySlug: "plant-growth-solutions",
    description: "A powerful plant growth regulator for vegetables and fruit crops. Promotes healthier growth, better flowering, and higher yields.",
    longDescription: "Green Power PGR (4 CPA) is a scientifically formulated plant growth regulator designed to enhance the growth and productivity of vegetables and fruit crops. This 200ml solution stimulates cell division, promotes fruit setting, and improves overall crop quality. Ideal for use on tomatoes, eggplants, chilies, and other fruit-bearing vegetables, it helps farmers achieve uniform ripening and increased marketable yield. Application is simple and cost-effective, making it an essential tool for modern commercial farming.",
    featured: true,
    businessSlug: "gmi-power-agro",
    tags: ["plant growth regulator", "4 CPA", "vegetables", "fruit crops", "yield enhancer"],
    status: "active",
  },
];
// ============================================================

async function ensureBucket(name: string) {
  const { data: buckets } = await supabase.storage.listBuckets();
  if (!buckets?.find(b => b.name === name)) {
    const { error } = await supabase.storage.createBucket(name, { public: true });
    if (error) throw new Error(`Failed to create bucket: ${error.message}`);
    console.log(`  Created bucket: ${name}`);
  }
}

async function uploadImage(filePath: string, fileName: string): Promise<string> {
  const buffer = readFileSync(filePath);
  const ext = fileName.split(".").pop() || "jpg";
  const uniqueName = `${crypto.randomUUID()}.${ext}`;
  const objectPath = `uploads/${uniqueName}`;

  const mimeMap: Record<string, string> = {
    jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png",
    gif: "image/gif", webp: "image/webp",
  };
  const contentType = mimeMap[ext.toLowerCase()] || "application/octet-stream";

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(objectPath, buffer, { contentType, upsert: false });

  if (uploadError) throw new Error(`Upload failed for ${fileName}: ${uploadError.message}`);

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(objectPath);
  return urlData?.publicUrl as string;
}

async function main() {
  const files = readdirSync(IMAGES_DIR)
    .filter(f => /\.(jpg|jpeg|png|gif|webp)$/i.test(f))
    .sort();

  console.log("Ensuring storage bucket exists...");
  await ensureBucket(BUCKET);

  // Clean up previously inserted products (old runs with wrong order)
  console.log("Cleaning up old products...");
  const { data: existing } = await supabase.from("products").select("id, image_url");
  if (existing && existing.length > 0) {
    for (const p of existing) {
      await supabase.from("products").delete().eq("id", p.id);
      // Try to extract storage path from URL to delete the image too
      if (p.image_url && p.image_url.startsWith("http")) {
        try {
          const url = new URL(p.image_url);
          const parts = url.pathname.split("/public/");
          if (parts.length > 1) {
            await supabase.storage.from(BUCKET).remove([parts[1]]);
          }
        } catch { /* skip invalid URLs */ }
      }
    }
    console.log(`  Deleted ${existing.length} old product(s) and their images`);
  }

  if (files.length === 0) {
    console.log("No images found in product-images/. Drop your product images there first.");
    return;
  }

  if (products.length === 0) {
    console.log(`Found ${files.length} image(s), but no product data is defined.`);
    console.log("Tell me what products these are and I'll fill in the content.");
    return;
  }

  if (files.length !== products.length) {
    console.log(`Warning: ${files.length} images but ${products.length} product definitions.`);
  }

  for (let i = 0; i < Math.min(files.length, products.length); i++) {
    const filePath = resolve(IMAGES_DIR, files[i]);
    const p = products[i];

    console.log(`\n[${i + 1}/${Math.min(files.length, products.length)}] ${files[i]}`);
    console.log(`  Uploading image...`);
    const imageUrl = await uploadImage(filePath, files[i]);
    console.log(`  Image URL: ${imageUrl}`);

    console.log(`  Creating product: ${p.name}...`);
    const { data, error } = await supabase
      .from("products")
      .insert({
        name: p.name,
        category: p.category,
        category_slug: p.categorySlug,
        description: p.description,
        long_description: p.longDescription || null,
        image_url: imageUrl,
        featured: p.featured || false,
        business_slug: p.businessSlug || null,
        tags: p.tags || [],
        status: p.status || "active",
      })
      .select();

    if (error) {
      console.error(`  FAILED: ${error.message}`);
    } else {
      console.log(`  Created product ID: ${data![0].id}`);
    }
  }

  console.log("\nAll done!");
}

main().catch((err) => {
  console.error("Script failed:", err);
  process.exit(1);
});
