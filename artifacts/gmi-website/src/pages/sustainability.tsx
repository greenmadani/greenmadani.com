import { Download, Droplets, Leaf, Sprout } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetCompanyStats } from "@workspace/api-client-react";
import { PageHero } from "@/components/page-hero";
import { SectionHeader } from "@/components/section-header";
import { AnimatedSection } from "@/components/animated-section";

export default function Sustainability() {
  const { data: stats } = useGetCompanyStats();

  return (
    <div className="w-full pb-0 bg-white">
      <PageHero
        title="Growing Responsibly"
        subtitle="At GMI, we believe that true corporate success cannot be separated from environmental stewardship and community upliftment."
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
          <div className="bg-white shadow-xl border-t-4 border-accent p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center md:text-left border-b md:border-b-0 md:border-r border-gray-100 pb-8 md:pb-0 md:pr-8 lift-hover">
              <div className="text-5xl font-bold text-primary mb-2">{stats?.farmerServed?.toLocaleString() || "10,000"}+</div>
              <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Farmers Empowered</div>
            </div>
            <div className="text-center md:text-left border-b md:border-b-0 md:border-r border-gray-100 pb-8 md:pb-0 md:pr-8 md:pl-4 lift-hover">
              <div className="text-5xl font-bold text-primary mb-2">50k+</div>
              <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Trees Planted</div>
            </div>
            <div className="text-center md:text-left md:pl-4 lift-hover">
              <div className="text-5xl font-bold text-primary mb-2">100%</div>
              <div className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Ethical Sourcing</div>
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
            title="Our Three Pillars of Impact"
          />
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto animate-stagger">
            <div className="bg-muted p-10 group hover:bg-primary transition-colors duration-500 border border-border card-hover">
              <Leaf size={48} className="text-primary mb-6 group-hover:text-accent transition-colors" />
              <h3 className="font-display text-foreground mb-4 group-hover:text-white transition-colors">Sustainable Agriculture</h3>
              <p className="text-muted-foreground group-hover:text-white/80 transition-colors leading-relaxed">
                Promoting farming techniques that conserve water, reduce chemical dependency, and improve soil health for long-term yield.
              </p>
            </div>
            
            <div className="bg-muted p-10 group hover:bg-primary transition-colors duration-500 border border-border card-hover">
              <Sprout size={48} className="text-primary mb-6 group-hover:text-accent transition-colors" />
              <h3 className="font-display text-foreground mb-4 group-hover:text-white transition-colors">Farmer Development</h3>
              <p className="text-muted-foreground group-hover:text-white/80 transition-colors leading-relaxed">
                Providing education, fair pricing, and direct market access to ensure farming communities thrive alongside our business.
              </p>
            </div>

            <div className="bg-muted p-10 group hover:bg-primary transition-colors duration-500 border border-border card-hover">
              <Droplets size={48} className="text-primary mb-6 group-hover:text-accent transition-colors" />
              <h3 className="font-display text-foreground mb-4 group-hover:text-white transition-colors">Environmental Responsibility</h3>
              <p className="text-muted-foreground group-hover:text-white/80 transition-colors leading-relaxed">
                Reducing water consumption by 30% across manufacturing facilities and transitioning to eco-friendly packaging materials.
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
            title="Transparency in Action"
            description="We hold ourselves accountable. Read our detailed annual sustainability report outlining our goals, progress, and areas for improvement."
          />
          <Button variant="secondary" className="px-8 py-6 font-bold text-lg">
            <Download className="mr-2" size={20} /> Download 2025 Sustainability Report
          </Button>
          <p className="text-xs text-gray-400 mt-4 uppercase tracking-widest">PDF format, 4.2 MB</p>
        </div>
      </section>
      </AnimatedSection>
    </div>
  );
}
