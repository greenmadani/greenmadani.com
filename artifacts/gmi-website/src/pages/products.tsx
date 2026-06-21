import { useState } from "react";
import { Search, Filter, ShoppingBasket } from "lucide-react";
import { Link } from "wouter";
import { useListProducts, useListProductCategories, getListProductsQueryKey, getListProductCategoriesQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHero } from "@/components/page-hero";

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
      <PageHero
        title="Our Products"
        subtitle="Premium quality products spanning agriculture, FMCG, skincare, and beyond."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" }
        ]}
      />

      <div className="container mx-auto px-4 py-16">
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center mb-12 bg-background p-6 border border-border">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <Input 
              type="search" 
              placeholder="Search products..." 
              className="pl-12 bg-white border-border h-12 focus-visible:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
            <Filter className="text-primary mr-2 shrink-0" size={20} />
            {loadingCategories ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="w-24 h-10 shrink-0" />)
            ) : (
              categories.map(cat => (
                <Button
                  key={cat.slug}
                  variant={activeCategory === cat.name ? "primary" : "outline"}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`shrink-0 font-semibold ${
                    activeCategory === cat.name 
                      ? "bg-primary text-white hover:bg-secondary" 
                      : "border-border text-muted-foreground hover:text-primary hover:border-primary"
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
              <div key={i} className="border border-border shadow-sm flex flex-col h-full">
                <Skeleton className="w-full h-56" />
                <div className="p-6">
                  <Skeleton className="w-20 h-6 mb-4" />
                  <Skeleton className="w-full h-6 mb-2" />
                  <Skeleton className="w-2/3 h-4 mb-6" />
                  <Skeleton className="w-full h-10" />
                </div>
              </div>
            ))
          ) : filteredProducts?.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-background border border-dashed border-border">
              <ShoppingBasket size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="font-display text-muted-foreground">No products found</h3>
              <p className="text-muted-foreground mt-2">Try adjusting your search or filters.</p>
            </div>
          ) : (
            filteredProducts?.map((product) => (
              <div key={product.id} className="border border-border card-hover flex flex-col h-full group">
                <div className="w-full h-56 bg-muted img-hover relative">
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      <ShoppingBasket size={48} className="opacity-20" />
                    </div>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <span className="inline-block text-accent font-semibold text-xs tracking-wider uppercase mb-3">
                    {product.category}
                  </span>
                  <h3 className="font-display mb-3 text-foreground group-hover:text-primary transition-colors">{product.name}</h3>
                  <p className="text-muted-foreground text-sm mb-6 flex-1 line-clamp-2">{product.description}</p>
                  <Link href={`/products/${product.id}`}>
                    <Button variant="outline" className="w-full font-bold">
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
