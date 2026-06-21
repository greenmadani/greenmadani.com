import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Menu, MapPin, Phone, Mail, Linkedin, Facebook, Twitter, Youtube, X, Home, Building2, ShoppingBasket, Tv, ArrowUp, ChevronDown, Sprout, Coffee, Sparkles, Shirt, Hotel, Plane, GraduationCap, Heart, FlaskConical, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface NavLinkItem {
  label: string;
  href: string;
  isExternal?: boolean;
}

interface FooterColumn {
  title: string;
  links: { label: string; href: string }[];
}

interface SiteSettings {
  announcementText: string;
  announcementEnabled: boolean;
  announcementBgColor: string;
  announcementTextColor: string;
  announcementDismissible: boolean;
  siteName: string;
  headerLogoUrl: string;
  footerLogoUrl: string;
  tagline: string;
  ctaButtonText: string;
  ctaButtonLink: string;
  navItems: NavLinkItem[];
  footerColumns: FooterColumn[];
  privacyPolicyUrl: string;
  termsUrl: string;
  footerBgColor: string;
  showSocialInFooter: boolean;
  primaryColor: string;
  accentColor: string;
  footerColor: string;
  bgColor: string;
  address: string;
  phone: string;
  email: string;
  facebookUrl: string;
  twitterUrl: string;
  youtubeUrl: string;
  linkedinUrl: string;
  instagramUrl: string;
  copyrightText: string;
  seoTitle: string;
  seoDescription: string;
  seoOgImage: string;
  seoKeywords: string;
}

function useSettings() {
  return useQuery<SiteSettings>({
    queryKey: ["site-settings"],
    queryFn: () => fetch("/api/settings").then((r) => r.json()),
    staleTime: 30 * 1000,
  });
}

const socialIconMap: Record<string, typeof Facebook> = {
  facebookUrl: Facebook,
  twitterUrl: Twitter,
  youtubeUrl: Youtube,
  linkedinUrl: Linkedin,
};

const socialLinkKeys = [
  { key: "facebookUrl", label: "Facebook" },
  { key: "twitterUrl", label: "Twitter" },
  { key: "youtubeUrl", label: "Youtube" },
  { key: "linkedinUrl", label: "Linkedin" },
] as const;

const bottomNavTabs = [
  { href: "/", label: "Home", icon: Home },
  { href: "/businesses", label: "Businesses", icon: Building2 },
  { href: "/products", label: "Products", icon: ShoppingBasket },
  { href: "/news", label: "News", icon: Tv },
  { href: "/contact", label: "Contact", icon: Phone },
];

