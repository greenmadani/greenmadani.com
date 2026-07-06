import { Router } from "express";
import multer from "multer";
import path from "node:path";
import crypto from "node:crypto";
import { supabase, mapRows, snakeToCamel } from "@workspace/db";
import { getSupabaseClient } from "../lib/supabase.js";
import { requireAdmin } from "../middlewares/auth.js";

const router = Router();
router.use(requireAdmin);

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml", "application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`Unsupported file type: ${file.mimetype}`));
    }
  },
});

const BUCKET = "site-media";

async function processFile(file: Express.Multer.File) {
  const ext = path.extname(file.originalname);
  const storageId = `${crypto.randomUUID()}${ext}`;
  const objectPath = `uploads/${storageId}`;

  const storageClient = getSupabaseClient();
  if (!storageClient) {
    throw new Error("Storage not configured");
  }

  const { error: uploadError } = await storageClient.storage
    .from(BUCKET)
    .upload(objectPath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data: urlData } = storageClient.storage
    .from(BUCKET)
    .getPublicUrl(objectPath);

  const publicUrl = urlData?.publicUrl;

  const { data: inserted, error: insertError } = await supabase!.from("media").insert({
    filename: file.originalname,
    original_name: file.originalname,
    mime_type: file.mimetype,
    size: file.size,
    url: publicUrl,
    bucket: BUCKET,
    path: objectPath,
  }).select();

  if (insertError) {
    throw new Error(insertError.message);
  }

  return snakeToCamel(inserted![0]);
}

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file provided" });
    }
    const result = await processFile(file);
    res.status(201).json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Upload failed";
    res.status(500).json({ error: message });
  }
});

router.post("/upload-multiple", upload.array("files", 50), async (req, res) => {
  try {
    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) {
      return res.status(400).json({ error: "No files provided" });
    }
    const results = [];
    const errors = [];
    for (const file of files) {
      try {
        const result = await processFile(file);
        results.push(result);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Upload failed";
        errors.push({ filename: file.originalname, error: message });
      }
    }
    res.status(201).json({ items: results, errors });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Upload failed";
    res.status(500).json({ error: message });
  }
});

router.get("/media", async (_req, res) => {
  const { data, error } = await supabase!.from("media").select("*").order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(mapRows(data ?? []));
});

router.delete("/media/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  const { data: record, error: fetchError } = await supabase!.from("media").select("*").eq("id", id).single();
  if (fetchError) return res.status(404).json({ error: "Media not found" });

  const storageClient = getSupabaseClient();
  if (storageClient && record) {
    const { error: storageError } = await storageClient.storage
      .from(record.bucket)
      .remove([record.path]);
    if (storageError) {
      console.error("Storage delete error:", storageError.message);
    }
  }

  const { error: deleteError } = await supabase!.from("media").delete().eq("id", id);
  if (deleteError) return res.status(500).json({ error: deleteError.message });

  res.status(204).end();
});

router.get("/media/upload-url", async (_req, res) => {
  res.json({ uploadUrl: null, message: "Presigned upload URL not implemented. Use POST /upload instead." });
});

export default router;
