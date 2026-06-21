import { motion } from "framer-motion";
import { ArrowRight, Sprout, ShoppingBasket, Coffee, Sparkles, Shirt, Hotel, Plane, GraduationCap, Heart, Tv, FlaskConical, Store, Award, Leaf, MapPin, Handshake } from "lucide-react";
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

export default function Home() {
  const { data: stats } = useGetCompanyStats();
  
  const { data: productsData, isLoading: loadingProducts } = useListProducts({ featured: true, limit: 3 }, { query: { queryKey: getListProductsQueryKey({ featured: true, limit: 3 }) } });
  
  const { data: newsData, isLoading: loadingNews } = useListNews({ limit: 3 }, { query: { queryKey: getListNewsQueryKey({ limit: 3 }) } });

  const subsidiaries = [
    { name: "GMI Power Agro Ltd.", icon: Sprout, desc: "Agriculture Inputs & Solutions" },
    { name: "GMI Essential Food", icon: ShoppingBasket, desc: "Food & FMCG" },
    { name: "GMI Beverage Ltd.", icon: Coffee, desc: "Beverages" },
    { name: "GMI Skin Care Ltd.", icon: Sparkles, desc: "Beauty & Personal Care" },
    { name: "GMI Fashion House", icon: Shirt, desc: "Apparel & Fashion" },
    { name: "GMI Hotel & Restaurant", icon: Hotel, desc: "Hospitality" },
    { name: "GMI Tour & Travels", icon: Plane, desc: "Travel & Tourism" },
    { name: "GMI Education", icon: GraduationCap, desc: "Educational Services" },
    { name: "GMI Hospital", icon: Heart, desc: "Healthcare" },
    { name: "GMI Media", icon: Tv, desc: "Media & Communications" },
    { name: "GMI R&D", icon: FlaskConical, desc: "Research & Development" },
    { name: "GMI Super Shop", icon: Store, desc: "Retail" },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-secondary to-[#09281A] text-white pt-[96px] md:pt-[128px] pb-16 md:pb-20 -mt-20 relative overflow-hidden flex flex-col items-center justify-center">
        <AnimatedBackground />
        <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-block text-accent font-semibold tracking-[0.2em] uppercase text-sm mb-6 border-b-2 border-accent/40 pb-2">
                Bangladesh's Premier Business Group
              </span>
              <h1 className="font-display leading-tight mb-6">
                Building Sustainable Solutions<br />
                <span className="text-accent">for a Better Future</span>
              </h1>
              <p className="text-sm md:text-base text-white/60 mb-10 max-w-2xl mx-auto leading-relaxed">
                Green Madani International Private Ltd. delivers quality solutions through innovation, technology, and sustainable growth.
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
          <div className="border-t border-white/10 pt-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatDisplay value={stats?.subsidiaries || "12+"} label="Subsidiaries" className="lift-hover" />
            <StatDisplay value={stats?.products || "500+"} label="Products" className="lift-hover" />
            <StatDisplay value={stats?.farmerServed?.toLocaleString() || "10,000+"} label="Farmers Served" className="lift-hover" />
            <StatDisplay value={stats?.yearsActive || "6+"} label="Years Active" className="lift-hover" />
          </div>
        </div>
      </section>

      {/* Company Intro */}
      <AnimatedSection>
        <section className="py-24 bg-card">
          <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-accent font-bold tracking-widest uppercase text-sm mb-4 block">Who We Are</span>
              <h2 className="font-display text-foreground mb-8">
                A Diversified Business Group Driving Sustainable Growth
              </h2>
              <div className="space-y-6 text-muted-foreground text-lg mb-10">
                <p>
                  Founded on the principles of Islamic heritage and community empowerment, Green Madani International has grown from a humble agricultural enterprise into a nationwide conglomerate.
                </p>
                <p>
                  We believe that true business success is measured not just in profit, but in the positive impact we create for our farmers, our customers, and our environment.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {["Quality", "Innovation", "Integrity", "Sustainability"].map((val, idx) => (
                  <div key={val} className="flex items-center gap-3 bg-muted p-4 font-semibold text-primary lift-hover">
                    {idx === 0 && <Award size={20} className="text-accent shrink-0" />}
                    {idx === 1 && <FlaskConical size={20} className="text-accent shrink-0" />}
                    {idx === 2 && <Handshake size={20} className="text-accent shrink-0" />}
                    {idx === 3 && <Leaf size={20} className="text-accent shrink-0" />}
                    {val}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 h-[500px]">
              <div className="bg-muted h-full img-hover shadow-lg border border-border">
                 <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop" alt="Modern Factory" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="bg-muted h-full mt-8 img-hover shadow-lg border border-border">
                 <img src="https://images.unsplash.com/photo-1592982537447-6f2c6c0c2834?q=80&w=2069&auto=format&fit=crop" alt="Agriculture" className="w-full h-full object-cover" loading="lazy" />
              </div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Business Categories */}
      <AnimatedSection>
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <SectionHeader
              title="Our Diverse Business Portfolio"
              align="center"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {subsidiaries.map((sub, i) => {
                const Icon = sub.icon;
                return (
                  <Link key={i} href="/businesses">
                    <div className="bg-card p-8 border border-border card-hover group h-full flex flex-col active:scale-[0.98]">
                      <div className="w-14 h-14 bg-muted text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                        <Icon size={28} />
                      </div>
                      <h3 className="font-display mb-2 text-foreground">{sub.name}</h3>
                      <p className="text-muted-foreground text-sm flex-1">{sub.desc}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="text-center mt-12">
              <Link href="/businesses">
                <Button variant="primary" size="lg">
                  View All Businesses <ArrowRight className="ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Featured Products */}
      <AnimatedSection>
        <section className="py-24 bg-card">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-end mb-12">
              <div>
                <span className="text-accent font-bold tracking-widest uppercase text-sm mb-2 block">Premium Quality</span>
                <h2 className="font-display text-foreground">Featured Products</h2>
              </div>
              <Link href="/products" className="hidden md:flex items-center text-primary font-bold hover:text-accent transition-colors">
                View All Catalog <ArrowRight size={20} className="ml-2" />
              </Link>
            </div>

            <div className="flex gap-4 mb-10 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory">
              <Button variant="primary">All</Button>
              <Button variant="outline">Agriculture</Button>
              <Button variant="outline">Food</Button>
              <Button variant="outline">Skincare</Button>
              <Button variant="outline">Beverage</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loadingProducts ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="border border-border shadow-sm flex flex-col h-full">
                    <Skeleton className="w-full h-64" />
                    <div className="p-6">
                      <Skeleton className="w-20 h-6 mb-4" />
                      <Skeleton className="w-full h-8 mb-2" />
                      <Skeleton className="w-2/3 h-4" />
                    </div>
                  </div>
                ))
              ) : (
                (productsData?.items ?? []).map((product) => (
                  <div key={product.id} className="border border-border shadow-sm flex flex-col h-full group overflow-hidden bg-card">
                    <div className="w-full h-64 bg-muted img-hover relative">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted"><ShoppingBasket size={48} className="opacity-20" /></div>
                      )}
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <span className="inline-block bg-accent/10 text-accent font-semibold text-xs tracking-wider uppercase px-3 py-1 mb-4 self-start">
                        {product.category}
                      </span>
                      <h3 className="font-display mb-3 text-foreground">{product.name}</h3>
                      <p className="text-muted-foreground text-sm mb-6 flex-1 line-clamp-3">{product.description}</p>
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
          </div>
        </section>
      </AnimatedSection>

      {/* Why Choose GMI */}
      <section className="py-24 bg-primary text-white relative border-y-4 border-accent overflow-hidden">
        <AnimatedBackground />
        <div className="container mx-auto px-4 relative z-10">
          <SectionHeader
            title="Why Partner With GMI"
            description="A legacy of trust, quality, and commitment to the nation."
            align="center"
            className="[&_h2]:text-white [&_p]:text-white/70"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Award, title: "Trusted Quality", desc: "Rigorous standards across all 12 subsidiaries." },
              { icon: Leaf, title: "Sustainable Practices", desc: "Eco-friendly operations from farm to shelf." },
              { icon: MapPin, title: "Nation-Wide Distribution", desc: "Reaching every corner of Bangladesh." },
              { icon: Sprout, title: "Farmer-First Approach", desc: "Empowering local communities directly." }
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="glass-card card-hover group text-center p-8">
                  <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon size={32} className="text-accent-foreground" />
                  </div>
                  <h3 className="font-display mb-3">{feature.title}</h3>
                  <p className="text-white/70 text-sm">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Partner / Investor CTA */}
      <CTASection />

      {/* Sustainability Strip */}
      <section className="py-24 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop')] bg-cover bg-center bg-fixed text-white text-center relative">
        <div className="absolute inset-0 bg-secondary/90"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="font-display italic mb-12 max-w-4xl min-w-[280px] mx-auto text-white">
            "Growing with Nature,<br />Building for Generations"
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
            <div className="glass-dark p-6 card-hover">
              <div className="text-4xl font-bold text-white mb-2">50,000+</div>
              <div className="text-sm uppercase tracking-widest font-semibold text-accent">Trees Planted</div>
            </div>
            <div className="glass-dark p-6 card-hover">
              <div className="text-4xl font-bold text-white mb-2">30%</div>
              <div className="text-sm uppercase tracking-widest font-semibold text-accent">Water Reduction</div>
            </div>
            <div className="glass-dark p-6 card-hover">
              <div className="text-4xl font-bold text-white mb-2">100%</div>
              <div className="text-sm uppercase tracking-widest font-semibold text-accent">Ethical Sourcing</div>
            </div>
          </div>
          <Link href="/sustainability">
            <Button variant="secondary" size="lg">
              Read Our Sustainability Report
            </Button>
          </Link>
        </div>
      </section>

      {/* News Preview */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-accent font-bold tracking-widest uppercase text-sm mb-2 block">Insights</span>
              <h2 className="font-display text-foreground">Latest News & Updates</h2>
            </div>
            <Link href="/news" className="hidden md:flex items-center text-primary font-bold hover:text-accent transition-colors link-underline">
              View All News <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loadingNews ? (
               Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex flex-col h-full border-t-4 border-accent bg-white shadow-sm">
                  <Skeleton className="w-full h-48" />
                  <div className="p-6">
                    <Skeleton className="w-24 h-4 mb-3" />
                    <Skeleton className="w-full h-6 mb-2" />
                    <Skeleton className="w-full h-6 mb-4" />
                    <Skeleton className="w-2/3 h-4" />
                  </div>
                </div>
              ))
            ) : (newsData?.items ?? []).map((article) => (
              <Link key={article.id} href={`/news/${article.slug}`} className="group border-t-4 border-accent bg-white shadow-sm card-hover flex flex-col h-full">
                <div className="w-full h-48 bg-muted img-hover relative overflow-hidden">
                  {article.imageUrl ? (
                    <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  ) : (
                    <div className="w-full h-full bg-secondary flex items-center justify-center"><Tv className="text-white/20" size={48} /></div>
                  )}
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground tracking-wider uppercase mb-3">
                    <span className="text-accent">{article.category}</span>
                    <span>{format(new Date(article.publishedAt), 'MMM dd, yyyy')}</span>
                  </div>
                  <h3 className="font-display mb-3 text-foreground group-hover:text-accent transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3 flex-1">
                    {article.excerpt || "Read more about our latest developments and news."}
                  </p>
                  <span className="text-accent font-bold flex items-center group-hover:gap-3 transition-all">
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
    </div>
  );
}
