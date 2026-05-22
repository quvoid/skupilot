# 🌌 SkuPilot — AI Product Catalog Enrichment Platform

SkuPilot is an enterprise-grade AI-powered product catalog enrichment platform. It is designed to automatically transform raw, sparse product inputs (like minimal spreadsheets, raw manufacturer specs, or simple URLs) into premium, conversion-ready e-commerce listings in seconds.

Built with **Next.js**, **Turborepo**, and **Supabase**, SkuPilot leverages high-throughput LLM pipelines (via **Groq & LLaMA 3.3**) and smart external integrations to write, design, translate, and audit your product content.

---

## 🚀 Key Features

*   **⚡ Automated AI Enrichment**: Transforms basic product tags and raw specs into SEO-optimized titles, persuasive multi-paragraph descriptions, structured key specs, and conversion-focused benefits. Powered by `llama-3.3-70b-versatile` via Groq.
*   **📥 Universal URL Scraping**: Paste any external product page URL (e.g., Amazon, Walmart). SkuPilot uses the **Firecrawl API** to extract structural elements and attributes automatically.
*   **📸 Smart Visual Assets Fallback**: Automatically gathers high-quality, category-appropriate product and lifestyle photography using the **Pexels API**, ensuring listings are never left empty or media-dry.
*   **🌐 40+ Language Translations**: Seamlessly translates complete e-commerce listings into over 40 languages to prepare your catalog for global retail.
*   **🔍 Built-in SEO Auditor**: Crawls and reviews web pages to audit titles, headings, keyword density, and meta descriptions, providing a dynamic SEO quality score and actionable "Quick Wins" recommendations.
*   **🛍️ One-Click Shopify Sync**: Integrates with the **Shopify Admin REST API** to automatically push enriched products directly to your Shopify store as drafts.
*   **💾 Interactive History Logs**: Persists every single enrichment session using **Supabase**. You can load past enrichments back into your editing workspace at any time to modify, duplicate, or inspect.

---

## 🛠️ Tech Stack & Integration Ecosystem

*   **Framework**: Next.js 14 (App Router) inside a Turborepo monorepo workspace.
*   **Styling & Motion**: Tailwind CSS, Framer Motion (for premium, dynamic animations).
*   **UI Components**: Zustand (for reactive, global state management), Lucide Icons.
*   **Database & Persistence**: Supabase (PostgreSQL) for saving logs and historical enrichments.
*   **Scraping**: Firecrawl API (delivering clean Markdown parsing).
*   **LLM Pipeline**: Groq SDK + Gemini API.
*   **Media**: Pexels API for asset gathering.
*   **Export/Integration**: Shopify Admin REST API & CSV export.

---

## 📂 Project Architecture

The codebase is configured as a PNPM monorepo managed with Turborepo:

```text
catalevo/
├── apps/
│   └── web/                     # Main Next.js Web App & API backend
│       ├── app/                 # Next.js pages & API routes
│       │   ├── (app)/           # Application dashboard (editor, SEO analyzer, history)
│       │   └── api/             # API routes (enrich, Shopify, exports, database logs)
│       ├── components/          # Reusable UI components & marketing sections
│       ├── lib/                 # Integrations & API wrapper clients (Groq, Supabase, Shopify, etc.)
│       └── store/               # Zustand global store logic (useEnrichmentStore)
├── package.json                 # Root script definitions
├── pnpm-workspace.yaml        # PNPM monorepo workspaces config
└── turbo.json                   # Turborepo task pipeline management
```

---

## ⚙️ Environment Variables Setup

Before running the project, you must set up your environment variables. 

1. Navigate to the web application folder:
   ```bash
   cd apps/web
   ```
2. Copy the sample environment file:
   ```bash
   cp .env.example .env.local
   ```
3. Open `.env.local` and fill in the required API keys:

```ini
# AI Processing Keys
GROQ_API_KEY=your_groq_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here

# Web Scraping & Content Gathering
FIRECRAWL_API_KEY=your_firecrawl_api_key_here
PEXELS_API_KEY=your_pexels_api_key_here

# Shopify Integration (Admin REST API)
SHOPIFY_STORE_DOMAIN=your_shopify_store_name.myshopify.com
SHOPIFY_ADMIN_TOKEN=shpat_your_admin_access_token_here

# Database & History Logs (Supabase)
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_public_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

---

## 🏃 Getting Started (Local Development)

SkuPilot uses `pnpm` for package management. Make sure you have it installed globally.

1. **Install Dependencies** (from the root directory):
   ```bash
   pnpm install
   ```

2. **Start Dev Server**:
   ```bash
   pnpm run dev
   ```
   This will run `turbo dev` and boot up the Next.js development server.

3. **Access the App**:
   Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 💻 Available Monorepo Scripts

From the root workspace folder, you can execute the following tasks:

| Command | Action |
| :--- | :--- |
| `pnpm run dev` | Runs the development environment using Turborepo |
| `pnpm run dev:web` | Runs ONLY the `@skupilot/web` (Next.js) project |
| `pnpm run build` | Builds all packages/apps in the workspace |
| `pnpm run typecheck` | Validates TypeScript compilation across the codebase |
| `pnpm run lint` | Lints files across the project |
| `pnpm run format` | Runs Prettier to format TypeScript, TSX, and Markdown files |
