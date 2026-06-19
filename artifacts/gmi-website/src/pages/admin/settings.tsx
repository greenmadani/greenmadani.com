import { useEffect, useState } from "react";
import { adminApi } from "@/lib/admin-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

const defaults: SiteSettings = {
  announcementText: "",
  siteName: "GMI",
  headerLogoUrl: "",
  footerLogoUrl: "",
  tagline: "",
  address: "",
  phone: "",
  email: "",
  facebookUrl: "",
  twitterUrl: "",
  youtubeUrl: "",
  linkedinUrl: "",
  instagramUrl: "",
  copyrightText: "",
};

export default function AdminSettings() {
  const [form, setForm] = useState<SiteSettings>(defaults);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    adminApi.get("/site-settings").then((data: SiteSettings | null) => {
      if (data) setForm({ ...defaults, ...data });
      setLoaded(true);
    });
  }, []);

  function set<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function save() {
    setSaving(true);
    await adminApi.put("/site-settings", form);
    setSaving(false);
  }

  if (!loaded) return <p className="text-gray-500">Loading settings...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-display font-bold">Site Settings</h2>
        <Button onClick={save} disabled={saving} className="bg-[#1A5C38] hover:bg-[#0D3D25]">
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      <div className="space-y-6 max-w-3xl">
        {/* Top Header / Announcement */}
        <Card>
          <CardHeader><CardTitle className="text-lg">Top Header / Announcement Bar</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Announcement Text</Label>
              <Input value={form.announcementText} onChange={(e) => set("announcementText", e.target.value)} className="mt-1" placeholder="Welcome to Green Madani International Private Ltd." />
            </div>
          </CardContent>
        </Card>

        {/* Header / Site Identity */}
        <Card>
          <CardHeader><CardTitle className="text-lg">Header / Site Identity</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Site Name</Label>
              <Input value={form.siteName} onChange={(e) => set("siteName", e.target.value)} className="mt-1" placeholder="GMI" />
            </div>
            <div>
              <Label>Tagline</Label>
              <Textarea value={form.tagline} onChange={(e) => set("tagline", e.target.value)} className="mt-1" placeholder="A diversified business group..." />
            </div>
            <div>
              <Label>Header Logo URL</Label>
              <Input value={form.headerLogoUrl} onChange={(e) => set("headerLogoUrl", e.target.value)} className="mt-1" placeholder="https://..." />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader><CardTitle className="text-lg">Contact Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Address</Label>
              <Textarea value={form.address} onChange={(e) => set("address", e.target.value)} className="mt-1" placeholder="Full address" />
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} className="mt-1" placeholder="01340-862454" />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={form.email} onChange={(e) => set("email", e.target.value)} className="mt-1" placeholder="info@greenmadani.com" />
            </div>
          </CardContent>
        </Card>

        {/* Social Media Links */}
        <Card>
          <CardHeader><CardTitle className="text-lg">Social Media Links</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Facebook URL</Label>
              <Input value={form.facebookUrl} onChange={(e) => set("facebookUrl", e.target.value)} className="mt-1" placeholder="https://facebook.com/..." />
            </div>
            <div>
              <Label>Twitter URL</Label>
              <Input value={form.twitterUrl} onChange={(e) => set("twitterUrl", e.target.value)} className="mt-1" placeholder="https://twitter.com/..." />
            </div>
            <div>
              <Label>YouTube URL</Label>
              <Input value={form.youtubeUrl} onChange={(e) => set("youtubeUrl", e.target.value)} className="mt-1" placeholder="https://youtube.com/..." />
            </div>
            <div>
              <Label>LinkedIn URL</Label>
              <Input value={form.linkedinUrl} onChange={(e) => set("linkedinUrl", e.target.value)} className="mt-1" placeholder="https://linkedin.com/..." />
            </div>
            <div>
              <Label>Instagram URL</Label>
              <Input value={form.instagramUrl} onChange={(e) => set("instagramUrl", e.target.value)} className="mt-1" placeholder="https://instagram.com/..." />
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <Card>
          <CardHeader><CardTitle className="text-lg">Footer Settings</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Footer Logo URL</Label>
              <Input value={form.footerLogoUrl} onChange={(e) => set("footerLogoUrl", e.target.value)} className="mt-1" placeholder="https://..." />
            </div>
            <div>
              <Label>Copyright Text</Label>
              <Input value={form.copyrightText} onChange={(e) => set("copyrightText", e.target.value)} className="mt-1" placeholder="2026 Green Madani..." />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pb-8">
          <Button onClick={save} disabled={saving} className="bg-[#1A5C38] hover:bg-[#0D3D25] px-8">
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
