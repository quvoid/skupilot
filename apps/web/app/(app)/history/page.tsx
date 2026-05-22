"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  History,
  Sparkles,
  Clock,
  ArrowRight,
  FileText,
  RefreshCw,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { useEnrichmentStore, type EnrichedData } from "@/store/useEnrichmentStore";

interface HistoryItem {
  id: string;
  created_at: string;
  input_type: string;
  tone: string | null;
  quality_score: number | null;
  result: EnrichedData & {
    seoTitle?: string;
    qualityScore?: number;
    description?: string;
  };
}

function QualityBadge({ score }: { score: number | null }) {
  if (!score) return null;
  const color =
    score >= 90
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : score >= 75
      ? "bg-sky-50 text-sky-700 border-sky-200"
      : "bg-amber-50 text-amber-700 border-amber-200";
  return (
    <span className={`px-2 py-1 rounded-full border text-xs font-bold ${color}`}>
      {score}% Quality
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function HistoryPage() {
  const router = useRouter();
  const store = useEnrichmentStore();
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const fetchHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/history");
      const data = await res.json();
      setItems(data.enrichments ?? []);
    } catch {
      setError("Failed to load history. Make sure Supabase is configured.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // ── Load a history item into the store and open the editor ─────────────────
  const handleOpenInEditor = (item: HistoryItem) => {
    setLoadingId(item.id);

    // Populate the Zustand store with the historical result
    store.setEnrichedData(item.result as EnrichedData);
    store.setInputType(item.input_type as "url" | "raw" | "csv");
    store.setRawInput(`[Loaded from history: ${item.result?.seoTitle ?? "Untitled"}]`);
    if (item.tone) store.setTone(item.tone);
    store.setStatus("complete");

    // Navigate to editor
    router.push("/generate/editor");
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 pb-16">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center">
                  <History className="w-5 h-5 text-sky-600" />
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900">
                  Enrichment History
                </h1>
              </div>
              <p className="text-slate-500 text-sm ml-13">
                All past AI enrichments stored in Supabase — click any card to open in editor.
              </p>
            </div>
            <button
              onClick={fetchHistory}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition-colors disabled:opacity-60"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-8">
        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-10 h-10 text-sky-500 animate-spin" />
            <p className="text-slate-500 font-medium">Fetching from Supabase...</p>
          </div>
        )}

        {/* Error */}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center">
              <FileText className="w-8 h-8 text-amber-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-700">No records found</h3>
            <p className="text-slate-400 text-sm max-w-md">{error}</p>
            <div className="bg-slate-900 rounded-xl p-4 text-left text-xs font-mono text-emerald-400 max-w-sm w-full">
              <p className="text-slate-400 mb-1"># Run in Supabase SQL Editor:</p>
              <p>CREATE TABLE enrichments (</p>
              <p>&nbsp;&nbsp;id uuid DEFAULT gen_random_uuid() PRIMARY KEY,</p>
              <p>&nbsp;&nbsp;created_at timestamptz DEFAULT now(),</p>
              <p>&nbsp;&nbsp;input_type text NOT NULL,</p>
              <p>&nbsp;&nbsp;raw_input text,</p>
              <p>&nbsp;&nbsp;tone text,</p>
              <p>&nbsp;&nbsp;result jsonb NOT NULL,</p>
              <p>&nbsp;&nbsp;quality_score int</p>
              <p>);</p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-500">No enrichments yet</h3>
            <p className="text-slate-400 text-sm">
              Run your first enrichment to see it appear here.
            </p>
            <Link
              href="/generate"
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-sky-500 to-cyan-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
            >
              <Sparkles className="w-4 h-4" />
              Start Your First Enrichment
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* History Grid */}
        {!isLoading && !error && items.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => handleOpenInEditor(item)}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-sky-300 transition-all p-6 flex flex-col gap-4 cursor-pointer group relative"
              >
                {/* Loading overlay for this card */}
                {loadingId === item.id && (
                  <div className="absolute inset-0 bg-white/80 rounded-2xl flex items-center justify-center z-10">
                    <Loader2 className="w-6 h-6 text-sky-500 animate-spin" />
                  </div>
                )}

                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 bg-gradient-to-tr from-sky-400 to-cyan-400 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex items-center gap-2">
                    <QualityBadge score={item.quality_score} />
                    <ExternalLink className="w-4 h-4 text-slate-300 group-hover:text-sky-500 transition-colors" />
                  </div>
                </div>

                {/* Title */}
                <div>
                  <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-2 mb-1 group-hover:text-sky-700 transition-colors">
                    {item.result?.seoTitle || "Untitled Product"}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {item.result?.description?.substring(0, 100)}...
                  </p>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-3 text-xs text-slate-400 pt-2 border-t border-slate-100">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {formatDate(item.created_at)}
                  </span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded-full font-medium capitalize">
                    {item.input_type}
                  </span>
                  {item.tone && (
                    <span className="bg-slate-100 px-2 py-0.5 rounded-full font-medium truncate max-w-[80px]">
                      {item.tone.split("&")[0].trim()}
                    </span>
                  )}
                </div>

                {/* Open hint */}
                <div className="text-xs text-sky-500 font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity -mt-2">
                  <ExternalLink className="w-3 h-3" />
                  Open in Editor
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
