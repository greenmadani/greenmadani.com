import { useState } from "react";
import { ArrowRight, Tv } from "lucide-react";
import { Link } from "wouter";
import { useListNews, getListNewsQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/page-hero";
import { FilterBar } from "@/components/filter-bar";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export default function News() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const categories = ["All", "Company News", "Agriculture Tips", "Events", "Announcements"];
  
  const { data: newsData, isLoading } = useListNews({
    category: activeCategory !== "All" ? activeCategory : undefined
  }, {
    query: { queryKey: getListNewsQueryKey({ category: activeCategory !== "All" ? activeCategory : undefined }) }
  });

  return (
    <div className="w-full pb-24 bg-background">
      <PageHero
        title="News & Updates"
        subtitle="Stay informed with the latest developments, events, and insights from across the GMI conglomerate."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "News & Insights", href: "/news" }
        ]}
      />

      <div className="container mx-auto px-4 py-16">
        {/* Filters */}
        <FilterBar
          categories={categories}
          active={activeCategory}
          onChange={setActiveCategory}
        />

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col h-full bg-white shadow-sm p-4">
                <Skeleton className="w-full h-56 rounded-xl mb-4" />
                <Skeleton className="w-24 h-4 mb-3" />
                <Skeleton className="w-full h-8 mb-2" />
                <Skeleton className="w-full h-8 mb-4" />
                <Skeleton className="w-2/3 h-4" />
              </div>
            ))
          ) : newsData?.items.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-white border border-dashed border-border">
              <h3 className="text-xl font-display font-bold text-muted-foreground">No articles found</h3>
              <p className="text-muted-foreground mt-2">Try selecting a different category.</p>
            </div>
          ) : (
            newsData?.items.map((article) => (
              <div key={article.id} className="group card-hover bg-white shadow-sm">
                <Link href={`/news/${article.slug}`} className="flex flex-col h-full p-4">
                  <div className="w-full h-56 bg-muted img-hover mb-6 relative">
                    {article.imageUrl ? (
                      <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full bg-secondary flex items-center justify-center"><Tv className="text-white/20" size={48} /></div>
                    )}
                  </div>
                  <div className="px-2 flex-1 flex flex-col">
                    <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground tracking-widest uppercase mb-3">
                      <span className="text-accent">{article.category}</span>
                      <span>•</span>
                      <span>{format(new Date(article.publishedAt), 'MMM dd, yyyy')}</span>
                    </div>
                    <h3 className="font-display font-bold text-2xl mb-4 text-foreground group-hover:text-primary transition-colors leading-tight">
                      {article.title}
                    </h3>
                    <p className="text-muted-foreground mb-6 flex-1 line-clamp-3">
                      {article.excerpt || "Read more about our latest developments and news."}
                    </p>
                    <span className="text-primary font-bold flex items-center group-hover:text-accent transition-colors mt-auto">
                      Read Article <ArrowRight size={16} className="ml-2" />
                    </span>
                  </div>
                </Link>
              </div>
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
    </div>
  );
}
