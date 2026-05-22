/**
 * GET /api/history
 * Returns the last 20 enrichments from Supabase.
 */

import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();

    if (!supabase) {
      // Return empty array gracefully if Supabase not configured
      return NextResponse.json({ enrichments: [] });
    }

    const { data, error } = await supabase
      .from("enrichments")
      .select("id, created_at, input_type, tone, quality_score, result")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ enrichments: data ?? [] });
  } catch (error: unknown) {
    console.error("[/api/history] Error:", error);
    return NextResponse.json({ enrichments: [] });
  }
}
