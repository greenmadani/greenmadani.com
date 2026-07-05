import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Building2, Cog, Award, Leaf, Handshake, MapPin, Tv } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useListProducts, useListNews, useGetCompanyStats, getListProductsQueryKey, getListNewsQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import AnimatedBackground from "@/components/AnimatedBackground";
import { SectionHeader } from "@/components/section-header";
import { StatDisplay } from "@/components/stat-display";
import { AnimatedSection } from "@/components/animated-section";
import { CTASection } from "@/components/cta-section";
import { useBusinessesList } from "@/lib/businesses";

const CATEGORIES = ["All", "Agriculture", "Food", "Skincare", "Beverage"] as const;

export default function Home() {
 const { data:stats } = useGetCompanyStats();
 const { data: businessData, isLoading: loadingBusinesses } = useBusinessesList();
 const [activeCategory, setActiveCategory] = useState<string>("All");
 
  function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
  }

  const displaySubsidiaries = useMemo(() => businessData ? shuffle(businessData).slice(0, 6) : [], [businessData]);

  const isAll = activeCategory === "All";
  const { data:productsData, isLoading:loadingProducts } = useListProducts(
    isAll ? { featured:true, limit:12 } : { category:activeCategory, limit:12 },
    { query:{ queryKey:getListProductsQueryKey(isAll ? { featured:true, limit:12 } : { category:activeCategory, limit:12 }) } }
  );
  const displayProducts = useMemo(() => productsData?.items ? shuffle(productsData.items).slice(0, 8) : [], [productsData]);
  
  const { data:newsData, isLoading:loadingNews } = useListNews({ limit:12 }, { query:{ queryKey:getListNewsQueryKey({ limit:12 }) } });
  const displayNews = useMemo(() => newsData?.items ? shuffle(newsData.items).slice(0, 8) : [], [newsData]);

 return (
 <div className="w-full">
 {/* Hero Section */}
 <section className="bg-gradient-to-br from-primary via-secondary to-[#09281A] text-white pt-[96px] md:pt-[128px] pb-16 md:pb-20 -mt-20 relative overflow-hidden flex flex-col items-center justify-center">
 <AnimatedBackground />
 <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
 <div className="max-w-3xl">
 <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.6 }}>
 <span className="inline-block text-accent font-semibold tracking-[0.2em] uppercase text-sm mb-4 md:mb-6 border-b-2 border-accent/40 pb-2">
 Bangladesh's Premier Diversified Business Group
 </span>
 <h1 className="font-display leading-tight mb-4 md:mb-6">
 Building Sustainable Solutions<br />
 <span className="text-accent">for a Better Future</span>
 </h1>
 <p className="text-sm md:text-base text-white/60 mb-4 md:mb-10 max-w-2xl mx-auto leading-relaxed">
 Green Madani International Private Ltd. delivers quality solutions across agriculture, food, health, and lifestyle — through innovation, technology, and sustainable growth.
 </p>
 <div className="flex flex-wrap gap-4 items-center justify-center">
 <Link href="/businesses">
 <Button variant="secondary" size="lg" className="shadow-lg hover:shadow-xl">
 Explore Businesses
 </Button>
 </Link>
 <Link href="/contact">
 <span className="text-white/70 hover:text-white font-semibold text-sm link-underline">
 Contact Us →
 </span>
 </Link>
 </div>
 </motion.div>
 </div>
 </div>

 {/* Stats */}
 <div className="container mx-auto px-4 mt-20 md:mt-24 relative z-10">
 <div className="border-t border-white/10 pt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
 <StatDisplay value={stats?.subsidiaries || "12"} label="Subsidiaries" className="card-hover" />
 <StatDisplay value={stats?.products ? `${stats.products}+` :"170+"} label="Products" className="card-hover" />
 <StatDisplay value={stats?.districtsCovered || "42"} label="Districts Covered" className="card-hover" />
 <StatDisplay value={stats?.yearsActive ? `${stats.yearsActive}+` :"6+"} label="Years Active" className="card-hover" />
 </div>
 </div>
 </section>

 {/* Company Intro */}
 <AnimatedSection animation="fade-in">
 <section className="py-16 md:py-24 bg-card">
 <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-6 md:gap-16 items-center">
 <div>
 <span className="text-accent font-bold tracking-widest uppercase text-sm mb-4 block">Who We Are</span>
 <h2 className="font-display text-foreground mb-4 md:mb-8">
 A Legacy of Growth, A Future of Innovation
 </h2>
 <div className="space-y-4 md:space-y-6 text-muted-foreground text-lg mb-4 md:mb-10">
 <p>
 Green Madani International Private Ltd. (formerly Green Universe Group) is a diversified business group operating across 12 integrated verticals — from agriculture and food to healthcare, education, hospitality, and media. Founded and led by A.R. Reju (Rafiqul Islam A.R. Chowdhury Reju), GMI was built on a single belief:that sustainable, technology-driven business can transform communities while delivering lasting value.
 </p>
 <p>
 With operations across 42 districts and a growing network of distribution points, GMI connects farmers, manufacturers, and consumers through a fully integrated farm-to-shelf model. Our mission extends beyond profit — we aim to build a better Bangladesh through quality, innovation, and large-scale employment opportunities.
 </p>
 </div>
 <div className="grid grid-cols-2 gap-3">
 {[{title:"Quality", icon:Award, desc:"We maintain uncompromising standards across every product and service we deliver."}, {title:"Innovation", icon:Cog, desc:"We embrace modern technology and American-formula R&D to stay ahead of industry needs."}, {title:"Integrity", icon:Handshake, desc:"We operate with transparency and honesty in every business relationship."}, {title:"Sustainability", icon:Leaf, desc:"We are committed to 100% safe soil, healthy crops, and zero harmful chemicals."}].map((val) => (
 <div key={val.title} className="flex flex-col gap-1 bg-muted p-2 font-semibold text-primary card-hover">
 <div className="flex items-center gap-3">
 <val.icon size={20} className="text-accent shrink-0" />
 {val.title}
 </div>
 <span className="text-xs font-normal text-muted-foreground">{val.desc}</span>
 </div>
 ))}
 </div>
 </div>
 <div className="relative">
 <div className="absolute -top-4 -left-4 w-28 h-28 border-2 border-accent/20 z-0 hidden lg:block" />
 <div className="grid grid-cols-2 gap-4 relative z-10">
 <div className="relative h-[460px] img-hover overflow-hidden shadow-xl border border-border/50 group">
 <img
 src="/images/about/Copilot_20260624_002230.webp"
 alt="Business Growth"
 className="w-full h-full object-cover"
 loading="lazy"
 />
 <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 transition-opacity duration-500" />
 <div className="absolute bottom-3 left-3 right-3">
 <span className="text-white/90 text-xs font-medium tracking-wide bg-black/40 backdrop-blur-sm px-3 py-1.5 inline-block">
 Innovation & Growth
 </span>
 </div>
 </div>
 <div className="relative h-[460px] mt-10 img-hover overflow-hidden shadow-xl border border-border/50 group">
 <img
 src="/images/about/Export-Bangladesh-SEO-Game-Plan.webp"
 alt="Export Bangladesh"
 className="w-full h-full object-cover"
 loading="lazy"
 />
 <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 transition-opacity duration-500" />
 <div className="absolute bottom-3 left-3 right-3">
 <span className="text-white/90 text-xs font-medium tracking-wide bg-black/40 backdrop-blur-sm px-3 py-1.5 inline-block">
 Global Reach
 </span>
 </div>
 </div>
 </div>
 <div className="absolute -bottom-4 -right-4 w-20 h-20 bg-accent/10 z-0 hidden lg:block" />
 </div>
 </div>
 </section>
 </AnimatedSection>

 {/* Business Portfolio */}
 <AnimatedSection>
 <section className="py-16 md:py-24 bg-gradient-to-br from-primary via-secondary to-[#09281A] text-white relative overflow-hidden">
 <AnimatedBackground />
 <div className="container mx-auto px-4 relative z-10">
 <SectionHeader
 title="Our Diverse Business Portfolio"
 align="center"
 className="[&_h2]:text-white [&_span]:text-accent"
 />
  <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6 md:mb-12">
  {loadingBusinesses ? (
  Array.from({ length: 6 }).map((_, i) => (
  <div key={i} className="h-full flex flex-col bg-white/5 backdrop-blur-xl border border-white/10 overflow-hidden">
  <Skeleton className="aspect-[3/2] w-full bg-white/10" />
  <div className="p-3 space-y-2">
  <Skeleton className="h-5 w-3/4 bg-white/10" />
  <Skeleton className="h-4 w-full bg-white/10" />
  </div>
  </div>
  ))
  ) : displaySubsidiaries.length === 0 ? null : (
  displaySubsidiaries.map((sub, i) => (
  <Link key={sub.slug} href={`/businesses/${sub.slug}`} className="group block">
  <div className="h-full flex flex-col bg-white/5 backdrop-blur-xl border border-white/10 card-hover overflow-hidden">
  <div className="relative aspect-[3/2] overflow-hidden img-hover" style={{ transform:'translateZ(0)' }}>
  <img src={sub.imageUrl ?? "/images/businesses/placeholder.svg"} alt={sub.name} className="w-full h-full object-cover" style={{ willChange:'transform' }} loading="lazy" />
  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
  <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider px-3 py-1 z-10">{sub.industry}</span>
  <div className="absolute bottom-3 left-3 right-3">
  <span className="text-white/90 text-xs font-medium tracking-wide bg-black/40 backdrop-blur-sm px-3 py-1.5 inline-block">
  Explore {sub.name}
  </span>
  </div>
  </div>
  <div className="p-3 flex flex-col items-center text-center flex-1">
  <h3 className="font-display text-white mb-1 leading-snug">{sub.name}</h3>
  <p className="text-white/60 text-sm leading-relaxed flex-1">{sub.description}</p>
  <span className="mt-5 text-xs font-semibold tracking-widest uppercase text-accent/70">
  Learn More →
  </span>
  </div>
  </div>
  </Link>
  ))
  )}
  </div>
 <div className="text-center">
 <Link href="/businesses">
 <Button variant="secondary" size="lg">
 View All Businesses <ArrowRight className="ml-2" />
 </Button>
 </Link>
 </div>
 </div>
 </section>
 </AnimatedSection>

 {/* Featured Products */}
 <AnimatedSection>
 <section className="py-16 md:py-24 bg-card">
 <div className="container mx-auto px-4">
 <div className="flex justify-between items-end mb-6 md:mb-12">
 <div>
 <span className="text-accent font-bold tracking-widest uppercase text-sm mb-2 block">Our Products</span>
 <h2 className="font-display text-foreground">Featured Products from Green Power Agro</h2>
 </div>
 <Link href="/products" className="hidden md:flex items-center text-primary font-bold hover:text-accent transition-colors">
 View All Catalog <ArrowRight size={20} className="ml-2" />
 </Link>
 </div>

  <div className="flex gap-4 mb-10 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory">
  {CATEGORIES.map((cat) => (
    <button
      key={cat}
      onClick={() => setActiveCategory(cat)}
      className={`px-4 py-2 text-sm font-semibold transition-colors whitespace-nowrap snap-start ${
        activeCategory === cat
          ? "bg-primary text-white"
          : "bg-white text-foreground border border-border hover:bg-muted"
      }`}
    >
      {cat}
    </button>
  ))}
  </div>

  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-stagger">
  {loadingProducts ? (
  Array.from({ length:8 }).map((_, i) => (
  <div key={i} className="border border-border shadow-sm flex flex-col h-full">
  <Skeleton className="w-full h-64" />
 <div className="p-4">
 <Skeleton className="w-20 h-6 mb-3" />
 <Skeleton className="w-full h-8 mb-2" />
 <Skeleton className="w-2/3 h-4" />
 </div>
 </div>
 ))
  ) :(
  displayProducts.map((product) => (
 <div key={product.id} className="border border-border shadow-sm flex flex-col h-full overflow-hidden bg-card card-hover">
      <div className="w-full h-64 bg-muted img-hover relative">
      {product.imageUrl ? (
        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted"><ShoppingBag size={48} className="opacity-20" /></div>
      )}
      <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider px-3 py-1 z-10">{product.category}</span>
      </div>
      <div className="p-3 flex-1 flex flex-col">
 <h3 className="font-display mb-1 text-foreground">{product.name}</h3>
 <p className="text-muted-foreground text-sm mb-3 flex-1 line-clamp-3">{product.description}</p>
 <Link href={`/products/${product.id}`}>
 <Button variant="outline" size="lg" className="w-full">
 View Details
 </Button>
 </Link>
 </div>
 </div>
 ))
  )}
  </div>

  <div className="mt-8 text-center md:hidden">
  <Link href="/products">
  <Button variant="outline" size="lg" className="w-full">
  View All Products <ArrowRight className="ml-2" />
  </Button>
  </Link>
  </div>
  </div>
  </section>
  </AnimatedSection>

  {/* Why Choose GMI */}
 <AnimatedSection animation="fade-in">
 <section className="py-16 md:py-24 bg-primary text-white relative border-y-4 border-accent overflow-hidden">
 <AnimatedBackground />
 <div className="container mx-auto px-4 relative z-10">
 <SectionHeader
 title="Why Partner With GMI"
 description="GMI's integrated business model, nationwide distribution network, and commitment to innovation make us the trusted partner for farmers, distributors, and businesses across Bangladesh."
 align="center"
 className="[&_h2]:text-white [&_p]:text-white/70"
 />
 <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-stagger">
 {[
 { icon:Award, title:"Vertical Integration", desc:"Our farm-to-shelf model eliminates middlemen, ensuring better margins and consistent quality at every step." },
 { icon:Building2, title:"Diversified Strength", desc:"Operating across 12 sectors means stability — we're never dependent on a single market or industry." },
 { icon:MapPin, title:"Nationwide Reach", desc:"Active in 42 districts with a growing distribution network of 1,000+ planned points." },
 { icon:Leaf, title:"Export-Ready Quality", desc:"Our products are built to international standards, ready for both local and global markets." }
 ].map((feature, i) => {
 const Icon = feature.icon;
 return (
 <div key={i} className="glass-card card-hover text-center p-4">
 <div className="w-12 h-12 bg-accent flex items-center justify-center mx-auto mb-3">
 <Icon size={24} className="text-accent-foreground" />
 </div>
 <h3 className="font-display mb-1">{feature.title}</h3>
 <p className="text-white/70 text-sm">{feature.desc}</p>
 </div>
 );
 })}
 </div>
 </div>
 </section>
 </AnimatedSection>

 {/* Partner / Investor CTA */}
 <CTASection />

 {/* Sustainability Strip */}
 <AnimatedSection animation="fade-in">
 <section className="py-16 md:py-24 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop')] bg-cover bg-center bg-fixed text-white text-center relative">
 <div className="absolute inset-0 bg-secondary/90"></div>
 <div className="container mx-auto px-4 relative z-10">
 <h2 className="font-display italic mb-6 md:mb-12 max-w-4xl min-w-[280px] mx-auto text-white">
 "Growing with Nature,<br />Building for Generations"
 </h2>
 <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 md:mb-12 max-w-4xl mx-auto animate-stagger">
 <div className="glass-dark p-4 card-hover">
 <div className="text-4xl font-bold text-white mb-1">100%</div>
 <div className="text-sm uppercase tracking-widest font-semibold text-accent">Safe Soil Initiative</div>
 </div>
 <div className="glass-dark p-4 card-hover">
 <div className="text-4xl font-bold text-white mb-1">42</div>
 <div className="text-sm uppercase tracking-widest font-semibold text-accent">Districts Covered</div>
 </div>
 <div className="glass-dark p-4 card-hover">
 <div className="text-4xl font-bold text-white mb-1">70+</div>
 <div className="text-sm uppercase tracking-widest font-semibold text-accent">High-Yield Seeds</div>
 </div>
 </div>
 <Link href="/sustainability">
 <Button variant="secondary" size="lg">
 Read Our Sustainability Report
 </Button>
 </Link>
 </div>
 </section>
 </AnimatedSection>

 {/* News Preview */}
 <AnimatedSection>
 <section className="py-16 md:py-24 bg-card">
 <div className="container mx-auto px-4">
 <div className="flex justify-between items-end mb-6 md:mb-12">
 <div>
 <span className="text-accent font-bold tracking-widest uppercase text-sm mb-2 block">Insights</span>
 <h2 className="font-display text-foreground">Latest News & Updates</h2>
 </div>
 <Link href="/news" className="hidden md:flex items-center text-primary font-bold hover:text-accent transition-colors link-underline">
 View All News <ArrowRight size={20} className="ml-2" />
 </Link>
 </div>

  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-stagger">
  {loadingNews ? (
  Array.from({ length:8 }).map((_, i) => (
  <div key={i} className="flex flex-col h-full border-t-4 border-accent bg-white shadow-sm">
 <Skeleton className="w-full h-48" />
 <div className="p-3">
 <Skeleton className="w-24 h-4 mb-1" />
 <Skeleton className="w-full h-6 mb-1" />
 <Skeleton className="w-full h-6 mb-2" />
 <Skeleton className="w-2/3 h-4" />
 </div>
 </div>
 ))
   ) :displayNews.map((article) => (
  <Link key={article.id} href={`/news/${article.slug}`} className="border-t-4 border-accent bg-white shadow-sm card-hover flex flex-col h-full">
  <div className="w-full h-48 bg-muted img-hover relative overflow-hidden">
  {article.imageUrl ? (
  <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" loading="lazy" />
  ) :(
  <div className="w-full h-full bg-secondary flex items-center justify-center"><Tv className="text-white/20" size={48} /></div>
  )}
  <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider px-3 py-1 z-10">{article.category}</span>
  </div>
  <div className="p-3 flex flex-col flex-1">
   <span className="hidden md:block text-[11px] md:text-xs font-semibold tracking-wider uppercase text-foreground/60 mb-1">{format(new Date(article.publishedAt), 'MMM dd, yyyy')}</span>
  <h3 className="font-display mb-1 text-foreground line-clamp-2">
 {article.title}
 </h3>
 <p className="text-muted-foreground text-sm mb-2 line-clamp-3 flex-1">
 {article.excerpt || "Read more about our latest developments and news."}
 </p>
 <span className="text-accent font-bold flex items-center">
 Read More <ArrowRight size={16} className="ml-1" />
 </span>
 </div>
 </Link>
 ))}
 </div>
 
 <div className="mt-12 text-center md:hidden">
 <Link href="/news">
 <Button variant="outline" size="lg" className="w-full">
 View All News
 </Button>
 </Link>
 </div>
 </div>
 </section>
 </AnimatedSection>
 </div>
 );
}
