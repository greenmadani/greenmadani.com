import { motion } from "framer-motion";
import { ArrowRight, Sprout, ShoppingBasket, Coffee, Sparkles, Shirt, Hotel, Plane, GraduationCap, Heart, Tv, FlaskConical, Store, Award, Leaf, MapPin, ArrowUpRight, Building2, Handshake } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useListBusinesses, useListProducts, useListNews, useGetCompanyStats, getListProductsQueryKey, getListNewsQueryKey } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

export default function Home() {
  const { data: stats } = useGetCompanyStats();
  
  const { data: productsData, isLoading: loadingProducts } = useListProducts({ featured: true, limit: 3 }, { query: { queryKey: getListProductsQueryKey({ featured: true, limit: 3 }) } });
  
  const { data: newsData, isLoading: loadingNews } = useListNews({ limit: 3 }, { query: { queryKey: getListNewsQueryKey({ limit: 3 }) } });

  const subsidiaries = [
    { name: "GMI Power Agro Ltd.", icon: Sprout, desc: "Agriculture Inputs & Solutions" },
    { name: "GMI Essential Food", icon: ShoppingBasket, desc: "Food & FMCG" },
    { name: "GMI Beverage Ltd.", icon: Coffee, desc: "Beverages" },
    { name: "GMI Skin Care Ltd.", icon: Sparkles, desc: "Beauty & Personal Care" },
    { name: "GMI Fashion House", icon: Shirt, desc: "Apparel & Fashion" },
    { name: "GMI Hotel & Restaurant", icon: Hotel, desc: "Hospitality" },
    { name: "GMI Tour & Travels", icon: Plane, desc: "Travel & Tourism" },
    { name: "GMI Education", icon: GraduationCap, desc: "Educational Services" },
    { name: "GMI Hospital", icon: Heart, desc: "Healthcare" },
    { name: "GMI Media", icon: Tv, desc: "Media & Communications" },
    { name: "GMI R&D", icon: FlaskConical, desc: "Research & Development" },
    { name: "GMI Super Shop", icon: Store, desc: "Retail" },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-[#1A5C38] text-white py-24 md:py-32 islamic-pattern-overlay relative overflow-hidden">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-block text-[#C8960C] font-semibold tracking-widest uppercase text-sm mb-6 border border-[#C8960C]/30 px-4 py-1.5 rounded-full bg-[#C8960C]/10">
              Bangladesh's Premier Business Group
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-extrabold leading-tight mb-6">
              Building Sustainable Solutions for a Better Future
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-10 max-w-xl font-sans">
              Green Madani International Private Ltd. delivers quality solutions through innovation, technology, and sustainable growth.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/businesses">
                <Button className="bg-[#C8960C] text-[#1A1A1A] hover:bg-[#a87d0a] font-bold px-8 py-6 rounded-none text-lg">
                  Explore Businesses
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="border-white text-white hover:bg-white hover:text-[#1A5C38] font-bold px-8 py-6 rounded-none text-lg">
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
          <div className="relative h-[400px] lg:h-[600px] w-full bg-black/20 rounded-lg overflow-hidden hidden lg:block border-4 border-[#C8960C]/20">
             <div className="absolute inset-0 bg-gradient-to-tr from-[#1A5C38]/40 to-transparent z-10" />
             <div className="absolute inset-0 flex items-center justify-center text-white/50 italic bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop')" }}></div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <div className="bg-[#C8960C] text-[#1A1A1A] py-6 border-b-4 border-[#0D3D25]">
        <div className="container mx-auto px-4 flex flex-wrap justify-between items-center gap-6 font-bold font-display text-lg md:text-xl">
          <div className="flex items-center gap-2"><div className="w-2 h-2 bg-[#1A1A1A] rounded-full" /> {stats?.subsidiaries || "12+"} Subsidiaries</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 bg-[#1A1A1A] rounded-full" /> {stats?.products || "500+"} Products</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 bg-[#1A1A1A] rounded-full" /> {stats?.farmerServed?.toLocaleString() || "10,000+"} Farmers Served</div>
          <div className="flex items-center gap-2"><div className="w-2 h-2 bg-[#1A1A1A] rounded-full" /> {stats?.yearsActive || "6+"} Years</div>
        </div>
      </div>

      {/* Company Intro */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-[#C8960C] font-bold tracking-widest uppercase text-sm mb-4 block">Who We Are</span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-[#1A1A1A] mb-8">
              A Diversified Business Group Driving Sustainable Growth
            </h2>
            <div className="space-y-6 text-gray-600 text-lg mb-10">
              <p>
                Founded on the principles of Islamic heritage and community empowerment, Green Madani International has grown from a humble agricultural enterprise into a nationwide conglomerate.
              </p>
              <p>
                We believe that true business success is measured not just in profit, but in the positive impact we create for our farmers, our customers, and our environment.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {["Quality", "Innovation", "Integrity", "Sustainability"].map((val, idx) => (
                <div key={val} className="flex items-center gap-3 bg-[#EEF4F0] p-4 font-semibold text-[#1A5C38]">
                  {idx === 0 && <Award size={20} className="text-[#C8960C]" />}
                  {idx === 1 && <FlaskConical size={20} className="text-[#C8960C]" />}
                  {idx === 2 && <Handshake size={20} className="text-[#C8960C]" />}
                  {idx === 3 && <Leaf size={20} className="text-[#C8960C]" />}
                  {val}
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 h-[500px]">
            <div className="bg-gray-200 h-full rounded overflow-hidden shadow-lg border border-gray-100">
               <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop" alt="Modern Factory" className="w-full h-full object-cover" />
            </div>
            <div className="bg-gray-200 h-full rounded mt-8 overflow-hidden shadow-lg border border-gray-100">
               <img src="https://images.unsplash.com/photo-1592982537447-6f2c6c0c2834?q=80&w=2069&auto=format&fit=crop" alt="Agriculture" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Business Categories */}
      <section className="py-24 bg-[#F9F7F2]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-[#1A1A1A]">Our Diverse Business Portfolio</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {subsidiaries.map((sub, i) => {
              const Icon = sub.icon;
              return (
                <Link key={i} href="/businesses">
                  <div className="bg-white p-8 border border-transparent hover:border-[#1A5C38] hover:shadow-xl transition-all duration-300 cursor-pointer group h-full flex flex-col">
                    <div className="w-14 h-14 bg-[#EEF4F0] text-[#1A5C38] flex items-center justify-center mb-6 group-hover:bg-[#1A5C38] group-hover:text-white transition-colors">
                      <Icon size={28} />
                    </div>
                    <h3 className="font-display font-bold text-xl mb-2 text-[#1A1A1A]">{sub.name}</h3>
                    <p className="text-gray-600 text-sm">{sub.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="text-center mt-12">
            <Link href="/businesses">
              <Button className="bg-[#1A5C38] hover:bg-[#0D3D25] text-white rounded-none px-8 py-6 text-lg font-bold">
                View All Businesses <ArrowRight className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-[#C8960C] font-bold tracking-widest uppercase text-sm mb-2 block">Premium Quality</span>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-[#1A1A1A]">Featured Products</h2>
            </div>
            <Link href="/products" className="hidden md:flex items-center text-[#1A5C38] font-bold hover:text-[#C8960C] transition-colors">
              View All Catalog <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>

          <div className="flex gap-4 mb-10 overflow-x-auto pb-4 hide-scrollbar">
            <Button variant="default" className="bg-[#1A5C38] text-white rounded-none">All</Button>
            <Button variant="outline" className="rounded-none border-gray-300 text-gray-600">Agriculture</Button>
            <Button variant="outline" className="rounded-none border-gray-300 text-gray-600">Food</Button>
            <Button variant="outline" className="rounded-none border-gray-300 text-gray-600">Skincare</Button>
            <Button variant="outline" className="rounded-none border-gray-300 text-gray-600">Beverage</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loadingProducts ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="border border-gray-100 shadow-sm flex flex-col h-full">
                  <Skeleton className="w-full h-64 rounded-none" />
                  <div className="p-6">
                    <Skeleton className="w-20 h-6 mb-4" />
                    <Skeleton className="w-full h-8 mb-2" />
                    <Skeleton className="w-2/3 h-4" />
                  </div>
                </div>
              ))
            ) : (
              (productsData?.items ?? []).map((product) => (
                <div key={product.id} className="border border-gray-100 shadow-sm flex flex-col h-full group">
                  <div className="w-full h-64 bg-gray-100 overflow-hidden relative">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 bg-[#EEF4F0]"><ShoppingBasket size={48} className="opacity-20" /></div>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <span className="inline-block bg-[#C8960C]/10 text-[#C8960C] font-semibold text-xs tracking-wider uppercase px-3 py-1 mb-4 self-start">
                      {product.category}
                    </span>
                    <h3 className="font-display font-bold text-2xl mb-3 text-[#1A1A1A]">{product.name}</h3>
                    <p className="text-gray-600 text-sm mb-6 flex-1 line-clamp-3">{product.description}</p>
                    <Link href={`/products/${product.id}`}>
                      <Button variant="outline" className="w-full rounded-none border-[#1A5C38] text-[#1A5C38] hover:bg-[#1A5C38] hover:text-white font-bold">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Why Choose GMI */}
      <section className="py-24 bg-[#1A5C38] text-white islamic-pattern-overlay relative border-y-4 border-[#C8960C]">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold">Why Partner With GMI</h2>
            <p className="text-white/80 mt-4 max-w-2xl mx-auto">A legacy of trust, quality, and commitment to the nation.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Award, title: "Trusted Quality", desc: "Rigorous standards across all 12 subsidiaries." },
              { icon: Leaf, title: "Sustainable Practices", desc: "Eco-friendly operations from farm to shelf." },
              { icon: MapPin, title: "Nation-Wide Distribution", desc: "Reaching every corner of Bangladesh." },
              { icon: Sprout, title: "Farmer-First Approach", desc: "Empowering local communities directly." }
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div key={i} className="bg-white/5 border border-white/10 p-8 backdrop-blur text-center hover:bg-white/10 transition-colors">
                  <div className="w-16 h-16 bg-[#C8960C] rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon size={32} className="text-[#1A1A1A]" />
                  </div>
                  <h3 className="text-xl font-bold font-display mb-3">{feature.title}</h3>
                  <p className="text-white/70 text-sm">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Sustainability Strip */}
      <section className="py-24 bg-[url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop')] bg-cover bg-center text-white text-center relative bg-fixed">
        <div className="absolute inset-0 bg-[#0D3D25]/90"></div>
        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-3xl md:text-5xl font-display font-bold italic mb-12 max-w-4xl mx-auto leading-relaxed text-[#C8960C]">
            "Growing with Nature, Building for Generations"
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
            <div className="p-6 border border-[#C8960C]/30 bg-black/20 backdrop-blur">
              <div className="text-4xl font-display font-bold text-white mb-2">50,000+</div>
              <div className="text-sm uppercase tracking-widest font-semibold text-[#C8960C]">Trees Planted</div>
            </div>
            <div className="p-6 border border-[#C8960C]/30 bg-black/20 backdrop-blur">
              <div className="text-4xl font-display font-bold text-white mb-2">30%</div>
              <div className="text-sm uppercase tracking-widest font-semibold text-[#C8960C]">Water Reduction</div>
            </div>
            <div className="p-6 border border-[#C8960C]/30 bg-black/20 backdrop-blur">
              <div className="text-4xl font-display font-bold text-white mb-2">100%</div>
              <div className="text-sm uppercase tracking-widest font-semibold text-[#C8960C]">Ethical Sourcing</div>
            </div>
          </div>
          <Link href="/sustainability">
            <Button className="bg-[#C8960C] text-[#1A1A1A] hover:bg-[#a87d0a] rounded-none px-8 py-6 font-bold text-lg">
              Read Our Sustainability Report
            </Button>
          </Link>
        </div>
      </section>

      {/* Partner / Investor CTA */}
      <section className="py-24 bg-[#EEF4F0]">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-12 border-t-4 border-[#1A5C38] shadow-sm flex flex-col justify-between">
              <div>
                <Building2 size={48} className="text-[#1A5C38] mb-6" />
                <h3 className="text-3xl font-display font-bold text-[#1A1A1A] mb-4">Become a Distributor</h3>
                <p className="text-gray-600 mb-8 text-lg">
                  Join our nationwide network. Gain access to premium products, dedicated support, and competitive margins.
                </p>
              </div>
              <Link href="/contact">
                <Button variant="outline" className="w-max rounded-none border-[#1A5C38] text-[#1A5C38] hover:bg-[#1A5C38] hover:text-white font-bold">
                  Apply Now <ArrowUpRight className="ml-2" size={16} />
                </Button>
              </Link>
            </div>
            
            <div className="bg-white p-12 border-t-4 border-[#C8960C] shadow-sm flex flex-col justify-between">
              <div>
                <Handshake size={48} className="text-[#C8960C] mb-6" />
                <h3 className="text-3xl font-display font-bold text-[#1A1A1A] mb-4">Become an Investor</h3>
                <p className="text-gray-600 mb-8 text-lg">
                  Partner with a fast-growing conglomerate driving sustainable impact across multiple high-growth sectors.
                </p>
              </div>
              <Link href="/contact">
                <Button className="w-max rounded-none bg-[#C8960C] text-[#1A1A1A] hover:bg-[#a87d0a] font-bold">
                  Request Info <ArrowUpRight className="ml-2" size={16} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* News Preview */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-[#C8960C] font-bold tracking-widest uppercase text-sm mb-2 block">Insights</span>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-[#1A1A1A]">Latest News & Updates</h2>
            </div>
            <Link href="/news" className="hidden md:flex items-center text-[#1A5C38] font-bold hover:text-[#C8960C] transition-colors">
              View All News <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {loadingNews ? (
               Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex flex-col h-full">
                  <Skeleton className="w-full h-56 rounded-none mb-4" />
                  <Skeleton className="w-24 h-4 mb-3" />
                  <Skeleton className="w-full h-6 mb-2" />
                  <Skeleton className="w-full h-6 mb-4" />
                  <Skeleton className="w-2/3 h-4" />
                </div>
              ))
            ) : (newsData?.items ?? []).map((article) => (
              <div key={article.id} className="group cursor-pointer">
                <Link href={`/news/${article.slug}`}>
                  <div className="w-full h-56 bg-gray-100 overflow-hidden mb-6 relative">
                    {article.imageUrl ? (
                      <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full bg-[#0D3D25] flex items-center justify-center"><Tv className="text-white/20" size={48} /></div>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 tracking-wider uppercase mb-3">
                    <span className="text-[#1A5C38]">{article.category}</span>
                    <span>•</span>
                    <span>{format(new Date(article.publishedAt), 'MMM dd, yyyy')}</span>
                  </div>
                  <h3 className="font-display font-bold text-2xl mb-3 text-[#1A1A1A] group-hover:text-[#C8960C] transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.excerpt || "Read more about our latest developments and news."}
                  </p>
                  <span className="text-[#1A5C38] font-bold flex items-center group-hover:text-[#C8960C] transition-colors">
                    Read More <ArrowRight size={16} className="ml-1" />
                  </span>
                </Link>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center md:hidden">
            <Link href="/news">
              <Button variant="outline" className="w-full rounded-none border-[#1A5C38] text-[#1A5C38] font-bold">
                View All News
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
