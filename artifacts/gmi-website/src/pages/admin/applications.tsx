import { useEffect, useState } from "react";
import { adminApi } from "@/lib/admin-api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
 Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
 Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Application {
 id:number;
 name:string;
 email:string;
 phone:string;
 position:string;
 jobId:number;
 status:string;
 coverLetter:string;
 linkedInUrl:string;
 createdAt:string;
}

const statuses = ["received", "reviewed", "shortlisted", "rejected", "hired"];

const statusColors:Record<string, string> = {
 received:"bg-muted text-muted-foreground",
 reviewed:"bg-blue-100 text-blue-700",
 shortlisted:"bg-accent text-accent",
 rejected:"bg-destructive text-destructive",
 hired:"bg-primary text-primary",
};

export default function AdminApplications() {
 const [data, setData] = useState<Application[]>([]);
 const [selected, setSelected] = useState<Application | null>(null);
 const [search, setSearch] = useState("");

 useEffect(() => { adminApi.get("/applications").then(setData); }, []);

 async function updateStatus(id:number, status:string) {
 try {
 const result = await adminApi.put(`/applications/${id}`, { status });
 if (result && typeof result === "object" && "error" in result) {
 toast({ title:"Update Failed", description:(result as any).error, variant:"destructive" });
 return;
 }
 adminApi.get("/applications").then(setData);
 } catch (err) {
 toast({ title:"Update Failed", description:err instanceof Error ? err.message :"An unexpected error occurred", variant:"destructive" });
 }
 }

 function exportCsv() {
 const headers = ["Name", "Email", "Phone", "Position", "Job ID", "Status", "Date"];
 const rows = data.map((a) => [
 a.name, a.email, a.phone, a.position, a.jobId, a.status,
 new Date(a.createdAt).toLocaleDateString(),
 ]);
 const csv = [headers.join(","), ...rows.map((r) => r.map((v) => `"${v}"`).join(","))].join("\n");
 const blob = new Blob([csv], { type:"text/csv" });
 const url = URL.createObjectURL(blob);
 const a = document.createElement("a");
 a.href = url;
 a.download = "applications.csv";
 a.click();
 URL.revokeObjectURL(url);
 }

 const filtered = data.filter((a) =>
 a.name.toLowerCase().includes(search.toLowerCase()) ||
 a.email.toLowerCase().includes(search.toLowerCase()) ||
 a.position.toLowerCase().includes(search.toLowerCase())
 );

 return (
 <div>
 <div className="flex items-center justify-between mb-6">
 <h2 className="font-display">Job Applications</h2>
 <Button onClick={exportCsv} variant="outline">
 <Download className="h-4 w-4 mr-2" />
 Export CSV
 </Button>
 </div>

 <div className="relative mb-4 max-w-sm">
 <Input
 placeholder="Search applications..."
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 />
 </div>

 <div className="border overflow-hidden">
 <Table>
 <TableHeader>
 <TableRow>
 <TableHead>Name</TableHead>
 <TableHead>Email</TableHead>
 <TableHead>Phone</TableHead>
 <TableHead>Position</TableHead>
 <TableHead>Job ID</TableHead>
 <TableHead>Status</TableHead>
 <TableHead>Date</TableHead>
 <TableHead className="w-20">Action</TableHead>
 </TableRow>
 </TableHeader>
 <TableBody>
 {filtered.map((item) => (
 <TableRow key={item.id} className="cursor-pointer" onClick={() => setSelected(item)}>
 <TableCell className="font-medium">{item.name}</TableCell>
 <TableCell>{item.email}</TableCell>
 <TableCell>{item.phone}</TableCell>
 <TableCell>{item.position}</TableCell>
 <TableCell>#{item.jobId}</TableCell>
 <TableCell>
 <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium ${statusColors[item.status] || "bg-muted text-muted-foreground"}`}>
 {item.status}
 </span>
 </TableCell>
 <TableCell className="text-muted-foreground text-sm">
 {new Date(item.createdAt).toLocaleDateString()}
 </TableCell>
 <TableCell onClick={(e) => e.stopPropagation()}>
 <select
 className="h-8 text-xs border px-1"
 value={item.status}
 onChange={(e) => updateStatus(item.id, e.target.value)}
 >
 {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
 </select>
 </TableCell>
 </TableRow>
 ))}
 {filtered.length === 0 && (
 <TableRow>
 <TableCell colSpan={8} className="text-center text-muted-foreground py-8">No applications found</TableCell>
 </TableRow>
 )}
 </TableBody>
 </Table>
 </div>

 <Dialog open={!!selected} onOpenChange={(open) => { if (!open) setSelected(null); }}>
 <DialogContent>
 <DialogHeader>
 <DialogTitle>Application Details</DialogTitle>
 </DialogHeader>
 {selected && (
 <div className="space-y-4">
 <div className="grid grid-cols-2 gap-4">
 <div>
 <Label className="text-xs text-muted-foreground">Name</Label>
 <p className="text-sm font-medium">{selected.name}</p>
 </div>
 <div>
 <Label className="text-xs text-muted-foreground">Email</Label>
 <p className="text-sm">{selected.email}</p>
 </div>
 <div>
 <Label className="text-xs text-muted-foreground">Phone</Label>
 <p className="text-sm">{selected.phone}</p>
 </div>
 <div>
 <Label className="text-xs text-muted-foreground">Position</Label>
 <p className="text-sm">{selected.position}</p>
 </div>
 <div>
 <Label className="text-xs text-muted-foreground">Job ID</Label>
 <p className="text-sm">#{selected.jobId}</p>
 </div>
 <div>
 <Label className="text-xs text-muted-foreground">Status</Label>
 <p className="text-sm">
 <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium ${statusColors[selected.status] || "bg-muted text-muted-foreground"}`}>
 {selected.status}
 </span>
 </p>
 </div>
 </div>
 {selected.coverLetter && (
 <div>
 <Label className="text-xs text-muted-foreground">Cover Letter</Label>
 <p className="text-sm mt-1 bg-muted p-3 whitespace-pre-wrap">{selected.coverLetter}</p>
 </div>
 )}
 {selected.linkedInUrl && (
 <div>
 <Label className="text-xs text-muted-foreground">LinkedIn URL</Label>
 <a href={selected.linkedInUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline block mt-1">
 {selected.linkedInUrl}
 </a>
 </div>
 )}
 </div>
 )}
 </DialogContent>
 </Dialog>
 </div>
 );
}
