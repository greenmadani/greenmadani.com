import { ReactNode, useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Menu, MapPin, Phone, Mail, Linkedin, Facebook, Twitter, Youtube, X } from "lucide-react";
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

export function Layout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  const { data: s } = useSettings();
  const [announcementVisible, setAnnouncementVisible] = useState(true);

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

  const ctaText = s?.ctaButtonText || "Get A Quote";
  const ctaLink = s?.ctaButtonLink || "/contact";
  const primaryColor = s?.primaryColor || "#1A5C38";
  const accentColor = s?.accentColor || "#C8960C";
  const footerBg = s?.footerBgColor || "#0D3D25";
  const bodyBg = s?.bgColor || "#F9F7F2";

  function dismissAnnouncement() {
    setAnnouncementVisible(false);
    if (s?.announcementDismissible) {
      localStorage.setItem("announcementDismissed", "true");
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: bodyBg }}>
      <style>{`
        :root {
          --color-primary: ${primaryColor};
          --color-accent: ${accentColor};
          --color-footer: ${footerBg};
        }
      `}</style>

      {/* Announcement Bar */}
      {s?.announcementEnabled !== false && announcementVisible && (
        <div
          className="text-xs py-1.5 px-4 flex justify-between items-center z-50 relative"
          style={{ backgroundColor: s?.announcementBgColor || "#1A5C38", color: s?.announcementTextColor || "#ffffff" }}
        >
          <div className="container mx-auto flex justify-between items-center">
            <span className="font-medium tracking-wide uppercase opacity-90">
              {s?.announcementText || "Welcome to Green Madani International Private Ltd."}
            </span>
            <div className="flex items-center gap-4">
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
                <button onClick={dismissAnnouncement} className="ml-2 hover:opacity-80">
                  <X size={12} />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Navbar */}
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/">
            {s?.headerLogoUrl ? (
              <img src={s.headerLogoUrl} alt={s.siteName || "GMI"} className="h-12 w-auto" />
            ) : (
              <span className="text-3xl font-display font-extrabold tracking-tighter cursor-pointer" style={{ color: accentColor }}>
                {s?.siteName || "GMI"}
              </span>
            )}
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              link.isExternal ? (
                <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer"
                  className={`text-sm font-semibold transition-colors cursor-pointer ${location === link.href ? "" : "text-gray-700"}`}
                  style={{ color: location === link.href ? accentColor : undefined }}
                  onMouseEnter={(e) => { if (location !== link.href) (e.target as HTMLElement).style.color = primaryColor; }}
                  onMouseLeave={(e) => { if (location !== link.href) (e.target as HTMLElement).style.color = ""; }}
                >
                  {link.label}
                </a>
              ) : (
                <Link key={link.href} href={link.href}>
                  <span
                    className="text-sm font-semibold transition-colors cursor-pointer"
                    style={{ color: location === link.href ? accentColor : "#374151" }}
                    onMouseEnter={(e) => { if (location !== link.href) (e.target as HTMLElement).style.color = primaryColor; }}
                    onMouseLeave={(e) => { if (location !== link.href) (e.target as HTMLElement).style.color = ""; }}
                  >
                    {link.label}
                  </span>
                </Link>
              )
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-4">
            <Link href={ctaLink}>
              <Button
                className="font-bold rounded-none px-6 text-white"
                style={{ backgroundColor: accentColor, color: "#1A1A1A" }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#a87d0a")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = accentColor)}
              >
                {ctaText}
              </Button>
            </Link>
          </div>

          {/* Mobile Nav */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" style={{ color: primaryColor }}>
                <Menu size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-white">
              <nav className="flex flex-col gap-6 mt-8">
                {navLinks.map((link) => (
                  link.isExternal ? (
                    <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer"
                      className="text-lg font-semibold" style={{ color: primaryColor }}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link key={link.href} href={link.href}>
                      <span className="text-lg font-semibold" style={{ color: primaryColor }}>{link.label}</span>
                    </Link>
                  )
                ))}
                <Link href={ctaLink}>
                  <Button
                    className="font-bold w-full rounded-none mt-4 text-white"
                    style={{ backgroundColor: accentColor, color: "#1A1A1A" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#a87d0a")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = accentColor)}
                  >
                    {ctaText}
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
      <footer
        className="text-white pt-16 pb-8 relative"
        style={{ backgroundColor: footerBg }}
      >
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            <div>
              {s?.footerLogoUrl ? (
                <img src={s.footerLogoUrl} alt={s.siteName || "GMI"} className="h-12 w-auto mb-6" />
              ) : (
                <h2 className="text-4xl font-display font-extrabold mb-6" style={{ color: accentColor }}>
                  {s?.siteName || "GMI"}
                </h2>
              )}
              <p className="text-white/80 text-sm leading-relaxed mb-6">
                {s?.tagline || "A diversified business group driving sustainable growth across Bangladesh and beyond."}
              </p>
              {s?.showSocialInFooter !== false && (
                <div className="flex items-center gap-4">
                  {socialLinkKeys.map(({ key, label }) => {
                    const url = s?.[key as keyof SiteSettings] as string | undefined;
                    if (!url) return null;
                    const Icon = socialIconMap[key];
                    return (
                      <a key={key} href={url}
                        className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:opacity-80 transition-opacity"
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
                <h3 className="text-lg font-bold mb-6 font-display text-white">{col.title}</h3>
                <ul className="space-y-3 text-sm text-white/70">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      {link.href.startsWith("http") ? (
                        <a href={link.href} target="_blank" rel="noopener noreferrer"
                          className="hover:opacity-80 cursor-pointer transition-opacity"
                        >
                          {link.label}
                        </a>
                      ) : (
                        <Link href={link.href}>
                          <span className="hover:opacity-80 cursor-pointer transition-opacity">{link.label}</span>
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <h3 className="text-lg font-bold mb-6 font-display text-white">Contact Info</h3>
              <ul className="space-y-4 text-sm text-white/80">
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="shrink-0 mt-0.5" style={{ color: accentColor }} />
                  <span>{s?.address || "924/C, Taltola Moor, Khilgaon-1219, Dhaka"}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={18} className="shrink-0" style={{ color: accentColor }} />
                  <span>{s?.phone || "01340-862454"}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={18} className="shrink-0" style={{ color: accentColor }} />
                  <span>{s?.email || "info@greenmadani.com"}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/60">
            <p>&copy; {s?.copyrightText || "2026 Green Madani International Private Ltd. All rights reserved."}</p>
            <div className="flex gap-6">
              <Link href={s?.privacyPolicyUrl || "/privacy"}>
                <span className="hover:text-white cursor-pointer">Privacy Policy</span>
              </Link>
              <Link href={s?.termsUrl || "/terms"}>
                <span className="hover:text-white cursor-pointer">Terms of Service</span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
