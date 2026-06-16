import { useState } from "react";
import { ChevronRight, ArrowRight, Tv } from "lucide-react";
import { Link } from "wouter";
import { useListNews, getListNewsQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
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
    <div className="w-full pb-24 bg-[#F9F7F2]">
      {/* Page Hero */}
      <section className="bg-[#1A5C38] text-white pt-16 pb-24 islamic-pattern-overlay relative border-b-4 border-[#C8960C]">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center text-sm font-semibold tracking-wider uppercase text-white/60 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-[#C8960C]">News & Insights</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-extrabold mb-6">News & Updates</h1>
          <p className="text-xl text-white/80 max-w-2xl leading-relaxed">
            Stay informed with the latest developments, events, and insights from across the GMI conglomerate.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-12">
          {categories.map(cat => (
            <Button
              key={cat}
              variant={activeCategory === cat ? "default" : "outline"}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-none font-bold ${
                activeCategory === cat 
                  ? "bg-[#1A5C38] text-white hover:bg-[#0D3D25]" 
                  : "bg-white border-gray-300 text-gray-600 hover:text-[#1A5C38] hover:border-[#1A5C38]"
              }`}
            >
              {cat}
            </Button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col h-full bg-white shadow-sm p-4">
                <Skeleton className="w-full h-56 rounded-none mb-4" />
                <Skeleton className="w-24 h-4 mb-3" />
                <Skeleton className="w-full h-8 mb-2" />
                <Skeleton className="w-full h-8 mb-4" />
                <Skeleton className="w-2/3 h-4" />
              </div>
            ))
          ) : newsData?.items.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-white border border-dashed border-gray-300">
              <h3 className="text-xl font-display font-bold text-gray-500">No articles found</h3>
              <p className="text-gray-400 mt-2">Try selecting a different category.</p>
            </div>
          ) : (
            newsData?.items.map((article) => (
              <div key={article.id} className="group cursor-pointer bg-white shadow-sm hover:shadow-md transition-shadow">
                <Link href={`/news/${article.slug}`} className="flex flex-col h-full p-4">
                  <div className="w-full h-56 bg-gray-100 overflow-hidden mb-6 relative">
                    {article.imageUrl ? (
                      <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full bg-[#0D3D25] flex items-center justify-center"><Tv className="text-white/20" size={48} /></div>
                    )}
                  </div>
                  <div className="px-2 flex-1 flex flex-col">
                    <div className="flex items-center gap-4 text-xs font-bold text-gray-500 tracking-widest uppercase mb-3">
                      <span className="text-[#C8960C]">{article.category}</span>
                      <span>•</span>
                      <span>{format(new Date(article.publishedAt), 'MMM dd, yyyy')}</span>
                    </div>
                    <h3 className="font-display font-bold text-2xl mb-4 text-[#1A1A1A] group-hover:text-[#1A5C38] transition-colors leading-tight">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 mb-6 flex-1 line-clamp-3">
                      {article.excerpt || "Read more about our latest developments and news."}
                    </p>
                    <span className="text-[#1A5C38] font-bold flex items-center group-hover:text-[#C8960C] transition-colors mt-auto">
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
            <Button variant="outline" className="border-[#1A5C38] text-[#1A5C38] rounded-none px-8 py-6 font-bold">
              Load More
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
