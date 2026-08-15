import { useEffect, useState } from "react";
import { adminApi } from "@/lib/admin-api";
import { CrudTable } from "@/pages/admin/manage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Search, Download, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const CROP_CATEGORIES = [
  "ধান", "গম ও দানা", "সবজি", "ফল", "তেল ও ডাল", "মাছ", "গবাদি পশু", "মসলা",
].map((c) => ({ value: c, label: c }));

const cropFields: any[] = [
  { key: "name", label: "ফসলের নাম (Bangla)", type: "text" },
  { key: "englishName", label: "English Name", type: "text" },
  { key: "category", label: "শ্রেণী", type: "select", options: CROP_CATEGORIES },
  { key: "season", label: "মৌসুম (রবি/খরিফ-১/খরিফ-২)", type: "text" },
  { key: "soilType", label: "মাটির ধরন", type: "text" },
  { key: "fertilizerNotes", label: "সার প্রণালী", type: "textarea" },
  { key: "irrigationNotes", label: "সেচের প্রয়োজন", type: "textarea" },
  { key: "seedVarietyRef", label: "বীজের জাত (Seed Variety)", type: "text" },
  { key: "expectedYield", label: "প্রত্যাশিত ফলন", type: "text" },
  { key: "imageUrl", label: "ছবি", type: "image" },
  { key: "status", label: "Status", type: "select", options: [{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }] },
];

const diseaseFields: any[] = [
  { key: "name", label: "রোগ/পোকার নাম (Bangla)", type: "text" },
  { key: "cropName", label: "আক্রান্ত ফসল", type: "text" },
  { key: "category", label: "শ্রেণী", type: "select", options: CROP_CATEGORIES },
  { key: "causeType", label: "কারণের ধরন", type: "select", options: [
    { value: "fungal", label: "ছত্রাকজনিত (Fungal)" },
    { value: "bacterial", label: "ব্যাকটেরিয়াজনিত (Bacterial)" },
    { value: "viral", label: "ভাইরাসজনিত (Viral)" },
    { value: "insect", label: "পোকামাকড়জনিত (Insect)" },
  ]},
  { key: "causeNotes", label: "কারণ বিস্তারিত", type: "textarea" },
  { key: "symptoms", label: "উপসর্গ (এক লাইনে একটি)", type: "array" },
  { key: "treatmentText", label: "চিকিৎসা", type: "textarea" },
  { key: "preventionSteps", label: "প্রতিরোধ (এক লাইনে একটি)", type: "array" },
  { key: "relatedProductIds", label: "সংশ্লিষ্ট পণ্য ID (এক লাইনে একটি)", type: "array" },
  { key: "imageUrl", label: "ছবি", type: "image" },
  { key: "status", label: "Status", type: "select", options: [{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }] },
];

const seasonFields: any[] = [
  { key: "name", label: "মৌসুমের নাম (Bangla)", type: "text" },
  { key: "englishName", label: "English Name", type: "text" },
  { key: "description", label: "বর্ণনা", type: "textarea" },
  { key: "months", label: "মাস (যেমন: অক্টোবর – মার্চ)", type: "text" },
  { key: "sowingWindow", label: "বপনের সময়", type: "text" },
  { key: "transplantingWindow", label: "রোপণের সময়", type: "text" },
  { key: "harvestWindow", label: "ফলনের সময়", type: "text" },
  { key: "applicableCrops", label: "উপযোগী ফসল (এক লাইনে একটি)", type: "array" },
  { key: "status", label: "Status", type: "select", options: [{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }] },
];

const PAGE_SIZE = 15;

