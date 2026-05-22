"use client";

import { ReactCompareSlider } from "react-compare-slider";
import { CheckCircle2, XCircle, TrendingUp, AlertTriangle } from "lucide-react";

const beforeStats = [
  { label: "Product Title", value: "headphones black", status: "bad" },
  { label: "Description", value: "0 words", status: "bad" },
  { label: "Images", value: "0 images", status: "bad" },
  { label: "Attributes", value: "2 / 15 filled", status: "bad" },
  { label: "SEO Score", value: "12 / 100", status: "bad" },
  { label: "Translations", value: "0 languages", status: "bad" },
];

const afterStats = [
  { label: "Product Title", value: "Premium Wireless Headphones Pro X500", status: "good" },
  { label: "Description", value: "320 words, SEO-optimised", status: "good" },
  { label: "Images", value: "5 AI-generated images", status: "good" },
  { label: "Attributes", value: "15 / 15 filled (100%)", status: "good" },
  { label: "SEO Score", value: "98 / 100", status: "good" },
  { label: "Translations", value: "42 languages", status: "good" },
];

function BeforePanel() {
  return (
    <div className="w-full h-full bg-slate-100 flex flex-col">
      <div className="px-6 py-4 bg-slate-200 border-b border-slate-300 flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-red-500" />
        <span className="text-sm font-bold text-slate-700">
          Before: Sparse Raw Data
        </span>
      </div>
      <div className="flex-1 p-5 space-y-2.5 overflow-hidden flex flex-col justify-center">
        {beforeStats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-red-200 p-3.5 flex items-start gap-3"
          >
            <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                {stat.label}
              </div>
              <div className="text-sm font-semibold text-red-600 truncate">
                {stat.value}
              </div>
            </div>
          </div>
        ))}
        <div className="mt-3 p-3 bg-red-50 rounded-xl border border-red-200 text-center">
          <div className="text-2xl font-bold text-red-500">12%</div>
          <div className="text-xs text-red-600 font-medium">
            Quality Score — Unpublishable
          </div>
        </div>
      </div>
    </div>
  );
}

function AfterPanel() {
  return (
    <div className="w-full h-full bg-sky-50 flex flex-col">
      <div className="px-6 py-4 bg-sky-500 border-b border-sky-600 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-white" />
        <span className="text-sm font-bold text-white">
          After: SkuPilot Enriched
        </span>
      </div>
      <div className="flex-1 p-5 space-y-2.5 overflow-hidden flex flex-col justify-center">
        {afterStats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-emerald-200 p-3.5 flex items-start gap-3"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                {stat.label}
              </div>
              <div className="text-sm font-semibold text-emerald-700 truncate">
                {stat.value}
              </div>
            </div>
          </div>
        ))}
        <div className="mt-3 p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
          <div className="text-2xl font-bold text-emerald-500">98%</div>
          <div className="text-xs text-emerald-600 font-medium">
            Quality Score — Conversion-Ready
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BeforeAfterSection() {
  return (
    <section className="section-padding bg-white text-center">
      <div className="container-section">
        <span className="section-label mb-4 block">Transformation</span>
        <h2 className="mb-4">
          See the <span className="gradient-text">Difference</span>
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-12">
          Drag the slider to see what SkuPilot turns your sparse product data
          into — in seconds.
        </p>

        <div
          className="w-full max-w-5xl mx-auto rounded-2xl overflow-hidden border border-slate-200 shadow-2xl"
          style={{ height: "660px" }}
        >
          <ReactCompareSlider
            itemOne={<BeforePanel />}
            itemTwo={<AfterPanel />}
            handle={
              <div className="flex h-full w-1 items-center justify-center bg-white shadow-[0_0_10px_rgba(0,0,0,0.1)]">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sky-500 shadow-xl border-4 border-white text-white transition-transform hover:scale-110 cursor-ew-resize">
                  <div className="flex gap-1">
                    <svg width="6" height="10" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 10L2 6L6 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    <svg width="6" height="10" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 10L6 6L2 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </div>
              </div>
            }
            style={{ height: "100%", width: "100%" }}
          />
        </div>

        {/* Helper text */}
        <p className="mt-6 text-sm text-slate-400 flex items-center justify-center gap-2">
          ← Drag the slider to compare →
        </p>
      </div>
    </section>
  );
}
