import { useEffect, useState } from "react";
import { adminApi } from "@/lib/admin-api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboard() {
  const [stats, setStats] = useState<Record<string, number>>({});

  useEffect(() => {
    Promise.all([
      adminApi.get("/businesses").then((d: any) => d?.length ?? 0),
      adminApi.get("/products").then((d: any) => d?.length ?? 0),
      adminApi.get("/news").then((d: any) => d?.length ?? 0),
      adminApi.get("/jobs").then((d: any) => d?.length ?? 0),
      adminApi.get("/contacts").then((d: any) => d?.length ?? 0),
      adminApi.get("/business-inquiries").then((d: any) => d?.length ?? 0),
    ]).then(([b, p, n, j, c, bi]) =>
      setStats({ businesses: b, products: p, news: n, jobs: j, contacts: c, "biz inquiries": bi })
    );
  }, []);

  const tiles = [
    { label: "Businesses", value: stats.businesses ?? "—", color: "border-l-primary" },
    { label: "Products", value: stats.products ?? "—", color: "border-l-accent" },
    { label: "News", value: stats.news ?? "—", color: "border-l-[#2196F3]" },
    { label: "Jobs", value: stats.jobs ?? "—", color: "border-l-[#9C27B0]" },
    { label: "Contacts", value: stats.contacts ?? "—", color: "border-l-[#FF9800]" },
    { label: "Biz Inquiries", value: stats["biz inquiries"] ?? "—", color: "border-l-[#F44336]" },
  ];

  return (
    <div>
      <h2 className="font-display mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {tiles.map((t) => (
          <Card key={t.label} className={`border-l-4 ${t.color}`}>
            <CardHeader className="pb-2">
              <CardTitle className="font-medium text-muted-foreground">{t.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{t.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
