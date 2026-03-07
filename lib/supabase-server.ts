import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function isSupabaseStorageConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseServiceRoleKey);
}

/**
 * Server-only Supabase client with service role key.
 * Use for Storage uploads and other server-side operations that need full access.
 * Throws if SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY are not set.
 */
export function getSupabaseServer() {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Add them to .env for Supabase Storage uploads."
    );
  }
  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false },
  });
}
