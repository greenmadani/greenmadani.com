import { useEffect, useState } from "react";
import { adminApi } from "@/lib/admin-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
 Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
 Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

interface Category {
 id:number;
 name:string;
 slug:string;
 type:string;
 order:number;
}

const types = ["product", "business", "news"];

export default function AdminCategories() {
 const [data, setData] = useState<Category[]>([]);
 const [open, setOpen] = useState(false);
 const [edit, setEdit] = useState<Partial<Category>>({});
 const [editingId, setEditingId] = useState<number | null>(null);

 useEffect(() => { adminApi.get("/categories").then(setData); }, []);

 function openNew() {
 setEdit({ name:"", slug:"", type:"product", order:0 });
 setEditingId(null);
 setOpen(true);
 }

 function openEdit(item:Category) {
 setEdit({ ...item });
 setEditingId(item.id);
 setOpen(true);
 }

 function generateSlug(name:string) {
 return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
 }

 async function save() {
 const body = { ...edit };
 try {
 const result = editingId
 ? await adminApi.put(`/categories/${editingId}`, body)
 :await adminApi.post("/categories", body);
 if (!result) {
 toast({ title:"Save Failed", description:"No response from server.", variant:"destructive" });
 return;
 }
 if (typeof result === "object" && "error" in result) {
 toast({ title:"Save Failed", description:(result as any).error, variant:"destructive" });
 return;
 }
 toast({ title:"Saved", description:"Category saved successfully.", className:"bg-primary text-white" });
 setOpen(false);
 adminApi.get("/categories").then(setData);
 } catch (err) {
 toast({ title:"Save Failed", description:err instanceof Error ? err.message :"An unexpected error occurred", variant:"destructive" });
 }
 }

 async function remove(id:number) {
 if (!confirm("Delete this category?")) return;
 try {
 const result = await adminApi.del(`/categories/${id}`);
 if (result && typeof result === "object" && "error" in result) {
 toast({ title:"Delete Failed", description:(result as any).error, variant:"destructive" });
 return;
 }
 toast({ title:"Deleted", description:"Category removed.", className:"bg-primary text-white" });
 adminApi.get("/categories").then(setData);
 } catch (err) {
 toast({ title:"Delete Failed", description:err instanceof Error ? err.message :"An unexpected error occurred", variant:"destructive" });
 }
 }

 return (
 <div>
 <div className="flex items-center justify-between mb-6">
 <h2 className="font-display">Categories</h2>
 <Button onClick={openNew} className="bg-primary">+ New Category</Button>
 </div>

 <div className="border overflow-hidden">
 <Table>
 <TableHeader>
 <TableRow>
 <TableHead>Name</TableHead>
 <TableHead>Slug</TableHead>
 <TableHead>Type</TableHead>
 <TableHead>Order</TableHead>
 <TableHead className="w-24">Actions</TableHead>
 </TableRow>
 </TableHeader>
 <TableBody>
 {data.map((item) => (
 <TableRow key={item.id}>
 <TableCell className="font-medium">{item.name}</TableCell>
 <TableCell className="text-muted-foreground">{item.slug}</TableCell>
 <TableCell>
 <span className="capitalize text-sm bg-muted px-2 py-0.5">{item.type}</span>
 </TableCell>
 <TableCell>{item.order}</TableCell>
 <TableCell>
 <div className="flex gap-1">
 <Button variant="ghost" size="sm" onClick={() => openEdit(item)}>Edit</Button>
 <Button variant="ghost" size="sm" className="text-destructive" onClick={() => remove(item.id)}>Del</Button>
 </div>
 </TableCell>
 </TableRow>
 ))}
 </TableBody>
 </Table>
 </div>

 <Dialog open={open} onOpenChange={setOpen}>
 <DialogContent>
 <DialogHeader>
 <DialogTitle>{editingId ? "Edit Category" :"New Category"}</DialogTitle>
 </DialogHeader>
 <div className="space-y-4 py-4">
 <div>
 <Label>Name</Label>
 <Input
 value={edit.name ?? ""}
 onChange={(e) => {
 const name = e.target.value;
 setEdit({
 ...edit,
 name,
 slug:editingId ? edit.slug :generateSlug(name),
 });
 }}
 className="mt-1"
 />
 </div>
 <div>
 <Label>Slug</Label>
 <Input
 value={edit.slug ?? ""}
 onChange={(e) => setEdit({ ...edit, slug:e.target.value })}
 className="mt-1"
 />
 </div>
 <div>
 <Label>Type</Label>
 <select
 className="flex h-10 w-full border border-input bg-background px-3 py-2 text-sm mt-1"
 value={edit.type ?? "product"}
 onChange={(e) => setEdit({ ...edit, type:e.target.value })}
 >
 {types.map((t) => (
 <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
 ))}
 </select>
 </div>
 <div>
 <Label>Order</Label>
 <Input
 type="number"
 value={edit.order ?? 0}
 onChange={(e) => setEdit({ ...edit, order:Number(e.target.value) })}
 className="mt-1"
 />
 </div>
 </div>
 <div className="flex justify-end gap-2">
 <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
 <Button onClick={save} className="bg-primary">{editingId ? "Update" :"Create"}</Button>
 </div>
 </DialogContent>
 </Dialog>
 </div>
 );
}
