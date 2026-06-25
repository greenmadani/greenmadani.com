import { useState, useRef, useCallback } from "react";
import { Upload, X, File, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { adminApi } from "@/lib/admin-api";

interface FileUploadProps {
 onUpload:(url:string) => void;
 accept?:string;
 maxSize?:number;
 className?:string;
 bucket?:string;
}

export default function FileUpload({ onUpload, accept = "image/*,.pdf,.doc,.docx", maxSize = 5, className = "" }:FileUploadProps) {
 const [file, setFile] = useState<File | null>(null);
 const [preview, setPreview] = useState<string | null>(null);
 const [uploading, setUploading] = useState(false);
 const [error, setError] = useState<string | null>(null);
 const [dragging, setDragging] = useState(false);
 const inputRef = useRef<HTMLInputElement>(null);

 const validateFile = useCallback((f:File) => {
 setError(null);
 if (maxSize && f.size > maxSize * 1024 * 1024) {
 setError(`File too large. Maximum size is ${maxSize}MB.`);
 return false;
 }
 return true;
 }, [maxSize]);

 const handleFile = useCallback((f:File) => {
 if (!validateFile(f)) return;
 setFile(f);
 if (f.type.startsWith("image/")) {
 const reader = new FileReader();
 reader.onload = (e) => setPreview(e.target?.result as string);
 reader.readAsDataURL(f);
 } else {
 setPreview(null);
 }
 }, [validateFile]);

 const handleDrop = useCallback((e:React.DragEvent) => {
 e.preventDefault();
 setDragging(false);
 const f = e.dataTransfer.files[0];
 if (f) handleFile(f);
 }, [handleFile]);

 const handleDragOver = (e:React.DragEvent) => { e.preventDefault(); setDragging(true); };
 const handleDragLeave = () => setDragging(false);

 const handleInputChange = (e:React.ChangeEvent<HTMLInputElement>) => {
 const f = e.target.files?.[0];
 if (f) handleFile(f);
 };

 const clearFile = () => {
 setFile(null);
 setPreview(null);
 setError(null);
 if (inputRef.current) inputRef.current.value = "";
 };

 async function handleUpload() {
 if (!file) return;
 setUploading(true);
 setError(null);
 try {
 const url = await adminApi.upload(file);
 onUpload(url);
 clearFile();
 } catch (err) {
 setError(err instanceof Error ? err.message :"Upload failed");
 } finally {
 setUploading(false);
 }
 }

 return (
 <div className={`space-y-4 ${className}`}>
 <div
 className={`border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
 dragging ? "border-[#1A5C38] bg-[#1A5C38]/5" :"border-gray-300 hover:border-gray-400"
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
 className="hidden"
 onChange={handleInputChange}
 />
 <Upload className="mx-auto h-10 w-10 text-gray-400 mb-3" />
 <p className="text-sm text-gray-600 font-medium">Drop a file here or click to browse</p>
 <p className="text-xs text-gray-400 mt-1">Max {maxSize}MB</p>
 </div>

 {error && (
 <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2">
 <X className="h-4 w-4 shrink-0" />
 {error}
 </div>
 )}

 {file && (
 <div className="flex items-center gap-3 border p-3">
 {preview ? (
 <img src={preview} alt="Preview" className="h-12 w-12 object-cover" />
 ) :(
 <div className="h-12 w-12 bg-gray-100 flex items-center justify-center">
 <File className="h-6 w-6 text-gray-400" />
 </div>
 )}
 <div className="flex-1 min-w-0">
 <p className="text-sm font-medium truncate">{file.name}</p>
 <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
 </div>
 <Button variant="ghost" size="sm" onClick={clearFile} disabled={uploading}>
 <X className="h-4 w-4" />
 </Button>
 </div>
 )}

 {file && (
 <Button onClick={handleUpload} disabled={uploading} className="w-full bg-[#1A5C38] hover:bg-[#0D3D25]">
 {uploading ? "Uploading..." :"Upload"}
 </Button>
 )}
 </div>
 );
}
