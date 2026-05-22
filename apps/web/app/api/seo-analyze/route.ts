/**
 * POST /api/seo-analyze
 * Firecrawl + Groq (LLaMA 3.3) powered SEO health check endpoint.
 */

import { NextResponse } from "next/server";
import { scrapeUrl } from "@/lib/firecrawl";
import { analyzeSEO } from "@/lib/groq";
import { getSupabaseServerClient } from "@/lib/supabase";

export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    const { url }: { url: string } = await req.json();

    if (!url || !url.startsWith("http")) {
      return NextResponse.json(
        { error: "A valid URL starting with http:// or https:// is required." },
        { status: 400 }
      );
    }

    // ── Step 1: Crawl the target URL with Firecrawl ──────────────────────────
    const scraped = await scrapeUrl(url);

    // ── Step 2: Analyze with Groq LLaMA ─────────────────────────────────────
    const report = await analyzeSEO(scraped.markdown, scraped.metadata, url);

    // ── Step 3: Persist to Supabase ──────────────────────────────────────────
    const supabase = getSupabaseServerClient();
    if (supabase) {
      const { error } = await supabase.from("seo_reports").insert({
        url,
        seo_score: report.seoScore,
        report: report as unknown as Record<string, unknown>,
      });
      if (error) {
        console.error("Supabase insert error (seo_reports):", error.message);
      }
    }

    return NextResponse.json(report);
  } catch (error: unknown) {
    console.error("[/api/seo-analyze] Error:", error);
    const message = error instanceof Error ? error.message : "SEO analysis failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
