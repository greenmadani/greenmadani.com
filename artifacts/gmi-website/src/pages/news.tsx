import { useState } from "react";
import { ArrowRight, Tv } from "lucide-react";
import { Link } from "wouter";
import { useListNews, getListNewsQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/page-hero";
import { FilterBar } from "@/components/filter-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { AnimatedSection } from "@/components/animated-section";

export default function News() {
 const [activeCategory, setActiveCategory] = useState<string>("All");
 const categories = ["All", "Company News", "Agriculture Tips", "Events", "Announcements"];
 
 const { data:newsData, isLoading } = useListNews({
 category:activeCategory !== "All" ? activeCategory :undefined
 }, {
 query:{ queryKey:getListNewsQueryKey({ category:activeCategory !== "All" ? activeCategory :undefined }) }
 });

 return (
 <div className="w-full pb-24 bg-background">
 <PageHero
 title="News & Updates"
 subtitle="Stay informed with the latest developments, events, and insights from across the GMI conglomerate."
 breadcrumbs={[
 { label:"Home", href:"/" },
 { label:"News & Insights", href:"/news" }
 ]}
 />

 <AnimatedSection animation="fade-up" delay={100}>
 <div className="container mx-auto px-4 py-16">
 {/* Filters */}
 <FilterBar
 categories={categories}
 active={activeCategory}
 onChange={setActiveCategory}
 />

 {/* Grid */}
 <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-stagger">
 {isLoading ? (
 Array.from({ length:6 }).map((_, i) => (
 <div key={i} className="flex flex-col h-full border-t-4 border-accent bg-white shadow-sm">
 <Skeleton className="w-full h-48" />
<div className="p-4">
 <Skeleton className="w-24 h-4 mb-2" />
 <Skeleton className="w-full h-6 mb-1" />
 <Skeleton className="w-full h-6 mb-3" />
 <Skeleton className="w-2/3 h-4" />
 </div>
 </div>
 ))
 ) :newsData?.items.length === 0 ? (
 <div className="col-span-full py-20 text-center bg-white border border-dashed border-border">
 <h3 className="font-display text-muted-foreground">No articles found</h3>
 <p className="text-muted-foreground mt-2">Try selecting a different category.</p>
 </div>
 ) :(
 newsData?.items.map((article) => (
 <Link key={article.id} href={`/news/${article.slug}`} className="border-t-4 border-accent bg-white shadow-sm card-hover flex flex-col h-full">
 <div className="w-full h-48 bg-muted img-hover relative overflow-hidden">
 {article.imageUrl ? (
 <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" loading="lazy" />
 ) :(
 <div className="w-full h-full bg-secondary flex items-center justify-center"><Tv className="text-white/20" size={48} /></div>
 )}
 </div>
 <div className="p-3 flex flex-col flex-1">
  <div className="flex items-center justify-between text-[11px] md:text-xs font-bold tracking-widest uppercase mb-1">
  <span className="text-accent">{article.category}</span>
  <span className="text-foreground/60">{format(new Date(article.publishedAt), 'MMM dd, yyyy')}</span>
  </div>
 <h3 className="font-display mb-1 text-foreground line-clamp-2 leading-tight">
 {article.title}
 </h3>
 <p className="text-muted-foreground text-sm mb-2 flex-1 line-clamp-3">
 {article.excerpt || "Read more about our latest developments and news."}
 </p>
 <span className="text-accent font-bold flex items-center mt-auto">
 Read Article <ArrowRight size={16} className="ml-1" />
 </span>
 </div>
 </Link>
 ))
 )}
 </div>

 {/* Pagination placeholder (simple) */}
 {!isLoading && (newsData?.total || 0) > (newsData?.items.length || 0) && (
 <div className="mt-16 flex justify-center">
 <Button variant="outline" size="lg">
 Load More
 </Button>
 </div>
 )}
 </div>
 </AnimatedSection>
 </div>
 );
}
