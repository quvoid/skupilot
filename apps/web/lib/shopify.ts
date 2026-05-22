/**
 * lib/shopify.ts
 * Shopify Admin REST API wrapper — server-side only.
 *
 * Setup (free):
 * 1. Create a free Partner account at https://partners.shopify.com
 * 2. Create a Development Store (free, unlimited)
 * 3. In your store: Settings → Apps → Develop apps → Create app
 * 4. Configure scopes: write_products, read_products
 * 5. Install the app and copy the "Admin API access token"
 *
 * Docs: https://shopify.dev/docs/api/admin-rest/2024-01/resources/product
 */

export interface ShopifyProductPayload {
  seoTitle: string;
  description: string;
  features: string[];
  attributes: Record<string, string>;
  images?: string[];
}

export interface ShopifyProductResult {
  productId: number;
  productUrl: string;
  adminUrl: string;
  handle: string;
}

function getConfig() {
  const domain = process.env.SHOPIFY_STORE_DOMAIN;
  const token = process.env.SHOPIFY_ADMIN_TOKEN;

  if (!domain || domain === "your-store.myshopify.com") {
    throw new Error(
      "SHOPIFY_STORE_DOMAIN not set. Create a free dev store at partners.shopify.com"
    );
  }
  if (!token || token === "your_shopify_admin_token_here") {
    throw new Error(
      "SHOPIFY_ADMIN_TOKEN not set. Create a custom app in your Shopify store settings."
    );
  }

  // Normalise domain (strip https:// if user pasted the full URL)
  const cleanDomain = domain.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return { domain: cleanDomain, token };
}

/**
 * Build the Shopify HTML body from bullet features.
 */
function buildBodyHtml(description: string, features: string[]): string {
  const descHtml = description
    .split("\n\n")
    .map((p) => `<p>${p.trim()}</p>`)
    .join("");

  const bulletsHtml =
    features.length > 0
      ? `<ul>${features.map((f) => `<li>${f}</li>`).join("")}</ul>`
      : "";

  return `${descHtml}${bulletsHtml}`;
}

/**
 * Push an enriched product to Shopify as a draft product.
 * Returns the created product's ID, handle, and storefront URL.
 */
export async function pushProductToShopify(
  data: ShopifyProductPayload
): Promise<ShopifyProductResult> {
  const { domain, token } = getConfig();

  const brand = data.attributes?.["Brand"] ?? "";
  const category = data.attributes?.["Category"] ?? "";

  // Build structured metafields from attributes (excludes Brand/Category/Model)
  const metafieldAttributes = Object.entries(data.attributes)
    .filter(([k]) => !["Brand", "Category", "Model"].includes(k))
    .map(([key, value]) => ({
      namespace: "skupilot",
      key: key.toLowerCase().replace(/\s+/g, "_"),
      value: String(value),
      type: "single_line_text_field",
    }));

  // Build product images array (max 10 for Shopify)
  const shopifyImages = (data.images ?? [])
    .slice(0, 10)
    .map((src) => ({ src }));

  const payload = {
    product: {
      title: data.seoTitle,
      body_html: buildBodyHtml(data.description, data.features),
      vendor: brand,
      product_type: category,
      status: "draft", // publish as draft so it doesn't go live immediately
      tags: `skupilot,ai-enriched,${category}`.toLowerCase(),
      metafields: metafieldAttributes,
      images: shopifyImages,
    },
  };

  const url = `https://${domain}/admin/api/2024-01/products.json`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": token,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new Error(
      `Shopify API error ${response.status}: ${errorText}`
    );
  }

  const result = await response.json();
  const product = result.product;

  return {
    productId: product.id,
    handle: product.handle,
    productUrl: `https://${domain}/products/${product.handle}`,
    adminUrl: `https://${domain}/admin/products/${product.id}`,
  };
}
