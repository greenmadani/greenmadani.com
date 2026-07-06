import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { adminApi } from "@/lib/admin-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
 Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
 Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ChevronLeft, ChevronRight, Search, Upload, Download, FileUp, Image as ImageIcon, Bold, Italic, List } from "lucide-react";
import MediaBrowser from "@/components/admin/MediaBrowser";
import { toast } from "@/hooks/use-toast";

interface Entity {
 id:number;
 [key:string]:any;
}

type FormField = { key:string; label:string; type:"text" | "textarea" | "number" | "switch" | "select" | "image" | "array" | "categories" | "richtext"; options?:{ value:string; label:string }[] };

const PAGE_SIZE = 15;

const businessFields:FormField[] = [
 { key:"name", label:"Name", type:"text" },
 { key:"slug", label:"Slug", type:"text" },
 { key:"industry", label:"Industry", type:"text" },
  { key:"description", label:"Description", type:"textarea" },
  { key:"longDescription", label:"Long Description", type:"richtext" },
  { key:"imageUrl", label:"Image", type:"image" },
  { key:"colorAccent", label:"Color Accent", type:"text" },
 { key:"featured", label:"Featured", type:"switch" },
 { key:"order", label:"Order", type:"number" },
 { key:"services", label:"Services (one per line)", type:"array" },
 { key:"targetAudience", label:"Target Audience", type:"text" },
 { key:"website", label:"Website", type:"text" },
 { key:"status", label:"Status", type:"select", options:[{ value:"active", label:"Active" }, { value:"inactive", label:"Inactive" }] },
];

const productFields:FormField[] = [
 { key:"name", label:"Name", type:"text" },
 { key:"category", label:"Category", type:"categories" },
 { key:"description", label:"Description", type:"textarea" },
 { key:"longDescription", label:"Long Description", type:"textarea" },
 { key:"imageUrl", label:"Image", type:"image" },
 { key:"featured", label:"Featured", type:"switch" },
 { key:"businessSlug", label:"Business Slug", type:"text" },
 { key:"status", label:"Status", type:"select", options:[{ value:"active", label:"Active" }, { value:"inactive", label:"Inactive" }] },
];

const newsFields:FormField[] = [
 { key:"title", label:"Title", type:"text" },
 { key:"slug", label:"Slug", type:"text" },
 { key:"excerpt", label:"Excerpt", type:"text" },
 { key:"content", label:"Content", type:"textarea" },
 { key:"category", label:"Category", type:"text" },
 { key:"imageUrl", label:"Featured Image", type:"image" },
 { key:"authorName", label:"Author", type:"text" },
 { key:"authorAvatarUrl", label:"Author Avatar", type:"image" },
 { key:"status", label:"Status", type:"select", options:[{ value:"published", label:"Published" }, { value:"draft", label:"Draft" }] },
];

const jobFields:FormField[] = [
 { key:"title", label:"Title", type:"text" },
 { key:"department", label:"Department", type:"text" },
 { key:"location", label:"Location", type:"text" },
 { key:"type", label:"Type", type:"select", options:[{ value:"Full-time", label:"Full-time" }, { value:"Part-time", label:"Part-time" }, { value:"Contract", label:"Contract" }, { value:"Internship", label:"Internship" }] },
 { key:"description", label:"Description", type:"textarea" },
 { key:"status", label:"Status", type:"select", options:[{ value:"open", label:"Open" }, { value:"closed", label:"Closed" }] },
];

