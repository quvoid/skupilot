"use client";

import { useState, useEffect } from "react";
import {
  Upload,
  Sparkles,
  Image,
  Send,
  CheckCircle2,
  Tag,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const steps = [
  {
    number: 1,
    icon: Upload,
    title: "Import Product Data",
    description:
      "Upload a CSV, paste a product URL, or enter raw attributes. SkuPilot accepts any format and instantly normalises it into a structured schema.",
  },
  {
    number: 2,
    icon: Sparkles,
    title: "AI Enhancement",
    description:
      "Claude claude-sonnet-4-6 rewrites titles, crafts compelling descriptions, generates bullet features, and fills in missing attributes — in your brand's voice.",
  },
  {
    number: 3,
    icon: Image,
    title: "Visual Generation",
    description:
      "Flux Pro generates 5 professional product images per SKU. Runway ML creates a showcase video. All assets are uploaded to cloud storage automatically.",
  },
  {
    number: 4,
    icon: Send,
    title: "Publish Everywhere",
    description:
      "Push enriched listings directly to Shopify, Amazon, or Magento with one click — or export a clean CSV with everything your team needs.",
  },
];

const tabs = ["Description", "Features", "Attributes"] as const;
type Tab = (typeof tabs)[number];

const tabContent: Record<Tab, { lines: { text: string; color?: string }[] }> = {
  Description: {
    lines: [
      { text: "✦ Generating SEO title…", color: "text-sky-400" },
      { text: "" },
      { text: "Premium Wireless Headphones Pro X500", color: "text-white" },
      { text: "" },
      { text: "Experience crystal-clear audio with 40-hour", color: "text-slate-300" },
      { text: "battery life and adaptive noise cancellation.", color: "text-slate-300" },
      { text: "Designed for audiophiles who demand the best.", color: "text-slate-300" },
      { text: "" },
      { text: "✓ SEO meta generated", color: "text-emerald-400" },
    ],
  },
  Features: {
    lines: [
      { text: "✦ Extracting key features…", color: "text-sky-400" },
      { text: "" },
      { text: "• 40-hour battery life with quick charge", color: "text-slate-300" },
      { text: "• Adaptive Active Noise Cancellation (ANC)", color: "text-slate-300" },
      { text: "• Bluetooth 5.3 with multipoint pairing", color: "text-slate-300" },
      { text: "• 40mm premium dynamic drivers", color: "text-slate-300" },
      { text: "• Foldable design with carry case", color: "text-slate-300" },
      { text: "" },
      { text: "✓ 5 features extracted", color: "text-emerald-400" },
    ],
  },
  Attributes: {
    lines: [
      { text: "✦ Building attribute schema…", color: "text-sky-400" },
      { text: "" },
      { text: 'color:          "Midnight Black"', color: "text-cyan-300" },
      { text: 'weight:         "250g"', color: "text-cyan-300" },
      { text: 'connectivity:   "Bluetooth 5.3"', color: "text-cyan-300" },
      { text: 'battery:        "40 hours"', color: "text-cyan-300" },
      { text: 'driver_size:    "40mm"', color: "text-cyan-300" },
      { text: "" },
      { text: "✓ 12 attributes mapped", color: "text-emerald-400" },
    ],
  },
};

export default function WalkthroughSection() {
  const [activeStep, setActiveStep] = useState(1);
  const [activeTab, setActiveTab] = useState<Tab>("Description");
  const [visibleLines, setVisibleLines] = useState(0);

  // Auto-cycle steps
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((s) => {
        const next = s === 4 ? 1 : s + 1;
        if (next === 2) setActiveTab("Description");
        if (next === 3) setActiveTab("Features");
        if (next === 4) setActiveTab("Attributes");
        return next;
      });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Stagger terminal lines
  useEffect(() => {
    setVisibleLines(0);
    const lines = tabContent[activeTab].lines.length;
    const timer = setInterval(() => {
      setVisibleLines((v) => {
        if (v >= lines) {
          clearInterval(timer);
          return v;
        }
        return v + 1;
      });
    }, 200); // show a new line every 200ms
    return () => clearInterval(timer);
  }, [activeTab]);

  return (
    <section className="section-padding bg-slate-50">
      <div className="container-section">
        <div className="text-center mb-16">
          <span className="section-label mb-4 block">The Process</span>
          <h2 className="mb-4">
            From Chaos to{" "}
            <span className="gradient-text">Ready Catalog</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Four steps. Zero manual work. Your entire product catalog enriched,
            translated, and live in minutes.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left — AI Content Enhancer mockup */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
            {/* Mockup header */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-sky-500" />
                <span className="font-semibold text-slate-800 text-sm">
                  AI Content Enhancer
                </span>
              </div>
              <span className="badge-green">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Generating
              </span>
            </div>

            {/* Product line */}
            <div className="px-6 pt-4 pb-0">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center flex-shrink-0">
                  <Tag className="w-5 h-5 text-sky-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-800 truncate">
                    WH-X500 — Wireless Headphones
                  </div>
                  <div className="text-xs text-slate-500">SKU imported · Enhancing now</div>
                </div>
                <div className="flex-shrink-0">
                  <div className="badge-sky">Step {activeStep}/4</div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="px-6 pt-4">
              <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "flex-1 py-1.5 text-xs font-medium rounded-md transition-all",
                      activeTab === tab
                        ? "bg-white shadow text-sky-600"
                        : "text-slate-500 hover:text-slate-700"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Code preview */}
            <div className="p-6">
              <div className="bg-slate-900 rounded-xl p-5 font-mono text-xs leading-relaxed min-h-[220px]">
                <AnimatePresence mode="popLayout">
                  {tabContent[activeTab].lines.slice(0, visibleLines).map((line, i) => (
                    <motion.div 
                      key={i} 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={line.color || "text-slate-500"}
                    >
                      {line.text || "\u00a0"}
                    </motion.div>
                  ))}
                  {visibleLines < tabContent[activeTab].lines.length && (
                    <motion.div 
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 0 }}
                      transition={{ repeat: Infinity, duration: 0.5 }}
                      className="w-2 h-4 bg-sky-400 inline-block mt-1"
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Quality bar */}
            <div className="px-6 pb-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-slate-600 font-medium">Quality Score</span>
                <span className="font-bold text-emerald-600">
                  {visibleLines === tabContent[activeTab].lines.length ? "98%" : "Calculating…"}
                </span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 rounded-full" 
                  initial={{ width: "20%" }}
                  animate={{ 
                    width: visibleLines === tabContent[activeTab].lines.length ? "98%" : `${20 + (visibleLines * 8)}%` 
                  }}
                  transition={{ ease: "easeInOut" }}
                />
              </div>
            </div>
          </div>

          {/* Right — steps list */}
          <div className="space-y-4">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = activeStep === step.number;
              return (
                <button
                  key={step.number}
                  onClick={() => setActiveStep(step.number)}
                  className={cn(
                    "w-full text-left p-5 rounded-xl border transition-all duration-300",
                    isActive
                      ? "bg-sky-50 border-sky-300 shadow-md"
                      : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                        isActive ? "bg-sky-500" : "bg-slate-100"
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-5 h-5",
                          isActive ? "text-white" : "text-slate-500"
                        )}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={cn(
                            "text-xs font-bold uppercase tracking-widest",
                            isActive ? "text-sky-500" : "text-slate-400"
                          )}
                        >
                          Step {step.number}
                        </span>
                      </div>
                      <h3
                        className={cn(
                          "text-base font-semibold mb-1",
                          isActive ? "text-sky-700" : "text-slate-800"
                        )}
                      >
                        {step.title}
                      </h3>
                      {isActive && (
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {step.description}
                        </p>
                      )}
                    </div>
                    {isActive && (
                      <CheckCircle2 className="w-5 h-5 text-sky-500 flex-shrink-0 mt-0.5" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
