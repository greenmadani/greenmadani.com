import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "⊞" },
  { href: "/admin/businesses", label: "Businesses", icon: "▣" },
  { href: "/admin/products", label: "Products", icon: "◎" },
  { href: "/admin/news", label: "News", icon: "◇" },
  { href: "/admin/jobs", label: "Jobs", icon: "○" },
  { href: "/admin/inquiries", label: "Inquiries", icon: "□" },
  { href: "/admin/settings", label: "Settings", icon: "⚙" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/admin/login";
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-[#0D3D25] text-white flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h1 className="font-display text-xl font-bold">GMI Admin</h1>
          <p className="text-sm text-white/60 mt-1">Content Management</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm hover:bg-white/10 transition-colors"
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
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
