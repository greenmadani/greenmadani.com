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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-stagger">
            {subsidiaries.map((sub, i) => (
              <Link key={i} href={`/businesses/${sub.slug}`} className="group block">
                <div className="h-full flex flex-col bg-white border border-border shadow-sm hover:shadow-xl transition-all duration-500 ease-out overflow-hidden">
                  <div className="relative h-44 overflow-hidden group" style={{ transform: 'translateZ(0)' }}>
                    <img
                      src={sub.image}
                      alt={sub.name}
                      className="w-full h-full object-cover transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105"
                      style={{ willChange: 'transform' }}
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]" />
                    <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider px-3 py-1 z-10">
                      {sub.industry}
                    </span>
                    <div className="absolute bottom-3 left-3 right-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]">
                      <span className="text-white/90 text-xs font-medium tracking-wide bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full inline-block">
                        Explore {sub.name}
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-3 bg-white/20 backdrop-blur-md text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]">
                      <ArrowUpRight size={16} />
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="font-display text-foreground mb-2 group-hover:text-primary transition-colors">{sub.name}</h3>
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
