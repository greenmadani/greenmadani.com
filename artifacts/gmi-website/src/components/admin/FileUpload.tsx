import { useState, useRef, useCallback } from "react";
import { Upload, X, File, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminApi } from "@/lib/admin-api";

interface FileUploadProps {
  onUpload:(url:string) => void;
  onUploadComplete?:() => void;
  accept?:string;
  maxSize?:number;
  className?:string;
  bucket?:string;
  multiple?:boolean;
}

interface FileEntry {
  file:File;
  preview:string | null;
}

export default function FileUpload({ onUpload, onUploadComplete, accept = "image/*,.pdf,.doc,.docx", maxSize = 5, className = "", multiple = false }:FileUploadProps) {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((f:File) => {
    if (maxSize && f.size > maxSize * 1024 * 1024) {
      setError(`File too large: ${f.name}. Maximum size is ${maxSize}MB.`);
      return false;
    }
    return true;
  }, [maxSize]);

  const readPreview = useCallback((f:File): Promise<string | null> => {
    return new Promise((resolve) => {
      if (!f.type.startsWith("image/")) return resolve(null);
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(f);
    });
  }, []);

  const addFiles = useCallback(async (incoming:FileList | File[]) => {
    setError(null);
    const entries:FileEntry[] = [];
    for (const f of Array.from(incoming)) {
      if (!validateFile(f)) continue;
      const preview = await readPreview(f);
      entries.push({ file: f, preview });
    }
    if (entries.length === 0) return;
    setFiles((prev) => multiple ? [...prev, ...entries] : entries);
  }, [validateFile, readPreview, multiple]);

  const handleDrop = useCallback(async (e:React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files.length > 0) {
      await addFiles(e.dataTransfer.files);
    }
  }, [addFiles]);

  const handleDragOver = (e:React.DragEvent) => { e.preventDefault(); setDragging(true); };
  const handleDragLeave = () => setDragging(false);

  const handleInputChange = async (e:React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await addFiles(e.target.files);
    }
  };

  const removeFile = (index:number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setError(null);
  };

  async function handleUpload() {
    if (files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      if (multiple && files.length > 1) {
        const urls = await adminApi.uploadMultiple(files.map((e) => e.file));
        urls.forEach((url) => onUpload(url));
      } else {
        const url = await adminApi.upload(files[0].file);
        onUpload(url);
      }
      setFiles([]);
      if (inputRef.current) inputRef.current.value = "";
      onUploadComplete?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        className={`border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
          dragging ? "border-[#1A5C38] bg-[#1A5C38]/5" : "border-gray-300 hover:border-gray-400"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={handleInputChange}
        />
        <Upload className="mx-auto h-10 w-10 text-gray-400 mb-3" />
        <p className="text-sm text-gray-600 font-medium">
          {multiple ? "Drop files here or click to browse" : "Drop a file here or click to browse"}
        </p>
        <p className="text-xs text-gray-400 mt-1">Max {maxSize}MB each</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2">
          <X className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {files.map((entry, i) => (
            <div key={i} className="flex items-center gap-3 border p-3">
              {entry.preview ? (
                <img src={entry.preview} alt="Preview" className="h-12 w-12 object-cover shrink-0" />
              ) : (
                <div className="h-12 w-12 bg-gray-100 flex items-center justify-center shrink-0">
                  <File className="h-6 w-6 text-gray-400" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{entry.file.name}</p>
                <p className="text-xs text-gray-500">{(entry.file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => removeFile(i)} disabled={uploading}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <Button onClick={handleUpload} disabled={uploading} className="w-full bg-[#1A5C38] hover:bg-[#0D3D25]">
          {uploading ? "Uploading..." : `Upload${files.length > 1 ? ` All (${files.length})` : ""}`}
        </Button>
      )}
    </div>
  );
}