function AdminAdvisoryInquiries() {
  const [data, setData] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);

  useEffect(() => { adminApi.get("/advisory-inquiries").then(setData); }, []);

  const filtered = data.filter((item) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return [item.name, item.phone, item.district, item.crop, item.question].some((v) => String(v ?? "").toLowerCase().includes(q));
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  async function remove(id: number) {
    if (!confirm("Delete this inquiry?")) return;
    try {
      const result = await adminApi.del(`/advisory-inquiries/${id}`);
      if (result && typeof result === "object" && "error" in result) {
        toast({ title: "Delete Failed", description: (result as any).error, variant: "destructive" });
        return;
      }
      toast({ title: "Deleted", description: "Inquiry removed.", className: "bg-primary text-white" });
      setData((d) => d.filter((x) => x.id !== id));
    } catch (err) {
      toast({ title: "Delete Failed", description: err instanceof Error ? err.message : "Unexpected error", variant: "destructive" });
    }
  }

  async function handleExport() {
    const { getAdminToken } = await import("@/lib/supabase");
    const token = await getAdminToken();
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    fetch("/api/admin/advisory-inquiries/export", { headers })
      .then((res) => res.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "advisory-inquiries-export.csv";
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch(() => toast({ title: "Export Failed", description: "Could not export inquiries", variant: "destructive" }));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display">কৃষি পরামর্শ প্রশ্নসমূহ</h3>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="h-3.5 w-3.5 mr-1" /> Export
        </Button>
      </div>

      <div className="relative flex-1 max-w-xs mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }} className="pl-9" />
      </div>

      <div className="border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>District</TableHead>
              <TableHead>Crop</TableHead>
              <TableHead>Question</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paged.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>{item.phone}</TableCell>
                <TableCell>{item.district ?? "—"}</TableCell>
                <TableCell>{item.crop ?? "—"}</TableCell>
                <TableCell className="max-w-xs truncate">{item.question}</TableCell>
                <TableCell className="whitespace-nowrap text-sm">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "—"}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" className="text-destructive" onClick={() => remove(item.id)}>Del</Button>
                </TableCell>
              </TableRow>
            ))}
            {paged.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground py-8">No inquiries yet</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
          <span>{filtered.length} total</span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" disabled={page === 0} onClick={() => setPage(page - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span>{page + 1} / {totalPages}</span>
            <Button variant="ghost" size="sm" disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminAgriAdvisory() {
  return (
    <div className="font-bangla">
      <div className="mb-6">
        <h2 className="font-display text-2xl mb-1">Agri Advisory — কৃষি পরামর্শ সেবা</h2>
        <p className="text-sm text-muted-foreground">Manage crops, disease & pest guides, seasons and farmer inquiries.</p>
      </div>
      <Tabs defaultValue="crops">
        <TabsList className="grid w-full max-w-xl grid-cols-4 bg-gray-200 h-12 p-1">
          <TabsTrigger value="crops" className="font-bold data-[state=active]:bg-primary data-[state=active]:text-white text-xs">Crops</TabsTrigger>
          <TabsTrigger value="diseases" className="font-bold data-[state=active]:bg-primary data-[state=active]:text-white text-xs">Diseases</TabsTrigger>
          <TabsTrigger value="seasons" className="font-bold data-[state=active]:bg-primary data-[state=active]:text-white text-xs">Seasons</TabsTrigger>
          <TabsTrigger value="inquiries" className="font-bold data-[state=active]:bg-primary data-[state=active]:text-white text-xs">Inquiries</TabsTrigger>
        </TabsList>

        <TabsContent value="crops" className="mt-6">
          <CrudTable title="Crops" endpoint="/crops" fields={cropFields} columns={["Name", "Category", "Season", "Status"]} />
        </TabsContent>
        <TabsContent value="diseases" className="mt-6">
          <CrudTable title="Diseases" endpoint="/diseases" fields={diseaseFields} columns={["Name", "CropName", "Category", "CauseType", "Status"]} />
        </TabsContent>
        <TabsContent value="seasons" className="mt-6">
          <CrudTable title="Seasons" endpoint="/seasons" fields={seasonFields} columns={["Name", "EnglishName", "Months", "Status"]} />
        </TabsContent>
        <TabsContent value="inquiries" className="mt-6">
          <AdminAdvisoryInquiries />
        </TabsContent>
      </Tabs>
      <div className="mt-6 bg-muted border border-border p-4 text-sm text-muted-foreground">
        <p className="font-semibold text-foreground mb-1">Note on related products</p>
        <p>
          In the <Badge variant="secondary">Diseases</Badge> tab, <code className="bg-background px-1">relatedProductIds</code> must contain product IDs
          (one per line). Find product IDs on the <a href="/admin/products" className="text-primary underline">Products</a> page.
        </p>
      </div>
    </div>
  );
}
