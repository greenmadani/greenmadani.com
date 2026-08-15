import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Search, Phone, Sprout, Bug, CalendarDays, CloudSun, MessageCircleQuestion,
  ShoppingBag, ArrowRight, MapPin, Wind, Droplets, Thermometer, ShieldCheck, Bot, FlaskConical,
} from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  useListCrops, useListDiseases, useListSeasons, useListAdvisoryDistricts,
  useGetWeather, useSubmitAdvisoryInquiry, useListProducts,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import AnimatedBackground from "@/components/AnimatedBackground";
import { SectionHeader } from "@/components/section-header";
import { AnimatedSection } from "@/components/animated-section";
import { StatDisplay } from "@/components/stat-display";

const CROP_CATEGORIES = [
  { slug: "all", name: "সব ফসল" },
  { slug: "ধান", name: "ধান" },
  { slug: "গম ও দানা", name: "গম ও দানা" },
  { slug: "সবজি", name: "সবজি" },
  { slug: "ফল", name: "ফল" },
  { slug: "তেল ও ডাল", name: "তেল ও ডাল" },
  { slug: "মাছ", name: "মাছ" },
  { slug: "গবাদি পশু", name: "গবাদি পশু" },
  { slug: "মসলা", name: "মসলা" },
];

const CAUSE_LABELS: Record<string, { label: string; color: string }> = {
  fungal: { label: "ছত্রাকজনিত", color: "bg-[#7A4E2D] text-white" },
  bacterial: { label: "ব্যাকটেরিয়াজনিত", color: "bg-[#B03A2E] text-white" },
  viral: { label: "ভাইরাসজনিত", color: "bg-[#6C3483] text-white" },
  insect: { label: "পোকামাকড়জনিত", color: "bg-[#B9770E] text-white" },
};

const CLIMATE_TIPS = [
  "শুষ্ক মৌসুমে মালচিং ব্যবহার করে মাটির আর্দ্রতা ধরে রাখুন এবং পানির অপচয় রোধ করুন।",
  "অতিবৃষ্টি বা বন্যায় ড্রেনেজ নালা পরিষ্কার রাখুন; জমিতে পানি জমতে দেবেন না।",
  "তীব্র তাপে দুপুরের পরিবর্তে সকালে ও বিকেলে সেচ দিন, চারা শুকিয়ে যাওয়া রোধ হবে।",
  "ঠান্ডা ঢেউ বা কুয়াশায় সন্ধ্যায় হালকা সেচ দিলে গাছের তাপমাত্রা স্থিতিশীল থাকে।",
  "ঝড়-জলোচ্ছ্বাসের আগাম বার্তায় পাকা ফসল আগেই ঘরে তুলুন এবং বীজ মজুদ রাখুন।",
  "শস্য বহুমুখীকরণ করুন — ঝুঁকি ছড়িয়ে দিতে একই মৌসুমে একাধিক ফসল চাষ করুন।",
];

const inquirySchema = z.object({
  name: z.string().min(2, "নাম লিখুন (অন্তত ২ অক্ষর)"),
  phone: z.string().min(5, "সঠিক মোবাইল নম্বর দিন"),
  district: z.string().optional(),
  crop: z.string().optional(),
  question: z.string().min(10, "প্রশ্নটি অন্তত ১০ অক্ষরের হতে হবে"),
});

type InquiryValues = z.infer<typeof inquirySchema>;

interface SiteSettings { phone: string; email: string; address: string; }

