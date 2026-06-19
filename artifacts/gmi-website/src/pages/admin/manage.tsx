import { useEffect, useState } from "react";
import { adminApi } from "@/lib/admin-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface Entity {
  id: number;
  [key: string]: any;
}

type FormFields = { key: string; label: string; type: "text" | "textarea" | "number" | "switch" | "select"; options?: { value: string; label: string }[] }[];

const businessFields: FormFields = [
  { key: "name", label: "Name", type: "text" },
  { key: "slug", label: "Slug", type: "text" },
  { key: "industry", label: "Industry", type: "text" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "longDescription", label: "Long Description", type: "textarea" },
  { key: "imageUrl", label: "Image URL", type: "text" },
  { key: "colorAccent", label: "Color Accent", type: "text" },
  { key: "featured", label: "Featured", type: "switch" },
  { key: "order", label: "Order", type: "number" },
  { key: "targetAudience", label: "Target Audience", type: "text" },
  { key: "website", label: "Website", type: "text" },
  { key: "status", label: "Status", type: "select", options: [{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }] },
];

const productFields: FormFields = [
  { key: "name", label: "Name", type: "text" },
  { key: "category", label: "Category", type: "text" },
  { key: "categorySlug", label: "Category Slug", type: "text" },
  { key: "description", label: "Description", type: "textarea" },
  { key: "longDescription", label: "Long Description", type: "textarea" },
  { key: "imageUrl", label: "Image URL", type: "text" },
  { key: "featured", label: "Featured", type: "switch" },
  { key: "businessSlug", label: "Business Slug", type: "text" },
  { key: "status", label: "Status", type: "select", options: [{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }] },
];

const newsFields: FormFields = [
  { key: "title", label: "Title", type: "text" },
  { key: "slug", label: "Slug", type: "text" },
  { key: "excerpt", label: "Excerpt", type: "text" },
  { key: "content", label: "Content", type: "textarea" },
  { key: "category", label: "Category", type: "text" },
  { key: "imageUrl", label: "Image URL", type: "text" },
  { key: "authorName", label: "Author", type: "text" },
  { key: "status", label: "Status", type: "select", options: [{ value: "published", label: "Published" }, { value: "draft", label: "Draft" }] },
];

const jobFields: FormFields = [
  { key: "title", label: "Title", type: "text" },
  { key: "department", label: "Department", type: "text" },
  { key: "location", label: "Location", type: "text" },
  { key: "type", label: "Type", type: "select", options: [{ value: "Full-time", label: "Full-time" }, { value: "Part-time", label: "Part-time" }, { value: "Contract", label: "Contract" }, { value: "Internship", label: "Internship" }] },
  { key: "description", label: "Description", type: "textarea" },
  { key: "status", label: "Status", type: "select", options: [{ value: "open", label: "Open" }, { key: "closed", value: "closed", label: "Closed" } as any] },
];

function CrudTable({ title, endpoint, fields, columns }: { title: string; endpoint: string; fields: FormFields; columns: string[] }) {
  const [data, setData] = useState<Entity[]>([]);
  const [edit, setEdit] = useState<Record<string, any>>({});
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => { adminApi.get(endpoint).then(setData); }, [endpoint]);

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

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-display font-bold">{title}</h3>
        <Button onClick={openNew} className="bg-[#1A5C38] hover:bg-[#0D3D25]">+ New</Button>
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
            {data.map((item) => (
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
          </TableBody>
        </Table>
      </div>

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
