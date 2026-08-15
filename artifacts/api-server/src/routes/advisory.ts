import { Router } from "express";
import { supabase, snakeToCamel, mapRows } from "@workspace/db";
import { z } from "zod";

const router = Router();

const WEATHER_CACHE_TTL_MS = 30 * 60 * 1000;

const DISTRICTS = [
  "Dhaka", "Chattogram", "Rajshahi", "Khulna", "Barishal", "Sylhet",
  "Rangpur", "Mymensingh", "Cumilla", "Bogura", "Jessore", "Dinajpur",
  "Pabna", "Tangail", "Narsingdi", "Gazipur", "Narayanganj", "Faridpur",
  "Manikganj", "Munshiganj", "Rajbari", "Gopalganj", "Madaripur", "Shariatpur",
  "Kishoreganj", "Netrokona", "Sherpur", "Jamalpur", "Naogaon", "Sirajganj",
  "Joypurhat", "Chapainawabganj", "Natore", "Patuakhali", "Bhola", "Pirojpur",
  "Jhalokathi", "Barguna", "Satkhira", "Bagerhat", "Kushtia", "Meherpur",
  "Chuadanga", "Jhenaidah", "Magura", "Narail", "Habiganj", "Moulvibazar",
  "Sunamganj", "Panchagarh", "Thakurgaon", "Nilphamari", "Lalmonirhat",
  "Kurigram", "Gaibandha", "Bandarban", "Khagrachhari", "Rangamati",
  "Cox's Bazar", "Feni", "Lakshmipur", "Noakhali", "Chandpur", "Brahmanbaria",
].filter((d, i, arr) => arr.indexOf(d) === i);

interface WeatherCurrent {
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
}

interface WeatherForecastItem {
  dt: number;
  temp: number;
  description: string;
  icon: string;
}

interface WeatherPayload {
  current: WeatherCurrent;
  forecast: WeatherForecastItem[];
}

router.get("/crops", async (req, res) => {
  const category = req.query.category as string | undefined;
  const season = req.query.season as string | undefined;
  const search = req.query.search as string | undefined;
  const limit = parseInt(req.query.limit as string) || 100;
  const offset = parseInt(req.query.offset as string) || 0;

  let query = supabase!.from("crops").select("*", { count: "exact" }).eq("status", "active");
  if (category) query = query.eq("category", category);
  if (season) query = query.eq("season", season);
  if (search) query = query.or(`name.ilike.%${search}%,english_name.ilike.%${search}%`);
  query = query.order("created_at", { ascending: false }).range(offset, offset + limit - 1);

  const { data, error, count } = await query;
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ items: mapRows(data ?? []), total: count ?? 0 });
});

router.get("/diseases", async (req, res) => {
  const category = req.query.category as string | undefined;
  const cropId = req.query.cropId as string | undefined;
  const search = req.query.search as string | undefined;
  const limit = parseInt(req.query.limit as string) || 100;
  const offset = parseInt(req.query.offset as string) || 0;

  let query = supabase!.from("diseases").select("*", { count: "exact" }).eq("status", "active");
  if (category) query = query.eq("category", category);
  if (cropId) query = query.eq("crop_id", parseInt(cropId));
  if (search) query = query.or(`name.ilike.%${search}%,crop_name.ilike.%${search}%`);
  query = query.order("created_at", { ascending: false }).range(offset, offset + limit - 1);

  const { data, error, count } = await query;
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ items: mapRows(data ?? []), total: count ?? 0 });
});

router.get("/seasons", async (_req, res) => {
  const { data, error } = await supabase!.from("seasons").select("*").eq("status", "active").order("created_at", { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  return res.json(mapRows(data ?? []));
});

router.get("/districts", (_req, res) => {
  return res.json(DISTRICTS);
});

const inquirySchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(5),
  district: z.string().optional(),
  crop: z.string().optional(),
  question: z.string().min(10),
});

