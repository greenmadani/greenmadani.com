import { useState } from "react";
import { ChevronRight, Search, Filter, ShoppingBasket } from "lucide-react";
import { Link } from "wouter";
import { useListProducts, useListProductCategories, getListProductsQueryKey, getListProductCategoriesQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

export default function Products() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: categoriesData, isLoading: loadingCategories } = useListProductCategories({
    query: { queryKey: getListProductCategoriesQueryKey() }
  });
  
  const categories = categoriesData ? [{ name: "All", slug: "all", count: 0 }, ...categoriesData] : [{ name: "All", slug: "all", count: 0 }];

  const { data: productsData, isLoading: loadingProducts } = useListProducts({ 
    category: activeCategory !== "All" ? activeCategory : undefined
  }, {
    query: { 
      queryKey: getListProductsQueryKey({ category: activeCategory !== "All" ? activeCategory : undefined }),
    }
  });

  const filteredProducts = productsData?.items.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full pb-24 bg-white">
      {/* Page Hero */}
      <section className="bg-[#1A5C38] text-white pt-16 pb-24 islamic-pattern-overlay relative border-b-4 border-[#C8960C]">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center text-sm font-semibold tracking-wider uppercase text-white/60 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-[#C8960C]">Products</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-extrabold mb-6">Our Products</h1>
          <p className="text-xl text-white/80 max-w-2xl leading-relaxed">
            Premium quality products spanning agriculture, FMCG, skincare, and beyond.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center mb-12 bg-[#F9F7F2] p-6 rounded-sm border border-gray-100">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <Input 
              type="search" 
              placeholder="Search products..." 
              className="pl-12 bg-white border-gray-300 rounded-none h-12 focus-visible:ring-[#1A5C38]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
            <Filter className="text-[#1A5C38] mr-2 shrink-0" size={20} />
            {loadingCategories ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="w-24 h-10 rounded-none shrink-0" />)
            ) : (
              categories.map(cat => (
                <Button
                  key={cat.slug}
                  variant={activeCategory === cat.name ? "default" : "outline"}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`rounded-none shrink-0 font-semibold ${
                    activeCategory === cat.name 
                      ? "bg-[#1A5C38] text-white hover:bg-[#0D3D25]" 
                      : "border-gray-300 text-gray-600 hover:text-[#1A5C38] hover:border-[#1A5C38]"
                  }`}
                >
                  {cat.name}
                </Button>
              ))
            )}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {loadingProducts ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="border border-gray-100 shadow-sm flex flex-col h-full">
                <Skeleton className="w-full h-56 rounded-none" />
                <div className="p-6">
                  <Skeleton className="w-20 h-6 mb-4" />
                  <Skeleton className="w-full h-6 mb-2" />
                  <Skeleton className="w-2/3 h-4 mb-6" />
                  <Skeleton className="w-full h-10 rounded-none" />
                </div>
              </div>
            ))
          ) : filteredProducts?.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-[#F9F7F2] border border-dashed border-gray-300">
              <ShoppingBasket size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-display font-bold text-gray-500">No products found</h3>
              <p className="text-gray-400 mt-2">Try adjusting your search or filters.</p>
            </div>
          ) : (
            filteredProducts?.map((product) => (
              <div key={product.id} className="border border-gray-100 shadow-sm flex flex-col h-full group hover:shadow-md transition-shadow">
                <div className="w-full h-56 bg-[#EEF4F0] overflow-hidden relative">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <ShoppingBasket size={48} className="opacity-20" />
                    </div>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <span className="inline-block text-[#C8960C] font-semibold text-xs tracking-wider uppercase mb-3">
                    {product.category}
                  </span>
                  <h3 className="font-display font-bold text-xl mb-3 text-[#1A1A1A] group-hover:text-[#1A5C38] transition-colors">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-6 flex-1 line-clamp-2">{product.description}</p>
                  <Link href={`/products/${product.id}`}>
                    <Button variant="outline" className="w-full rounded-none border-gray-300 text-[#1A1A1A] hover:bg-[#1A5C38] hover:text-white hover:border-[#1A5C38] font-bold">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
