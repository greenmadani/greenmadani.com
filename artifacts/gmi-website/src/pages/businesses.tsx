import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { useListBusinesses, getListBusinessesQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
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
                  <Skeleton className="w-full h-64" />
                  <div className="p-8">
                    <Skeleton className="w-32 h-6 mb-4" />
                    <Skeleton className="w-3/4 h-8 mb-4" />
                    <Skeleton className="w-full h-4 mb-2" />
                    <Skeleton className="w-full h-4 mb-6" />
                    <Skeleton className="w-40 h-10" />
                  </div>
                </div>
              ))
            ) : businesses?.slice(0, 6).map((business) => (
              <div key={business.id} className="flex flex-col bg-white border border-border card-hover group">
                <div className="w-full h-64 bg-secondary relative img-hover">
                  {business.imageUrl ? (
                    <img src={business.imageUrl} alt={business.name} className="w-full h-full object-cover opacity-80" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-muted text-primary font-bold text-3xl">GMI</div>
                  )}
                  <div className="absolute top-4 left-4 bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider px-3 py-1">
                    {business.industry}
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="font-display text-foreground mb-4">{business.name}</h3>
                  <p className="text-muted-foreground mb-8 flex-1 text-lg">{business.description}</p>
                  <Link href={`/businesses/${business.slug}`}>
                    <Button variant="secondary">
                      Learn More <ArrowRight className="ml-2" size={16} />
                    </Button>
                  </Link>
                </div>
              </div>
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-stagger">
            {isLoading ? null : businesses?.map((business) => (
              <Link key={business.id} href={`/businesses/${business.slug}`}>
                <div className="bg-background p-8 border border-border card-hover h-full flex flex-col group">
                  <div className="text-accent text-xs font-bold uppercase tracking-wider mb-4">{business.industry}</div>
                  <h4 className="font-display text-foreground mb-3 group-hover:text-primary transition-colors">{business.name}</h4>
                  <p className="text-muted-foreground text-sm">{business.description}</p>
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
