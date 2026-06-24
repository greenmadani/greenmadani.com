import { ArrowUpRight } from "lucide-react";
import { Link } from "wouter";
import { PageHero } from "@/components/page-hero";
import { AnimatedSection } from "@/components/animated-section";
import { subsidiaries } from "@/data/subsidiaries";

export default function Businesses() {
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

      <AnimatedSection animation="fade-up">
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 animate-stagger">
            {subsidiaries.map((sub, i) => (
              <Link key={i} href={`/businesses/${sub.slug}`} className="group block">
                <div className="h-full flex flex-col bg-white border border-border shadow-sm card-hover overflow-hidden">
                  <div className="relative h-40 overflow-hidden img-hover" style={{ transform: 'translateZ(0)' }}>
                    <img
                      src={sub.image}
                      alt={sub.name}
                      className="w-full h-full object-cover"
                      style={{ willChange: 'transform' }}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                    <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider px-3 py-1 z-10">
                      {sub.industry}
                    </span>
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="text-white/90 text-xs font-medium tracking-wide bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full inline-block">
                        Explore {sub.name}
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-white/20 backdrop-blur-md text-white p-1.5 rounded-full">
                      <ArrowUpRight size={16} />
                    </div>
                  </div>
                  <div className="p-3 flex flex-col flex-1">
                    <h3 className="font-display text-foreground mb-1">{sub.name}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed flex-1">{sub.desc}</p>
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
