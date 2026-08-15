import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const AGRI_IMG_DIR = resolve(__dirname, "../../artifacts/gmi-website/public/images/agri");

const CATEGORY_GRADIENTS: Record<string, [string, string]> = {
  "ধান": ["#2E7D32", "#1B5E20"],
  "গম ও দানা": ["#F9A825", "#F57F17"],
  "সবজি": ["#43A047", "#2E7D32"],
  "ফল": ["#FB8C00", "#E65100"],
  "তেল ও ডাল": ["#9E9D24", "#827717"],
  "মাছ": ["#0288D1", "#01579B"],
  "গবাদি পশু": ["#8D6E63", "#5D4037"],
  "মসলা": ["#D84315", "#BF360C"],
};

const CAUSE_GRADIENTS: Record<string, [string, string]> = {
  insect: ["#6D4C41", "#4E342E"],
  fungal: ["#8E24AA", "#4A148C"],
  bacterial: ["#D32F2F", "#7F0000"],
  viral: ["#4527A0", "#1A237E"],
};

const CROP_IMAGES: Record<string, { slug: string; emoji: string }> = {
  "ধান (উফশী)": { slug: "paddy", emoji: "🌾" },
  "গম": { slug: "wheat", emoji: "🌾" },
  "ভুট্টা (হাইব্রিড)": { slug: "maize", emoji: "🌽" },
  "মরিচ": { slug: "chili", emoji: "🌶️" },
  "টমেটো": { slug: "tomato", emoji: "🍅" },
  "আলু": { slug: "potato", emoji: "🥔" },
  "আম": { slug: "mango", emoji: "🥭" },
  "পেঁয়াজ": { slug: "onion", emoji: "🧅" },
  "সরিষা": { slug: "mustard", emoji: "🌼" },
  "মুগ ডাল": { slug: "mung-bean", emoji: "🫘" },
  "তিল": { slug: "sesame", emoji: "🌻" },
  "রুই মাছ": { slug: "rui-fish", emoji: "🐟" },
  "গরু (দুগ্ধ)": { slug: "dairy-cattle", emoji: "🐄" },
  "মুরগি (ব্রয়লার)": { slug: "broiler", emoji: "🐔" },
  "রসুন": { slug: "garlic", emoji: "🧄" },
  "আদা": { slug: "ginger", emoji: "🪴" },
};

const DISEASE_IMAGES: Record<string, { slug: string; emoji: string }> = {
  "ধান মাজরা পোকা": { slug: "rice-stem-borer", emoji: "🐛" },
  "ধান পাখোয়াড়া পোকা": { slug: "rice-bph", emoji: "🐛" },
  "ধান শীষকাটা রোগ (ব্লাস্ট)": { slug: "rice-blast", emoji: "🍄" },
  "আম গুঁটি মাইট": { slug: "mango-mite", emoji: "🐛" },
  "আমের ভাইরাস (মোজাইক)": { slug: "mango-mosaic", emoji: "🦠" },
  "মরিচের অ্যানথ্রাকনোজ": { slug: "chili-anthracnose", emoji: "🍄" },
  "টমেটোর মরিচা/ঝাড়পোড়া রোগ": { slug: "tomato-blight", emoji: "🍄" },
  "আলু স্ক্যাব রোগ": { slug: "potato-scab", emoji: "🦠" },
  "গরুর ফুট অ্যান্ড মাউথ (ক্ষুরা রোগ)": { slug: "fmd", emoji: "🦠" },
};

function svgPlaceholder(name: string, emoji: string, [c1, c2]: [string, string]): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/>
  </linearGradient></defs>
  <rect width="800" height="600" fill="url(#g)"/>
  <circle cx="110" cy="90" r="190" fill="#fff" opacity="0.07"/>
  <circle cx="710" cy="530" r="230" fill="#000" opacity="0.10"/>
  <circle cx="640" cy="120" r="60" fill="#fff" opacity="0.06"/>
  <text x="400" y="310" font-size="210" text-anchor="middle">${emoji}</text>
  <text x="400" y="475" font-family="Anek Bangla, Hind Siliguri, sans-serif" font-size="60" font-weight="700" text-anchor="middle" fill="#fff">${name}</text>
  <text x="400" y="535" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="600" text-anchor="middle" fill="#fff" opacity="0.8">GREEN MADANI POWER AGRO</text>
