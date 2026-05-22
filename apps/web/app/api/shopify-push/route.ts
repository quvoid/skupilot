/**
 * POST /api/shopify-push
 * Pushes an enriched product listing to a Shopify store as a draft product.
 */

import { NextResponse } from "next/server";
import { pushProductToShopify, type ShopifyProductPayload } from "@/lib/shopify";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const body: ShopifyProductPayload = await req.json();

    if (!body.seoTitle) {
      return NextResponse.json(
        { error: "seoTitle is required" },
        { status: 400 }
      );
    }

    const result = await pushProductToShopify(body);

    return NextResponse.json({
      success: true,
      productId: result.productId,
      productUrl: result.productUrl,
      adminUrl: result.adminUrl,
      handle: result.handle,
    });
  } catch (error: unknown) {
    console.error("[/api/shopify-push] Error:", error);
    const message =
      error instanceof Error ? error.message : "Shopify push failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
