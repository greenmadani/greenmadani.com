import { useState, useMemo } from "react";
import { Search, ShoppingBasket, ChevronDown } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useListProducts, useListProductCategories, getListProductsQueryKey, getListProductCategoriesQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHero } from "@/components/page-hero";
import { AnimatedSection } from "@/components/animated-section";

export default function Products() {
 const [location, navigate] = useLocation();
 const [searchQuery, setSearchQuery] = useState("");
 const [sidebarOpen, setSidebarOpen] = useState(false);

 const { data:categoriesData, isLoading:loadingCategories } = useListProductCategories({
 query:{ queryKey:getListProductCategoriesQueryKey() }
 });

 const allCategories = useMemo(() => {
  const base = categoriesData ?? [];
  return [{ name:"All", slug:"all", count:0 }, ...base];
 }, [categoriesData]);

 const activeSlug = useMemo(() => {
  const params = new URLSearchParams(location.split("?")[1] ?? "");
  const cat = params.get("category");
  if (cat && allCategories.some((c) => c.slug === cat)) return cat;
  return "all";
 }, [location, allCategories]);

 const { data:productsData, isLoading:loadingProducts } = useListProducts({
 category:activeSlug !== "all" ? activeSlug :undefined
 }, {
 query:{
 queryKey:getListProductsQueryKey({ category:activeSlug !== "all" ? activeSlug :undefined }),
 }
 });

 const filteredProducts = productsData?.items.filter(p =>
 p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
 p.description.toLowerCase().includes(searchQuery.toLowerCase())
 );

 function handleCategoryClick(slug: string) {
  setSidebarOpen(false);
  if (slug === "all") {
   navigate("/products", { replace: true });
  } else {
   navigate(`/products?category=${slug}`, { replace: true });
  }
 }

 return (
 <div className="w-full pb-24 bg-white">
 <PageHero
 title="Our Products"
 subtitle="Discover GMI's growing portfolio of 170+ products across agriculture, food, beverages, and more — all built on quality and innovation."
 breadcrumbs={[
 { label:"Home", href:"/" },
 { label:"Products", href:"/products" }
 ]}
 />

 <AnimatedSection animation="fade-up" delay={100}>
 <div className="container mx-auto px-4 py-16">
  <div className="flex gap-8">
   {/* Sidebar */}
   <aside className="hidden md:block w-56 shrink-0">
    <div className="sticky top-28 space-y-1">
     <h3 className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-3 px-3">Categories</h3>
     {loadingCategories ? (
      Array.from({ length:5 }).map((_, i) => <Skeleton key={i} className="h-9 w-full mb-1" />)
     ) :(
      allCategories.map((cat) => (
       <button
        key={cat.slug}
        onClick={() => handleCategoryClick(cat.slug)}
        className={`w-full text-left px-3 py-2 text-sm font-medium transition-colors duration-200 ${
         activeSlug === cat.slug
         ? "bg-primary text-white"
         : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
        }`}
       >
        <span className="flex items-center justify-between">
         <span>{cat.name}</span>
         {cat.slug !== "all" && <span className="text-xs opacity-60">({cat.count})</span>}
        </span>
       </button>
      ))
     )}
    </div>
   </aside>

   {/* Mobile sidebar toggle */}
   <div className="md:hidden w-full mb-4">
    <button
     onClick={() => setSidebarOpen(!sidebarOpen)}
     className="flex items-center gap-2 w-full px-4 py-3 border border-border bg-background text-sm font-semibold text-muted-foreground"
    >
     <span>Categories</span>
     <ChevronDown size={16} className={`ml-auto transition-transform ${sidebarOpen ? "rotate-180" : ""}`} />
    </button>
    {sidebarOpen && (
     <div className="border-x border-b border-border bg-background p-2 space-y-1">
      {allCategories.map((cat) => (
       <button
        key={cat.slug}
        onClick={() => handleCategoryClick(cat.slug)}
        className={`w-full text-left px-3 py-2 text-sm font-medium transition-colors ${
         activeSlug === cat.slug
         ? "bg-primary text-white"
         : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
        }`}
       >
        <span className="flex items-center justify-between">
         <span>{cat.name}</span>
         {cat.slug !== "all" && <span className="text-xs opacity-60">({cat.count})</span>}
        </span>
       </button>
      ))}
     </div>
    )}
   </div>

   {/* Main content */}
   <div className="flex-1 min-w-0">
    {/* Search */}
    <div className="relative max-w-md mb-8">
     <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
     <Input
      type="search"
      placeholder="Search products..."
      className="pl-12 bg-white border-border h-12 focus-visible:ring-primary"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
     />
    </div>

    {/* Grid */}
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-stagger">
     {loadingProducts ? (
      Array.from({ length:6 }).map((_, i) => (
       <div key={i} className="border border-border shadow-sm flex flex-col h-full">
        <Skeleton className="w-full h-56" />
        <div className="p-4">
         <Skeleton className="w-20 h-6 mb-3" />
         <Skeleton className="w-full h-6 mb-2" />
         <Skeleton className="w-2/3 h-4 mb-6" />
         <Skeleton className="w-full h-10" />
        </div>
       </div>
      ))
     ) :filteredProducts?.length === 0 ? (
      <div className="col-span-full py-20 text-center bg-background border border-dashed border-border">
       <ShoppingBasket size={48} className="mx-auto text-muted-foreground mb-4" />
       <h3 className="font-display text-muted-foreground">No products found</h3>
       <p className="text-muted-foreground mt-2">Try adjusting your search or filters.</p>
      </div>
     ) :(
      filteredProducts?.map((product) => (
       <div key={product.id} className="border border-border card-hover flex flex-col h-full group">
        <div className="w-full h-56 bg-muted img-hover relative">
         {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
         ) :(
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
           <ShoppingBasket size={48} className="opacity-20" />
          </div>
         )}
         <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider px-3 py-1 z-10">{product.category}</span>
        </div>
        <div className="p-3 flex-1 flex flex-col">
         <h3 className="font-display mb-1 text-foreground">{product.name}</h3>
         <p className="text-muted-foreground text-sm mb-3 flex-1 line-clamp-2">{product.description}</p>
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
 </div>
 </AnimatedSection>
 </div>
 );
}