</svg>`;
}

function writeSvg(slug: string, name: string, emoji: string, gradient: [string, string]): string {
  mkdirSync(AGRI_IMG_DIR, { recursive: true });
  writeFileSync(resolve(AGRI_IMG_DIR, `${slug}.svg`), svgPlaceholder(name, emoji, gradient));
  return `/images/agri/${slug}.svg`;
}

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

// ============================================================
// CROPS (crops table)
// ============================================================
const crops = [
  { name: "ধান (উফশী)", englishName: "High-Yield Paddy", category: "ধান", season: "খরিফ-২ (আমন), খরিফ-১ (আউশ)", soilType: "পলিমাটি ও দো-আঁশ মাটি", fertilizerNotes: "ইউরিয়া ৩ কিস্তিতে, টিএসপি ও এমওপি বুননের সময়", irrigationNotes: "রোপণের ৭ দিন পর্যন্ত ২-৩ সেমি পানি; কুশি পর্যায়ে দাঁড়ানো পানি ১০-১৫ দিন", seedVarietyRef: "Miracle হাইব্রিড ধান", expectedYield: "৭.৫–৯.০ টন/হেক্টর" },
  { name: "গম", englishName: "Wheat", category: "গম ও দানা", season: "রবি", soilType: "দো-আঁশ মাটি", fertilizerNotes: "ইউরিয়া ২ কিস্তিতে, জিংক সালফেট অন্তর্ভুক্ত", irrigationNotes: "৩-৪টি সেচ — চাষের পর, গোড়া অবস্থায়, শীষ বের হওয়ার সময়", seedVarietyRef: "উচ্চ ফলনশীল গম বীজ", expectedYield: "৩.৫–৪.৫ টন/হেক্টর" },
  { name: "ভুট্টা (হাইব্রিড)", englishName: "Hybrid Maize", category: "গম ও দানা", season: "রবি, খরিফ-১", soilType: "বেলে দো-আঁশ মাটি", fertilizerNotes: "ইউরিয়া ৩ কিস্তিতে, জিংক ও বোরন সংযোজন", irrigationNotes: "বপন পরবর্তী ৩-৪ সেচ; ফুল আসার সময় অত্যাবশ্যক", seedVarietyRef: "Miracle Corn Seeds (Single Cross)", expectedYield: "৯–১২ টন/হেক্টর" },
  { name: "মরিচ", englishName: "Chili", category: "সবজি", season: "খরিফ-১, রবি", soilType: "দো-আঁশ মাটি, নিষ্কাশন সমৃদ্ধ", fertilizerNotes: "জৈব সার বেশি; ইউরিয়া হালকা কিস্তিতে", irrigationNotes: "ফুল ধরার সময় নিয়মিত সেচ; অতিরিক্ত পানি ক্ষতিকর", seedVarietyRef: "উন্নত হাইব্রিড মরিচ বীজ", expectedYield: "১৫–২৫ টন/হেক্টর" },
  { name: "টমেটো", englishName: "Tomato", category: "সবজি", season: "রবি", soilType: "জৈবসমৃদ্ধ দো-আঁশ মাটি", fertilizerNotes: "ফসফরাস ও পটাশ বেশি; ফল ধরা শুরু হলে ১০ দিন পরপর টপ ড্রেসিং", irrigationNotes: "নিয়মিত সেচ; ফলের গোড়ায় পানি জমতে দেওয়া যাবে না", seedVarietyRef: "হাইব্রিড টমেটো বীজ", expectedYield: "৪০–৬০ টন/হেক্টর" },
  { name: "আলু", englishName: "Potato", category: "সবজি", season: "রবি", soilType: "বেলে দো-আঁশ মাটি (জলাবদ্ধতামুক্ত)", fertilizerNotes: "পচা গোবর + ইউরিয়া ২ কিস্তিতে; পটাশ গুরুত্বপূর্ণ", irrigationNotes: "সাধারণত সেচ ছাড়াই; খরা হলে ১-২ হালকা সেচ", seedVarietyRef: "উচ্চ ফলনশীল আলু জাত", expectedYield: "২৫–৩৫ টন/হেক্টর" },
  { name: "আম", englishName: "Mango", category: "ফল", season: "বর্ষা (রোপণ), গ্রীষ্ম (ফলন)", soilType: "উঁচু, নিষ্কাশন ভালো এমন মাটি", fertilizerNotes: "শীতকালে গাছ প্রতি ১০-১৫ কেজি গোবর + রাসায়নিক সার", irrigationNotes: "ফল ধরা ও পাকার সময় নিয়মিত সেচ; বর্ষায় নিষ্কাশন", seedVarietyRef: "ব্যারি-৩, হিমসাগর, আম্রপালি", expectedYield: "গাছ প্রতি ৮০–১৫০ কেজি" },
  { name: "পেঁয়াজ", englishName: "Onion", category: "সবজি", season: "রবি", soilType: "দো-আঁশ মাটি", fertilizerNotes: "পটাশ বেশি; সালফার যুক্ত সার", irrigationNotes: "কন্দ গঠনের সময় নিয়মিত সেচ; পাকার আগে সেচ বন্ধ", seedVarietyRef: "উন্নত পেঁয়াজ জাত", expectedYield: "১০–১৫ টন/হেক্টর" },
  { name: "সরিষা", englishName: "Mustard", category: "তেল ও ডাল", season: "রবি", soilType: "দো-আঁশ মাটি", fertilizerNotes: "সালফার ও বোরন গুরুত্বপূর্ণ", irrigationNotes: "ফুল ধরার সময় ১-২ সেচ", seedVarietyRef: "উন্নত সরিষা জাত (বারি-১৪)", expectedYield: "১.২–১.৮ টন/হেক্টর" },
  { name: "মুগ ডাল", englishName: "Mung Bean", category: "তেল ও ডাল", season: "খরিফ-১", soilType: "বেলে দো-আঁশ মাটি", fertilizerNotes: "রাসায়নিক সার কম; গোবর + ভস্ম যথেষ্ট", irrigationNotes: "মোটামুটি শুষ্ক সহিষ্ণু; প্রায় সেচ লাগে না", seedVarietyRef: "উন্নত মুগ জাত", expectedYield: "১.০–১.৫ টন/হেক্টর" },
  { name: "তিল", englishName: "Sesame", category: "তেল ও ডাল", season: "খরিফ-১", soilType: "বেলে দো-আঁশ মাটি", fertilizerNotes: "কম সারেই হয়; হালকা ইউরিয়া", irrigationNotes: "খরা সহিষ্ণু; সেচ কম প্রয়োজন", seedVarietyRef: "উন্নত তিল জাত", expectedYield: "০.৮–১.২ টন/হেক্টর" },
  { name: "রুই মাছ", englishName: "Rui Fish (Rohu)", category: "মাছ", season: "বর্ষা (পোনা মজুদ)", soilType: "পুকুরের মাটি", fertilizerNotes: "গোবর ও ইউরিয়া দিয়ে পানি সার দিন; খাবারসহ চাষ", irrigationNotes: "পুকুরে পানির গভীরতা ৪-৫ ফুট", seedVarietyRef: "Miracle Fastest Fish Growth", expectedYield: "৪–৬ টন/হেক্টর" },
  { name: "গরু (দুগ্ধ)", englishName: "Dairy Cattle", category: "গবাদি পশু", season: "সারা বছর", soilType: "—", fertilizerNotes: "সুষম খাদ্য: খড়, ভুসি, ডাল-ক্যালসিয়াম, খনিজ লবণ", irrigationNotes: "পরিষ্কার পানি সবসময়", seedVarietyRef: "Miracle Cattle Growth Dairy", expectedYield: "প্রতিদিন ৮–১২ লিটার" },
  { name: "মুরগি (ব্রয়লার)", englishName: "Broiler Poultry", category: "গবাদি পশু", season: "সারা বছর", soilType: "—", fertilizerNotes: "ব্রয়লার স্টার্টার ও ফিনিশার খাবার সুষম মিশ্রণে", irrigationNotes: "পরিষ্কার পানি; ঘরে বায়ু চলাচল নিশ্চিত", seedVarietyRef: "Miracle Cattle Growth Poultry", expectedYield: "৩৫–৪০ দিনে ১.৮–২.০ কেজি" },
  { name: "রসুন", englishName: "Garlic", category: "মসলা", season: "রবি", soilType: "বেলে দো-আঁশ মাটি", fertilizerNotes: "গোবর বেশি; সালফার যুক্ত সার", irrigationNotes: "কন্দ গঠনের সময় নিয়মিত সেচ", seedVarietyRef: "উন্নত রসুন জাত", expectedYield: "৪–৭ টন/হেক্টর" },
  { name: "আদা", englishName: "Ginger", category: "মসলা", season: "খরিফ-১", soilType: "ছায়াযুক্ত, সুনিষ্কাশিত মাটি", fertilizerNotes: "জৈব সার প্রচুর; ইউরিয়া কিস্তিতে", irrigationNotes: "নিয়মিত সেচ; ছায়া প্রয়োজন", seedVarietyRef: "উন্নত আদা জাত", expectedYield: "১০–১৫ টন/হেক্টর" },
];

// ============================================================
// DISEASES (diseases table)
// ============================================================
const diseases = [
  {
    name: "ধান মাজরা পোকা",
    cropName: "ধান",
    category: "ধান",
    symptoms: ["কচি পাতায় অনুপ্রস্থ সাদা দাগ", "কুশির মাঝখান থেকে মরা পাতা ('ডেড হার্ট')", "ফুলের আগে শীষ কেটে যায় ('হোয়াইট হেড')"],
    causeType: "insect",
    causeNotes: "মাজরা পোকা (Scirpophaga incertulas) কান্ডের ভেতরে ঢুকে খায়, ফলে দানাপূর্ণ শীষ সাদা হয়ে যায়।",
    treatmentText: "ডিম পাড়ার সময় ডিমপাতা সংগ্রহ করুন। আক্রান্ত কুশি ও শীষ কেটে ধ্বংস করুন। প্রয়োজনে আলোক ফাঁদ ব্যবহার করুন এবং জমিতে ২-৩ সেমি পানি রাখলে ডিম ফুটতে বাধা পড়ে।",
    preventionSteps: ["টোপ বপন ও সঠিক সার্বন প্রয়োগ", "জমিতে নিয়মিত পরিদর্শন (সাপ্তাহিক)", "রবি-খরিফের মাঝে জমি ভালোভাবে শুকানো", "সাথী ফসল বা ফেরোমন ট্র্যাপ ব্যবহার"],
    relatedProductRefs: ["boron", "zinc"],
  },
  {
    name: "ধান পাখোয়াড়া পোকা",
    cropName: "ধান",
    category: "ধান",
    symptoms: ["পাতা হলুদ হয়ে কুচকিয়ে যায়", "আক্রান্ত অংশে টানলে গোড়া ছিঁড়ে যায়", "গাছের গোড়ায় পোকার ডিম ও ময়লা দেখা যায়"],
    causeType: "insect",
    causeNotes: "পাখোয়াড়া (Brown Plant Hopper, Nilaparvata lugens) গাছের রস শোষণ করে, ব্যাপক আক্রমণে 'হপারবার্ন' অবস্থা সৃষ্টি হয়।",
    treatmentText: "জমিতে পানি কমিয়ে রাখুন এবং সন্ধ্যায় স্প্রে করুন। আক্রান্ত জমির ধান পোকাসহ কেটে ফেলুন। সিন্থেটিক কীটনাশকের বদলে জৈব বালাইনাশক (যেমন নিশিন্দা নির্যাস) ব্যবহার করুন।",
    preventionSteps: ["অতিরিক্ত ইউরিয়া প্রয়োগ এড়ানো", "আগাম জাতের ধান চাষ", "পরিমিত রোপণ দূরত্ব (২০×২০ সেমি)", "আক্রান্ত খেত পরপর দুই মৌসুম চাষ না করা"],
    relatedProductRefs: ["boron", "zinc"],
  },
  {
    name: "ধান শীষকাটা রোগ (ব্লাস্ট)",
    cropName: "ধান",
    category: "ধান",
    symptoms: ["পাতায় ছোট বাদামি দাগ", "কান্ডের গিঁটে পচন ও ভাঙন", "শীষের গোড়া কালো হয়ে কাটা (নেক ব্লাস্ট)"],
    causeType: "fungal",
    causeNotes: "ছত্রাক Pyricularia oryzae-এর আক্রমণ। সন্ধ্যার কুয়াশা ও বেশি ইউরিয়া এই রোগ বাড়ায়।",
    treatmentText: "অতিরিক্ত ইউরিয়া প্রয়োগ বন্ধ করুন। রোগ প্রতিরোধী জাত চাষ করুন। আক্রান্ত শীষ কেটে ধ্বংস করুন এবং চিকিৎসায় কার্বেন্ডাজিম গ্রুপের ছত্রাকনাশক ৭ দিন পরপর ২ বার প্রয়োগ করুন।",
    preventionSteps: ["সরকারি জাতের প্রতিরোধী ভ্যারাইটি নির্বাচন", "জমিতে অতিরিক্ত নাইট্রোজেন এড়ানো", "পানির স্তর নিয়ন্ত্রণ", "কুয়াশা মৌসুমে সতর্ক পর্যবেক্ষণ"],
    relatedProductRefs: [],
  },
  {
    name: "আম গুঁটি মাইট",
    cropName: "আম",
    category: "ফল",
    symptoms: ["গুঁটি মারা যায় ও কালো হয়ে পড়ে", "পাতায় ছোট বাদামি দাগ", "ফল ধরার পর অকালে ঝরে পড়ে"],
    causeType: "insect",
    causeNotes: "আম গুঁটি মাইট (Mangifera indicae mite) ফুল ও কচি গুটিতে রস শোষণ করে।",
    treatmentText: "আক্রান্ত গুঁটি ও পাতা ঝেড়ে সংগ্রহ করে পুড়িয়ে ফেলুন। ফুল আসার আগে সালফার গোত্রের ওষুধ ১০ দিন পরপর ২ বার স্প্রে করুন।",
    preventionSteps: ["ফুল আসার আগে পরিচ্ছন্নতা", "গাছের মাথায় বাতাস চলাচল নিশ্চিত", "গত মৌসুমের পতিত পাতা সংগ্রহ", "জৈব বালাইনাশক প্রয়োগ"],
    relatedProductRefs: ["boron", "zinc"],
  },
  {
    name: "আমের ভাইরাস (মোজাইক)",
    cropName: "আম",
    category: "ফল",
    symptoms: ["পাতায় হলুদ-সবুজ মোজাইক দাগ", "পাতা কুচকে ও বিকৃত হয়", "ফলের আকার ছোট ও রং অস্বাভাবিক"],
    causeType: "viral",
    causeNotes: "ভাইরাস সাধারণত ঝিঁঝিঁ পোকার মাধ্যমে ছড়ায়; আক্রান্ত গাছ থেকে কলম করলেও ছড়ায়।",
    treatmentText: "ভাইরাসের স্থায়ী চিকিৎসা নেই। আক্রান্ত ডাল কেটে ধ্বংস করুন, ঝিঁঝিঁ পোকা নিয়ন্ত্রণ করুন এবং রোগমুক্ত উৎস থেকে কলম/চারা সংগ্রহ করুন।",
    preventionSteps: ["রোগমুক্ত নার্সারি থেকে চারা", "ঝিঁঝিঁ পোকা নিয়ন্ত্রণ", "আক্রান্ত গাছ আলাদা করা", "পরিষ্কার ধারালো ছাঁটাই যন্ত্র"],
    relatedProductRefs: [],
  },
  {
    name: "মরিচের অ্যানথ্রাকনোজ",
    cropName: "মরিচ",
    category: "সবজি",
    symptoms: ["কাঁচা ফল ও পাতায় গোল গোল বাদামি দাগ", "ফলের ভেতরে কালো পচন", "শুকিয়ে যাওয়া গোড়ার অংশ"],
    causeType: "fungal",
    causeNotes: "ছত্রাক Colletotrichum capsici বীজ ও মাটির মাধ্যমে ছড়ায়; বৃষ্টি ও উচ্চ আর্দ্রতায় দ্রুত বিস্তার।",
    treatmentText: "আক্রান্ত ফল ও ডাল কেটে ধ্বংস করুন। ফুল ও ফল ধরার সময় ম্যানকোজেব বা কার্বেন্ডাজিম ১০ দিন পরপর স্প্রে করুন। রোগমুক্ত বীজ ব্যবহার করুন।",
    preventionSteps: ["রোগমুক্ত বীজ শোধন", "জমি থেকে আগাছা পরিষ্কার", "আক্রান্ত গাছের অবশিষ্টাংশ পোড়ানো", "জলাবদ্ধতা রোধে উঁচু বেড চাষ"],
    relatedProductRefs: ["boron", "zinc"],
  },
  {
    name: "টমেটোর মরিচা/ঝাড়পোড়া রোগ",
    cropName: "টমেটো",
    category: "সবজি",
    symptoms: ["পাতায় বাদামি রিং-আকৃতির দাগ", "কাণ্ড কালো হয়ে পচে যায়", "ফলে কালো পচা দাগ"],
    causeType: "fungal",
    causeNotes: "টমেটো ঝাড়পোড়া (Late Blight) ছত্রাক Phytophthora infestans-এর আক্রমণ; শীতল স্যাঁতসেঁতে আবহাওয়ায় বাড়ে।",
    treatmentText: "আক্রান্ত পাতা ও গাছ তুলে ধ্বংস করুন। সন্ধ্যার আগে ম্যানকোজেব স্প্রে করুন এবং ৭-১০ দিন পর পর পুনরায়। সেচের সময় পাতায় পানি পড়তে দেবেন না।",
    preventionSteps: ["আগাম প্রতিরোধী জাত চাষ", "গাছের মধ্যে পর্যাপ্ত দূরত্ব", "পাতায় পানি এড়িয়ে ড্রিপ সেচ", "বাগানের পরিচ্ছন্নতা"],
    relatedProductRefs: ["pgr"],
  },
  {
    name: "আলু স্ক্যাব রোগ",
    cropName: "আলু",
    category: "সবজি",
    symptoms: ["কন্দে বাদামি আঁশযুক্ত ঘা", "কন্দের ত্বকে ফাটল", "কন্দ বিকৃত হয়ে যায়"],
    causeType: "bacterial",
    causeNotes: "Streptomyces scabies ব্যাকটেরিয়া; শুষ্ক মাটি ও বেশি pH-এ রোগ বাড়ে।",
    treatmentText: "চুনের বদলে সালফার প্রয়োগ করে মাটির pH কম করুন। রোগমুক্ত বীজ আলু ব্যবহার করুন এবং আক্রান্ত ক্ষেতে ৩-৪ বছর আলু চাষ এড়ান।",
    preventionSteps: ["শংসাপত্রপ্রাপ্ত বীজ আলু", "জৈব পদার্থ (কম্পোস্ট) বেশি দেওয়া", "সেচের সময় নিয়ন্ত্রণ", "শস্য আবর্তন"],
    relatedProductRefs: [],
  },
  {
    name: "গরুর ফুট অ্যান্ড মাউথ (ক্ষুরা রোগ)",
    cropName: "গরু",
    category: "গবাদি পশু",
    symptoms: ["জিহ্বা ও পায়ের খুরে ফোসকা", "অতিরিক্ত লালা ঝরা", "খোঁড়া হয়ে হাঁটা"],
    causeType: "viral",
    causeNotes: "অত্যন্ত সংক্রামক ভাইরাসজনিত রোগ; আক্রান্ত পশুর সাথে যোগাযোগে ছড়ায়।",
    treatmentText: "এটি জরুরি পশুচিকিৎসা বিষয় — অবিলম্বে স্থানীয় পশুসম্পদ কর্মকর্তাকে জানান। ফোসকার যত্ন নিন, নরম খাবার দিন এবং আক্রান্ত গরু আলাদা রাখুন।",
    preventionSteps: ["বার্ষিক টিকা প্রদান", "নতুন গরু ৩ সপ্তাহ আলাদা রাখা", "গোয়ালঘর জীবাণুমুক্ত রাখা", "বহিরাগত পশুর সাথে যোগাযোগ নিয়ন্ত্রণ"],
    relatedProductRefs: ["cattle"],
  },
];

// ============================================================
// SEASONS (seasons table)
// ============================================================
const seasons = [
  {
    name: "রবি মৌসুম",
    englishName: "Rabi (Winter)",
    description: "শীতকালীন মৌসুম — অক্টোবর থেকে মার্চ। শুষ্ক ও ঠান্ডা আবহাওয়ায় নাতিশীতোষ্ণ ও শীতপ্রধান ফসলের জন্য আদর্শ।",
    months: "অক্টোবর – মার্চ",
    sowingWindow: "অক্টোবর – ডিসেম্বর",
    transplantingWindow: "নভেম্বর – জানুয়ারি",
    harvestWindow: "ফেব্রুয়ারি – এপ্রিল",
    applicableCrops: ["গম", "আলু", "টমেটো", "মরিচ", "পেঁয়াজ", "রসুন", "সরিষা", "ভুট্টা", "বোরো ধান"],
  },
  {
    name: "খরিফ-১ মৌসুম",
    englishName: "Kharif-1 (Pre-monsoon)",
    description: "প্রাক-মৌসুমী বর্ষাকাল — মার্চ থেকে জুলাই। গরম আবহাওয়ায় স্বল্পমেয়াদি ফসল ও বর্ষা-পূর্ব চাষ হয়।",
    months: "মার্চ – জুলাই",
    sowingWindow: "মার্চ – মে",
    transplantingWindow: "মে – জুন",
    harvestWindow: "জুন – আগস্ট",
    applicableCrops: ["আউশ ধান", "ভুট্টা", "মুগ ডাল", "তিল", "আদা", "মরিচ", "গরমকালীন সবজি"],
  },
  {
    name: "খরিফ-২ মৌসুম",
    englishName: "Kharif-2 (Monsoon)",
    description: "বর্ষাকাল — জুলাই থেকে নভেম্বর। সবচেয়ে বড় চাষ মৌসুম; আমন ধান ও বর্ষাজাত ফসলের সময়।",
    months: "জুলাই – নভেম্বর",
    sowingWindow: "জুন – জুলাই",
    transplantingWindow: "জুলাই – আগস্ট",
    harvestWindow: "নভেম্বর – ডিসেম্বর",
    applicableCrops: ["আমন ধান", "পাট", "বর্ষা সবজি", "তিল", "সয়াবিন", "মিষ্টি কুমড়া"],
  },
];

// ============================================================

async function getProductIdMap(): Promise<Record<string, number[]>> {
  const { data, error } = await supabase.from("products").select("id, name");
  if (error) throw new Error(`Failed to load products: ${error.message}`);
  const map: Record<string, number[]> = {};
  for (const p of data ?? []) {
    const lower = p.name.toLowerCase();
    for (const keyword of ["nishinda", "pgr", "fish", "boron", "zinc", "cattle", "poultry"]) {
      if (lower.includes(keyword)) {
        map[keyword] = map[keyword] ?? [];
        map[keyword].push(p.id);
      }
    }
  }
  return map;
}

async function main() {
  console.log("Seeding agri-advisory data...");

  for (const table of ["crops", "diseases", "seasons"]) {
    const { error } = await supabase.from(table).delete().neq("id", 0);
    if (error) throw new Error(`Failed to clear ${table}: ${error.message}`);
  }

  const productMap = await getProductIdMap();
  const resolve = (refs: string[]): number[] => refs.flatMap((ref) => productMap[ref.toLowerCase()] ?? []);

  console.log(`\n--- Crops (${crops.length}) ---`);
  const cropRows = crops.map((c) => {
    const img = CROP_IMAGES[c.name];
    const imageUrl = img ? writeSvg(img.slug, c.name, img.emoji, CATEGORY_GRADIENTS[c.category] ?? CATEGORY_GRADIENTS["ধান"]) : null;
    return {
      name: c.name,
      english_name: c.englishName,
      category: c.category,
      season: c.season,
      soil_type: c.soilType,
      fertilizer_notes: c.fertilizerNotes,
      irrigation_notes: c.irrigationNotes,
      seed_variety_ref: c.seedVarietyRef,
      expected_yield: c.expectedYield,
      image_url: imageUrl,
    };
  });
  const { error: cropsError } = await supabase.from("crops").insert(cropRows);
  if (cropsError) {
    console.error(`  FAILED: ${cropsError.message}`);
  } else {
    console.log("  Inserted all crops.");
  }

  console.log(`\n--- Diseases (${diseases.length}) ---`);
  for (const d of diseases) {
    const relatedProductIds = resolve(d.relatedProductRefs ?? []);
    const img = DISEASE_IMAGES[d.name];
    const imageUrl = img ? writeSvg(img.slug, d.name, img.emoji, CAUSE_GRADIENTS[d.causeType] ?? CAUSE_GRADIENTS["insect"]) : null;
    const { data, error } = await supabase.from("diseases").insert({
      name: d.name,
      crop_name: d.cropName,
      category: d.category,
      symptoms: d.symptoms,
      cause_type: d.causeType,
      cause_notes: d.causeNotes,
      treatment_text: d.treatmentText,
      prevention_steps: d.preventionSteps,
      related_product_ids: relatedProductIds,
      image_url: imageUrl,
      status: "active",
    }).select("id");
    if (error) {
      console.error(`  FAILED (${d.name}): ${error.message}`);
    } else {
      const id = data?.[0]?.id;
      console.log(`  Inserted "${d.name}" (id=${id}, linked products: ${relatedProductIds.length})`);
    }
  }

  console.log(`\n--- Seasons (${seasons.length}) ---`);
  const { error: seasonsError } = await supabase.from("seasons").insert(
    seasons.map((s) => ({
      name: s.name,
      english_name: s.englishName,
      description: s.description,
      months: s.months,
      sowing_window: s.sowingWindow,
      transplanting_window: s.transplantingWindow,
      harvest_window: s.harvestWindow,
      applicable_crops: s.applicableCrops,
    }))
  );
  if (seasonsError) {
    console.error(`  FAILED: ${seasonsError.message}`);
  } else {
    console.log("  Inserted all seasons.");
  }

  console.log("\nDone! Run `supabase db push` (or apply the migration) before seeding if the tables don't exist yet.");
}

main().catch((err) => {
  console.error("Script failed:", err);
  process.exit(1);
});
