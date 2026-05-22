"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  XCircle,
  TrendingUp,
  FileText,
  Link2,
  Hash,
  AlignLeft,
  Zap,
  Loader2,
  ChevronRight,
} from "lucide-react";
import type { SEOReport } from "@/lib/gemini";

// ── Score Ring Component ──────────────────────────────────────────────────────
function ScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = (score / 100) * circumference;

  const color =
    score >= 80
      ? "#10b981" // emerald
      : score >= 60
      ? "#f59e0b" // amber
      : "#ef4444"; // red

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" viewBox={`0 0 ${size} ${size}`}>
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={10}
        />
        {/* Animated progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={10}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference - strokeDash }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-3xl font-extrabold"
          style={{ color }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
        >
          {score}
        </motion.span>
        <span className="text-xs text-slate-400 font-medium">/100</span>
      </div>
    </div>
  );
}

// ── Score Badge Component ─────────────────────────────────────────────────────
function ScoreBadge({ score }: { score: number }) {
  if (score >= 80)
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
        <CheckCircle2 className="w-3 h-3" /> Good
      </span>
    );
  if (score >= 60)
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
        <AlertCircle className="w-3 h-3" /> Needs Work
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 text-red-700 text-xs font-bold border border-red-200">
      <XCircle className="w-3 h-3" /> Poor
    </span>
  );
}

// ── Score Bar Component ───────────────────────────────────────────────────────
function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 80 ? "bg-emerald-500" : score >= 60 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
      <motion.div
        className={`h-full rounded-full ${color}`}
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
      />
    </div>
  );
}

// ── Metric Card Component ─────────────────────────────────────────────────────
function MetricCard({
  icon: Icon,
  title,
  content,
  length,
  score,
  feedback,
}: {
  icon: React.ElementType;
  title: string;
  content: string;
  length?: number;
  score: number;
  feedback: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
            <Icon className="w-5 h-5 text-slate-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">{title}</h3>
            {length !== undefined && (
              <span className="text-xs text-slate-400">{length} chars</span>
            )}
          </div>
        </div>
        <ScoreBadge score={score} />
      </div>
      <div className="bg-slate-50 rounded-xl p-3 mb-3">
        <p className="text-xs text-slate-600 font-mono leading-relaxed break-all">
          {content || "Not found"}
        </p>
      </div>
      <ScoreBar score={score} />
      <p className="text-xs text-slate-500 mt-2 leading-relaxed">{feedback}</p>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function SEOAnalyzerPage() {
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [report, setReport] = useState<SEOReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!url.startsWith("http")) {
      setError("Please enter a valid URL starting with http:// or https://");
      return;
    }
    setError(null);
    setReport(null);
    setIsAnalyzing(true);

    try {
      const res = await fetch("/api/seo-analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Analysis failed");
      }

      const data = await res.json();
      setReport(data as SEOReport);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(msg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 pb-16">
      {/* Page Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-50 border border-violet-200 shadow-sm mb-4">
              <TrendingUp className="w-4 h-4 text-violet-500" />
              <span className="text-xs font-semibold text-violet-600 uppercase tracking-wider">
                Powered by Firecrawl + Gemini
              </span>
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              SEO Health{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-purple-500">
                Analyzer
              </span>
            </h1>
            <p className="text-slate-500 text-lg">
              Enter any URL and get an instant, AI-powered SEO audit with
              actionable improvement suggestions.
            </p>
          </div>

          {/* URL Input Bar */}
          <div className="mt-8 max-w-3xl mx-auto">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !isAnalyzing && handleAnalyze()}
                  placeholder="https://example.com/product-page"
                  className="w-full pl-12 pr-6 py-4 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all text-base shadow-inner"
                />
              </div>
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !url}
                className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {isAnalyzing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
                {isAnalyzing ? "Analyzing..." : "Analyze SEO"}
              </button>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
              >
                <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Analysis failed: </span>
                  {error}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Loading State */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-6xl mx-auto px-6 py-16 text-center"
          >
            <div className="relative inline-flex mb-8">
              <div className="absolute inset-0 bg-violet-200 rounded-full blur-xl animate-pulse" />
              <div className="relative bg-gradient-to-tr from-violet-600 to-purple-500 w-20 h-20 rounded-full flex items-center justify-center shadow-xl">
                <Sparkles className="w-10 h-10 text-white animate-pulse" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Crawling & Analyzing
            </h2>
            <p className="text-slate-500 mb-8">
              Firecrawl is extracting the page, then Gemini is scoring every SEO signal...
            </p>
            <div className="max-w-xs mx-auto space-y-3 text-left">
              {[
                "Crawling URL with Firecrawl...",
                "Extracting title, meta & headings...",
                "Counting words & links...",
                "Scoring each SEO factor with Gemini...",
                "Generating improvement roadmap...",
              ].map((step, i) => (
                <motion.div
                  key={step}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.4 }}
                >
                  <div className="w-2 h-2 rounded-full bg-violet-500 animate-ping" />
                  <span className="text-sm text-slate-600">{step}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Dashboard */}
      <AnimatePresence>
        {report && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-6xl mx-auto px-6 pt-10 space-y-8"
          >
            {/* Overview Row */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Overall Score */}
              <div className="md:col-span-1 bg-white rounded-3xl border border-slate-200 shadow-xl p-8 flex flex-col items-center justify-center text-center">
                <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">
                  Overall SEO Score
                </h2>
                <ScoreRing score={report.seoScore} size={140} />
                <p className="mt-4 text-sm text-slate-500 leading-relaxed">
                  {report.seoScore >= 80
                    ? "Your page is well-optimized for search engines."
                    : report.seoScore >= 60
                    ? "Your page has a solid base, but key improvements are available."
                    : "This page needs significant SEO work to rank well."}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="md:col-span-2 grid grid-cols-2 gap-4">
                {[
                  {
                    icon: AlignLeft,
                    label: "Word Count",
                    value: `${report.wordCount.toLocaleString()} words`,
                    good: report.wordCount >= 500,
                  },
                  {
                    icon: Link2,
                    label: "Internal Links",
                    value: `${report.internalLinks} links`,
                    good: report.internalLinks >= 5,
                  },
                  {
                    icon: Link2,
                    label: "External Links",
                    value: `${report.externalLinks} links`,
                    good: report.externalLinks >= 1,
                  },
                  {
                    icon: Hash,
                    label: "Heading Structure",
                    value: `${report.headings.h1Count} H1 · ${report.headings.h2Count} H2`,
                    good: report.headings.h1Count === 1,
                  },
                ].map(({ icon: StatIcon, label, value, good }) => (
                  <div
                    key={label}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-start gap-4"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        good ? "bg-emerald-50" : "bg-amber-50"
                      }`}
                    >
                      <StatIcon
                        className={`w-5 h-5 ${good ? "text-emerald-600" : "text-amber-600"}`}
                      />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">{label}</p>
                      <p className="text-lg font-extrabold text-slate-800">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Metric Cards Row */}
            <div className="grid md:grid-cols-3 gap-6">
              <MetricCard
                icon={FileText}
                title="Title Tag"
                content={report.titleTag.content}
                length={report.titleTag.length}
                score={report.titleTag.score}
                feedback={report.titleTag.feedback}
              />
              <MetricCard
                icon={AlignLeft}
                title="Meta Description"
                content={report.metaDescription.content}
                length={report.metaDescription.length}
                score={report.metaDescription.score}
                feedback={report.metaDescription.feedback}
              />
              <MetricCard
                icon={Hash}
                title="Heading Structure"
                content={`H1: ${report.headings.h1Count} · H2: ${report.headings.h2Count}`}
                score={report.headings.score}
                feedback={report.headings.feedback}
              />
            </div>

            {/* Quick Wins + Improvements Row */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Quick Wins */}
              <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-3xl p-8 text-white shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-lg font-bold">⚡ Top 3 Quick Wins</h3>
                </div>
                <div className="space-y-4">
                  {report.quickWins.map((win, i) => (
                    <motion.div
                      key={i}
                      className="flex items-start gap-3 bg-white/10 rounded-xl p-4"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 + 0.3 }}
                    >
                      <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-sm leading-relaxed text-white/90">{win}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* All Improvements */}
              <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">Full Improvement Roadmap</h3>
                </div>
                <div className="space-y-3">
                  {report.improvements.map((item, i) => (
                    <motion.div
                      key={i}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 + 0.3 }}
                    >
                      <ChevronRight className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      <p className="text-sm text-slate-600 leading-relaxed">{item}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">
                AI Summary
              </h3>
              <p className="text-slate-700 leading-relaxed text-base">{report.summary}</p>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!report && !isAnalyzing && !error && (
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <TrendingUp className="w-12 h-12 text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-400 mb-2">Ready to audit</h3>
          <p className="text-slate-400 text-sm">
            Enter any URL above and hit &quot;Analyze SEO&quot; to get started.
          </p>
        </div>
      )}
    </div>
  );
}
