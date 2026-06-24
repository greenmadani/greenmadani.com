import { Award, Leaf, Users, Cog, Handshake } from "lucide-react";
import AnimatedBackground from "@/components/AnimatedBackground";
import { PageHero } from "@/components/page-hero";
import { SectionHeader } from "@/components/section-header";
import { AnimatedSection } from "@/components/animated-section";

export default function About() {
  return (
    <div className="w-full pb-24">
      <PageHero
        title="About Green Madani International"
        subtitle="Building Bangladesh's most diversified industrial group — from agriculture to innovation, healthcare to hospitality."
        badge="Our Story"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About Us", href: "/about" }
        ]}
      />

      {/* Company Story */}
      <AnimatedSection animation="fade-in">
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <SectionHeader badge="Our Heritage" title="A Decade of Diversified Growth" />
            <div className="space-y-6 text-muted-foreground text-lg leading-relaxed text-left">
              <p>
                Green Madani International Private Ltd. was founded with a vision to transform Bangladesh's agricultural and industrial landscape. Under the leadership of Founder & Managing Director Md. Rejaul Karim Majumder, the group quickly expanded beyond agriculture into food, healthcare, hospitality, education, and media.
              </p>
              <p>
                Today, GMI operates 12 fully integrated business verticals, connecting farmers, manufacturers, and consumers through a seamless farm-to-shelf supply chain. Our in-house R&D center continuously develops new, safer agricultural solutions using American formulas — while our media arm and education institutions support the entire group through internal marketing and a steady talent pipeline.
              </p>
              <p>
                With a presence in 42 districts and an ambitious 2030 roadmap, GMI is steadily building toward becoming an internationally recognized, top-tier diversified group — one rooted in Bangladeshi soil but built for the world.
              </p>
            </div>
          </div>
        </div>
      </section>
      </AnimatedSection>

      {/* Vision & Mission */}
      <AnimatedSection animation="fade-up">
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-12 border-t-4 border-primary shadow-sm">
              <h3 className="font-display text-primary mb-4 uppercase tracking-wide">Our Vision</h3>
              <p className="text-xl text-muted-foreground font-medium leading-relaxed italic">
                "To become Bangladesh's most diversified industrial group by 2030, while establishing a strong presence in international markets through innovation, sustainability, and integrated business excellence."
              </p>
            </div>
            <div className="bg-white p-12 border-t-4 border-accent shadow-sm">
              <h3 className="font-display text-accent mb-4 uppercase tracking-wide">Our Mission</h3>
              <p className="text-xl text-muted-foreground font-medium leading-relaxed italic">
                "To deliver quality, innovation, and large-scale employment across all 12 of our business verticals — building a better Bangladesh through ethical, sustainable, and technology-driven growth."
              </p>
            </div>
          </div>
        </div>
      </section>
      </AnimatedSection>

      {/* Core Values */}
      <AnimatedSection animation="fade-up">
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <SectionHeader title="Our Core Values" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 animate-stagger">
            {[
              { icon: Award, title: "Quality", desc: "We never compromise on the standards of our products and services." },
              { icon: Cog, title: "Innovation", desc: "We invest in R&D and modern technology to lead, not follow, our industries." },
              { icon: Handshake, title: "Integrity", desc: "We build every relationship — with farmers, partners, and customers — on trust and transparency." },
              { icon: Leaf, title: "Sustainability", desc: "We are committed to safe soil, healthy ecosystems, and zero harmful chemicals." },
              { icon: Users, title: "Customer Focus", desc: "Every decision we make starts with the people we serve." }
            ].map((value, i) => {
              const Icon = value.icon;
              return (
                <div key={i} className="bg-background p-8 text-center border border-border card-hover">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <Icon size={28} className="text-primary" />
                  </div>
                  <h4 className="font-display mb-3 text-foreground">{value.title}</h4>
                  <p className="text-muted-foreground text-sm">{value.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      </AnimatedSection>

      {/* Founder's Message */}
      <AnimatedSection animation="fade-in">
      <section className="py-24 bg-secondary text-white border-y-4 border-accent overflow-hidden relative">
        <AnimatedBackground />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <SectionHeader badge="Leadership" title="Founder's Message" className="[&_h2]:text-white" />
          </div>
          <div className="max-w-5xl mx-auto grid md:grid-cols-5 gap-12 items-center">
            <div className="md:col-span-2 flex justify-center">
              <div className="w-72 h-72 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-accent/30 shadow-xl">
                <img
                  src="/images/Founder-of-Green-Universe-Ltd.jpg"
                  alt="Md. Rejaul Karim Majumder"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="md:col-span-3 space-y-6">
              <div className="relative">
                <span className="text-6xl text-accent/20 font-serif absolute -top-4 -left-2 leading-none">"</span>
                <p className="text-lg text-white/80 leading-relaxed relative z-10">
                  Green Madani International was founded with a clear purpose — to build a business that creates value for people, society, and the environment. As Bangladesh grows, challenges like unsafe food, lack of pure water, and limited access to quality services remain. Our goal is to address these challenges through responsible, sustainable, and ethical business practices.
                </p>
              </div>
              <p className="text-lg text-white/80 leading-relaxed">
                We focus on quality, safety, and long-term growth across our diverse business sectors. With integrity, innovation, and a people-first mindset, we are committed to building a greener, healthier, and more sustainable future for Bangladesh.
              </p>
              <div className="pt-4 border-t border-white/10">
                <p className="font-display text-accent text-xl">Md. Rejaul Karim Majumder</p>
                <p className="text-white/60 text-sm font-semibold tracking-wider uppercase">Founder and Managing Director</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      </AnimatedSection>

      {/* Timeline */}
      <AnimatedSection animation="fade-up">
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <SectionHeader title="Our Journey" />
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="relative border-l-4 border-primary/20 pl-8 ml-4 md:ml-0 md:pl-0 md:border-l-0 space-y-12">
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-primary/20 -translate-x-1/2"></div>
              
              {[
                { year: "2018", title: "Foundation", desc: "Green Madani International was founded, beginning operations in the agricultural sector." },
                { year: "2020", title: "Expansion into Food", desc: "Launched GMI Essential Food & Consumer, extending the farm-to-shelf model." },
                { year: "2022", title: "Diversification", desc: "Expanded into healthcare, hospitality, and education verticals." },
                { year: "2024", title: "Nationwide Network", desc: "Reached active operations across 42 districts with a growing distribution network." },
                { year: "2026", title: "Integrated Excellence", desc: "Green Madani International achieves full vertical integration across all 12 business verticals, with a growing presence in international markets." }
              ].map((milestone, i) => (
                <div key={i} className={`relative flex flex-col md:flex-row items-center justify-between ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  <div className="hidden md:block w-1/2"></div>
                  <div className="absolute left-[-42px] md:left-1/2 md:-translate-x-1/2 w-8 h-8 rounded-full bg-primary border-4 border-white flex items-center justify-center z-10 shadow-sm">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                  </div>
                  <div className={`w-full md:w-5/12 bg-background p-6 border border-border shadow-sm ${i % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                    <span className="text-3xl font-extrabold text-accent mb-2 block">{milestone.year}</span>
                    <h4 className="text-foreground mb-2">{milestone.title}</h4>
                    <p className="text-muted-foreground">{milestone.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      </AnimatedSection>
    </div>
  );
}
