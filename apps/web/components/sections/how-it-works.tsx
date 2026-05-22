"use client";

import { useState, useEffect } from "react";
import {
  Upload,
  Link,
  FileText,
  ArrowRight,
  CheckCircle2,
  Image,
  Video,
  Globe,
  Tag,
  BarChart2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const inputOptions = [
  {
    icon: Upload,
    label: "CSV Upload",
    desc: "Bulk import thousands of products",
    code: `sku,name,price\nWH-X500,headphones,89.99\nSP-M200,speaker,149.99`,
  },
  {
    icon: Link,
    label: "Product URL",
    desc: "Scrape any product page automatically",
    code: `url: amazon.com/dp/B08N5WRWNW\n→ Scraping attributes...\n→ Extracting images...\n→ Done ✓`,
  },
  {
    icon: FileText,
    label: "Raw Attributes",
    desc: "Paste any unstructured product data",
    code: `model: X500\ncolor: black\ndriver: 40mm\nbattery: 30h`,
  },
];

const outputItems = [
  { icon: CheckCircle2, label: "SEO product title & meta description" },
  { icon: CheckCircle2, label: "Long-form rich product description" },
  { icon: CheckCircle2, label: "5 AI-generated professional images" },
  { icon: Video, label: "Showcase video (Runway ML)" },
  { icon: Globe, label: "40+ language translations" },
  { icon: Tag, label: "Structured attributes & schema" },
  { icon: BarChart2, label: "Quality score & SEO audit" },
];

export default function HowItWorksSection() {
  const [activeInput, setActiveInput] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
    const duration = 2500; // 2.5 seconds to reach 100%
    const steps = 100;
    const intervalTime = duration / steps;
    
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(timer);
          return 100;
        }
        return p + 1;
      });
    }, intervalTime);
    return () => clearInterval(timer);
  }, [activeInput]);

  return (
    <section id="how-it-works" className="section-padding bg-white">
      <div className="container-section">
        <div className="text-center mb-16">
          <span className="section-label mb-4 block">How It Works</span>
          <h2 className="mb-4">
            From Raw Data to{" "}
            <span className="gradient-text">Conversion-Ready</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            SkuPilot accepts any product input format and delivers a fully
            enriched, publish-ready catalog in seconds.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 items-stretch">
          {/* INPUT panel */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
            <div className="bg-white border-b border-slate-200 px-6 py-4">
              <h3 className="text-base font-semibold text-slate-800">
                📥 Input — Any Format
              </h3>
            </div>
            <div className="p-6 flex flex-col h-[calc(100%-60px)]">
              {/* Tab switcher */}
              <div className="flex gap-2 mb-5">
                {inputOptions.map((opt, i) => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.label}
                      onClick={() => setActiveInput(i)}
                      className={cn(
                        "flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all",
                        activeInput === i
                          ? "bg-sky-500 text-white shadow-sm"
                          : "bg-white border border-slate-200 text-slate-600 hover:border-sky-300"
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {opt.label}
                    </button>
                  );
                })}
              </div>

              <p className="text-sm text-slate-500 mb-4">
                {inputOptions[activeInput].desc}
              </p>

              {/* Code preview */}
              <div className="bg-slate-900 rounded-xl p-5 font-mono text-xs leading-relaxed flex-grow">
                {inputOptions[activeInput].code.split("\n").map((line, i) => (
                  <div key={i} className="text-emerald-400">
                    {line || "\u00a0"}
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              <div className="mt-5 space-y-2">
                <div className="flex justify-between text-xs text-slate-500 font-medium">
                  <span>{progress < 100 ? "Processing…" : "Done ✓"}</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-sky-400 to-cyan-400 rounded-full" 
                    initial={{ width: "0%" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ ease: "linear", duration: 0.1 }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className="hidden lg:flex absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
            <div className="w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center shadow-lg">
              <ArrowRight className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* OUTPUT panel */}
          <div className="bg-sky-50 rounded-2xl border border-sky-200 overflow-hidden flex flex-col">
            <div className="bg-white border-b border-sky-200 px-6 py-4 flex-shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-slate-800">
                  ✨ Output — Fully Enriched
                </h3>
                {progress === 100 && (
                  <motion.span 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="badge-green"
                  >
                    98% Quality Score
                  </motion.span>
                )}
              </div>
            </div>
            <div className="p-6 space-y-3 flex-grow flex flex-col">
              <div className="flex-grow space-y-3">
                <AnimatePresence>
                  {outputItems.map(({ icon: Icon, label }, index) => {
                    const threshold = (index + 1) * (100 / outputItems.length);
                    if (progress < threshold && progress < 100) return null;
                    return (
                      <motion.div
                        key={label}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3 p-3 bg-white rounded-xl border border-sky-100"
                      >
                        <Icon className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                        <span className="text-sm font-medium text-slate-700">{label}</span>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>

              {progress === 100 && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="pt-4 border-t border-sky-200 mt-auto"
                >
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600 font-medium">Ready to publish to:</span>
                  </div>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {["Shopify", "Amazon", "Magento", "CSV"].map((p) => (
                      <span
                        key={p}
                        className="px-3 py-1 bg-white border border-sky-200 rounded-full text-xs font-semibold text-sky-700"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
