import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "SkuPilot — AI Product Catalog Enrichment Platform",
  description:
    "Transform raw, sparse product data into conversion-ready ecommerce listings in seconds using AI. SEO titles, rich descriptions, images, videos & 40+ language translations.",
  keywords: "AI product catalog, ecommerce enrichment, product descriptions AI, SEO product content, Shopify automation",
  openGraph: {
    title: "SkuPilot — AI Product Catalog Enrichment Platform",
    description: "Transform raw product data into conversion-ready listings using AI.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0EA5E9",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="antialiased bg-white text-slate-900">{children}</body>
    </html>
  );
}