const businessSubs = [
  { name: "GMI Power Agro", slug: "gmi-power-agro", icon: Sprout },
  { name: "GMI Essential Food & Consumer", slug: "gmi-essential-food-consumer", icon: ShoppingBasket },
  { name: "GMI Beverage", slug: "gmi-beverage", icon: Coffee },
  { name: "GMI Hospital", slug: "gmi-hospital", icon: Heart },
  { name: "GMI Hotel & Resort", slug: "gmi-hotel-resort", icon: Hotel },
  { name: "GMI Supermarket", slug: "gmi-supermarket", icon: Store },
  { name: "GMI Tour & Travels", slug: "gmi-tour-travels", icon: Plane },
  { name: "GMI Education", slug: "gmi-education", icon: GraduationCap },
  { name: "GMI Skin Care", slug: "gmi-skin-care", icon: Sparkles },
  { name: "GMI Fashion House", slug: "gmi-fashion-house", icon: Shirt },
  { name: "GMI News & Media", slug: "gmi-news-media", icon: Tv },
  { name: "GMI R&D Center", slug: "gmi-rd-center", icon: FlaskConical },
];

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { data: s } = useSettings();
  const [announcementVisible, setAnnouncementVisible] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  useEffect(() => {
    const dismissed = localStorage.getItem("announcementDismissed");
    if (dismissed === "true") setAnnouncementVisible(false);
  }, []);

  useEffect(() => {
    if (!s) return;
    const title = s.seoTitle || `${s.siteName || "GMI"} — Corporate Website`;
    document.title = title;
    const setMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
      if (!el) {
        el = document.createElement("meta");
        if (name.startsWith("og:")) el.setAttribute("property", name);
        else el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };
    setMeta("description", s.seoDescription || `${s.siteName || "GMI"} — A diversified business group driving sustainable growth across Bangladesh and beyond.`);
    setMeta("og:title", title);
    setMeta("og:description", s.seoDescription || "");
    if (s.seoOgImage) setMeta("og:image", s.seoOgImage);
    setMeta("twitter:title", title);
    setMeta("twitter:description", s.seoDescription || "");
    if (s.seoKeywords) setMeta("keywords", s.seoKeywords);
  }, [s]);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks: NavLinkItem[] = (s?.navItems?.length ? s.navItems : [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/businesses", label: "Businesses" },
    { href: "/products", label: "Products" },
    { href: "/sustainability", label: "Sustainability" },
    { href: "/news", label: "News" },
    { href: "/careers", label: "Careers" },
    { href: "/contact", label: "Contact" },
  ]);

  const footerCols: FooterColumn[] = (s?.footerColumns?.length ? s.footerColumns : [
    {
      title: "Quick Links",
      links: [
        { label: "About Us", href: "/about" },
        { label: "Products", href: "/products" },
        { label: "Sustainability", href: "/sustainability" },
        { label: "Careers", href: "/careers" },
        { label: "News & Updates", href: "/news" },
      ],
    },
    {
      title: "Our Businesses",
      links: [
        { label: "GMI Power Agro Ltd.", href: "/businesses" },
        { label: "GMI Essential Food", href: "/businesses" },
        { label: "GMI Beverage Ltd.", href: "/businesses" },
        { label: "GMI Skin Care", href: "/businesses" },
        { label: "View All Subsidiaries", href: "/businesses" },
      ],
    },
  ]);

  const rightLinks = navLinks.filter(l => l.href === "/careers" || l.href === "/contact");
  const mainNavLinks = navLinks.filter(l => l.href !== "/careers" && l.href !== "/contact");
  const footerBg = s?.footerBgColor || "#0D3D25";
  const bodyBg = s?.bgColor || "#F9F7F2";

  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if ((window.scrollY > 50) !== scrolled) {
        setScrolled(window.scrollY > 50);
      }
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(docHeight > 0 ? Math.min(scrollTop / docHeight, 1) : 0);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  function dismissAnnouncement() {
    setAnnouncementVisible(false);
    if (s?.announcementDismissible) {
      localStorage.setItem("announcementDismissed", "true");
    }
  }

  function isActive(href: string) {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: bodyBg }}>
      {/* Announcement Bar */}
      {s?.announcementEnabled !== false && announcementVisible && (
        <div
          className="text-xs py-1.5 px-4 z-50 relative bg-accent text-accent-foreground"
        >
          <div className="container mx-auto flex items-center justify-center gap-4">
            <span className="font-medium tracking-wide uppercase opacity-90 text-center">
              {s?.announcementText || "Welcome to Green Madani International Private Ltd."}
            </span>
            <div className="flex items-center gap-4 shrink-0">
              {socialLinkKeys.map(({ key, label }) => {
                const url = s?.[key as keyof SiteSettings] as string | undefined;
                if (!url) return null;
                const Icon = socialIconMap[key];
                return (
                  <a key={key} href={url} className="hover:opacity-80 transition-opacity" title={label}>
                    {Icon && <Icon size={12} />}
                  </a>
                );
              })}
              {(s?.announcementDismissible || true) && (
                <button onClick={dismissAnnouncement} className="hover:opacity-80">
                  <X size={12} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <header className={`sticky top-0 z-40 w-full transition-all duration-500 ${scrolled ? "bg-white/80 backdrop-blur-xl shadow-lg shadow-black/[0.03]" : "bg-transparent"}`}>
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/">
            {s?.headerLogoUrl ? (
              <img src={s.headerLogoUrl} alt={s.siteName || "GMI"} className={`h-12 w-auto transition-all duration-500 ${scrolled ? "brightness-100" : "brightness-[1.2]"}`} />
            ) : (
              <img src={scrolled ? "/header-logo.png" : "/Green-Madani-Footer-Logo.png"} alt={s?.siteName || "GMI"} className="h-12 w-auto transition-all duration-500" />
            )}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1" onMouseLeave={() => setOpenSubmenu(null)}>
            {mainNavLinks.map((link) => {
              if (link.href === "/businesses") {
                return (
                  <div key={link.href} className="relative" onMouseEnter={() => setOpenSubmenu("businesses")}>
                    <Link href={link.href}>
                      <span
                        className={`nav-link px-4 py-2 text-sm font-semibold transition-all duration-200 cursor-pointer inline-flex items-center gap-1 ${!scrolled ? "text-white/80 hover:text-white hover:bg-white/10" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"} ${isActive(link.href) ? "active text-accent" : ""}`}
                      >
                        {link.label} <ChevronDown size={14} className={`transition-transform duration-200 ${openSubmenu === "businesses" ? "rotate-180" : ""}`} />
                      </span>
                    </Link>
                    <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 transition-all duration-200 ${openSubmenu === "businesses" ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"}`}>
                      <div className="bg-white/90 backdrop-blur-xl shadow-xl border border-border/50 w-64">
                        <div className="px-4 py-3 border-b border-border/50">
                          <Link href="/businesses">
                            <span className="text-xs font-bold tracking-widest uppercase text-primary hover:text-accent transition-colors cursor-pointer">
                              View All →
                            </span>
                          </Link>
                        </div>
                        <div className="max-h-[70vh] overflow-y-auto scrollbar-none" style={{ maskImage: 'linear-gradient(to bottom, black 0%, black 85%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 85%, transparent 100%)' }}>
                          {businessSubs.map((sub, i) => {
                            const Icon = sub.icon;
                            return (
                              <Link key={sub.slug} href={`/businesses/${sub.slug}`}>
                                <span className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/10 hover:text-accent transition-colors duration-200 cursor-pointer border-b border-border/40 last:border-b-0">
                                  <Icon size={16} className="text-accent shrink-0" />
                                  <span className="flex-1">{sub.name}</span>
                                </span>
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }
              return link.isExternal ? (
                <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer"
                  className={`nav-link px-4 py-2 text-sm font-semibold transition-all duration-200 cursor-pointer ${!scrolled ? "text-white/80 hover:text-white hover:bg-white/10" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"} ${isActive(link.href) ? "active text-accent" : ""}`}
                >
                  {link.label}
                </a>
              ) : (
                <Link key={link.href} href={link.href}>
                  <span
                  className={`nav-link px-4 py-2 text-sm font-semibold transition-all duration-200 cursor-pointer ${!scrolled ? "text-white/80 hover:text-white hover:bg-white/10" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"} ${isActive(link.href) ? "active text-accent" : ""}`}
                  >
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            {rightLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span className="px-4 py-2 text-sm font-semibold transition-all duration-200 cursor-pointer bg-accent text-accent-foreground border border-black hover:opacity-90">
                  {link.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Mobile Nav */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className={`lg:hidden transition-all duration-300 ${!scrolled ? "text-white hover:bg-white/10" : "hover:bg-muted/50"}`} aria-label="Open navigation menu">
                <Menu size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-white/95 backdrop-blur-xl border-l border-border/50 p-0 w-80">
              <div className="flex flex-col h-full">
                <div className="border-b border-border/50 px-6 py-6">
                  <span className="text-xl font-extrabold text-primary tracking-tight">
                    {s?.siteName || "GMI"}
                  </span>
                </div>
                <nav className="flex-1 flex flex-col gap-1 px-3 py-4 overflow-y-auto">
                  {mainNavLinks.map((link, i) => {
                    const isBiz = link.href === "/businesses";
                    return (
                      <div key={link.href} style={{ animationDelay: `${i * 50}ms` }} className="animate-fade-in">
                        {link.isExternal ? (
                          <a href={link.href} target="_blank" rel="noopener noreferrer"
                            className={`flex items-center gap-4 px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200 hover:bg-primary/5 ${isActive(link.href) ? "bg-primary/10 text-primary" : "text-foreground hover:text-primary"}`}
                          >
                            {link.label}
                          </a>
                        ) : (
                          <div>
                            <div className="flex items-center justify-between">
                              <Link href={link.href}>
                                <span
                                  className={`flex items-center gap-4 px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200 cursor-pointer hover:bg-primary/5 ${isActive(link.href) ? "bg-primary/10 text-primary" : "text-foreground hover:text-primary"}`}
                                >
                                  {link.label}
                                </span>
                              </Link>
                              {isBiz && (
                                <button onClick={() => setOpenSubmenu(openSubmenu === "businesses-mobile" ? null : "businesses-mobile")} className="p-3 hover:bg-muted/50 rounded-lg transition-colors">
                                  <ChevronDown size={18} className={`transition-transform duration-200 ${openSubmenu === "businesses-mobile" ? "rotate-180" : ""}`} />
                                </button>
                              )}
                            </div>
                            {isBiz && openSubmenu === "businesses-mobile" && (
                              <div className="ml-4 mt-1 mb-2 space-y-0.5 border-l-2 border-accent/30 pl-3">
                                <Link href="/businesses">
                                  <span className="flex items-center px-4 py-2 text-sm font-semibold text-accent hover:text-accent/80 transition-colors cursor-pointer">
                                    View All Businesses →
                                  </span>
                                </Link>
                                {businessSubs.map((sub) => {
                                  const Icon = sub.icon;
                                  return (
                                    <Link key={sub.slug} href={`/businesses/${sub.slug}`}>
                                      <span className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 rounded-lg transition-colors cursor-pointer">
                                        <Icon size={15} className="text-accent shrink-0" />
                                        {sub.name}
                                      </span>
                                    </Link>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </nav>
                <div className="border-t border-border/50 px-4 py-6 flex flex-col gap-3">
                  {rightLinks.map((link) => (
                    <Link key={link.href} href={link.href}>
                      <span className="flex items-center justify-center px-4 py-3 text-base font-semibold transition-all duration-200 cursor-pointer bg-accent text-accent-foreground border border-black hover:opacity-90">
                        {link.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </header>

      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-transparent pointer-events-none">
        <div
          className="h-full bg-accent transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress * 100}%` }}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 pb-16 lg:pb-0">
        {children}
      </main>

      {/* Back to Top */}
      {showBackToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-20 lg:bottom-8 right-4 z-50 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg lift-hover flex items-center justify-center active:scale-90"
          aria-label="Back to top"
        >
          <ArrowUp size={20} />
        </button>
      )}

      {/* Mobile Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/90 backdrop-blur-xl border-t border-border flex justify-around items-center h-16 px-2 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] safe-area-bottom">
        {bottomNavTabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.href);
          return (
            <Link key={tab.href} href={tab.href}>
              <span className={`flex flex-col items-center gap-0.5 px-3 py-1 cursor-pointer transition-colors ${active ? "text-primary" : "text-gray-400 hover:text-foreground/60"}`}>
                <Icon size={20} />
                <span className="text-[10px] font-semibold leading-none">{tab.label}</span>
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <footer
        className="text-white pt-16 pb-24 lg:pb-8 relative"
        style={{ backgroundColor: footerBg }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              {s?.footerLogoUrl ? (
                <img src={s.footerLogoUrl} alt={s.siteName || "GMI"} className="h-12 w-auto mb-6" />
              ) : (
                <h2 className="font-display mb-6 text-accent">
                  {s?.siteName || "GMI"}
                </h2>
              )}
              <p className="text-white/80 text-sm leading-relaxed mb-6">
                {s?.tagline || "Building Bangladesh's Most Diversified Industrial Group"}
              </p>
              {s?.showSocialInFooter !== false && (
                <div className="flex items-center gap-4">
                  {socialLinkKeys.map(({ key, label }) => {
                    const url = s?.[key as keyof SiteSettings] as string | undefined;
                    if (!url) return null;
                    const Icon = socialIconMap[key];
                    return (
                      <a key={key} href={url}
                        className="icon-hover w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"
                        title={label}
                      >
                        {Icon && <Icon size={14} />}
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            {footerCols.map((col) => (
              <div key={col.title}>
                <h3 className="mb-6 font-display text-white">{col.title}</h3>
                <ul className="space-y-3 text-sm text-white/70">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      {link.href.startsWith("http") ? (
                        <a href={link.href} target="_blank" rel="noopener noreferrer"
                          className="hover:text-white cursor-pointer transition-colors link-underline"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link href={link.href}>
                          <span className="hover:text-white cursor-pointer transition-colors link-underline">{link.label}</span>
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <h3 className="mb-6 font-display text-white">Contact Info</h3>
              <ul className="space-y-4 text-sm text-white/80">
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="shrink-0 mt-0.5 text-accent" />
                  <span>{s?.address || "924/C, Taltola Moor, Khilgaon-1219, Dhaka"}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={18} className="shrink-0 text-accent" />
                  <span>{s?.phone || "01340-862454"}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={18} className="shrink-0 text-accent" />
                  <span>{s?.email || "info@greenmadani.com"}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/60">
            <p>&copy; {s?.copyrightText || "2026 Green Madani International Private Ltd. All rights reserved."}</p>
            <div className="flex gap-6">
              <Link href={s?.privacyPolicyUrl || "/privacy"}>
                <span className="hover:text-white cursor-pointer transition-colors link-underline">Privacy Policy</span>
              </Link>
              <Link href={s?.termsUrl || "/terms"}>
                <span className="hover:text-white cursor-pointer transition-colors link-underline">Terms of Service</span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
