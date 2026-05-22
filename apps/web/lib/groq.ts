/**
 * lib/groq.ts
 * Groq API wrapper — server-side only.
 * Using llama-3.3-70b-versatile: best free-tier LLM for structured JSON output.
 *
 * Free Tier: 6,000 req/day, 30 req/min, 30,000 tokens/min — zero credit card.
 * Get a key at: https://console.groq.com/keys
 * Docs: https://console.groq.com/docs/openai
 */

import Groq from "groq-sdk";
import type { EnrichedData } from "@/store/useEnrichmentStore";

let groqClient: Groq | null = null;

function getClient(): Groq {
  if (!groqClient) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey || apiKey === "your_groq_api_key_here") {
      throw new Error(
        "GROQ_API_KEY is not set. Get a free key at https://console.groq.com/keys"
      );
    }
    groqClient = new Groq({ apiKey });
  }
  return groqClient;
}

// ── Shared JSON parser with fence stripping ───────────────────────────────────
function parseJSON<T>(raw: string, context: string): T {
  const clean = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();
  try {
    return JSON.parse(clean) as T;
  } catch {
    throw new Error(
      `${context}: LLM returned invalid JSON.\nFirst 300 chars: ${clean.substring(0, 300)}`
    );
  }
}

export interface SEOReport {
  url: string;
  seoScore: number;
  titleTag: {
    content: string;
    length: number;
    score: number;
    feedback: string;
  };
  metaDescription: {
    content: string;
    length: number;
    score: number;
    feedback: string;
  };
  headings: {
    h1Count: number;
    h2Count: number;
    score: number;
    feedback: string;
  };
  wordCount: number;
  internalLinks: number;
  externalLinks: number;
  keywordDensity: string;
  improvements: string[];
  quickWins: string[];
  summary: string;
}

// ── Product Enrichment ────────────────────────────────────────────────────────
export async function enrichProduct(
  scrapedMarkdown: string,
  rawInput: string,
  tone: string
): Promise<EnrichedData> {
  const client = getClient();

  const sourceContent = scrapedMarkdown.trim()
    ? `Scraped product page content:\n\n${scrapedMarkdown.substring(0, 8000)}`
    : `Raw product data provided by user:\n\n${rawInput.substring(0, 4000)}`;

  const completion = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.4,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are a world-class ecommerce copywriter and product catalog specialist.
You always respond with a single valid JSON object and nothing else.
Brand Voice/Tone: ${tone}`,
      },
      {
        role: "user",
        content: `Analyze the following product data and generate a complete, conversion-optimized product listing.

${sourceContent}

Return a JSON object with this exact structure:
{
  "seoTitle": "SEO-optimized title (50-70 chars, includes key search terms)",
  "description": "2-3 paragraph rich description. Focus on benefits, use cases, emotional appeal. Be compelling.",
  "features": [
    "Feature 1 keyword: explanation of benefit",
    "Feature 2 keyword: explanation of benefit",
    "Feature 3 keyword: explanation of benefit",
    "Feature 4 keyword: explanation of benefit",
    "Feature 5 keyword: explanation of benefit"
  ],
  "attributes": {
    "Brand": "brand name",
    "Model": "model or product name",
    "Category": "product category",
    "Key Spec 1": "value",
    "Key Spec 2": "value",
    "Key Spec 3": "value"
  },
  "qualityScore": 94
}

Rules:
- qualityScore: 85-99 based on completeness and compelling copy
- All fields must be populated — never null or empty
- SEO title must include natural primary keywords`,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "";
  return parseJSON<EnrichedData>(raw, "enrichProduct");
}

// ── SEO Analysis ──────────────────────────────────────────────────────────────
export async function analyzeSEO(
  markdown: string,
  metadata: Record<string, unknown>,
  url: string
): Promise<SEOReport> {
  const client = getClient();

  const completion = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "You are a senior SEO consultant with 10+ years of experience. You always respond with a single valid JSON object.",
      },
      {
        role: "user",
        content: `Analyze this website for SEO health.

URL: ${url}
Title: ${metadata.title ?? "Not found"}
Meta Description: ${metadata.description ?? "Not found"}

Page Content (first 5000 chars):
${markdown.substring(0, 5000)}

Return this exact JSON structure (fill in all fields with real analysis):
{
  "url": "${url}",
  "seoScore": 72,
  "titleTag": { "content": "...", "length": 60, "score": 80, "feedback": "..." },
  "metaDescription": { "content": "...", "length": 155, "score": 65, "feedback": "..." },
  "headings": { "h1Count": 1, "h2Count": 4, "score": 90, "feedback": "..." },
  "wordCount": 850,
  "internalLinks": 12,
  "externalLinks": 3,
  "keywordDensity": "Primary keywords appear at X% density...",
  "improvements": ["...", "...", "...", "...", "..."],
  "quickWins": ["...", "...", "..."],
  "summary": "..."
}

Score weights: Title 25%, Meta 25%, Content Quality 20%, Technical 15%, UX 15%.`,
      },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "";
  return parseJSON<SEOReport>(raw, "analyzeSEO");
}