router.post("/inquiries", async (req, res) => {
  const parsed = inquirySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Validation failed", details: parsed.error.issues });
  }
  const { error } = await supabase!.from("advisory_inquiries").insert({
    name: parsed.data.name,
    phone: parsed.data.phone,
    district: parsed.data.district ?? null,
    crop: parsed.data.crop ?? null,
    question: parsed.data.question,
  });
  if (error) return res.status(500).json({ error: error.message });
  return res.status(201).json({ success: true, message: "আপনার প্রশ্নটি আমাদের কৃষি বিশেষজ্ঞ টিমের কাছে পৌঁছেছে। আমরা শীঘ্রই যোগাযোগ করবো।" });
});

async function getOpenWeatherApiKey(): Promise<string | null> {
  if (process.env.OPENWEATHER_API_KEY) return process.env.OPENWEATHER_API_KEY;
  try {
    const { data } = await supabase!.from("site_settings").select("settings").limit(1).maybeSingle();
    const key = (data?.settings as Record<string, unknown> | undefined)?.openWeatherApiKey;
    return typeof key === "string" && key.length > 0 ? key : null;
  } catch {
    return null;
  }
}

async function fetchOpenWeather(district: string): Promise<WeatherPayload> {
  const apiKey = await getOpenWeatherApiKey();
  if (!apiKey) throw new Error("OPENWEATHER_API_KEY not configured");

  const base = "https://api.openweathermap.org/data/2.5";
  const units = "metric";

  const currentRes = await fetch(`${base}/weather?q=${encodeURIComponent(district)},BD&units=${units}&appid=${apiKey}`);
  if (!currentRes.ok) throw new Error(`Weather fetch failed (${currentRes.status})`);
  const currentData = (await currentRes.json()) as {
    main?: Record<string, number>;
    wind?: Record<string, number>;
    weather?: Array<Record<string, string>>;
  };

  const forecastRes = await fetch(`${base}/forecast?q=${encodeURIComponent(district)},BD&units=${units}&appid=${apiKey}`);
  if (!forecastRes.ok) throw new Error(`Forecast fetch failed (${forecastRes.status})`);
  const forecastData = (await forecastRes.json()) as {
    list?: Array<{
      dt: number;
      main?: Record<string, number>;
      weather?: Array<Record<string, string>>;
    }>;
  };

  const forecast: WeatherForecastItem[] = (forecastData.list ?? []).slice(0, 5).map((item) => ({
    dt: item.dt,
    temp: item.main?.temp ?? 0,
    description: item.weather?.[0]?.description ?? "",
    icon: item.weather?.[0]?.icon ?? "",
  }));

  return {
    current: {
      temp: currentData.main?.temp ?? 0,
      feelsLike: currentData.main?.feels_like ?? 0,
      humidity: currentData.main?.humidity ?? 0,
      windSpeed: currentData.wind?.speed ?? 0,
      description: currentData.weather?.[0]?.description ?? "",
      icon: currentData.weather?.[0]?.icon ?? "",
    },
    forecast,
  };
}

router.get("/weather", async (req, res) => {
  const district = (req.query.district as string)?.trim() || "Dhaka";

  try {
    const { data: cached, error: cacheError } = await supabase!.from("weather_cache")
      .select("*").eq("district", district).maybeSingle();
    if (cacheError) return res.status(500).json({ error: cacheError.message });

    const now = Date.now();
    if (cached && now - new Date(cached.fetched_at).getTime() < WEATHER_CACHE_TTL_MS) {
      return res.json(snakeToCamel({ ...cached.payload_json, source: "cache" }) as Record<string, unknown>);
    }

    const payload = await fetchOpenWeather(district);
    const body = { district, ...payload, fetchedAt: new Date().toISOString(), source: "live" };

    if (cached) {
      await supabase!.from("weather_cache")
        .update({ fetched_at: new Date().toISOString(), payload_json: body })
        .eq("id", cached.id);
    } else {
      await supabase!.from("weather_cache")
        .insert({ district, fetched_at: new Date().toISOString(), payload_json: body });
    }

    return res.json(body);
  } catch (err) {
    return res.status(503).json({
      error: err instanceof Error ? err.message : "Weather service unavailable",
      districts: DISTRICTS,
    });
  }
});

export { DISTRICTS };
export default router;
