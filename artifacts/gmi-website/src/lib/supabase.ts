import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://xerjhnqoioraeogwklrm.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhlcmpobnFvaW9yYWVvZ3drbHJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2MjYwMDgsImV4cCI6MjA5NzIwMjAwOH0.TXP5tXL2lfcb5Av7ZqnyXAsNkDz3BQ0dVe9EetNWcHg";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function getAdminToken(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}
