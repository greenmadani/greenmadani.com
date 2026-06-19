import { useEffect, useState, useMemo } from "react";
import { adminApi } from "@/lib/admin-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ChevronLeft, ChevronRight, Search, Image as ImageIcon } from "lucide-react";
import FileUpload from "@/components/admin/FileUpload";
import MediaBrowser from "@/components/admin/MediaBrowser";

interface Entity {
  id: number;
  [key: string]: any;
}

type FormField = { key: string; label: string; type: "text" | "textarea" | "number" | "switch" | "select" | "image"; options?: { value: string; label: string }[] };

const PAGE_SIZE = 15;

const businessFields: FormField[] = [
  { key: "name", label: "Name", type: "text" },
  { key: "slug", label: "Slug", type: "text" },
  { key: "industry", label: "Industry", type: "text" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "longDescription", label: "Long Description", type: "textarea" },
  { key: "imageUrl", label: "Image", type: "image" },
  { key: "colorAccent", label: "Color Accent", type: "text" },
  { key: "featured", label: "Featured", type: "switch" },
  { key: "order", label: "Order", type: "number" },
  { key: "targetAudience", label: "Target Audience", type: "text" },
  { key: "website", label: "Website", type: "text" },
  { key: "status", label: "Status", type: "select", options: [{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }] },
];

const productFields: FormField[] = [
  { key: "name", label: "Name", type: "text" },
  { key: "category", label: "Category", type: "text" },
  { key: "categorySlug", label: "Category Slug", type: "text" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "longDescription", label: "Long Description", type: "textarea" },
  { key: "imageUrl", label: "Image", type: "image" },
  { key: "featured", label: "Featured", type: "switch" },
  { key: "businessSlug", label: "Business Slug", type: "text" },
  { key: "status", label: "Status", type: "select", options: [{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }] },
];

const newsFields: FormField[] = [
  { key: "title", label: "Title", type: "text" },
  { key: "slug", label: "Slug", type: "text" },
  { key: "excerpt", label: "Excerpt", type: "text" },
  { key: "content", label: "Content", type: "textarea" },
  { key: "category", label: "Category", type: "text" },
  { key: "imageUrl", label: "Featured Image", type: "image" },
  { key: "authorName", label: "Author", type: "text" },
  { key: "authorAvatarUrl", label: "Author Avatar", type: "image" },
  { key: "status", label: "Status", type: "select", options: [{ value: "published", label: "Published" }, { value: "draft", label: "Draft" }] },
];

const jobFields: FormField[] = [
  { key: "title", label: "Title", type: "text" },
  { key: "department", label: "Department", type: "text" },
  { key: "location", label: "Location", type: "text" },
  { key: "type", label: "Type", type: "select", options: [{ value: "Full-time", label: "Full-time" }, { value: "Part-time", label: "Part-time" }, { value: "Contract", label: "Contract" }, { value: "Internship", label: "Internship" }] },
  { key: "description", label: "Description", type: "textarea" },
  { key: "status", label: "Status", type: "select", options: [{ value: "open", label: "Open" }, { value: "closed", label: "Closed" }] },
];

