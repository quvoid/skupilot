"use client";

import { CheckCircle2, XCircle, Clock, Zap } from "lucide-react";

const features = [
  "SEO Product Titles & Meta",
  "Rich Product Descriptions",
  "AI-Generated Images (5/product)",
  "Product Video Generation",
  "40+ Language Translation",
  "Bulk Processing (1,000+ SKUs)",
  "Brand Voice Configuration",
  "Complete Attribute Mapping",
  "Quality Score & Audit",
  "Direct Shopify/Amazon Publish",
  "Real-time Progress Tracking",
  "API & Webhook Access",
];

const timeComparison = [
  { label: "Per product (manual)", value: "2–4 hrs", color: "text-red-500" },
  { label: "Per product (SkuPilot)", value: "< 30 sec", color: "text-emerald-500" },
  { label: "100 products (manual)", value: "~2 weeks", color: "text-red-500" },
  { label: "100 products (SkuPilot)", value: "< 1 hour", color: "text-emerald-500" },
];

export default function ComparisonSection() {
  return (
    <section id="comparison" className="section-padding bg-slate-50">
      <div className="container-section">
        <div className="text-center mb-16">
          <span className="section-label mb-4 block">Why SkuPilot</span>
          <h2 className="mb-4">
            SkuPilot vs{" "}
            <span className="text-slate-600">Traditional Solutions</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Manual data entry, agencies, and generic tools can&apos;t compete
            with AI-powered automation at scale.
          </p>
        </div>

        {/* Feature Matrix */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden mb-10">
          {/* Table header */}
          <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-200">
            <div className="px-6 py-4 text-sm font-bold text-slate-600 uppercase tracking-widest">
              Feature
            </div>
            <div className="px-6 py-4 text-center">
              <span className="text-sm font-bold text-red-500 uppercase tracking-widest">
                Manual / Agency
              </span>
            </div>
            <div className="px-6 py-4 text-center bg-sky-50 border-l border-sky-200">
              <span className="text-sm font-bold text-sky-600 uppercase tracking-widest">
                SkuPilot AI
              </span>
            </div>
          </div>

          {/* Rows */}
          {features.map((feature, i) => (
            <div
              key={feature}
              className={`grid grid-cols-3 border-b border-slate-100 last:border-0 ${
                i % 2 === 0 ? "bg-white" : "bg-slate-50/50"
              }`}
            >
              <div className="px-6 py-4 text-sm font-medium text-slate-700">
                {feature}
              </div>
              <div className="px-6 py-4 flex justify-center items-center">
                <XCircle className="w-5 h-5 text-red-400" />
              </div>
              <div className="px-6 py-4 flex justify-center items-center bg-sky-50/50 border-l border-sky-100">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
            </div>
          ))}
        </div>

        {/* Time comparison cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {timeComparison.map((item) => (
            <div key={item.label} className="card text-center">
              <div className="flex justify-center mb-3">
                {item.color.includes("red") ? (
                  <Clock className="w-6 h-6 text-red-400" />
                ) : (
                  <Zap className="w-6 h-6 text-sky-500" />
                )}
              </div>
              <div className={`text-2xl font-bold mb-1 ${item.color}`}>
                {item.value}
              </div>
              <div className="text-xs text-slate-500 font-medium">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
