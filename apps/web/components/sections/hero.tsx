"use client";

import {
  ArrowRight,
  Play,
  CheckCircle2,
  Sparkles,
  Zap,
  Star,
  Clock,
  Globe,
  BarChart3,
} from "lucide-react";

const featureTags = [
  { icon: CheckCircle2, label: "Conversion-ready" },
  { icon: Zap, label: "Instant enrichment" },
  { icon: BarChart3, label: "SEO-optimized" },
  { icon: Globe, label: "40+ languages" },
];

const stats = [
  { value: "2,400+", label: "Brands trust SkuPilot" },
  { value: "12M+", label: "Products enriched" },
  { value: "3.5 hrs", label: "Saved per product" },
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28 bg-white">
      {/* Background gradient blobs */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-sky-100 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute -bottom-20 -left-40 w-96 h-96 bg-cyan-50 rounded-full blur-3xl opacity-60 pointer-events-none" />

      <div className="container-section relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left copy */}
          <div>

            <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 leading-[1.08] mb-6">
              AI Product{" "}
              <span className="gradient-text">Catalog Enrichment</span>{" "}
              Platform
            </h1>

            <p className="text-xl text-slate-600 mb-10 max-w-xl leading-relaxed">
              Transform raw, sparse product data into conversion-ready ecommerce
              listings in seconds. SEO titles, rich descriptions, AI images,
              videos &amp; 40+ language translations — automatically.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <a href="/generate" className="btn-primary px-8 py-3 text-base">
                Start Generating <ArrowRight className="w-5 h-5" />
              </a>
              <a href="#how-it-works" className="btn-outline px-8 py-3 text-base">
                <Play className="w-4 h-4" /> See How It Works
              </a>
            </div>

            {/* Feature tags */}
            <div className="flex flex-wrap gap-3 mb-12">
              {featureTags.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-sm text-slate-600 shadow-sm"
                >
                  <Icon className="w-4 h-4 text-sky-500" />
                  {label}
                </div>
              ))}
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-6 pt-4 border-t border-slate-100">
              <div className="flex -space-x-2">
                {["bg-sky-400", "bg-cyan-500", "bg-emerald-500", "bg-amber-500", "bg-sky-600"].map(
                  (c, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-full border-2 border-white ${c}`}
                    />
                  )
                )}
              </div>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-amber-400 fill-amber-400"
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-slate-700">
                  Trusted by 2,400+ brands
                </span>
              </div>
            </div>
          </div>

          {/* Right — animated product enrichment mockup */}
          <div className="relative flex justify-center lg:justify-end">
            <div className="relative w-full max-w-md float-animation">
              {/* Main card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden">
                {/* Card header */}
                <div className="bg-sky-500 px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-white" />
                    <span className="text-white font-semibold text-sm">
                      AI Enrichment
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-white/90 text-xs font-medium">Live</span>
                  </div>
                </div>

                {/* Card body */}
                <div className="px-6 py-6 space-y-5">
                  {/* Input product */}
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                      Raw Input
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 font-mono text-xs text-slate-600">
                      <div>SKU: WH-X500</div>
                      <div>name: headphones</div>
                      <div className="text-red-400">description: (empty)</div>
                      <div className="text-red-400">images: 0</div>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-px bg-gradient-to-r from-slate-200 via-sky-300 to-slate-200" />
                    <div className="flex items-center gap-1 px-3 py-1 bg-sky-500 rounded-full">
                      <Sparkles className="w-3 h-3 text-white" />
                      <span className="text-white text-xs font-medium">AI Enriching…</span>
                    </div>
                    <div className="flex-1 h-px bg-gradient-to-r from-slate-200 via-sky-300 to-slate-200" />
                  </div>

                  {/* Enriched output */}
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                      Enriched Output
                    </div>
                    <div className="space-y-2">
                      <div className="flex gap-2 items-start">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <div className="text-sm font-semibold text-slate-800">
                          Premium Wireless Headphones Pro X500
                        </div>
                      </div>
                      <div className="flex gap-2 items-start">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-slate-600">
                          Experience crystal-clear audio with industry-leading
                          noise cancellation…
                        </div>
                      </div>
                      <div className="flex gap-2 items-start">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-slate-600">
                          5 AI images · 1 video · 12 translations
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quality score */}
                  <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl flex items-center justify-between">
                    <span className="text-sm font-bold text-emerald-700">
                      Quality Score
                    </span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-emerald-100 rounded-full overflow-hidden">
                        <div className="w-[98%] h-full bg-emerald-500 rounded-full" />
                      </div>
                      <span className="text-sm font-bold text-emerald-700">98%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating badge: time saved */}
              <div className="absolute -left-8 top-16 bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-500" />
                <div>
                  <div className="text-xs text-slate-500">Time saved</div>
                  <div className="text-sm font-bold text-slate-800">3.5 hrs</div>
                </div>
              </div>

              {/* Floating badge: languages */}
              <div className="absolute -right-6 bottom-20 bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3 flex items-center gap-2">
                <Globe className="w-4 h-4 text-cyan-500" />
                <div>
                  <div className="text-xs text-slate-500">Translated to</div>
                  <div className="text-sm font-bold text-slate-800">42 languages</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-20 pt-10 border-t border-slate-100 grid grid-cols-3 gap-8 max-w-2xl mx-auto text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-3xl font-bold text-sky-500 mb-1">{s.value}</div>
              <div className="text-sm text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