function CrudTable({ title, endpoint, fields, columns }: { title: string; endpoint: string; fields: FormField[]; columns: string[] }) {
  const [data, setData] = useState<Entity[]>([]);
  const [edit, setEdit] = useState<Record<string, any>>({});
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");
  const [browseField, setBrowseField] = useState<string | null>(null);

  useEffect(() => { adminApi.get(endpoint).then(setData); }, [endpoint]);

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
    const empty = Object.fromEntries(fields.map((f) => [f.key, f.type === "switch" ? false : ""]));
    setEdit(empty);
    setEditingId(null);
    setOpen(true);
  }

  function openEdit(item: Entity) {
    setEdit({ ...item });
    setEditingId(item.id);
    setOpen(true);
  }

  async function save() {
    const body = { ...edit };
    for (const f of fields) {
      if (f.type === "number") body[f.key] = Number(body[f.key]) || 0;
    }
    if (editingId) {
      await adminApi.put(`${endpoint}/${editingId}`, body);
    } else {
      await adminApi.post(endpoint, body);
    }
    setOpen(false);
    adminApi.get(endpoint).then(setData);
  }

  async function remove(id: number) {
    if (!confirm("Delete this item?")) return;
    await adminApi.del(`${endpoint}/${id}`);
    adminApi.get(endpoint).then(setData);
  }

  const uniqueStatuses = useMemo(() => {
    const s = new Set(data.map((d) => d.status).filter(Boolean));
    return Array.from(s);
  }, [data]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-display font-bold">{title}</h3>
        <Button onClick={openNew} className="bg-[#1A5C38] hover:bg-[#0D3D25]">+ New</Button>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="pl-9"
          />
        </div>
        {uniqueStatuses.length > 1 && (
          <select
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
          >
            <option value="all">All Status</option>
            {uniqueStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        )}
      </div>

      <div className="border rounded-lg overflow-hidden">
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
                      <Badge variant={item[c.toLowerCase()] === "active" || item[c.toLowerCase()] === "published" || item[c.toLowerCase()] === "open" ? "default" : "secondary"}>
                        {item[c.toLowerCase()]}
                      </Badge>
                    ) : typeof item[c.toLowerCase()] === "boolean" ? (
                      item[c.toLowerCase()] ? "Yes" : "No"
                    ) : typeof item[c.toLowerCase()] === "string" && item[c.toLowerCase()]?.length > 50 ? (
                      item[c.toLowerCase()]?.slice(0, 50) + "..."
                    ) : (
                      item[c.toLowerCase()] ?? "—"
                    )}
                  </TableCell>
                ))}
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(item)}>Edit</Button>
                    <Button variant="ghost" size="sm" className="text-red-600" onClick={() => remove(item.id)}>Del</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {paged.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length + 1} className="text-center text-gray-500 py-8">No results found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingId ? `Edit ${title.slice(0, -1)}` : `New ${title.slice(0, -1)}`}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {fields.map((f) => (
              <div key={f.key}>
                <Label>{f.label}</Label>
                {f.type === "textarea" ? (
                  <Textarea value={edit[f.key] ?? ""} onChange={(e) => setEdit({ ...edit, [f.key]: e.target.value })} className="mt-1" />
                ) : f.type === "switch" ? (
                  <div className="mt-1">
                    <Switch checked={edit[f.key] ?? false} onCheckedChange={(v) => setEdit({ ...edit, [f.key]: v })} />
                  </div>
                ) : f.type === "select" ? (
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm mt-1"
                    value={edit[f.key] ?? ""}
                    onChange={(e) => setEdit({ ...edit, [f.key]: e.target.value })}
                  >
                    <option value="">Select...</option>
                    {f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                ) : f.type === "image" ? (
                  <div className="mt-1 space-y-3">
                    {edit[f.key] && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                        <img src={edit[f.key]} alt="Preview" className="h-16 w-16 rounded object-cover border" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs text-gray-500 truncate">{edit[f.key]}</p>
                          <button
                            className="text-xs text-red-600 hover:underline mt-1"
                            onClick={() => setEdit({ ...edit, [f.key]: "" })}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <FileUpload onUpload={(url) => setEdit({ ...edit, [f.key]: url })} accept="image/*" />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-10 shrink-0"
                        onClick={() => setBrowseField(f.key)}
                      >
                        <ImageIcon className="h-4 w-4 mr-1" />
                        Browse
                      </Button>
                    </div>
                    <div className="relative">
                      <span className="text-xs text-gray-400 absolute -top-2 left-3 bg-white px-1">or paste URL</span>
                      <Input
                        value={edit[f.key] ?? ""}
                        onChange={(e) => setEdit({ ...edit, [f.key]: e.target.value })}
                        placeholder="https://..."
                        className="h-8 text-xs pt-3"
                      />
                    </div>
                    <MediaBrowser
                      open={browseField === f.key}
                      onOpenChange={(open) => { if (!open) setBrowseField(null); }}
                      onSelect={(url) => { setEdit({ ...edit, [f.key]: url }); setBrowseField(null); }}
                    />
                  </div>
                ) : (
                  <Input
                    type={f.type === "number" ? "number" : "text"}
                    value={edit[f.key] ?? ""}
                    onChange={(e) => setEdit({ ...edit, [f.key]: f.type === "number" ? Number(e.target.value) : e.target.value })}
                    className="mt-1"
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={save} className="bg-[#1A5C38] hover:bg-[#0D3D25]">{editingId ? "Update" : "Create"}</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function AdminBusinesses() {
  return <CrudTable title="Businesses" endpoint="/businesses" fields={businessFields} columns={["Name", "Industry", "Status", "Featured"]} />;
}

export function AdminProducts() {
  return <CrudTable title="Products" endpoint="/products" fields={productFields} columns={["Name", "Category", "Status", "Featured"]} />;
}

export function AdminNews() {
  return <CrudTable title="News" endpoint="/news" fields={newsFields} columns={["Title", "Category", "Status"]} />;
}

export function AdminJobs() {
  return <CrudTable title="Jobs" endpoint="/jobs" fields={jobFields} columns={["Title", "Department", "Location", "Type", "Status"]} />;
}