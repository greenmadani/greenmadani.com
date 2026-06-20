import { useEffect, useState } from "react";
import { adminApi } from "@/lib/admin-api";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";

const statuses = ["new", "reviewed", "replied", "archived"];

function InquiryTable({ title, endpoint, columns }: { title: string; endpoint: string; columns: string[] }) {
  const [data, setData] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => { adminApi.get(endpoint).then(setData); }, [endpoint]);

  async function updateStatus(id: number, status: string) {
    try {
      const result = await adminApi.put(`${endpoint}/${id}`, { status });
      if (result && typeof result === "object" && "error" in result) {
        toast({ title: "Update Failed", description: (result as any).error, variant: "destructive" });
        return;
      }
      adminApi.get(endpoint).then(setData);
    } catch (err) {
      toast({ title: "Update Failed", description: err instanceof Error ? err.message : "An unexpected error occurred", variant: "destructive" });
    }
  }

  return (
    <div>
      <h3 className="text-xl font-display font-bold mb-4">{title}</h3>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((c) => <TableHead key={c}>{c}</TableHead>)}
              <TableHead className="w-24">Status</TableHead>
              <TableHead className="w-20">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                {columns.map((c) => (
                  <TableCell key={c}>{item[c.toLowerCase()] ?? "—"}</TableCell>
                ))}
                <TableCell>
                  <Badge variant={item.status === "new" ? "default" : "secondary"}>{item.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => setSelected(item)}>View</Button>
                    <select
                      className="h-8 text-xs rounded border px-1"
                      value={item.status}
                      onChange={(e) => updateStatus(item.id, e.target.value)}
                    >
                      {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Inquiry Details</DialogTitle></DialogHeader>
          {selected && (
            <div className="space-y-3">
              {Object.entries(selected).filter(([k]) => k !== "id" && k !== "createdAt").map(([k, v]) => (
                <div key={k}>
                  <Label className="text-xs text-muted-foreground capitalize">{k.replace(/_/g, " ")}</Label>
                  <p className="text-sm">{String(v ?? "—")}</p>
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function AdminContacts() {
  return <InquiryTable title="Contact Inquiries" endpoint="/contacts" columns={["Name", "Email", "Subject", "Created"]} />;
}

export function AdminBizInquiries() {
  return <InquiryTable title="Business Inquiries" endpoint="/business-inquiries" columns={["Name", "Email", "Company", "Inquiry Type", "Created"]} />;
}
