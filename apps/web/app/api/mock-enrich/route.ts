import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Simulate 5 seconds of AI processing
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Hardcoded perfect response for testing the UI
    const enrichedProduct = {
      seoTitle: "Premium Wireless Noise-Cancelling Headphones - WH-X500",
      description:
        "Experience pure audio perfection with the WH-X500 Premium Wireless Headphones. Featuring industry-leading adaptive noise cancellation, these headphones dynamically block out distractions so you can focus on what matters. With an incredible 40-hour battery life and rapid charging technology, the music never has to stop.\n\nCrafted for all-day comfort, the ultra-soft memory foam ear cushions and lightweight chassis make them perfect for long commutes, office work, or intense focus sessions. The custom 40mm dynamic drivers deliver crisp highs, balanced mids, and deep, punchy bass.",
      features: [
        "Industry-Leading ANC: Adaptive noise cancellation automatically blocks ambient sound.",
        "40-Hour Battery Life: Get up to 40 hours of playtime on a single charge.",
        "Premium Sound Quality: Custom 40mm drivers deliver rich, detailed audio.",
        "Multipoint Connectivity: Seamlessly switch between two Bluetooth devices.",
        "All-Day Comfort: Ultra-soft memory foam cushions and a lightweight frame.",
      ],
      attributes: {
        "Brand": "AudioPro",
        "Model": "WH-X500",
        "Color": "Midnight Black",
        "Connectivity": "Bluetooth 5.3",
        "Battery Life": "40 hours",
        "Weight": "250g",
        "Charging Port": "USB-C",
      },
      qualityScore: 98,
      images: [
        "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=600",
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&q=80&w=600"
      ]
    };

    return NextResponse.json(enrichedProduct);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to enrich product" },
      { status: 500 }
    );
  }
}
