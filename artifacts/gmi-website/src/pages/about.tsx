import { motion } from "framer-motion";
import { Link } from "wouter";
import { ChevronRight, Award, FlaskConical, ShieldCheck, Leaf, Users, UserCircle2 } from "lucide-react";

export default function About() {
  return (
    <div className="w-full pb-24">
      {/* Page Hero */}
      <section className="bg-[#1A5C38] text-white pt-16 pb-24 islamic-pattern-overlay relative border-b-4 border-[#C8960C]">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center text-sm font-semibold tracking-wider uppercase text-white/60 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-[#C8960C]">About Us</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-extrabold mb-6">About GMI</h1>
          <p className="text-xl text-white/80 max-w-2xl leading-relaxed">
            A diversified business conglomerate driving sustainable growth and community empowerment.
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <span className="text-[#C8960C] font-bold tracking-widest uppercase text-sm mb-4 block">Our Heritage</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-[#1A1A1A] mb-8">
              Rooted in Values, Growing with Purpose
            </h2>
            <div className="space-y-6 text-gray-600 text-lg leading-relaxed text-left">
              <p>
                Founded originally as Green Universe Group, our journey began with a simple mission: to empower local farmers and provide high-quality agricultural solutions. Recognizing the need for sustainable, ethical business practices across multiple sectors, we rebranded to Green Madani International Private Ltd. (GMI).
              </p>
              <p>
                The word "Madani" reflects our commitment to ethical, community-focused development rooted in Islamic heritage. We operate with a deep sense of responsibility towards our people, our nation, and our environment.
              </p>
              <p>
                Today, GMI stands as a rapidly expanding conglomerate spanning 12 distinct subsidiaries — from essential food and beverages to healthcare, education, and fashion. While our portfolio is diverse, our core philosophy remains unchanged: delivering excellence while building a better future for generations to come.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-[#EEF4F0]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="bg-white p-12 border-t-4 border-[#1A5C38] shadow-sm">
              <h3 className="text-2xl font-display font-bold text-[#1A5C38] mb-4 uppercase tracking-wide">Our Vision</h3>
              <p className="text-xl text-gray-700 font-medium leading-relaxed italic">
                "To be a globally recognized leader in sustainable agriculture and diversified business solutions, setting the benchmark for ethical corporate growth."
              </p>
            </div>
            <div className="bg-white p-12 border-t-4 border-[#C8960C] shadow-sm">
              <h3 className="text-2xl font-display font-bold text-[#C8960C] mb-4 uppercase tracking-wide">Our Mission</h3>
              <p className="text-xl text-gray-700 font-medium leading-relaxed italic">
                "To deliver innovative, high-quality products and services that uplift communities, empower farmers, and create lasting value for all stakeholders."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-[#1A1A1A]">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { icon: Award, title: "Quality", desc: "Uncompromising standards in every product and service." },
              { icon: FlaskConical, title: "Innovation", desc: "Pioneering solutions for tomorrow's challenges." },
              { icon: ShieldCheck, title: "Integrity", desc: "Transparent, honest, and ethical business practices." },
              { icon: Leaf, title: "Sustainability", desc: "Protecting our environment and resources." },
              { icon: Users, title: "Customer Focus", desc: "Putting our customers and community first." }
            ].map((value, i) => {
              const Icon = value.icon;
              return (
                <div key={i} className="bg-[#F9F7F2] p-8 text-center border border-gray-100 hover:border-[#1A5C38] transition-colors">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                    <Icon size={28} className="text-[#1A5C38]" />
                  </div>
                  <h4 className="font-display font-bold text-lg mb-3 text-[#1A1A1A]">{value.title}</h4>
                  <p className="text-gray-600 text-sm">{value.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-24 bg-[#0D3D25] text-white islamic-pattern-overlay border-y-4 border-[#C8960C]">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <span className="text-[#C8960C] font-bold tracking-widest uppercase text-sm mb-4 block">Our Team</span>
            <h2 className="text-4xl font-display font-bold text-white">Leadership</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: "Abdullah Al Mahmud", title: "Chairman & Founder" },
              { name: "Dr. Hasan Rahman", title: "Managing Director" },
              { name: "Syed Tariqul Islam", title: "Chief Operations Officer" }
            ].map((leader, i) => (
              <div key={i} className="bg-white/5 border border-white/10 p-8 text-center backdrop-blur">
                <div className="w-32 h-32 bg-[#1A5C38] rounded-full mx-auto mb-6 flex items-center justify-center border-4 border-[#C8960C]/30 overflow-hidden">
                  <UserCircle2 size={64} className="text-white/50" />
                </div>
                <h4 className="font-display font-bold text-xl mb-1 text-[#C8960C]">{leader.name}</h4>
                <p className="text-white/70 text-sm font-semibold tracking-wider uppercase">{leader.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-[#1A1A1A]">Our Journey</h2>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="relative border-l-4 border-[#1A5C38]/20 pl-8 ml-4 md:ml-0 md:pl-0 md:border-l-0 space-y-12">
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-[#1A5C38]/20 -translate-x-1/2"></div>
              
              {[
                { year: "2018", title: "Founded", desc: "Established as Green Universe Group focusing on agriculture." },
                { year: "2020", title: "First 100 Products", desc: "Expanded agricultural inputs and launched consumer foods." },
                { year: "2022", title: "Expanded to 6 Subsidiaries", desc: "Entered fashion, beauty, and beverage sectors." },
                { year: "2024", title: "Rebranded to GMI", desc: "Unified under Green Madani International Private Ltd." },
                { year: "2026", title: "12 Subsidiaries & Global Reach", desc: "Full conglomerate status with international export operations." }
              ].map((milestone, i) => (
                <div key={i} className={`relative flex flex-col md:flex-row items-center justify-between ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  <div className="hidden md:block w-1/2"></div>
                  <div className="absolute left-[-42px] md:left-1/2 md:-translate-x-1/2 w-8 h-8 rounded-full bg-[#1A5C38] border-4 border-white flex items-center justify-center z-10 shadow-sm">
                    <div className="w-2 h-2 bg-[#C8960C] rounded-full"></div>
                  </div>
                  <div className={`w-full md:w-5/12 bg-[#F9F7F2] p-6 border border-gray-100 shadow-sm ${i % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                    <span className="text-3xl font-display font-extrabold text-[#C8960C] mb-2 block">{milestone.year}</span>
                    <h4 className="font-bold text-xl text-[#1A1A1A] mb-2">{milestone.title}</h4>
                    <p className="text-gray-600">{milestone.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
