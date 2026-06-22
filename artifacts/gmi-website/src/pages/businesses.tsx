import { Link } from "wouter";
import { PageHero } from "@/components/page-hero";
import { SectionHeader } from "@/components/section-header";
import { AnimatedSection } from "@/components/animated-section";

const subsidiaries = [
  { name: "GMI Power Agro", image: "/images/businesses/gmi-power-agro.webp", slug: "gmi-power-agro", industry: "Agriculture", desc: "Hybrid seeds, organic fertilizers, and export-quality rice — powering Bangladesh's agricultural transformation with American-formula solutions." },
  { name: "GMI Essential Food & Consumer", image: "/images/businesses/gmi-essential-food-consumer.webp", slug: "gmi-essential-food-consumer", industry: "Food & FMCG", desc: "Rice, oil, flour, and packaged food essentials delivered through a fully integrated farm-to-shelf supply chain." },
  { name: "GMI Beverage", image: "/images/businesses/gmi-beverage.webp", slug: "gmi-beverage", industry: "Beverages", desc: "Pure drinking water, natural fruit juices, and healthy soft drinks crafted for everyday wellness." },
  { name: "GMI Hospital", image: "/images/businesses/gmi-hospital.webp", slug: "gmi-hospital", industry: "Healthcare", desc: "Multi-specialized and digital healthcare services bringing modern medical care closer to communities." },
  { name: "GMI Hotel & Resort", image: "/images/businesses/gmi-hotel-resort.webp", slug: "gmi-hotel-resort", industry: "Hospitality", desc: "Luxury city hotels and eco-friendly resorts offering premium hospitality experiences nationwide." },
  { name: "GMI Supermarket", image: "/images/businesses/gmi-supermarket.webp", slug: "gmi-supermarket", industry: "Retail", desc: "City-based chain supermarkets with online delivery, bringing GMI's farm-fresh products directly to customers." },
  { name: "GMI Tour & Travels", image: "/images/businesses/gmi-tour-travels.webp", slug: "gmi-tour-travels", industry: "Travel & Tourism", desc: "Hajj, Umrah, and domestic and international tour packages designed for comfort and trust." },
  { name: "GMI Education", image: "/images/businesses/gmi-education.webp", slug: "gmi-education", industry: "Education", desc: "Schools, vocational training centers, and online learning platforms building the workforce of tomorrow." },
  { name: "GMI Skin Care", image: "/images/businesses/gmi-skin-care.webp", slug: "gmi-skin-care", industry: "Beauty & Personal Care", desc: "Herbal, organic, and medical-grade skincare products formulated for natural beauty and wellness." },
  { name: "GMI Fashion House", image: "/images/businesses/gmi-fashion-house.webp", slug: "gmi-fashion-house", industry: "Apparel & Fashion", desc: "Export-quality garments for men, women, and children — combining comfort, style, and sustainability." },
  { name: "GMI News & Media", image: "/images/businesses/gmi-news-media.webp", slug: "gmi-news-media", industry: "Media & Communications", desc: "Digital news portal and in-house brand promotion center powering zero-cost marketing across the group." },
  { name: "GMI R&D Center", image: "/images/businesses/gmi-rd-center.webp", slug: "gmi-rd-center", industry: "Research & Development", desc: "The innovation engine behind GMI — developing new products and ensuring quality control across every vertical." },
];

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

      {/* Featured Businesses (First 6) */}
      <AnimatedSection animation="fade-up">
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 animate-stagger">
            {subsidiaries.slice(0, 6).map((sub, i) => (
              <Link key={i} href={`/businesses/${sub.slug}`} className="group">
                <div className="h-full flex flex-col bg-white border border-border card-hover overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <img src={sub.image} alt={sub.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <span className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider px-3 py-1 z-10">
                      {sub.industry}
                    </span>
                  </div>
                  <div className="p-6 flex flex-col items-center text-center flex-1">
                    <h3 className="font-display text-foreground mb-2 group-hover:text-primary transition-colors">{sub.name}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed flex-1">{sub.desc}</p>
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
            {subsidiaries.map((sub, i) => (
              <Link key={i} href={`/businesses/${sub.slug}`} className="group">
                <div className="h-full flex flex-col bg-white border border-border card-hover overflow-hidden">
                  <div className="relative h-36 overflow-hidden">
                    <img src={sub.image} alt={sub.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <span className="absolute top-2 left-2 bg-accent text-accent-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 z-10">
                      {sub.industry}
                    </span>
                  </div>
                  <div className="p-4 flex flex-col items-center text-center flex-1">
                    <h4 className="font-display text-foreground text-sm mb-1 group-hover:text-primary transition-colors">{sub.name}</h4>
                    <p className="text-muted-foreground text-xs leading-relaxed line-clamp-2">{sub.desc}</p>
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
