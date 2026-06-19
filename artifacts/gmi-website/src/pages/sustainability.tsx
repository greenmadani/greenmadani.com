import { ChevronRight, Download, Droplets, Leaf, Sprout } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useGetCompanyStats } from "@workspace/api-client-react";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function Sustainability() {
  const { data: stats } = useGetCompanyStats();

  return (
    <div className="w-full pb-0 bg-white">
      {/* Page Hero */}
      <section className="bg-[#1A5C38] text-white pt-16 pb-32 relative border-b-4 border-[#C8960C] overflow-hidden">
        <AnimatedBackground />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center text-sm font-semibold tracking-wider uppercase text-white/60 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-[#C8960C]">Sustainability</span>
          </div>
          <div className="max-w-3xl">
            <span className="inline-block text-[#C8960C] font-semibold tracking-widest uppercase text-sm mb-4 border border-[#C8960C]/30 px-3 py-1 rounded-full bg-[#C8960C]/10">
              Our Commitment
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-extrabold mb-6 leading-tight">Growing Responsibly</h1>
            <p className="text-xl text-white/80 leading-relaxed">
              At GMI, we believe that true corporate success cannot be separated from environmental stewardship and community upliftment.
            </p>
          </div>
        </div>
      </section>

      {/* Intro Stats */}
      <section className="relative -mt-16 z-20">
        <div className="container mx-auto px-4">
          <div className="bg-white shadow-xl border-t-4 border-[#C8960C] p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center md:text-left border-b md:border-b-0 md:border-r border-gray-100 pb-8 md:pb-0 md:pr-8">
              <div className="text-5xl font-display font-bold text-[#1A5C38] mb-2">{stats?.farmerServed?.toLocaleString() || "10,000"}+</div>
              <div className="text-sm font-bold uppercase tracking-widest text-gray-500">Farmers Empowered</div>
            </div>
            <div className="text-center md:text-left border-b md:border-b-0 md:border-r border-gray-100 pb-8 md:pb-0 md:pr-8 md:pl-4">
              <div className="text-5xl font-display font-bold text-[#1A5C38] mb-2">50k+</div>
              <div className="text-sm font-bold uppercase tracking-widest text-gray-500">Trees Planted</div>
            </div>
            <div className="text-center md:text-left md:pl-4">
              <div className="text-5xl font-display font-bold text-[#1A5C38] mb-2">100%</div>
              <div className="text-sm font-bold uppercase tracking-widest text-gray-500">Ethical Sourcing</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-[#1A1A1A]">Our Three Pillars of Impact</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-[#EEF4F0] p-10 group hover:bg-[#1A5C38] transition-colors duration-500">
              <Leaf size={48} className="text-[#1A5C38] mb-6 group-hover:text-[#C8960C] transition-colors" />
              <h3 className="text-2xl font-display font-bold text-[#1A1A1A] mb-4 group-hover:text-white transition-colors">Sustainable Agriculture</h3>
              <p className="text-gray-600 group-hover:text-white/80 transition-colors leading-relaxed">
                Promoting farming techniques that conserve water, reduce chemical dependency, and improve soil health for long-term yield.
              </p>
            </div>
            
            <div className="bg-[#EEF4F0] p-10 group hover:bg-[#1A5C38] transition-colors duration-500">
              <Sprout size={48} className="text-[#1A5C38] mb-6 group-hover:text-[#C8960C] transition-colors" />
              <h3 className="text-2xl font-display font-bold text-[#1A1A1A] mb-4 group-hover:text-white transition-colors">Farmer Development</h3>
              <p className="text-gray-600 group-hover:text-white/80 transition-colors leading-relaxed">
                Providing education, fair pricing, and direct market access to ensure farming communities thrive alongside our business.
              </p>
            </div>

            <div className="bg-[#EEF4F0] p-10 group hover:bg-[#1A5C38] transition-colors duration-500">
              <Droplets size={48} className="text-[#1A5C38] mb-6 group-hover:text-[#C8960C] transition-colors" />
              <h3 className="text-2xl font-display font-bold text-[#1A1A1A] mb-4 group-hover:text-white transition-colors">Environmental Responsibility</h3>
              <p className="text-gray-600 group-hover:text-white/80 transition-colors leading-relaxed">
                Reducing water consumption by 30% across manufacturing facilities and transitioning to eco-friendly packaging materials.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Download Report */}
      <section className="py-24 bg-[#F9F7F2] border-t border-gray-200">
        <div className="container mx-auto px-4 text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-[#1A1A1A] mb-6">Transparency in Action</h2>
          <p className="text-lg text-gray-600 mb-10">
            We hold ourselves accountable. Read our detailed annual sustainability report outlining our goals, progress, and areas for improvement.
          </p>
          <Button className="bg-[#C8960C] text-[#1A1A1A] hover:bg-[#a87d0a] rounded-none px-8 py-6 font-bold text-lg">
            <Download className="mr-2" size={20} /> Download 2025 Sustainability Report
          </Button>
          <p className="text-xs text-gray-400 mt-4 uppercase tracking-widest">PDF format, 4.2 MB</p>
        </div>
      </section>
    </div>
  );
}
