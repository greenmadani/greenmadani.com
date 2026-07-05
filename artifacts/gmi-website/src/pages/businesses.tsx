import { ArrowUpRight, Building2 } from "lucide-react";
import { Link } from "wouter";
import { PageHero } from "@/components/page-hero";
import { AnimatedSection } from "@/components/animated-section";
import { Skeleton } from "@/components/ui/skeleton";
import { useBusinessesList } from "@/lib/businesses";

export default function Businesses() {
 const { data: businesses, isLoading } = useBusinessesList();

 return (
 <div className="w-full pb-24 bg-background">
 <PageHero
 title="Our Business Portfolio"
 subtitle={`${businesses?.length ?? 12} distinct subsidiaries working together to create value across diverse industries.`}
 breadcrumbs={[
 { label:"Home", href:"/" },
 { label:"Businesses", href:"/businesses" }
 ]}
 />

 <AnimatedSection animation="fade-up">
 <section className="py-24">
 <div className="container mx-auto px-4">
 <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 animate-stagger">
 {isLoading ? (
 Array.from({ length: 8 }).map((_, i) => (
 <div key={i} className="h-full flex flex-col bg-white border border-border shadow-sm overflow-hidden">
  <Skeleton className="aspect-[3/2] w-full" />
 <div className="p-3 space-y-2">
 <Skeleton className="h-5 w-3/4" />
 <Skeleton className="h-4 w-full" />
 </div>
 </div>
 ))
 ) : businesses?.length === 0 ? (
 <div className="col-span-full py-20 text-center bg-background border border-dashed border-border">
 <Building2 size={48} className="mx-auto text-muted-foreground mb-4" />
 <h3 className="font-display text-muted-foreground">No businesses found</h3>
 </div>
 ) : (
 businesses?.map((sub) => (
 <Link key={sub.slug} href={`/businesses/${sub.slug}`} className="group block">
 <div className="h-full flex flex-col bg-white border border-border shadow-sm card-hover overflow-hidden">
  <div className="relative aspect-[3/2] overflow-hidden img-hover" style={{ transform:'translateZ(0)' }}>
 <img
 src={sub.imageUrl ?? "/images/businesses/placeholder.svg"}
 alt={sub.name}
 className="w-full h-full object-cover"
 style={{ willChange:'transform' }}
 loading="lazy"
 />
 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
 <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider px-3 py-1 z-10">
 {sub.industry}
 </span>
 <div className="absolute bottom-3 left-3 right-3">
 <span className="text-white/90 text-xs font-medium tracking-wide bg-black/40 backdrop-blur-sm px-3 py-1.5 inline-block">
 Explore {sub.name}
 </span>
 </div>
 <div className="absolute bottom-3 right-3 bg-white/20 backdrop-blur-md text-white p-1.5">
 <ArrowUpRight size={16} />
 </div>
 </div>
 <div className="p-3 flex flex-col flex-1">
 <h3 className="font-display text-foreground mb-1">{sub.name}</h3>
 <p className="text-muted-foreground text-sm leading-relaxed flex-1">{sub.description}</p>
 </div>
 </div>
 </Link>
 ))
 )}
 </div>
 </div>
 </section>
 </AnimatedSection>
 </div>
 );
}
