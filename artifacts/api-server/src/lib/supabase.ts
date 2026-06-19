import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.SUPABASE_ANON_KEY;

export const supabaseAdmin = supabaseUrl && serviceRoleKey
  ? createClient(supabaseUrl, serviceRoleKey)
  : null;

export function getSupabaseClient() {
  if (supabaseAdmin) return supabaseAdmin;
  if (supabaseUrl && anonKey) return createClient(supabaseUrl, anonKey);
  return null;
}