function ImageUploadField({ value, onChange, onBrowse }:{ value:string; onChange:(url:string) => void; onBrowse:() => void }) {
 const [uploading, setUploading] = useState(false);
 const [error, setError] = useState<string | null>(null);
 const inputRef = useRef<HTMLInputElement>(null);

 async function handleFile(file: File) {
  if (!file.type.startsWith("image/")) {
   setError("Only image files are allowed");
   return;
  }
  if (file.size > 10 * 1024 * 1024) {
   setError("File too large. Maximum size is 10MB.");
   return;
  }
  setError(null);
  setUploading(true);
  try {
   const url = await adminApi.upload(file);
   onChange(url);
  } catch (err) {
   setError(err instanceof Error ? err.message : "Upload failed");
  } finally {
   setUploading(false);
  }
 }

 return (
  <div className="mt-1 space-y-2">
   {value && (
    <div className="flex items-center gap-3 p-2 bg-muted border">
     <img src={value} alt="Preview" className="h-14 w-14 object-cover border shrink-0" />
     <div className="flex-1 min-w-0">
      <p className="text-xs text-muted-foreground truncate">{value}</p>
      <button className="text-xs text-destructive hover:underline mt-0.5" onClick={() => onChange("")}>Remove</button>
     </div>
    </div>
   )}
   <div className="flex gap-2">
    <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) { handleFile(f); e.target.value = ""; } }} />
    <Button type="button" variant="outline" size="sm" disabled={uploading} onClick={() => inputRef.current?.click()} className="h-9">
     <Upload className="h-3.5 w-3.5 mr-1.5" />
     {uploading ? "Uploading..." : "Upload Image"}
    </Button>
    <Button type="button" variant="outline" size="sm" onClick={onBrowse} className="h-9">
     <ImageIcon className="h-3.5 w-3.5 mr-1.5" />
     Browse
    </Button>
   </div>
   {error && <p className="text-xs text-destructive">{error}</p>}
   <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Or paste image URL..." className="h-8 text-xs" />
  </div>
 );
}

