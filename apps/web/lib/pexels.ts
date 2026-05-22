/**
 * lib/pexels.ts
 * Pexels Image Search — pure fetch, server-side only.
 * Free Tier: 200 requests/hour, 20,000/month — no credit card required.
 * Get a free API key at: https://www.pexels.com/api/
 * Docs: https://www.pexels.com/api/documentation/#photos-search
 */

const PEXELS_API_BASE = "https://api.pexels.com/v1";

interface PexelsPhoto {
  id: number;
  src: {
    large: string;
    medium: string;
    small: string;
    portrait: string;
    landscape: string;
    tiny: string;
  };
  alt: string;
}

interface PexelsSearchResponse {
  photos: PexelsPhoto[];
  total_results: number;
  next_page?: string;
}

/**
 * Search Pexels for product-relevant images.
 * Returns an array of image URLs (large format, 940px wide).
 * Falls back to empty array if key is not configured.
 */
export async function searchProductImages(
  query: string,
  count: number = 4
): Promise<string[]> {
  const apiKey = process.env.PEXELS_API_KEY;

  if (!apiKey || apiKey === "your_pexels_api_key_here") {
    console.warn("[Pexels] No API key set. Using placeholder images.");
    return [];
  }

  // Build a product-photography-focused query
  const searchQuery = `${query} product photography`;

  const url = new URL(`${PEXELS_API_BASE}/search`);
  url.searchParams.set("query", searchQuery);
  url.searchParams.set("per_page", String(count));
  url.searchParams.set("orientation", "square");

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: apiKey,
    },
  });

  if (!response.ok) {
    console.error(`[Pexels] Search failed: ${response.status} ${response.statusText}`);
    return [];
  }

  const data: PexelsSearchResponse = await response.json();

  if (!data.photos || data.photos.length === 0) {
    console.warn(`[Pexels] No results found for query: "${searchQuery}"`);
    return [];
  }

  return data.photos.map((photo) => photo.src.large);
}