export default function AgriAdvisory() {
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDisease, setSelectedDisease] = useState<any>(null);
  const [selectedCrop, setSelectedCrop] = useState<any>(null);
  const [district, setDistrict] = useState("Dhaka");

  const { data: cropsData, isLoading: loadingCrops } = useListCrops(
    searchQuery ? { search: searchQuery, limit: 50 } : { limit: 50 },
    { query: { queryKey: ["advisory-crops", searchQuery] } }
  );
  const { data: diseasesData, isLoading: loadingDiseases } = useListDiseases(
    { category: activeCategory === "all" ? undefined : activeCategory, search: searchQuery || undefined, limit: 100 },
    { query: { queryKey: ["advisory-diseases", activeCategory, searchQuery] } }
  );
  const { data: seasons } = useListSeasons({ query: { queryKey: ["advisory-seasons"] } });
  const { data: districts } = useListAdvisoryDistricts({ query: { queryKey: ["advisory-districts"] } });
  const { data: productsData } = useListProducts({ limit: 50 }, { query: { queryKey: ["advisory-products"] } });
  const { data: s } = useQuery<SiteSettings>({
    queryKey: ["site-settings"],
    queryFn: () => fetch("/api/settings", { cache: "no-cache" }).then((r) => r.json()),
    staleTime: 10 * 1000,
  });

  const weatherQuery = useGetWeather(
    { district },
    {
      query: {
        queryKey: ["advisory-weather", district],
        retry: false,
        refetchInterval: 15 * 60 * 1000,
      },
    }
  );

  const inquiryMutation = useSubmitAdvisoryInquiry();

  const crops = useMemo(() => cropsData?.items ?? [], [cropsData]);
  const diseases = useMemo(() => diseasesData?.items ?? [], [diseasesData]);

  const powerAgroProducts = useMemo(
    () => (productsData?.items ?? []).filter((p: any) => p.businessSlug === "green-madani-power-agro").slice(0, 4),
    [productsData]
  );

  const diseaseCount = diseasesData?.total ?? diseases.length;
  const cropCount = cropsData?.total ?? crops.length;

  const form = useForm<InquiryValues>({
    resolver: zodResolver(inquirySchema),
    defaultValues: { name: "", phone: "", district: "", crop: "", question: "" },
  });

  const onSubmit = (data: InquiryValues) => {
    inquiryMutation.mutate({ data }, {
      onSuccess: () => {
        toast({ title: "প্রশ্ন পাঠানো হয়েছে", description: "আমাদের কৃষি বিশেষজ্ঞ টিম শীঘ্রই আপনার সাথে যোগাযোগ করবে।", className: "bg-primary text-white" });
        form.reset();
      },
      onError: (err) => {
        toast({ title: "ব্যর্থ হয়েছে", description: err instanceof Error ? err.message : "আবার চেষ্টা করুন", variant: "destructive" });
      },
    });
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="w-full font-bangla">
      {/* ============ 1. HERO ============ */}
      <section className="bg-gradient-to-br from-primary via-secondary to-[#09281A] text-white pt-[96px] md:pt-[128px] pb-16 md:pb-20 -mt-20 relative overflow-hidden">
        <AnimatedBackground />
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block text-accent font-semibold tracking-[0.2em] uppercase text-sm mb-4 md:mb-6 border-b-2 border-accent/40 pb-2">
              Green Madani Power Agro — কৃষি পরামর্শ সেবা
            </span>
            <h1 className="font-display leading-tight mb-4 md:mb-6">
              কৃষকের পাশে,<br /><span className="text-accent">প্রযুক্তির সাথে</span>
            </h1>
            <p className="text-sm md:text-base text-white/60 mb-8 max-w-2xl mx-auto leading-relaxed font-medium">
              রোগ-পোকা শনাক্তকরণ, মৌসুমি ফসল ক্যালেন্ডার, আবহাওয়ার আপডেট ও কৃষি বিশেষজ্ঞের পরামর্শ —
              <span className="text-accent font-semibold"> সম্পূর্ণ বিনামূল্যে</span>, বাংলাদেশের ৪২ জেলার কৃষকের জন্য।
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto mb-6 md:mb-8">
              <div className="flex bg-white/10 backdrop-blur-xl border border-white/20 p-1.5">
                <Search className="text-white/50 shrink-0 my-auto ml-3" size={20} />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ফসল বা রোগের নাম লিখুন... (যেমন: ধান, পাতার দাগ রোগ, নিশিন্দা)"
                  className="flex-1 bg-transparent px-3 py-2.5 text-sm md:text-base text-white placeholder:text-white/40 focus:outline-none"
                  aria-label="ফসল বা রোগ অনুসন্ধান"
                />
                <button
                  onClick={() => scrollTo("disease-guide")}
                  className="bg-accent text-accent-foreground px-4 md:px-6 py-2.5 text-sm font-bold hover:opacity-90 transition-opacity shrink-0"
                >
                  খুঁজুন
                </button>
              </div>
              <p className="text-white/40 text-xs mt-2">টিপস: ধান, গম, মরিচ, আলু, গরু, মাছ — নাম লিখলেই ফলাফল পাবেন</p>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              <StatDisplay value="42" label="জেলায় সেবা" className="card-hover" />
              <StatDisplay value="70+" label="উন্নত বীজ" className="card-hover" />
              <StatDisplay value={diseaseCount ? `${diseaseCount}+` : "২০+"} label="রোগ ও পোকা গাইড" className="card-hover" />
              <StatDisplay value={cropCount ? `${cropCount}+` : "৩০+"} label="ফসলের তথ্য" className="card-hover" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ============ 2. DISEASE & PEST GUIDE ============ */}
      <AnimatedSection>
        <section id="disease-guide" className="py-16 md:py-24 bg-card scroll-mt-24">
          <div className="container mx-auto px-4">
            <SectionHeader
              badge="রোগ ও পোকা গাইড"
              title="ফসলের রোগ ও পোকা শনাক্তকরণ"
              description="ফসলের রোগ বা পোকা শনাক্ত করে সঠিক চিকিৎসা ও প্রতিরোধের পরামর্শ নিন। প্রতিটি গাইডে আছে উপসর্গ, কারণ এবং Green Power-এর নিরাপদ সমাধান।"
              align="center"
            />

            <div className="flex gap-4 mb-10 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory justify-start md:justify-center">
              {CROP_CATEGORIES.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => setActiveCategory(cat.slug)}
                  className={`px-4 py-2 text-sm font-semibold transition-colors whitespace-nowrap snap-start ${
                    activeCategory === cat.slug
                      ? "bg-primary text-white"
                      : "bg-white text-foreground border border-border hover:bg-muted"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-stagger">
              {loadingDiseases ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="border border-border shadow-sm flex flex-col h-full">
                    <Skeleton className="w-full aspect-[4/3]" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="w-3/4 h-5" />
                      <Skeleton className="w-full h-4" />
                      <Skeleton className="w-2/3 h-4" />
                    </div>
                  </div>
                ))
              ) : diseases.length === 0 ? (
                <div className="col-span-2 lg:col-span-4 text-center py-12 text-muted-foreground">
                  <Bug size={48} className="mx-auto mb-4 opacity-20" />
                  <p>কোনো ফলাফল পাওয়া যায়নি। অন্য নাম বা ফসল দিয়ে অনুসন্ধান করুন।</p>
                </div>
              ) : (
                diseases.map((disease) => (
                  <button
                    key={disease.id}
                    onClick={() => setSelectedDisease(disease)}
                    className="border border-border shadow-sm flex flex-col h-full overflow-hidden bg-card card-hover text-left"
                  >
                    <div className="relative aspect-[4/3] bg-muted img-hover">
                      {disease.imageUrl ? (
                        <img src={disease.imageUrl} alt={disease.name} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-secondary/10">
                          <Bug size={40} className="text-primary/30" />
                        </div>
                      )}
                      <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider px-3 py-1 z-10">
                        {disease.category}
                      </span>
                      {disease.causeType && CAUSE_LABELS[disease.causeType] && (
                        <span className={`absolute top-3 right-3 text-xs font-bold px-3 py-1 z-10 ${CAUSE_LABELS[disease.causeType].color}`}>
                          {CAUSE_LABELS[disease.causeType].label}
                        </span>
                      )}
                    </div>
                    <div className="p-3 flex-1 flex flex-col">
                      <h3 className="font-display mb-1 text-foreground">{disease.name}</h3>
                      {disease.cropName && <span className="text-xs text-muted-foreground font-semibold mb-2">{disease.cropName}</span>}
                      <p className="text-muted-foreground text-sm mb-3 flex-1 line-clamp-2">{disease.symptoms?.[0] ?? "বিস্তারিত জানতে ক্লিক করুন"}</p>
                      <span className="text-accent font-bold flex items-center text-sm">
                        বিস্তারিত দেখুন <ArrowRight size={14} className="ml-1" />
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ============ 3. SEASON CALENDAR ============ */}
      <AnimatedSection>
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary via-secondary to-[#09281A] text-white relative overflow-hidden">
          <AnimatedBackground />
          <div className="container mx-auto px-4 relative z-10">
            <SectionHeader
              badge="মৌসুমি ক্যালেন্ডার"
              title="বাংলাদেশের ৩টি কৃষি মৌসুম"
              description="রবি, খরিফ-১ ও খরিফ-২ — কোন মৌসুমে কোন ফসল, কখন বুনন ও কখন ফলন, এক নজরে।"
              align="center"
              className="[&_h2]:text-white [&_span]:text-accent [&_p]:text-white/70"
            />

            {!seasons || seasons.length === 0 ? (
              <div className="grid md:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-64 bg-white/10" />
                ))}
              </div>
            ) : (
              <div className="relative">
                <div className="hidden md:block absolute top-[52px] left-0 right-0 h-1 bg-white/10" />
                <div className="grid md:grid-cols-3 gap-4 md:gap-6">
                  {seasons.map((season, i) => (
                    <div key={season.id} className="glass-card card-hover p-4 md:p-6 relative">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 bg-accent flex items-center justify-center shrink-0">
                          <CalendarDays size={20} className="text-accent-foreground" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest text-accent">{season.months || `মৌসুম ${i + 1}`}</span>
                      </div>
                      <h3 className="font-display text-white mb-1">{season.name}</h3>
                      {season.englishName && <p className="text-white/40 text-xs mb-3 uppercase tracking-wider">{season.englishName}</p>}
                      <p className="text-white/60 text-sm leading-relaxed mb-4">{season.description}</p>
                      <div className="space-y-2 text-sm">
                        {season.sowingWindow && (
                          <p className="flex gap-2"><span className="text-accent font-semibold shrink-0">বপন:</span><span className="text-white/70">{season.sowingWindow}</span></p>
                        )}
                        {season.transplantingWindow && (
                          <p className="flex gap-2"><span className="text-accent font-semibold shrink-0">রোপণ:</span><span className="text-white/70">{season.transplantingWindow}</span></p>
                        )}
                        {season.harvestWindow && (
                          <p className="flex gap-2"><span className="text-accent font-semibold shrink-0">ফলন:</span><span className="text-white/70">{season.harvestWindow}</span></p>
                        )}
                      </div>
                      <div className="mt-4 pt-4 border-t border-white/10">
                        <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">উপযোগী ফসল</p>
                        <div className="flex flex-wrap gap-1.5">
                          {(season.applicableCrops ?? []).map((crop) => (
                            <span key={crop} className="text-xs bg-white/10 border border-white/10 px-2 py-0.5 text-white/80">{crop}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </AnimatedSection>

      {/* ============ 4. SEASONAL CROP DETAILS ============ */}
      <AnimatedSection animation="fade-in">
        <section className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-4">
            <SectionHeader
              badge="ফসল পরিচিতি"
              title="মৌসুমি ফসলের বিস্তারিত"
              description="মাটির ধরন, সার প্রণালী, সেচের প্রয়োজন ও প্রত্যাশিত ফলন — প্রতিটি ফসলের পূর্ণাঙ্গ তথ্য।"
              align="center"
            />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-stagger">
              {loadingCrops ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="border border-border shadow-sm flex flex-col h-full">
                    <Skeleton className="w-full aspect-square" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="w-3/4 h-5" />
                      <Skeleton className="w-full h-4" />
                      <Skeleton className="w-1/2 h-4" />
                    </div>
                  </div>
                ))
              ) : crops.length === 0 ? (
                <div className="col-span-2 lg:col-span-4 text-center py-12 text-muted-foreground">
                  <Sprout size={48} className="mx-auto mb-4 opacity-20" />
                  <p>কোনো ফসলের তথ্য পাওয়া যায়নি।</p>
                </div>
              ) : (
                crops.map((crop) => (
                  <div key={crop.id} className="border border-border shadow-sm flex flex-col h-full overflow-hidden bg-card card-hover">
                    <div className="w-full aspect-square bg-muted img-hover relative">
                      {crop.imageUrl ? (
                        <img src={crop.imageUrl} alt={crop.name} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><Sprout size={48} className="text-primary/20" /></div>
                      )}
                      <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider px-3 py-1 z-10">{crop.category}</span>
                      {crop.season && <span className="absolute bottom-3 left-3 text-xs font-semibold bg-black/40 backdrop-blur-sm px-2 py-1 text-white">{crop.season}</span>}
                    </div>
                    <div className="p-3 flex-1 flex flex-col">
                      <h3 className="font-display mb-1 text-foreground">{crop.name}</h3>
                      {crop.englishName && <p className="text-xs text-muted-foreground mb-2">{crop.englishName}</p>}
                      <div className="space-y-1 text-xs text-muted-foreground mb-3 flex-1">
                        {crop.soilType && <p><span className="font-semibold text-foreground">মাটি:</span> {crop.soilType}</p>}
                        {crop.expectedYield && <p><span className="font-semibold text-foreground">ফলন:</span> {crop.expectedYield}</p>}
                        {crop.seedVarietyRef && <p><span className="font-semibold text-foreground">জাত:</span> {crop.seedVarietyRef}</p>}
                      </div>
                      <Button variant="outline" size="sm" className="w-full" onClick={() => setSelectedCrop(crop)}>
                        বিস্তারিত দেখুন <ArrowRight size={14} className="ml-1" />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ============ 5. WEATHER & CLIMATE ============ */}
      <AnimatedSection>
        <section className="py-16 md:py-24 bg-muted">
          <div className="container mx-auto px-4">
            <SectionHeader
              badge="আবহাওয়া ও জলবায়ু"
              title="জেলাভিত্তিক আবহাওয়ার আপডেট"
              description="চলমান আবহাওয়া ও ৫ দিনের পূর্বাভাস — ফসলি কাজের সিদ্ধান্ত নিতে সাহায্য করবে।"
              align="center"
            />

            <div className="grid lg:grid-cols-3 gap-4 md:gap-8 items-start">
              {/* Weather widget */}
              <div className="lg:col-span-2 bg-card border-t-4 border-accent shadow-sm overflow-hidden">
                <div className="bg-gradient-to-br from-primary via-secondary to-[#09281A] p-4 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-accent flex items-center justify-center shrink-0">
                      <CloudSun size={28} className="text-accent-foreground" />
                    </div>
                    <div>
                      <h3 className="font-display text-white">আবহাওয়া পূর্বাভাস</h3>
                      <p className="text-white/60 text-sm">৪২ জেলা কভারেজ — OpenWeather ডেটা</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin size={18} className="text-accent shrink-0" />
                    <Select value={district} onValueChange={setDistrict}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white w-44 md:w-52">
                        <SelectValue placeholder="জেলা নির্বাচন করুন" />
                      </SelectTrigger>
                      <SelectContent>
                        {(districts ?? ["Dhaka", "Chattogram", "Rajshahi", "Khulna", "Sylhet", "Barishal", "Rangpur", "Mymensingh"]).map((d) => (
                          <SelectItem key={d} value={d}>{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="p-4 md:p-6">
                  {weatherQuery.isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
                    </div>
                  ) : weatherQuery.isError || !weatherQuery.data?.current ? (
                    <div className="text-center py-10">
                      <CloudSun size={48} className="mx-auto mb-4 text-muted-foreground/30" />
                      <p className="text-muted-foreground mb-4">আবহাওয়া ডেটা এই মুহূর্তে পাওয়া যাচ্ছে না (API কী কনফিগার করা হয়নি বা সার্ভিস অফলাইন)।</p>
                      <a href="https://www.bmd.gov.bd" target="_blank" rel="noopener noreferrer">
                        <Button variant="outline">সরকারি আবহাওয়া সতর্কতা — BMD</Button>
                      </a>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-6 bg-muted p-4">
                        <div>
                          <p className="text-4xl md:text-5xl font-extrabold text-foreground">{Math.round(weatherQuery.data.current.temp ?? 0)}°C</p>
                          <p className="text-muted-foreground capitalize">{weatherQuery.data.current.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">অনুভূতি: {Math.round(weatherQuery.data.current.feelsLike ?? 0)}°C</p>
                        </div>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <p className="flex items-center gap-2"><Thermometer size={16} className="text-accent" /> তাপমাত্রা: {Math.round(weatherQuery.data.current.temp ?? 0)}°C</p>
                          <p className="flex items-center gap-2"><Droplets size={16} className="text-accent" /> আর্দ্রতা: {weatherQuery.data.current.humidity}%</p>
                          <p className="flex items-center gap-2"><Wind size={16} className="text-accent" /> বাতাস: {weatherQuery.data.current.windSpeed} মি/সে</p>
                        </div>
                      </div>

                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">৫ দিনের পূর্বাভাস</p>
                      <div className="grid grid-cols-5 gap-2 md:gap-4">
                        {(weatherQuery.data.forecast ?? []).map((f, i) => (
                          <div key={i} className="border border-border p-2 md:p-3 text-center">
                            <img src={`https://openweathermap.org/img/wn/${f.icon}@2x.png`} alt={f.description} className="w-10 h-10 md:w-12 md:h-12 mx-auto" loading="lazy" />
                            <p className="font-bold text-foreground text-sm md:text-base">{Math.round(f.temp ?? 0)}°</p>
                            <p className="text-[10px] md:text-xs text-muted-foreground capitalize line-clamp-1">{f.description}</p>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* BMD + climate adaptation */}
              <div className="space-y-4 md:space-y-6">
                <div className="bg-card border-t-4 border-primary shadow-sm p-4 md:p-6">
                  <h3 className="font-display mb-3 flex items-center gap-2"><ShieldCheck className="text-primary" size={20} /> সরকারি সতর্কতা</h3>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                    ঘূর্ণিঝড়, বন্যা বা শৈত্যপ্রবাহের সরকারি সতর্কবার্তার জন্য বাংলাদেশ আবহাওয়া অধিদপ্তরের (BMD) পোর্টাল অনুসরণ করুন। সরাসরি BMD ডেটা ইন্টিগ্রেশন শীঘ্রই যুক্ত হবে।
                  </p>
                  <a href="https://www.bmd.gov.bd" target="_blank" rel="noopener noreferrer">
                    <Button variant="secondary" size="sm" className="w-full">bmd.gov.bd দেখুন <ArrowRight size={14} className="ml-2" /></Button>
                  </a>
                </div>

                <div className="bg-primary text-white border-t-4 border-accent shadow-sm p-4 md:p-6">
                  <h3 className="font-display mb-4">জলবায়ু অভিযোজন টিপস</h3>
                  <ul className="space-y-3">
                    {CLIMATE_TIPS.map((tip, i) => (
                      <li key={i} className="flex gap-3 text-sm text-white/80 leading-relaxed">
                        <span className="w-5 h-5 bg-accent text-accent-foreground flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ============ 6. ASK AN EXPERT ============ */}
      <AnimatedSection animation="fade-in">
        <section className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-4 md:gap-8 items-start">
              <div>
                <span className="text-accent font-bold tracking-widest uppercase text-sm mb-4 block">কৃষি বিশেষজ্ঞকে প্রশ্ন করুন</span>
                <h2 className="font-display text-foreground mb-6">জমির সমস্যা? বিশেষজ্ঞের পরামর্শ নিন</h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-8">
                  রোগ, পোকা, সার, সেচ বা ফসল নির্বাচন — যেকোনো প্রশ্নে আমাদের কৃষি বিশেষজ্ঞ টিম বিনামূল্যে পরামর্শ দেবে। আমরা ২৪-৪৮ ঘণ্টার মধ্যে যোগাযোগ করবো।
                </p>

                <div className="bg-secondary text-white p-4 md:p-6 border-t-4 border-accent mb-6">
                  <p className="text-xs font-bold uppercase tracking-widest text-accent mb-2">সরাসরি কথা বলুন</p>
                  <a href={`tel:${s?.phone || "01340-862454"}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                    <Phone size={24} className="text-accent" />
                    <span className="text-xl md:text-2xl font-bold">{s?.phone || "01340-862454"}</span>
                  </a>
                  <p className="text-white/60 text-sm mt-2">রবি-বৃহস্পতিবার, সকাল ৯টা – সন্ধ্যা ৬টা</p>
                </div>

                <div className="bg-muted border border-dashed border-primary/40 p-4 md:p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-primary/10 flex items-center justify-center"><Bot size={20} className="text-primary" /></div>
                    <div>
                      <p className="font-bold text-foreground">AI কৃষি সহায়ক</p>
                      <p className="text-xs text-muted-foreground">শীঘ্রই আসছে</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    আমাদের AI চ্যাটবট ২৪/৭ আপনার প্রশ্নের উত্তর দেবে — আমরা বর্তমানে এই ফিচারটি তৈরি করছি। ততক্ষণ পর্যন্ত ফর্ম বা হটলাইনে যোগাযোগ করুন।
                  </p>
                </div>
              </div>

              <div className="bg-background border border-border shadow-sm p-4 md:p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-foreground">আপনার নাম *</FormLabel>
                          <FormControl><Input {...field} placeholder="যেমন: আব্দুল করিম" className="bg-white border-input focus-visible:ring-primary" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="phone" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-foreground">মোবাইল নম্বর *</FormLabel>
                          <FormControl><Input {...field} placeholder="01XXXXXXXXX" className="bg-white border-input focus-visible:ring-primary" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="district" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-foreground">জেলা</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-white border-input focus:ring-primary">
                                <SelectValue placeholder="জেলা নির্বাচন করুন" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {(districts ?? ["Dhaka", "Chattogram", "Rajshahi", "Khulna", "Sylhet", "Barishal", "Rangpur", "Mymensingh"]).map((d) => (
                                <SelectItem key={d} value={d}>{d}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="crop" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-bold text-foreground">ফসল</FormLabel>
                          <FormControl><Input {...field} placeholder="যেমন: ধান, মরিচ, গরু" className="bg-white border-input focus-visible:ring-primary" /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <FormField control={form.control} name="question" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-bold text-foreground">আপনার প্রশ্ন *</FormLabel>
                        <FormControl>
                          <Textarea {...field} rows={5} placeholder="ফসলের সমস্যা বিস্তারিত লিখুন..." className="bg-white border-input focus-visible:ring-primary resize-none" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <Button type="submit" variant="secondary" size="lg" disabled={inquiryMutation.isPending} className="w-full">
                      <MessageCircleQuestion className="mr-2" size={18} />
                      {inquiryMutation.isPending ? "পাঠানো হচ্ছে..." : "প্রশ্ন পাঠান"}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">সেবাটি সম্পূর্ণ বিনামূল্যে — কৃষকের জন্য Green Power Agro</p>
                  </form>
                </Form>
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ============ 7. RELATED PRODUCTS ============ */}
      <AnimatedSection>
        <section className="py-16 md:py-24 bg-muted">
          <div className="container mx-auto px-4">
            <SectionHeader
              badge="Green Power সমাধান"
              title="সংশ্লিষ্ট পণ্য — নিরাপদ চিকিৎসা ও পুষ্টি"
              description="রোগ ও পোকা দমনে Green Power-এর জৈব ও রাসায়নিক-মুক্ত সমাধান। ১০০% নিরাপদ মাটি, ১০০% স্বাস্থ্যকর ফসল, ০% ক্ষতিকর রাসায়নিক।"
              align="center"
            />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-stagger">
              {!productsData ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="border border-border shadow-sm flex flex-col h-full">
                    <Skeleton className="w-full aspect-square" />
                    <div className="p-4 space-y-2">
                      <Skeleton className="w-3/4 h-5" />
                      <Skeleton className="w-full h-4" />
                    </div>
                  </div>
                ))
              ) : powerAgroProducts.length === 0 ? (
                <div className="col-span-2 lg:col-span-4 text-center py-12 text-muted-foreground">
                  <ShoppingBag size={48} className="mx-auto mb-4 opacity-20" />
                  <p className="mb-4">কোনো সংশ্লিষ্ট পণ্য পাওয়া যায়নি।</p>
                  <Link href="/products">
                    <Button variant="outline" size="sm">সব পণ্য দেখুন</Button>
                  </Link>
                </div>
              ) : (
                powerAgroProducts.map((product) => (
                  <div key={product.id} className="border border-border shadow-sm flex flex-col h-full overflow-hidden bg-card card-hover">
                    <div className="w-full aspect-square bg-muted img-hover relative">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><FlaskConical size={48} className="text-primary/20" /></div>
                      )}
                      <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider px-3 py-1 z-10">{product.category}</span>
                    </div>
                    <div className="p-3 flex-1 flex flex-col">
                      <h3 className="font-display mb-1 text-foreground">{product.name}</h3>
                      <p className="text-muted-foreground text-sm mb-3 flex-1 line-clamp-3">{product.description}</p>
                      <Link href={`/products/${product.id}`}>
                        <Button variant="outline" size="sm" className="w-full">বিস্তারিত দেখুন</Button>
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="text-center mt-8">
              <Link href="/products">
                <Button variant="outline" size="lg">সব পণ্য দেখুন <ArrowRight className="ml-2" /></Button>
              </Link>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* ============ DISEASE DETAIL MODAL ============ */}
      <Dialog open={!!selectedDisease} onOpenChange={(v) => { if (!v) setSelectedDisease(null); }}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto font-bangla">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedDisease?.name}</DialogTitle>
          </DialogHeader>
          {selectedDisease && (
            <div className="space-y-6">
              {selectedDisease.imageUrl && (
                <img src={selectedDisease.imageUrl} alt={selectedDisease.name} className="w-full h-56 object-cover" />
              )}
              <div className="flex flex-wrap gap-2">
                <span className="bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider px-3 py-1">{selectedDisease.category}</span>
                {selectedDisease.cropName && <span className="bg-muted text-muted-foreground text-xs font-bold uppercase tracking-wider px-3 py-1">{selectedDisease.cropName}</span>}
                {selectedDisease.causeType && CAUSE_LABELS[selectedDisease.causeType] && (
                  <span className={`text-xs font-bold px-3 py-1 ${CAUSE_LABELS[selectedDisease.causeType].color}`}>
                    কারণ: {CAUSE_LABELS[selectedDisease.causeType].label}
                  </span>
                )}
              </div>

              {selectedDisease.causeNotes && (
                <div>
                  <h4 className="font-bold text-foreground mb-2">কারণ</h4>
                  <p className="text-muted-foreground leading-relaxed">{selectedDisease.causeNotes}</p>
                </div>
              )}

              {(selectedDisease.symptoms?.length ?? 0) > 0 && (
                <div>
                  <h4 className="font-bold text-foreground mb-2">উপসর্গসমূহ</h4>
                  <ul className="space-y-2">
                    {selectedDisease.symptoms.map((sym: string, i: number) => (
                      <li key={i} className="flex gap-3 text-muted-foreground leading-relaxed">
                        <span className="text-accent font-bold shrink-0">•</span>{sym}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-primary text-white p-4 md:p-5 border-l-4 border-accent">
                <h4 className="font-bold mb-2 flex items-center gap-2"><FlaskConical size={18} className="text-accent" /> চিকিৎসা</h4>
                <p className="text-white/85 leading-relaxed">{selectedDisease.treatmentText}</p>
              </div>

              {(selectedDisease.preventionSteps?.length ?? 0) > 0 && (
                <div>
                  <h4 className="font-bold text-foreground mb-2 flex items-center gap-2"><ShieldCheck size={18} className="text-primary" /> প্রতিরোধ</h4>
                  <ul className="space-y-2">
                    {selectedDisease.preventionSteps.map((step: string, i: number) => (
                      <li key={i} className="flex gap-3 text-muted-foreground leading-relaxed">
                        <span className="w-5 h-5 bg-muted border border-border flex items-center justify-center text-xs font-bold text-primary shrink-0 mt-0.5">{i + 1}</span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {(selectedDisease.relatedProductIds?.length ?? 0) > 0 && (
                <div className="bg-muted p-4">
                  <h4 className="font-bold text-foreground mb-3 flex items-center gap-2"><ShoppingBag size={18} className="text-accent" /> Green Power সুপারিশকৃত পণ্য</h4>
                  <div className="space-y-2">
                    {(productsData?.items ?? [])
                      .filter((p: any) => selectedDisease.relatedProductIds.includes(p.id))
                      .map((p: any) => (
                        <Link key={p.id} href={`/products/${p.id}`}>
                          <div className="flex items-center gap-3 bg-card border border-border p-2 card-hover">
                            {p.imageUrl && <img src={p.imageUrl} alt={p.name} className="w-12 h-12 object-cover shrink-0" loading="lazy" />}
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-foreground text-sm truncate">{p.name}</p>
                              <p className="text-xs text-muted-foreground truncate">{p.category}</p>
                            </div>
                            <span className="text-accent font-bold text-sm shrink-0">দেখুন →</span>
                          </div>
                        </Link>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ============ CROP DETAIL MODAL ============ */}
      <Dialog open={!!selectedCrop} onOpenChange={(v) => { if (!v) setSelectedCrop(null); }}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto font-bangla">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedCrop?.name}</DialogTitle>
          </DialogHeader>
          {selectedCrop && (
            <div className="space-y-6">
              {selectedCrop.imageUrl && (
                <img src={selectedCrop.imageUrl} alt={selectedCrop.name} className="w-full h-56 object-cover" />
              )}
              <div className="flex flex-wrap gap-2">
                <span className="bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider px-3 py-1">{selectedCrop.category}</span>
                {selectedCrop.season && <span className="bg-muted text-muted-foreground text-xs font-bold uppercase tracking-wider px-3 py-1">{selectedCrop.season}</span>}
              </div>
              {selectedCrop.englishName && <p className="text-muted-foreground uppercase tracking-wider text-sm">{selectedCrop.englishName}</p>}

              {selectedCrop.soilType && selectedCrop.soilType !== "—" && (
                <div>
                  <h4 className="font-bold text-foreground mb-2">মাটির ধরন</h4>
                  <p className="text-muted-foreground leading-relaxed">{selectedCrop.soilType}</p>
                </div>
              )}

              {selectedCrop.fertilizerNotes && (
                <div>
                  <h4 className="font-bold text-foreground mb-2 flex items-center gap-2"><FlaskConical size={18} className="text-primary" /> সার প্রণালী</h4>
                  <p className="text-muted-foreground leading-relaxed">{selectedCrop.fertilizerNotes}</p>
                </div>
              )}

              {selectedCrop.irrigationNotes && (
                <div>
                  <h4 className="font-bold text-foreground mb-2 flex items-center gap-2"><Droplets size={18} className="text-primary" /> সেচ ব্যবস্থাপনা</h4>
                  <p className="text-muted-foreground leading-relaxed">{selectedCrop.irrigationNotes}</p>
                </div>
              )}

              {selectedCrop.seedVarietyRef && (
                <div>
                  <h4 className="font-bold text-foreground mb-2 flex items-center gap-2"><Sprout size={18} className="text-primary" /> জাত / ভ্যারাইটি</h4>
                  <p className="text-muted-foreground leading-relaxed">{selectedCrop.seedVarietyRef}</p>
                </div>
              )}

              {selectedCrop.expectedYield && (
                <div className="bg-primary text-white p-4 md:p-5 border-l-4 border-accent">
                  <h4 className="font-bold mb-2 flex items-center gap-2"><Sprout size={18} className="text-accent" /> প্রত্যাশিত ফলন</h4>
                  <p className="text-white/85 leading-relaxed">{selectedCrop.expectedYield}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
