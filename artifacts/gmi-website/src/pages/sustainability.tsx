import { Download, Droplets, Leaf, Tractor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHero } from "@/components/page-hero";
import { SectionHeader } from "@/components/section-header";
import { AnimatedSection } from "@/components/animated-section";

export default function Sustainability() {
  return (
    <div className="w-full pb-0 bg-white">
      <PageHero
        title="Growing Responsibly"
        subtitle="At GMI, sustainability isn't a department — it's the foundation of how we grow, produce, and distribute across every one of our 12 business verticals."
        badge="Our Commitment"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Sustainability", href: "/sustainability" }
        ]}
      />

      {/* Intro Stats */}
      <AnimatedSection animation="scale-in">
      <section className="relative -mt-16 z-20">
        <div className="container mx-auto px-4">
          <div className="bg-white shadow-xl border-t-4 border-accent p-4 md:p-8 grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center md:text-left border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0 md:pr-4 card-hover">
              <div className="text-5xl font-bold text-primary mb-2">42</div>
              <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Districts Covered</div>
            </div>
            <div className="text-center md:text-left border-b md:border-b-0 md:border-r border-gray-100 pb-4 md:pb-0 md:pr-4 md:pl-2 card-hover">
              <div className="text-5xl font-bold text-primary mb-2">70+</div>
              <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Seed Varieties</div>
            </div>
            <div className="text-center md:text-left md:pl-2 card-hover">
              <div className="text-5xl font-bold text-primary mb-2">100%</div>
              <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Safe Soil Commitment</div>
            </div>
          </div>
        </div>
      </section>
      </AnimatedSection>

      {/* Pillars */}
      <AnimatedSection animation="fade-up">
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
          <SectionHeader
            title="Our Three Pillars of Sustainability"
          />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto animate-stagger">
            <div className="bg-muted p-6 border border-border card-hover">
              <Leaf size={32} className="text-primary mb-3" />
              <h3 className="font-display text-foreground mb-2">Sustainable Agriculture</h3>
              <p className="text-muted-foreground leading-relaxed">
                We promote organic fertilizers and American-formula natural pesticides over harmful chemicals — protecting soil health for future generations.
              </p>
            </div>
            
            <div className="bg-muted p-6 border border-border card-hover">
              <Tractor size={32} className="text-primary mb-3" />
              <h3 className="font-display text-foreground mb-2">Farmer Development</h3>
              <p className="text-muted-foreground leading-relaxed">
                Through training, fair pricing, and direct market access, we empower farmers as true partners in our supply chain — not just suppliers.
              </p>
            </div>

            <div className="bg-muted p-6 border border-border card-hover">
              <Droplets size={32} className="text-primary mb-3" />
              <h3 className="font-display text-foreground mb-2">Environmental Responsibility</h3>
              <p className="text-muted-foreground leading-relaxed">
                From water-conscious farming practices to reduced chemical runoff, every GMI product is designed with environmental impact in mind.
              </p>
            </div>
          </div>
        </div>
      </section>
      </AnimatedSection>

      {/* Download Report */}
      <AnimatedSection animation="fade-up">
      <section className="py-24 bg-background border-t border-border">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <SectionHeader
            title="Our Sustainability Report"
            description="Learn more about our soil safety initiatives, farmer development programs, and environmental commitments across all 12 GMI verticals."
          />
          <Button variant="secondary" size="lg">
            <Download className="mr-2" size={20} /> Download Report
          </Button>
          <p className="text-xs text-gray-400 mt-4 uppercase tracking-widest">Report available in English and Bengali. Updated annually.</p>
        </div>
      </section>
      </AnimatedSection>
    </div>
  );
}