function CrudTable({ title, endpoint, fields, columns, headerExtra }:{ title:string; endpoint:string; fields:FormField[]; columns:string[]; headerExtra?:React.ReactNode }) {
 const [data, setData] = useState<Entity[]>([]);
 const [edit, setEdit] = useState<Record<string, any>>({});
 const [open, setOpen] = useState(false);
 const [editingId, setEditingId] = useState<number | null>(null);
 const [search, setSearch] = useState("");
 const [page, setPage] = useState(0);
 const [statusFilter, setStatusFilter] = useState("all");
  const [browseField, setBrowseField] = useState<string | null>(null);
  const [catOptions, setCatOptions] = useState<{value:string;label:string}[]>([]);

  useEffect(() => { adminApi.get(endpoint).then(setData); }, [endpoint]);

  const hasCategoryField = useMemo(() => fields.some((f) => f.type === "categories"), [fields]);
  useEffect(() => {
   if (hasCategoryField) {
    adminApi.get("/categories").then((data) => {
     const list = (data ?? []).filter((c:any) => c.type === "product").map((c:any) => ({ value: c.slug, label: c.name }));
     setCatOptions(list);
    });
   }
  }, [hasCategoryField]);

 const filtered = useMemo(() => {
 let items = data;
 if (search) {
 const q = search.toLowerCase();
 items = items.filter((item) =>
 columns.some((c) => String(item[c.toLowerCase()] ?? "").toLowerCase().includes(q))
 );
 }
 if (statusFilter !== "all") {
 items = items.filter((item) => item.status === statusFilter);
 }
 return items;
 }, [data, search, statusFilter, columns]);

 const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
 const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

 function openNew() {
 const empty = Object.fromEntries(fields.map((f) => [f.key, f.type === "switch" ? false :""]));
 setEdit(empty);
 setEditingId(null);
 setOpen(true);
 }

 function openEdit(item:Entity) {
 setEdit({ ...item });
 setEditingId(item.id);
 setOpen(true);
 }

  async function save() {
  const body = { ...edit };
  for (const f of fields) {
  if (f.type === "number") body[f.key] = Number(body[f.key]) || 0;
  if (f.type === "array") body[f.key] = typeof body[f.key] === "string" ? body[f.key].split("\n").filter(Boolean) : (body[f.key] ?? []);
  }
 try {
 const result = editingId
 ? await adminApi.put(`${endpoint}/${editingId}`, body)
 :await adminApi.post(endpoint, body);
 if (!result) {
 toast({ title:"Save Failed", description:"No response from server.", variant:"destructive" });
 return;
 }
 if (typeof result === "object" && "error" in result) {
 toast({ title:"Save Failed", description:(result as any).error, variant:"destructive" });
 return;
 }
 toast({ title:"Saved", description:"Changes saved successfully.", className:"bg-primary text-white" });
 setOpen(false);
 adminApi.get(endpoint).then(setData);
 } catch (err) {
 toast({ title:"Save Failed", description:err instanceof Error ? err.message :"An unexpected error occurred", variant:"destructive" });
 }
 }

 async function remove(id:number) {
 if (!confirm("Delete this item?")) return;
 try {
 const result = await adminApi.del(`${endpoint}/${id}`);
 if (result && typeof result === "object" && "error" in result) {
 toast({ title:"Delete Failed", description:(result as any).error, variant:"destructive" });
 return;
 }
 toast({ title:"Deleted", description:"Item removed successfully.", className:"bg-primary text-white" });
 adminApi.get(endpoint).then(setData);
 } catch (err) {
 toast({ title:"Delete Failed", description:err instanceof Error ? err.message :"An unexpected error occurred", variant:"destructive" });
 }
 }

 const uniqueStatuses = useMemo(() => {
 const s = new Set(data.map((d) => d.status).filter(Boolean));
 return Array.from(s);
 }, [data]);

  return (
  <div>
  <div className="flex items-center justify-between mb-4">
  <h3 className="font-display">{title}</h3>
  <div className="flex items-center gap-2">
  {headerExtra}
  <Button onClick={openNew}>+ New</Button>
  </div>
  </div>

 <div className="flex items-center gap-3 mb-4">
 <div className="relative flex-1 max-w-xs">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
 <Input
 placeholder="Search..."
 value={search}
 onChange={(e) => { setSearch(e.target.value); setPage(0); }}
 className="pl-9"
 />
 </div>
 {uniqueStatuses.length > 1 && (
 <select
 className="h-10 border border-input bg-background px-3 text-sm"
 value={statusFilter}
 onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
 >
 <option value="all">All Status</option>
 {uniqueStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
 </select>
 )}
 </div>

 <div className="border overflow-hidden">
 <Table>
 <TableHeader>
 <TableRow>
 {columns.map((c) => <TableHead key={c}>{c}</TableHead>)}
 <TableHead className="w-24">Actions</TableHead>
 </TableRow>
 </TableHeader>
 <TableBody>
 {paged.map((item) => (
 <TableRow key={item.id}>
 {columns.map((c) => (
 <TableCell key={c}>
 {c === "status" ? (
 <Badge variant={item[c.toLowerCase()] === "active" || item[c.toLowerCase()] === "published" || item[c.toLowerCase()] === "open" ? "default" :"secondary"}>
 {item[c.toLowerCase()]}
 </Badge>
 ) :typeof item[c.toLowerCase()] === "boolean" ? (
 item[c.toLowerCase()] ? "Yes" :"No"
 ) :typeof item[c.toLowerCase()] === "string" && item[c.toLowerCase()]?.length > 50 ? (
 item[c.toLowerCase()]?.slice(0, 50) + "..."
 ) :(
 item[c.toLowerCase()] ?? "—"
 )}
 </TableCell>
 ))}
 <TableCell>
 <div className="flex gap-1">
 <Button variant="ghost" size="sm" onClick={() => openEdit(item)}>Edit</Button>
 <Button variant="ghost" size="sm" className="text-destructive" onClick={() => remove(item.id)}>Del</Button>
 </div>
 </TableCell>
 </TableRow>
 ))}
 {paged.length === 0 && (
 <TableRow>
 <TableCell colSpan={columns.length + 1} className="text-center text-muted-foreground py-8">No results found</TableCell>
 </TableRow>
 )}
 </TableBody>
 </Table>
 </div>

 {totalPages > 1 && (
 <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
 <span>{filtered.length} total items</span>
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

  <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditingId(null); setBrowseField(null); } }}>
  <DialogContent className="!gap-0 !p-0 max-w-2xl">
  <DialogHeader className="p-6 pb-0">
  <DialogTitle>{editingId ? `Edit ${title.slice(0, -1)}` :`New ${title.slice(0, -1)}`}</DialogTitle>
  </DialogHeader>
  <div className="overflow-y-auto p-6 max-h-[55vh] space-y-4">
   {fields.map((f) => (
   <div key={f.key}>
   <Label>{f.label}</Label>
    {f.type === "textarea" ? (
    <Textarea value={edit[f.key] ?? ""} onChange={(e) => setEdit({ ...edit, [f.key]:e.target.value })} className="mt-1" />
    ) :f.type === "richtext" ? (
    <div className="mt-1 border border-input rounded-sm overflow-hidden">
     <div className="flex gap-0.5 p-1 bg-muted border-b border-input">
      <button type="button" className="p-1.5 hover:bg-background rounded-sm" onClick={() => document.execCommand('bold')} title="Bold"><Bold size={14} /></button>
      <button type="button" className="p-1.5 hover:bg-background rounded-sm" onClick={() => document.execCommand('italic')} title="Italic"><Italic size={14} /></button>
      <button type="button" className="p-1.5 hover:bg-background rounded-sm" onClick={() => document.execCommand('insertUnorderedList')} title="List"><List size={14} /></button>
     </div>
     <div
      contentEditable
      suppressContentEditableWarning
      className="min-h-[200px] p-3 text-sm focus:outline-none prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{ __html: edit[f.key] ?? "" }}
      onInput={(e) => setEdit({ ...edit, [f.key]: (e.target as HTMLDivElement).innerHTML })}
     />
    </div>
    ) :f.type === "array" ? (
   <Textarea
   value={Array.isArray(edit[f.key]) ? (edit[f.key] as string[]).join("\n") : (edit[f.key] ?? "")}
   onChange={(e) => setEdit({ ...edit, [f.key]:e.target.value })}
   className="mt-1 font-mono text-xs"
   rows={6}
   placeholder="Enter one item per line..."
   />
   ) :f.type === "switch" ? (
   <div className="mt-1">
   <Switch checked={edit[f.key] ?? false} onCheckedChange={(v) => setEdit({ ...edit, [f.key]:v })} />
   </div>
   ) :f.type === "select" ? (
   <select
   className="flex h-10 w-full border border-input bg-background px-3 py-2 text-sm mt-1"
   value={edit[f.key] ?? ""}
   onChange={(e) => setEdit({ ...edit, [f.key]:e.target.value })}
   >
   <option value="">Select...</option>
   {f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
   </select>
    ) :f.type === "categories" ? (
    <select
    className="flex h-10 w-full border border-input bg-background px-3 py-2 text-sm mt-1"
    value={edit.categorySlug ?? edit.category ?? ""}
    onChange={(e) => {
     const slug = e.target.value;
     const opt = catOptions.find((o) => o.value === slug);
     setEdit({ ...edit, category: opt?.label ?? slug, categorySlug: slug });
    }}
    >
    <option value="">Select category...</option>
    {catOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
    ) :f.type === "image" ? (
     <ImageUploadField
     value={edit[f.key] ?? ""}
     onChange={(url) => setEdit({ ...edit, [f.key]:url })}
     onBrowse={() => setBrowseField(f.key)}
     />
     ) :(
   <Input
   type={f.type === "number" ? "number" :"text"}
   value={edit[f.key] ?? ""}
   onChange={(e) => setEdit({ ...edit, [f.key]:f.type === "number" ? Number(e.target.value) :e.target.value })}
   className="mt-1"
   />
   )}
   </div>
   ))}
   </div>
   <MediaBrowser
   open={browseField !== null}
   onOpenChange={(open) => { if (!open) setBrowseField(null); }}
   onSelect={(url) => {
    if (browseField) setEdit({ ...edit, [browseField]: url });
    setBrowseField(null);
   }}
   />
   <div className="flex justify-end gap-2 p-6 border-t">
   <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
   <Button onClick={save}>{editingId ? "Update" :"Create"}</Button>
   </div>
   </DialogContent>
   </Dialog>
 </div>
 );
}

export function AdminBusinesses() {
 return <CrudTable title="Businesses" endpoint="/businesses" fields={businessFields} columns={["Name", "Industry", "Status", "Featured"]} />;
}

function ProductImportDialog({ open, onOpenChange, onDone }:{ open:boolean; onOpenChange:(v:boolean) => void; onDone:() => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<{ inserted:number; errors?:{ row:number; message:string }[] } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const reset = useCallback(() => {
    setFile(null);
    setResult(null);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  async function handleImport() {
    if (!file) return;
    setUploading(true);
    setResult(null);
    try {
      const res = await adminApi.importCsv("/products/import", file);
      setResult(res);
      if (res?.errors?.length === 0) {
        toast({ title:"Import Complete", description:`${res.inserted} products imported successfully.`, className:"bg-primary text-white" });
      }
    } catch (err) {
      toast({ title:"Import Failed", description:err instanceof Error ? err.message : "Import failed", variant:"destructive" });
    } finally {
      setUploading(false);
    }
  }

  function downloadTemplate() {
    const headers = ["Name", "Category", "CategorySlug", "Description", "LongDescription", "ImageUrl", "Featured", "BusinessSlug", "Tags", "Status"];
    const row = ["Example Product", "Agriculture", "agriculture", "Product description here", "", "", "No", "", "", "active"];
    const csv = [headers.join(","), row.join(",")].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "product-import-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { onOpenChange(false); setTimeout(reset, 200); } }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Import Products from CSV</DialogTitle>
          <DialogDescription>
            Upload a CSV file with product data.{" "}
            <button onClick={downloadTemplate} className="text-[#1A5C38] underline hover:no-underline font-medium">Download template</button>
          </DialogDescription>
        </DialogHeader>

        {!result ? (
          <div className="space-y-4">
            <div
              className="border-2 border-dashed p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
              onClick={() => inputRef.current?.click()}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) setFile(f); }}
              />
              <FileUp className="mx-auto h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-600 font-medium">
                {file ? file.name : "Click to select CSV file"}
              </p>
              {file && (
                <p className="text-xs text-gray-400 mt-1">{(file.size / 1024).toFixed(1)} KB</p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button onClick={handleImport} disabled={!file || uploading} className="bg-[#1A5C38] hover:bg-[#0D3D25]">
                {uploading ? "Importing..." : "Import"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 p-4 text-center">
              <p className="text-lg font-bold text-green-700">{result.inserted}</p>
              <p className="text-sm text-green-600">products imported successfully</p>
            </div>
            {result.errors && result.errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 p-3 max-h-40 overflow-y-auto">
                <p className="text-sm font-medium text-red-700 mb-1">{result.errors.length} row(s) skipped:</p>
                {result.errors.map((e, i) => (
                  <p key={i} className="text-xs text-red-600">Row {e.row}: {e.message}</p>
                ))}
              </div>
            )}
            <div className="flex justify-end">
              <Button onClick={() => { reset(); onDone(); onOpenChange(false); }}>Done</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function AdminProducts() {
  const [showImport, setShowImport] = useState(false);
  const [importKey, setImportKey] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  async function handleExport() {
    const { getAdminToken } = await import("@/lib/supabase");
    const token = await getAdminToken();
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    fetch("/api/admin/products/export", { headers })
      .then((res) => res.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "products-export.csv";
        a.click();
        URL.revokeObjectURL(url);
      })
      .catch(() => toast({ title:"Export Failed", description:"Could not export products", variant:"destructive" }));
  }

  const headerExtra = (
    <>
      <Button variant="outline" size="sm" onClick={handleExport}>
        <Download className="h-3.5 w-3.5 mr-1" />
        Export
      </Button>
      <Button variant="outline" size="sm" onClick={() => setShowImport(true)}>
        <FileUp className="h-3.5 w-3.5 mr-1" />
        Import
      </Button>
      <ProductImportDialog
        key={importKey}
        open={showImport}
        onOpenChange={(v) => { setShowImport(v); if (!v) { setImportKey((k) => k + 1); setRefreshKey((k) => k + 1); } }}
        onDone={() => setRefreshKey((k) => k + 1)}
      />
    </>
  );

  return (
    <CrudTable
      key={refreshKey}
      title="Products"
      endpoint="/products"
      fields={productFields}
      columns={["Name", "Category", "Status", "Featured"]}
      headerExtra={headerExtra}
    />
  );
}

export function AdminNews() {
 return <CrudTable title="News" endpoint="/news" fields={newsFields} columns={["Title", "Category", "Status"]} />;
}

export function AdminJobs() {
 return <CrudTable title="Jobs" endpoint="/jobs" fields={jobFields} columns={["Title", "Department", "Location", "Type", "Status"]} />;
}