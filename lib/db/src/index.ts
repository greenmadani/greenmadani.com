import { createClient } from "@supabase/supabase-js";
import * as schema from "./schema/index.js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn(
    "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_ANON_KEY) must be set for database operations.",
  );
}

export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    })
  : null;

export async function query(table: string, options?: { limit?: number; offset?: number; orderBy?: { column: string; ascending?: boolean } }) {
  if (!supabase) throw new Error("Supabase client not initialized");
  let q = supabase.from(table).select("*");
  if (options?.orderBy) q = q.order(options.orderBy.column, { ascending: options.orderBy.ascending ?? true });
  if (options?.limit) q = q.limit(options.limit);
  if (options?.offset) q = q.offset(options.offset);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function queryById(table: string, id: number) {
  if (!supabase) throw new Error("Supabase client not initialized");
  const { data, error } = await supabase.from(table).select("*").eq("id", id).single();
  if (error) throw new Error(error.message);
  return data;
}

export async function insertRow(table: string, values: Record<string, unknown>) {
  if (!supabase) throw new Error("Supabase client not initialized");
  const { data, error } = await supabase.from(table).insert(values).select();
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function updateRow(table: string, id: number, values: Record<string, unknown>) {
  if (!supabase) throw new Error("Supabase client not initialized");
  const { data, error } = await supabase.from(table).update(values).eq("id", id).select();
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function deleteRow(table: string, id: number) {
  if (!supabase) throw new Error("Supabase client not initialized");
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export function camelToSnake(obj: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key.replace(/[A-Z]/g, (c) => `_${c.toLowerCase()}`)] = value;
  }
  return result;
}

export function snakeToCamel<T = Record<string, unknown>>(obj: Record<string, unknown>): T {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key.replace(/_([a-z])/g, (_, c) => c.toUpperCase())] = value;
  }
  return result as T;
}

export function mapRows<T = Record<string, unknown>>(rows: unknown[]): T[] {
  return rows.map((r) => snakeToCamel<T>(r as Record<string, unknown>));
}

export const tableNames = {
  businesses: "businesses",
  products: "products",
  news: "news",
  jobs: "jobs",
  applications: "applications",
  contacts: "contacts",
  businessInquiries: "business_inquiries",
  siteSettings: "site_settings",
} as const;

export * from "./schema/index.js";
