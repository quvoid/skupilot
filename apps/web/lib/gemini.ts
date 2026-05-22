/**
 * lib/gemini.ts
 * Google Gemini API wrapper — server-side only
 * Using gemini-1.5-flash which is the fastest free-tier model.
 * Free Tier: 15 RPM, 1 million tokens/day
 * Docs: https://ai.google.dev/api/generate-content
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import type { EnrichedData } from "@/store/useEnrichmentStore";

let genAI: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      throw new Error(
        "GEMINI_API_KEY is not set. Get a free key at https://aistudio.google.com/app/apikey"
      );
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
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

/**
 * Given scraped markdown + settings, produce a complete product listing.
 * Returns structured JSON matching the EnrichedData type.
 */
export async function enrichProduct(
  scrapedMarkdown: string,
  rawInput: string,
  tone: string
): Promise<EnrichedData> {
  const ai = getClient();
  const model = ai.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

  const sourceContent = scrapedMarkdown.trim()
    ? `Scraped product page content:\n\n${scrapedMarkdown.substring(0, 8000)}`
    : `Raw product data provided by user:\n\n${rawInput.substring(0, 4000)}`;

  const prompt = `You are a world-class ecommerce copywriter and product catalog specialist.

Your task: Analyze the following product data and generate a complete, conversion-optimized product listing.

Tone/Brand Voice: ${tone}

${sourceContent}

Return ONLY a valid JSON object (no markdown fences, no extra text) with this exact structure:
{
  "seoTitle": "SEO-optimized product title (50-70 chars, includes key search terms)",
  "description": "2-3 paragraph rich product description in the specified tone. Focus on benefits, use cases, and emotional appeal. Make it compelling.",
  "features": ["Feature bullet 1 with bold keyword: explanation", "Feature bullet 2 with bold keyword: explanation", "Feature bullet 3 with bold keyword: explanation", "Feature bullet 4 with bold keyword: explanation", "Feature bullet 5 with bold keyword: explanation"],
  "attributes": {
    "Brand": "extracted brand name",
    "Model": "extracted model number or name",
    "Category": "product category",
    "Key Spec 1": "value",
    "Key Spec 2": "value",
    "Key Spec 3": "value"
  },
  "qualityScore": 94
}

Rules:
- qualityScore should be 85-99 based on how complete and compelling the listing is
- features should start with a short bold-style keyword followed by a colon then explanation
- All fields must be populated — do NOT leave any field empty or null
- SEO title must contain primary keywords naturally`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  // Strip markdown fences if model wraps in them despite instruction
  const clean = text.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();

  try {
    const parsed = JSON.parse(clean) as EnrichedData;
    return parsed;
  } catch {
    // Fallback if JSON is malformed — shouldn't happen with flash but be safe
    throw new Error(`Gemini returned invalid JSON: ${clean.substring(0, 200)}`);
  }
}

/**
 * Analyze a scraped website's markdown and return a structured SEO report.
 */
export async function analyzeSEO(
  markdown: string,
  metadata: Record<string, unknown>,
  url: string
): Promise<SEOReport> {
  const ai = getClient();
  const model = ai.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

  const prompt = `You are a senior SEO consultant with 10+ years of experience. Analyze this website's content and metadata.

URL: ${url}

Page Metadata:
- Title: ${metadata.title || "Not found"}
- Meta Description: ${metadata.description || "Not found"}
- OG Title: ${metadata.ogTitle || "Not found"}

Page Content (first 6000 chars):
${markdown.substring(0, 6000)}

Return ONLY a valid JSON object (no markdown fences) with this exact structure:
{
  "url": "${url}",
  "seoScore": 72,
  "titleTag": {
    "content": "the title tag text",
    "length": 60,
    "score": 80,
    "feedback": "Your title is well-optimized. Consider adding your primary keyword earlier."
  },
  "metaDescription": {
    "content": "the meta description text or 'Not found'",
    "length": 155,
    "score": 65,
    "feedback": "Meta description is missing or too short. Add a compelling 150-160 char description."
  },
  "headings": {
    "h1Count": 1,
    "h2Count": 4,
    "score": 90,
    "feedback": "Good heading structure. Make sure your H1 contains your primary keyword."
  },
  "wordCount": 850,
  "internalLinks": 12,
  "externalLinks": 3,
  "keywordDensity": "Product keywords appear 2.3% of the time — within optimal range (1-3%).",
  "improvements": [
    "Add schema markup (Product/Article) for rich snippets",
    "Compress images — page load speed affects SEO ranking",
    "Add alt text to all images",
    "Include more long-tail keywords in the body copy",
    "Build internal links from related pages to this one"
  ],
  "quickWins": [
    "Fix the meta description — this alone can increase CTR by 5-10%",
    "Add 2-3 H2 subheadings with target keywords",
    "Add a call-to-action button above the fold"
  ],
  "summary": "This page has a solid content foundation but lacks technical SEO elements. The biggest opportunities are in meta tags, heading structure, and schema markup."
}

Calculate seoScore as a weighted average:
- Title (25%): score based on length (50-70 optimal), keyword presence
- Meta Description (25%): score based on length (150-160 optimal), present at all
- Content Quality (20%): word count (300+ good, 1000+ excellent), heading structure
- Technical (15%): schema markup indicators, image alt text mentions
- UX/Engagement (15%): clear CTAs, internal linking

Be specific and actionable in all feedback.`;

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  const clean = text.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();

  try {
    return JSON.parse(clean) as SEOReport;
  } catch {
    throw new Error(`Gemini SEO analysis returned invalid JSON: ${clean.substring(0, 200)}`);
  }
}
