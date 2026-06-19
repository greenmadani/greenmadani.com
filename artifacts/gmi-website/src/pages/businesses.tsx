import { ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { useListBusinesses, getListBusinessesQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import AnimatedBackground from "@/components/AnimatedBackground";

export default function Businesses() {
  const { data: businesses, isLoading } = useListBusinesses(undefined, {
    query: { queryKey: getListBusinessesQueryKey() }
  });

  return (
    <div className="w-full pb-24 bg-[#F9F7F2]">
      {/* Page Hero */}
      <section className="bg-[#1A5C38] text-white pt-16 pb-24 relative border-b-4 border-[#C8960C] overflow-hidden">
        <AnimatedBackground />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center text-sm font-semibold tracking-wider uppercase text-white/60 mb-6">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-[#C8960C]">Businesses</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-display font-extrabold mb-6">Our Business Portfolio</h1>
          <p className="text-xl text-white/80 max-w-2xl leading-relaxed">
            12 distinct subsidiaries working together to create value across diverse industries.
          </p>
        </div>
      </section>

      {/* Featured Businesses (First 6) */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col bg-white border border-gray-100 shadow-sm">
                  <Skeleton className="w-full h-64 rounded-none" />
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
              <div key={business.id} className="flex flex-col bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                <div className="w-full h-64 bg-[#0D3D25] relative overflow-hidden">
                  {business.imageUrl ? (
                    <img src={business.imageUrl} alt={business.name} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#EEF4F0] text-[#1A5C38] font-display font-bold text-3xl">GMI</div>
                  )}
                  <div className="absolute top-4 left-4 bg-[#C8960C] text-[#1A1A1A] text-xs font-bold uppercase tracking-wider px-3 py-1">
                    {business.industry}
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-3xl font-display font-bold text-[#1A1A1A] mb-4">{business.name}</h3>
                  <p className="text-gray-600 mb-8 flex-1 text-lg">{business.description}</p>
                  <Link href={`/businesses/${business.slug}`}>
                    <Button className="w-max bg-[#1A5C38] hover:bg-[#0D3D25] text-white rounded-none font-bold">
                      Learn More <ArrowRight className="ml-2" size={16} />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Businesses Grid */}
      <section className="py-24 bg-white border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-[#1A1A1A]">Complete Portfolio</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {isLoading ? null : businesses?.map((business) => (
              <Link key={business.id} href={`/businesses/${business.slug}`}>
                <div className="bg-[#F9F7F2] p-8 border border-transparent hover:border-[#1A5C38] transition-all cursor-pointer h-full flex flex-col group">
                  <div className="text-[#C8960C] text-xs font-bold uppercase tracking-wider mb-4">{business.industry}</div>
                  <h4 className="text-xl font-display font-bold text-[#1A1A1A] mb-3 group-hover:text-[#1A5C38] transition-colors">{business.name}</h4>
                  <p className="text-gray-600 text-sm">{business.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
