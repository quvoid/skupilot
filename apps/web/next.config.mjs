/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@skupilot/ui"],
  // Only @google/generative-ai needs to be external — it's a Node.js-only package.
  // We removed @mendable/firecrawl-js because we now call the Firecrawl REST API
  // directly with fetch (no SDK import = no webpack conflict).
  experimental: {
    serverComponentsExternalPackages: [
      "@google/generative-ai",
      "@supabase/supabase-js",
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;