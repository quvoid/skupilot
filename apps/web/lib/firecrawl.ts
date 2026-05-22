/**
 * lib/firecrawl.ts
 * Firecrawl v1 REST API — pure fetch, zero SDK/webpack issues.
 * We bypass the @mendable/firecrawl-js SDK entirely because it imports
 * 'undici' (a Node.js native module) that webpack cannot bundle.
 * Using native fetch here works in all Next.js API routes (Node.js 18+).
 * Docs: https://docs.firecrawl.dev/api-reference/endpoint/scrape
 */

const FIRECRAWL_API_BASE = "https://api.firecrawl.dev/v1";

function getApiKey(): string {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey || apiKey === "your_firecrawl_api_key_here") {
    throw new Error(
      "FIRECRAWL_API_KEY is not set. Get a free key at https://www.firecrawl.dev"
    );
  }
  return apiKey;
}

export interface ScrapeResult {
  markdown: string;
  metadata: {
    title?: string;
    description?: string;
    ogTitle?: string;
    ogDescription?: string;
    ogImage?: string;
    statusCode?: number;
    url?: string;
    [key: string]: unknown;
  };
}

interface FirecrawlScrapeResponse {
  success: boolean;
  data?: {
    markdown?: string;
    metadata?: ScrapeResult["metadata"];
  };
  error?: string;
}

/**
 * Scrape a single URL and return clean markdown + metadata.
 * Uses 1 Firecrawl credit per call.
 */
export async function scrapeUrl(url: string): Promise<ScrapeResult> {
  const apiKey = getApiKey();

  const response = await fetch(`${FIRECRAWL_API_BASE}/scrape`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url,
      formats: ["markdown"],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new Error(
      `Firecrawl API error ${response.status}: ${errorText}`
    );
  }

  const data: FirecrawlScrapeResponse = await response.json();

  if (!data.success) {
    throw new Error(
      `Firecrawl failed to scrape ${url}: ${data.error ?? "Unknown error"}`
    );
  }

  return {
    markdown: data.data?.markdown ?? "",
    metadata: data.data?.metadata ?? {},
  };
}
