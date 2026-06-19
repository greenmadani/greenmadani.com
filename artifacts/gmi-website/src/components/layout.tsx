import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Menu, MapPin, Phone, Mail, Linkedin, Facebook, Twitter, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface SiteSettings {
  announcementText: string;
  siteName: string;
  headerLogoUrl: string;
  footerLogoUrl: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  facebookUrl: string;
  twitterUrl: string;
  youtubeUrl: string;
  linkedinUrl: string;
  instagramUrl: string;
  copyrightText: string;
}

function useSettings() {
  return useQuery<SiteSettings>({
    queryKey: ["site-settings"],
    queryFn: () => fetch("/api/settings").then((r) => r.json()),
    staleTime: 5 * 60 * 1000,
  });
}

const socialIcons: Record<string, typeof Facebook> = {
  facebookUrl: Facebook,
  twitterUrl: Twitter,
  youtubeUrl: Youtube,
  linkedinUrl: Linkedin,
};

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { data: s } = useSettings();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/businesses", label: "Businesses" },
    { href: "/products", label: "Products" },
    { href: "/sustainability", label: "Sustainability" },
    { href: "/news", label: "News" },
    { href: "/careers", label: "Careers" },
    { href: "/contact", label: "Contact" },
  ];

  const socialLinks = [
    { key: "facebookUrl", label: "Facebook" },
    { key: "twitterUrl", label: "Twitter" },
    { key: "youtubeUrl", label: "Youtube" },
    { key: "linkedinUrl", label: "Linkedin" },
  ] as const;

  return (
    <div className="min-h-screen flex flex-col bg-[#F9F7F2]">
      {/* Announcement Bar */}
      <div className="bg-[#1A5C38] text-white text-xs py-1.5 px-4 flex justify-between items-center z-50 relative">
        <div className="container mx-auto flex justify-between items-center">
          <span className="font-medium tracking-wide uppercase opacity-90">{s?.announcementText || "Welcome to Green Madani International Private Ltd."}</span>
          <div className="flex items-center gap-4">
            {socialLinks.map(({ key, label }) => {
              const url = s?.[key as keyof SiteSettings] as string | undefined;
              if (!url) return null;
              return (
                <a key={key} href={url} className="hover:text-[#C8960C] transition-colors" title={label}>
                  {key === "facebookUrl" ? <Facebook size={12} /> :
                   key === "twitterUrl" ? <Twitter size={12} /> :
                   key === "youtubeUrl" ? <Youtube size={12} /> :
                   key === "linkedinUrl" ? <Linkedin size={12} /> : null}
                </a>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/">
            {s?.headerLogoUrl ? (
              <img src={s.headerLogoUrl} alt={s.siteName || "GMI"} className="h-12 w-auto" />
            ) : (
              <span className="text-3xl font-display font-extrabold text-[#C8960C] tracking-tighter cursor-pointer">{s?.siteName || "GMI"}</span>
            )}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span className={`text-sm font-semibold transition-colors cursor-pointer ${location === link.href ? "text-[#C8960C]" : "text-gray-700 hover:text-[#1A5C38]"}`}>
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <Link href="/contact">
              <Button className="bg-[#C8960C] text-[#1A1A1A] hover:bg-[#a87d0a] font-bold rounded-none px-6">
                Get A Quote
              </Button>
            </Link>
          </div>

          {/* Mobile Nav */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden text-[#1A5C38]">
                <Menu size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-white">
              <nav className="flex flex-col gap-6 mt-8">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href}>
                    <span className="text-lg font-semibold text-[#1A5C38]">{link.label}</span>
                  </Link>
                ))}
                <Link href="/contact">
                  <Button className="bg-[#C8960C] text-[#1A1A1A] hover:bg-[#a87d0a] font-bold w-full rounded-none mt-4">
                    Get A Quote
                  </Button>
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#0D3D25] text-white pt-16 pb-8 islamic-pattern-overlay relative border-t-4 border-[#C8960C]">
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              {s?.footerLogoUrl ? (
                <img src={s.footerLogoUrl} alt={s.siteName || "GMI"} className="h-12 w-auto mb-6" />
              ) : (
                <h2 className="text-4xl font-display font-extrabold text-[#C8960C] mb-6">{s?.siteName || "GMI"}</h2>
              )}
              <p className="text-white/80 text-sm leading-relaxed mb-6">
                {s?.tagline || "A diversified business group driving sustainable growth across Bangladesh and beyond. Rooted in heritage, looking to the future."}
              </p>
              <div className="flex items-center gap-4">
                {socialLinks.map(({ key, label }) => {
                  const url = s?.[key as keyof SiteSettings] as string | undefined;
                  if (!url) return null;
                  return (
                    <a key={key} href={url} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#C8960C] transition-colors" title={label}>
                      {key === "facebookUrl" ? <Facebook size={14} /> :
                       key === "twitterUrl" ? <Twitter size={14} /> :
                       key === "youtubeUrl" ? <Youtube size={14} /> :
                       key === "linkedinUrl" ? <Linkedin size={14} /> : null}
                    </a>
                  );
                })}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-6 font-display text-white">Our Businesses</h3>
              <ul className="space-y-3 text-sm text-white/70">
                <li><Link href="/businesses"><span className="hover:text-[#C8960C] cursor-pointer">GMI Power Agro Ltd.</span></Link></li>
                <li><Link href="/businesses"><span className="hover:text-[#C8960C] cursor-pointer">GMI Essential Food</span></Link></li>
                <li><Link href="/businesses"><span className="hover:text-[#C8960C] cursor-pointer">GMI Beverage Ltd.</span></Link></li>
                <li><Link href="/businesses"><span className="hover:text-[#C8960C] cursor-pointer">GMI Skin Care</span></Link></li>
                <li><Link href="/businesses"><span className="hover:text-[#C8960C] cursor-pointer">View All Subsidiaries</span></Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-6 font-display text-white">Quick Links</h3>
              <ul className="space-y-3 text-sm text-white/70">
                <li><Link href="/about"><span className="hover:text-[#C8960C] cursor-pointer">About Us</span></Link></li>
                <li><Link href="/products"><span className="hover:text-[#C8960C] cursor-pointer">Products</span></Link></li>
                <li><Link href="/sustainability"><span className="hover:text-[#C8960C] cursor-pointer">Sustainability</span></Link></li>
                <li><Link href="/careers"><span className="hover:text-[#C8960C] cursor-pointer">Careers</span></Link></li>
                <li><Link href="/news"><span className="hover:text-[#C8960C] cursor-pointer">News & Updates</span></Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-6 font-display text-white">Contact Info</h3>
              <ul className="space-y-4 text-sm text-white/80">
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="text-[#C8960C] shrink-0 mt-0.5" />
                  <span>{s?.address || "924/C, Taltola Moor, Khilgaon-1219, Dhaka"}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={18} className="text-[#C8960C] shrink-0" />
                  <span>{s?.phone || "01340-862454"}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={18} className="text-[#C8960C] shrink-0" />
                  <span>{s?.email || "info@greenmadani.com"}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/60">
            <p>&copy; {s?.copyrightText || "2026 Green Madani International Private Ltd. All rights reserved."}</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white">Privacy Policy</a>
              <a href="#" className="hover:text-white">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
