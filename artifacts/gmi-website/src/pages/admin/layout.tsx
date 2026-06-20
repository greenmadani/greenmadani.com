import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { adminApi } from "@/lib/admin-api";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "⊞" },
  { href: "/admin/businesses", label: "Businesses", icon: "▣" },
  { href: "/admin/products", label: "Products", icon: "◎" },
  { href: "/admin/news", label: "News", icon: "◇" },
  { href: "/admin/jobs", label: "Jobs", icon: "○" },
  { href: "/admin/categories", label: "Categories", icon: "⊟" },
  { href: "/admin/inquiries", label: "Inquiries", icon: "□" },
  { href: "/admin/applications", label: "Applications", icon: "⊡" },
  { href: "/admin/media", label: "Media", icon: "⌷" },
  { href: "/admin/settings", label: "Settings", icon: "⚙" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [inquiryCount, setInquiryCount] = useState(0);

  useEffect(() => {
    Promise.all([
      adminApi.get("/contacts?status=new").then((d: any) => Array.isArray(d) ? d.length : 0),
      adminApi.get("/business-inquiries?status=new").then((d: any) => Array.isArray(d) ? d.length : 0),
    ]).then(([c, bi]) => setInquiryCount(c + bi));
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  }

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-64 bg-secondary text-white flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h1 className="font-display text-xl font-bold">GMI Admin</h1>
          <p className="text-sm text-white/60 mt-1">Content Management</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm hover:bg-white/10 transition-colors ${item.href === "/admin/inquiries" ? "relative" : ""}`}
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
              {item.href === "/admin/inquiries" && inquiryCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold rounded-full h-5 min-w-[20px] flex items-center justify-center px-1">
                  {inquiryCount}
                </span>
              )}
            </a>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <Button
            variant="ghost"
            className="w-full text-white/70 hover:text-white hover:bg-white/10 justify-start"
            onClick={handleLogout}
          >
            Sign out
          </Button>
        </div>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
