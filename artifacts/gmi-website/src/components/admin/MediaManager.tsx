import { useEffect, useState } from "react";
import { Upload, Search, Trash2, Copy, Check, Image as ImageIcon, File as FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle,
  AlertDialogDescription, AlertDialogAction, AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { adminApi } from "@/lib/admin-api";
import FileUpload from "./FileUpload";

interface MediaItem {
  id: number;
  url: string;
  filename: string;
  type: string;
  size: number;
  createdAt: string;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaManager() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [search, setSearch] = useState("");
  const [viewItem, setViewItem] = useState<MediaItem | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  function load() {
    adminApi.get("/media").then(setMedia);
  }

  useEffect(() => { load(); }, []);

  async function handleDelete() {
    if (!deleteId) return;
    await adminApi.del(`/media/${deleteId}`);
    setDeleteId(null);
    setViewItem(null);
    load();
  }

  async function copyUrl(url: string) {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const filtered = media.filter((m) =>
    m.filename.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-display font-bold">Media Library</h2>
        <Button onClick={() => setShowUpload(true)} className="bg-[#1A5C38] hover:bg-[#0D3D25]">
          <Upload className="h-4 w-4 mr-2" />
          Upload
        </Button>
      </div>

      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search by filename..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="group relative aspect-square rounded-lg border bg-white overflow-hidden cursor-pointer"
            onClick={() => setViewItem(item)}
          >
            {item.type.startsWith("image/") ? (
              <img src={item.url} alt={item.filename} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-50">
                <FileIcon className="h-10 w-10 text-gray-300" />
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2 pt-6 opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-xs text-white truncate">{item.filename}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-1 right-1 h-7 w-7 p-0 bg-white/80 hover:bg-red-50 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => { e.stopPropagation(); setDeleteId(item.id); }}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="col-span-full text-center text-sm text-gray-500 py-12">No media found</p>
        )}
      </div>

      {showUpload && (
        <Dialog open={showUpload} onOpenChange={setShowUpload}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Media</DialogTitle>
            </DialogHeader>
            <FileUpload
              onUpload={() => {
                setShowUpload(false);
                load();
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      <Dialog open={!!viewItem} onOpenChange={(open) => { if (!open) setViewItem(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{viewItem?.filename}</DialogTitle>
          </DialogHeader>
          {viewItem && (
            <div className="space-y-4">
              {viewItem.type.startsWith("image/") ? (
                <img src={viewItem.url} alt={viewItem.filename} className="w-full rounded-lg max-h-64 object-contain bg-gray-50" />
              ) : (
                <div className="w-full h-32 rounded-lg bg-gray-50 flex items-center justify-center">
                  <FileIcon className="h-12 w-12 text-gray-300" />
                </div>
              )}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Filename</span>
                  <span className="font-medium">{viewItem.filename}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Type</span>
                  <Badge variant="secondary">{viewItem.type}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Size</span>
                  <span>{formatSize(viewItem.size)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Created</span>
                  <span>{new Date(viewItem.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button className="flex-1" onClick={() => copyUrl(viewItem.url)}>
                  {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  {copied ? "Copied!" : "Copy URL"}
                </Button>
                <Button variant="destructive" onClick={() => { setDeleteId(viewItem.id); setViewItem(null); }}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => { if (!open) setDeleteId(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Media</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this file? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end gap-2">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
