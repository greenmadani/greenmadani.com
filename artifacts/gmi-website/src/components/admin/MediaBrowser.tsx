import { useEffect, useState } from "react";
import { Search, Image as ImageIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

interface MediaBrowserProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (url: string) => void;
}

export default function MediaBrowser({ open, onOpenChange, onSelect }: MediaBrowserProps) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (open) adminApi.get("/media").then(setMedia);
  }, [open]);

  const filtered = media.filter((m) =>
    m.filename.toLowerCase().includes(search.toLowerCase())
  );

  function handleInsert() {
    const item = media.find((m) => m.id === selectedId);
    if (item) {
      onSelect(item.url);
      onOpenChange(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Media</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="library">
          <TabsList className="mb-4">
            <TabsTrigger value="library">Media Library</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
          </TabsList>

          <TabsContent value="library" className="flex-1 overflow-hidden flex flex-col">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search files..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="grid grid-cols-4 gap-3 overflow-y-auto flex-1 max-h-[50vh]">
              {filtered.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedId(item.id)}
                  className={`relative aspect-square rounded-lg border-2 overflow-hidden transition-colors ${
                    selectedId === item.id ? "border-[#1A5C38]" : "border-transparent hover:border-gray-300"
                  }`}
                >
                  {item.type.startsWith("image/") ? (
                    <img src={item.url} alt={item.filename} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="col-span-4 text-center text-sm text-gray-500 py-8">No media found</p>
              )}
            </div>

            <div className="flex justify-end mt-4 pt-4 border-t">
              <Button
                onClick={handleInsert}
                disabled={!selectedId}
                className="bg-[#1A5C38] hover:bg-[#0D3D25]"
              >
                Insert Selected
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="upload">
            <FileUpload
              onUpload={(url) => {
                onSelect(url);
                onOpenChange(false);
              }}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
