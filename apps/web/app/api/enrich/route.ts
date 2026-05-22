/**
 * POST /api/enrich
 * Real AI enrichment endpoint.
 * Pipeline: Input → Firecrawl (if URL) → Groq LLaMA → Pexels Images → Supabase → Response
 */

import { NextResponse } from "next/server";
import { scrapeUrl } from "@/lib/firecrawl";
import { enrichProduct } from "@/lib/groq";
import { searchProductImages } from "@/lib/pexels";
import { getSupabaseServerClient } from "@/lib/supabase";

export const maxDuration = 60;

// Category → fallback Unsplash image set (used only when Pexels key not set)
const FALLBACK_IMAGES: Record<string, string[]> = {
  skincare: [
    "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1621610568027-6e9c7c4e4e71?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?auto=format&fit=crop&q=80&w=600",
  ],
  shoe: [
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&q=80&w=600",
  ],
  laptop: [
    "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&q=80&w=600",
  ],
  headphone: [
    "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=600",
  ],
  default: [
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=600",
  ],
};

function getFallbackImages(seoTitle: string, category: string): string[] {
  const combined = `${seoTitle} ${category}`.toLowerCase();
  if (combined.includes("skin") || combined.includes("cleanser") || combined.includes("moisturizer") || combined.includes("serum") || combined.includes("cream")) return FALLBACK_IMAGES.skincare;
  if (combined.includes("shoe") || combined.includes("sneaker") || combined.includes("boot") || combined.includes("running")) return FALLBACK_IMAGES.shoe;
  if (combined.includes("laptop") || combined.includes("computer") || combined.includes("macbook") || combined.includes("thinkpad")) return FALLBACK_IMAGES.laptop;
  if (combined.includes("headphone") || combined.includes("earphone") || combined.includes("audio") || combined.includes("earbud")) return FALLBACK_IMAGES.headphone;
  return FALLBACK_IMAGES.default;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      inputType,
      rawInput,
      settings,
    }: {
      inputType: "url" | "raw" | "csv";
      rawInput: string;
      settings: { tone: string; images: boolean };
    } = body;

    // ── Step 1: Scrape the URL if input type is URL ──────────────────────────
    let markdownContent = "";

    if (inputType === "url" && rawInput) {
      try {
        const scraped = await scrapeUrl(rawInput);
        markdownContent = scraped.markdown;
      } catch (scrapeError: unknown) {
        const msg = scrapeError instanceof Error ? scrapeError.message : "Scrape failed";
        if (msg.includes("FIRECRAWL_API_KEY")) {
          console.warn("Firecrawl not configured, using URL as raw input");
        } else {
          throw scrapeError;
        }
      }
    }

    // ── Step 2: Generate enriched listing with Groq LLaMA ───────────────────
    const enriched = await enrichProduct(markdownContent, rawInput, settings.tone);

    // ── Step 3: Fetch relevant product images from Pexels ───────────────────
    if (settings.images) {
      // Build a smart search query from the enriched data
      const category = (enriched.attributes?.["Category"] as string) ?? "";
      const brand = (enriched.attributes?.["Brand"] as string) ?? "";
      const searchQuery = `${brand} ${category || enriched.seoTitle}`.trim();

      const pexelsImages = await searchProductImages(searchQuery, 4);

      if (pexelsImages.length > 0) {
        enriched.images = pexelsImages;
      } else {
        // Intelligent fallback based on product type
        enriched.images = getFallbackImages(enriched.seoTitle, category);
      }
    } else {
      enriched.images = [];
    }

    // ── Step 4: Persist to Supabase ──────────────────────────────────────────
    const supabase = getSupabaseServerClient();
    if (supabase) {
      const { error } = await supabase.from("enrichments").insert({
        input_type: inputType,
        raw_input: rawInput?.substring(0, 2000) ?? null,
        tone: settings.tone,
        result: enriched as unknown as Record<string, unknown>,
        quality_score: enriched.qualityScore,
      });
      if (error) {
        console.error("Supabase insert error:", error.message);
      }
    }

    return NextResponse.json(enriched);
  } catch (error: unknown) {
    console.error("[/api/enrich] Error:", error);
    const message = error instanceof Error ? error.message : "Enrichment failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
