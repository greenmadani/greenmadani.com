import type { Request, Response, NextFunction } from "express";
import { supabaseAdmin, getSupabaseClient } from "../lib/supabase.js";

export async function requireAdmin(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or invalid authorization header" });
    return;
  }

  const client = getSupabaseClient();
  if (!client) {
    res.status(401).json({ error: "Admin authentication not configured" });
    return;
  }

  const token = authHeader.slice(7);
  const { data, error } = await client.auth.getUser(token);

  if (error || !data.user) {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }

  next();
}
