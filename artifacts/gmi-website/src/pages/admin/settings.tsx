import { useEffect, useState } from "react";
import { adminApi } from "@/lib/admin-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FileUpload from "@/components/admin/FileUpload";
import MediaBrowser from "@/components/admin/MediaBrowser";
import { Plus, Trash2, GripVertical, Image as ImageIcon } from "lucide-react";

interface NavLinkItem {
  label: string;
  href: string;
  isExternal?: boolean;
}

interface FooterLink {
  label: string;
  href: string;
}

interface FooterColumn {
  title: string;
  links: FooterLink[];
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

const defaults: SiteSettings = {
  announcementText: "Welcome to Green Madani International Private Ltd.",
  announcementEnabled: true,
  announcementBgColor: "#1A5C38",
  announcementTextColor: "#FFFFFF",
  announcementDismissible: true,
  siteName: "GMI",
  headerLogoUrl: "",
  footerLogoUrl: "",
  tagline: "",
  ctaButtonText: "Get A Quote",
  ctaButtonLink: "/contact",
  navItems: [],
  footerColumns: [],
  privacyPolicyUrl: "",
  termsUrl: "",
  footerBgColor: "#0D3D25",
  showSocialInFooter: true,
  primaryColor: "#1A5C38",
  accentColor: "#C8960C",
  footerColor: "#0D3D25",
  bgColor: "#F9F7F2",
  address: "",
  phone: "",
  email: "",
  facebookUrl: "",
  twitterUrl: "",
  youtubeUrl: "",
  linkedinUrl: "",
  instagramUrl: "",
  copyrightText: "",
  seoTitle: "",
  seoDescription: "",
  seoOgImage: "",
  seoKeywords: "",
};

export default function AdminSettings() {
  const [form, setForm] = useState<SiteSettings>(defaults);
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [browseField, setBrowseField] = useState<string | null>(null);

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

  function addNavItem() {
    setForm((prev) => ({
      ...prev,
      navItems: [...prev.navItems, { label: "", href: "/", isExternal: false }],
    }));
  }

  function updateNavItem(index: number, field: keyof NavLinkItem, value: string | boolean) {
    setForm((prev) => {
      const items = [...prev.navItems];
      items[index] = { ...items[index], [field]: value };
      return { ...prev, navItems: items };
    });
  }

  function removeNavItem(index: number) {
    setForm((prev) => ({
      ...prev,
      navItems: prev.navItems.filter((_, i) => i !== index),
    }));
  }

  function addFooterColumn() {
    setForm((prev) => ({
      ...prev,
      footerColumns: [...prev.footerColumns, { title: "", links: [{ label: "", href: "" }] }],
    }));
  }

  function updateFooterColumn(index: number, title: string) {
    setForm((prev) => {
      const cols = [...prev.footerColumns];
      cols[index] = { ...cols[index], title };
      return { ...prev, footerColumns: cols };
    });
  }

  function addFooterLink(colIndex: number) {
    setForm((prev) => {
      const cols = [...prev.footerColumns];
      cols[colIndex] = { ...cols[colIndex], links: [...cols[colIndex].links, { label: "", href: "" }] };
      return { ...prev, footerColumns: cols };
    });
  }

  function updateFooterLink(colIndex: number, linkIndex: number, field: keyof FooterLink, value: string) {
    setForm((prev) => {
      const cols = [...prev.footerColumns];
      const links = [...cols[colIndex].links];
      links[linkIndex] = { ...links[linkIndex], [field]: value };
      cols[colIndex] = { ...cols[colIndex], links };
      return { ...prev, footerColumns: cols };
    });
  }

  function removeFooterLink(colIndex: number, linkIndex: number) {
    setForm((prev) => {
      const cols = [...prev.footerColumns];
      cols[colIndex] = { ...cols[colIndex], links: cols[colIndex].links.filter((_, i) => i !== linkIndex) };
      return { ...prev, footerColumns: cols };
    });
  }

  function removeFooterColumn(index: number) {
    setForm((prev) => ({
      ...prev,
      footerColumns: prev.footerColumns.filter((_, i) => i !== index),
    }));
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
        {/* Top Bar / Announcement */}
        <Card>
          <CardHeader><CardTitle className="text-lg">Top Header / Announcement Bar</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Switch checked={form.announcementEnabled} onCheckedChange={(v) => set("announcementEnabled", v)} />
              <Label>Enable Announcement Bar</Label>
            </div>
            {form.announcementEnabled && (
              <>
                <div>
                  <Label>Announcement Text</Label>
                  <Input value={form.announcementText} onChange={(e) => set("announcementText", e.target.value)} className="mt-1" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Background Color</Label>
                    <div className="flex gap-2 mt-1">
                      <input type="color" value={form.announcementBgColor} onChange={(e) => set("announcementBgColor", e.target.value)} className="h-10 w-10 rounded border cursor-pointer" />
                      <Input value={form.announcementBgColor} onChange={(e) => set("announcementBgColor", e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <Label>Text Color</Label>
                    <div className="flex gap-2 mt-1">
                      <input type="color" value={form.announcementTextColor} onChange={(e) => set("announcementTextColor", e.target.value)} className="h-10 w-10 rounded border cursor-pointer" />
                      <Input value={form.announcementTextColor} onChange={(e) => set("announcementTextColor", e.target.value)} />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Switch checked={form.announcementDismissible} onCheckedChange={(v) => set("announcementDismissible", v)} />
                  <Label>Allow Dismiss</Label>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Header / Navigation */}
        <Card>
          <CardHeader><CardTitle className="text-lg">Header / Navigation</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Site Name</Label>
              <Input value={form.siteName} onChange={(e) => set("siteName", e.target.value)} className="mt-1" />
            </div>
            <ImageField
              label="Header Logo"
              value={form.headerLogoUrl}
              onChange={(v) => set("headerLogoUrl", v)}
              browseField="headerLogoUrl"
              browseOpen={browseField}
              onBrowseOpen={setBrowseField}
            />
            <div>
              <Label>Tagline</Label>
              <Textarea value={form.tagline} onChange={(e) => set("tagline", e.target.value)} className="mt-1" />
            </div>
            <div className="border-t pt-4">
              <Label className="text-sm font-semibold">CTA Button</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <Label className="text-xs">Button Text</Label>
                  <Input value={form.ctaButtonText} onChange={(e) => set("ctaButtonText", e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs">Button Link</Label>
                  <Input value={form.ctaButtonLink} onChange={(e) => set("ctaButtonLink", e.target.value)} className="mt-1" />
                </div>
              </div>
            </div>
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-semibold">Navigation Links</Label>
                <Button variant="outline" size="sm" onClick={addNavItem}>
                  <Plus className="h-3 w-3 mr-1" /> Add Link
                </Button>
              </div>
              {form.navItems.length === 0 && (
                <p className="text-sm text-gray-400 italic">No custom nav items. Default links will be shown.</p>
              )}
              <div className="space-y-2">
                {form.navItems.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                    <GripVertical className="h-4 w-4 text-gray-400 shrink-0" />
                    <Input
                      placeholder="Label"
                      value={item.label}
                      onChange={(e) => updateNavItem(i, "label", e.target.value)}
                      className="h-8 text-sm flex-1"
                    />
                    <Input
                      placeholder="/path"
                      value={item.href}
                      onChange={(e) => updateNavItem(i, "href", e.target.value)}
                      className="h-8 text-sm flex-1"
                    />
                    <label className="flex items-center gap-1 text-xs text-gray-500 shrink-0">
                      <input type="checkbox" checked={!!item.isExternal} onChange={(e) => updateNavItem(i, "isExternal", e.target.checked)} />
                      External
                    </label>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600" onClick={() => removeNavItem(i)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Branding / Colors */}
        <Card>
          <CardHeader><CardTitle className="text-lg">Branding & Colors</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Primary Color</Label>
                <div className="flex gap-2 mt-1">
                  <input type="color" value={form.primaryColor} onChange={(e) => set("primaryColor", e.target.value)} className="h-10 w-10 rounded border cursor-pointer" />
                  <Input value={form.primaryColor} onChange={(e) => set("primaryColor", e.target.value)} />
                </div>
              </div>
              <div>
                <Label>Accent Color</Label>
                <div className="flex gap-2 mt-1">
                  <input type="color" value={form.accentColor} onChange={(e) => set("accentColor", e.target.value)} className="h-10 w-10 rounded border cursor-pointer" />
                  <Input value={form.accentColor} onChange={(e) => set("accentColor", e.target.value)} />
                </div>
              </div>
              <div>
                <Label>Footer Background</Label>
                <div className="flex gap-2 mt-1">
                  <input type="color" value={form.footerBgColor} onChange={(e) => set("footerBgColor", e.target.value)} className="h-10 w-10 rounded border cursor-pointer" />
                  <Input value={form.footerBgColor} onChange={(e) => set("footerBgColor", e.target.value)} />
                </div>
              </div>
              <div>
                <Label>Page Background</Label>
                <div className="flex gap-2 mt-1">
                  <input type="color" value={form.bgColor} onChange={(e) => set("bgColor", e.target.value)} className="h-10 w-10 rounded border cursor-pointer" />
                  <Input value={form.bgColor} onChange={(e) => set("bgColor", e.target.value)} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <Card>
          <CardHeader><CardTitle className="text-lg">Footer Settings</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <ImageField
              label="Footer Logo"
              value={form.footerLogoUrl}
              onChange={(v) => set("footerLogoUrl", v)}
              browseField="footerLogoUrl"
              browseOpen={browseField}
              onBrowseOpen={setBrowseField}
            />
            <div>
              <Label>Copyright Text</Label>
              <Input value={form.copyrightText} onChange={(e) => set("copyrightText", e.target.value)} className="mt-1" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Privacy Policy URL</Label>
                <Input value={form.privacyPolicyUrl} onChange={(e) => set("privacyPolicyUrl", e.target.value)} className="mt-1" />
              </div>
              <div>
                <Label>Terms of Service URL</Label>
                <Input value={form.termsUrl} onChange={(e) => set("termsUrl", e.target.value)} className="mt-1" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.showSocialInFooter} onCheckedChange={(v) => set("showSocialInFooter", v)} />
              <Label>Show Social Icons in Footer</Label>
            </div>

            {/* Footer Columns */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-semibold">Footer Columns</Label>
                <Button variant="outline" size="sm" onClick={addFooterColumn}>
                  <Plus className="h-3 w-3 mr-1" /> Add Column
                </Button>
              </div>
              {form.footerColumns.length === 0 && (
                <p className="text-sm text-gray-400 italic">No custom footer columns. Default links will be shown.</p>
              )}
              <div className="space-y-4">
                {form.footerColumns.map((col, ci) => (
                  <div key={ci} className="border rounded-lg p-3 bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <Input
                        placeholder="Column title"
                        value={col.title}
                        onChange={(e) => updateFooterColumn(ci, e.target.value)}
                        className="h-8 text-sm font-medium max-w-xs"
                      />
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-600" onClick={() => removeFooterColumn(ci)}>
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <div className="space-y-1 ml-2">
                      {col.links.map((link, li) => (
                        <div key={li} className="flex items-center gap-2">
                          <Input
                            placeholder="Label"
                            value={link.label}
                            onChange={(e) => updateFooterLink(ci, li, "label", e.target.value)}
                            className="h-7 text-xs flex-1"
                          />
                          <Input
                            placeholder="/path"
                            value={link.href}
                            onChange={(e) => updateFooterLink(ci, li, "href", e.target.value)}
                            className="h-7 text-xs flex-1"
                          />
                          <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-600" onClick={() => removeFooterLink(ci, li)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      <Button variant="ghost" size="sm" onClick={() => addFooterLink(ci)} className="text-xs h-7">
                        <Plus className="h-3 w-3 mr-1" /> Add Link
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader><CardTitle className="text-lg">Contact Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Address</Label>
              <Textarea value={form.address} onChange={(e) => set("address", e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={form.phone} onChange={(e) => set("phone", e.target.value)} className="mt-1" />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={form.email} onChange={(e) => set("email", e.target.value)} className="mt-1" />
            </div>
          </CardContent>
        </Card>

        {/* Social Media Links */}
        <Card>
          <CardHeader><CardTitle className="text-lg">Social Media Links</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {(["facebookUrl", "twitterUrl", "youtubeUrl", "linkedinUrl", "instagramUrl"] as const).map((key) => (
              <div key={key}>
                <Label className="capitalize">{key.replace("Url", "").replace(/([A-Z])/g, " $1")} URL</Label>
                <Input value={form[key]} onChange={(e) => set(key, e.target.value)} className="mt-1" placeholder={`https://${key.replace("Url", "").toLowerCase()}.com/...`} />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* SEO */}
        <Card>
          <CardHeader><CardTitle className="text-lg">SEO Settings</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Default SEO Title</Label>
              <Input value={form.seoTitle} onChange={(e) => set("seoTitle", e.target.value)} className="mt-1" placeholder="Green Madani International - ..." />
            </div>
            <div>
              <Label>Default Meta Description</Label>
              <Textarea value={form.seoDescription} onChange={(e) => set("seoDescription", e.target.value)} className="mt-1" placeholder="A diversified business group..." />
            </div>
            <ImageField
              label="OG Image"
              value={form.seoOgImage}
              onChange={(v) => set("seoOgImage", v)}
              browseField="seoOgImage"
              browseOpen={browseField}
              onBrowseOpen={setBrowseField}
            />
            <div>
              <Label>Keywords (comma separated)</Label>
              <Input value={form.seoKeywords} onChange={(e) => set("seoKeywords", e.target.value)} className="mt-1" placeholder="agriculture, bangladesh, business group" />
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

function ImageField({ label, value, onChange, browseField, browseOpen, onBrowseOpen }: {
  label: string;
  value: string;
  onChange: (url: string) => void;
  browseField: string;
  browseOpen: string | null;
  onBrowseOpen: (v: string | null) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="mt-1 space-y-3">
        {value && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
            <img src={value} alt={label} className="h-14 w-14 rounded object-cover border" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-500 truncate">{value}</p>
              <button className="text-xs text-red-600 hover:underline mt-1" onClick={() => onChange("")}>Remove</button>
            </div>
          </div>
        )}
        <div className="flex gap-2">
          <div className="flex-1">
            <FileUpload onUpload={onChange} accept="image/*" />
          </div>
          <Button variant="outline" size="sm" className="h-10 shrink-0" onClick={() => onBrowseOpen(browseField)}>
            <ImageIcon className="h-4 w-4 mr-1" /> Browse
          </Button>
        </div>
        <div className="relative">
          <span className="text-xs text-gray-400 absolute -top-2 left-3 bg-white px-1">or paste URL</span>
          <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://..." className="h-8 text-xs pt-3" />
        </div>
        <MediaBrowser open={browseOpen === browseField} onOpenChange={(open) => { if (!open) onBrowseOpen(null); }} onSelect={(url) => { onChange(url); onBrowseOpen(null); }} />
      </div>
    </div>
  );
}