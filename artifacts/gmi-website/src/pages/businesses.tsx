import { Link } from "wouter";
import { useListBusinesses, getListBusinessesQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHero } from "@/components/page-hero";
import { SectionHeader } from "@/components/section-header";
import { AnimatedSection } from "@/components/animated-section";

export default function Businesses() {
  const { data: businesses, isLoading } = useListBusinesses(undefined, {
    query: { queryKey: getListBusinessesQueryKey() }
  });

  return (
    <div className="w-full pb-24 bg-background">
      <PageHero
        title="Our Business Portfolio"
        subtitle="12 distinct subsidiaries working together to create value across diverse industries."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Businesses", href: "/businesses" }
        ]}
      />

      {/* Featured Businesses (First 6) */}
      <AnimatedSection animation="fade-up">
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 animate-stagger">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col bg-white border border-border shadow-sm">
                  <Skeleton className="w-full h-48" />
                  <div className="p-6">
                    <Skeleton className="w-32 h-6 mb-4" />
                    <Skeleton className="w-3/4 h-8 mb-4" />
                    <Skeleton className="w-full h-4 mb-2" />
                    <Skeleton className="w-full h-4 mb-6" />
                  </div>
                </div>
              ))
            ) : businesses?.slice(0, 6).map((business) => (
              <Link key={business.id} href={`/businesses/${business.slug}`} className="group">
                <div className="h-full flex flex-col bg-white border border-border card-hover overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    {business.imageUrl ? (
                      <img src={business.imageUrl} alt={business.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-2xl">GMI</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider px-3 py-1 z-10">
                      {business.industry}
                    </span>
                  </div>
                  <div className="p-6 flex flex-col items-center text-center flex-1">
                    <h3 className="font-display text-foreground mb-2 group-hover:text-primary transition-colors">{business.name}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed flex-1 line-clamp-3">{business.description}</p>
                    <span className="mt-5 text-xs font-semibold tracking-widest uppercase text-primary/60 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300">
                      Learn More →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      </AnimatedSection>

      {/* All Businesses Grid */}
      <AnimatedSection animation="fade-up" delay={100}>
      <section className="py-24 bg-white border-t border-border">
        <div className="container mx-auto px-4">
          <SectionHeader title="Complete Portfolio" align="center" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 animate-stagger">
            {isLoading ? null : businesses?.map((business) => (
              <Link key={business.id} href={`/businesses/${business.slug}`} className="group">
                <div className="h-full flex flex-col bg-white border border-border card-hover overflow-hidden">
                  <div className="relative h-36 overflow-hidden">
                    {business.imageUrl ? (
                      <img src={business.imageUrl} alt={business.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg">GMI</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <span className="absolute top-2 left-2 bg-accent text-accent-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 z-10">
                      {business.industry}
                    </span>
                  </div>
                  <div className="p-4 flex flex-col items-center text-center flex-1">
                    <h4 className="font-display text-foreground text-sm mb-1 group-hover:text-primary transition-colors">{business.name}</h4>
                    <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">{business.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      </AnimatedSection>
    </div>
  );
}
