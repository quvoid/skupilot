/**
 * lib/supabase.ts
 * Supabase client factory — exports both browser and server clients
 * Docs: https://supabase.com/docs/reference/javascript
 * Free Tier: 500MB DB, 50k MAU, 1GB storage
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// ──────────────────────────────────────────────────────────────────────────────
// Browser client — uses anon key, safe to use in client components
// ──────────────────────────────────────────────────────────────────────────────
let browserClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseBrowserClient() {
  if (!browserClient) {
    browserClient = createClient(supabaseUrl, supabaseAnonKey);
  }
  return browserClient;
}

// ──────────────────────────────────────────────────────────────────────────────
// Server client — uses service role key, ONLY use in API routes (server-side)
// This bypasses Row Level Security, so never expose this key to the browser
// ──────────────────────────────────────────────────────────────────────────────
export function getSupabaseServerClient() {
  if (!supabaseUrl || supabaseUrl === "your_supabase_project_url_here") {
    // Return a no-op mock client so the app works without Supabase keys
    return null;
  }
  return createClient(supabaseUrl, supabaseServiceKey ?? supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// ──────────────────────────────────────────────────────────────────────────────
// Database Types (mirrors the SQL schema)
// ──────────────────────────────────────────────────────────────────────────────
export interface EnrichmentRecord {
  id: string;
  created_at: string;
  input_type: string;
  raw_input: string | null;
  tone: string | null;
  result: Record<string, unknown>;
  quality_score: number | null;
}

export interface SEOReportRecord {
  id: string;
  created_at: string;
  url: string;
  seo_score: number | null;
  report: Record<string, unknown>;
}
