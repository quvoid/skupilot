"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Link as LinkIcon, FileText, Sparkles, Settings2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEnrichmentStore, InputType } from "@/store/useEnrichmentStore";
import { motion, AnimatePresence } from "framer-motion";

const inputTabs: { id: InputType; icon: any; label: string; desc: string }[] = [
  { id: "url", icon: LinkIcon, label: "Product URL", desc: "Extract from any ecommerce link" },
  { id: "raw", icon: FileText, label: "Raw Attributes", desc: "Paste messy specs or notes" },
  { id: "csv", icon: Upload, label: "CSV Upload", desc: "Bulk process multiple SKUs" },
];

export default function GeneratePage() {
  const router = useRouter();
  const store = useEnrichmentStore();

  const handleStart = () => {
    if (!store.rawInput && store.inputType !== "csv") {
      alert("Please enter some input data to continue.");
      return;
    }
    store.setStatus("processing");
    router.push("/generate/processing");
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-sky-100/50 to-transparent pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-sky-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-32 -left-24 w-72 h-72 bg-blue-200/40 rounded-full blur-3xl pointer-events-none" />

      <div className="container-section py-12 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          <div className="mb-10 text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-4">
              <Sparkles className="w-4 h-4 text-sky-500" />
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">AI Enrichment Engine</span>
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
              Create <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-cyan-500">Conversion-Ready</span> Listings
            </h1>
            <p className="text-lg text-slate-500">
              Drop in your sparse data, and SkuPilot will extract, normalize, and enrich it into a perfect product catalog entry.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Main Input Area (Takes up 8 columns) */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden flex flex-col min-h-[500px]">
              
              {/* Animated Tab Switcher */}
              <div className="flex bg-slate-50 border-b border-slate-200 p-2 gap-2">
                {inputTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = store.inputType === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => store.setInputType(tab.id)}
                      className={cn(
                        "relative flex-1 flex flex-col items-center justify-center gap-1 py-4 px-2 rounded-2xl text-sm font-medium transition-colors z-10",
                        isActive ? "text-sky-700" : "text-slate-500 hover:text-slate-700 hover:bg-slate-100/50"
                      )}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-white rounded-2xl shadow-sm border border-slate-200/60"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-2 mb-1">
                        <Icon className={cn("w-5 h-5", isActive ? "text-sky-500" : "text-slate-400")} />
                        {tab.label}
                      </span>
                      <span className="relative z-10 text-[11px] font-normal text-slate-400">{tab.desc}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab Content with Framer Motion */}
              <div className="flex-1 p-8 bg-white relative">
                <AnimatePresence mode="wait">
                  {store.inputType === "url" && (
                    <motion.div 
                      key="url"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="h-full flex flex-col justify-center max-w-xl mx-auto w-full space-y-6"
                    >
                      <div className="text-center">
                        <div className="w-16 h-16 bg-sky-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-sky-100">
                          <LinkIcon className="w-8 h-8 text-sky-500" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Extract from URL</h3>
                        <p className="text-sm text-slate-500">Paste any product page link. SkuPilot will scrape the site, bypass captchas, and extract all raw data automatically.</p>
                      </div>
                      
                      <div className="relative group">
                        <input
                          type="url"
                          value={store.rawInput}
                          onChange={(e) => store.setRawInput(e.target.value)}
                          placeholder="https://amazon.com/dp/B08N5WRWNW"
                          className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all text-lg shadow-inner group-hover:border-slate-300"
                        />
                        {store.rawInput && (
                           <div className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500">
                             <Sparkles className="w-6 h-6" />
                           </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {store.inputType === "raw" && (
                    <motion.div 
                      key="raw"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="h-full flex flex-col space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-bold text-slate-700">Paste Raw Attributes</label>
                        <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-md font-mono">Format: Any</span>
                      </div>
                      <textarea
                        value={store.rawInput}
                        onChange={(e) => store.setRawInput(e.target.value)}
                        placeholder="Brand: Sony&#10;Model: WH-1000XM5&#10;Type: Over-ear wireless&#10;Battery: 30 hours&#10;[Paste messy factory data, PDF exports, or bullet points here...]"
                        className="w-full flex-1 min-h-[300px] px-6 py-5 bg-slate-50 border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all resize-none font-mono text-sm leading-relaxed shadow-inner"
                      />
                    </motion.div>
                  )}

                  {store.inputType === "csv" && (
                    <motion.div 
                      key="csv"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      className="h-full flex items-center justify-center"
                    >
                      <div className="w-full h-full min-h-[300px] border-2 border-dashed border-slate-300 hover:border-sky-400 hover:bg-sky-50/50 transition-colors rounded-2xl flex flex-col items-center justify-center cursor-pointer group">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mb-4 group-hover:scale-110 transition-transform">
                          <Upload className="w-8 h-8 text-sky-500" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-1">Upload CSV Catalog</h3>
                        <p className="text-sm font-medium text-slate-500 mb-4">Drag & drop or click to browse</p>
                        <span className="text-xs text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                          Max 5,000 rows per file
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Sidebar Settings (Takes up 4 columns) */}
            <div className="lg:col-span-4 space-y-6">
              
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8">
                <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
                  <div className="bg-sky-100 p-2 rounded-lg">
                    <Settings2 className="w-5 h-5 text-sky-600" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-800">Configuration</h2>
                </div>

                <div className="space-y-8">
                  {/* Brand Tone */}
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-slate-700">Brand Voice & Tone</label>
                    <div className="relative">
                      <select
                        value={store.tone}
                        onChange={(e) => store.setTone(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:ring-2 focus:ring-sky-500 outline-none appearance-none cursor-pointer"
                      >
                        <option>Professional & Trustworthy</option>
                        <option>Luxurious & Premium</option>
                        <option>Casual & Friendly</option>
                        <option>Technical & Precise</option>
                        <option>Urgent & Direct (Sales)</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500">Claude will adopt this persona when writing.</p>
                  </div>

                  {/* Image Generation */}
                  <div className="flex items-start justify-between pt-6 border-t border-slate-100">
                    <div className="pr-4">
                      <label className="block text-sm font-bold text-slate-700 mb-1">Visual Generation</label>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Use Flux Pro to generate 5 professional studio images based on the extracted specs.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 mt-1">
                      <input
                        type="checkbox"
                        checked={store.generateImages}
                        onChange={(e) => store.setGenerateImages(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-8 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all peer-checked:bg-emerald-500 shadow-inner"></div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleStart}
                className="w-full group relative flex items-center justify-center gap-3 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white py-5 px-8 rounded-2xl text-lg font-bold shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <Sparkles className="w-6 h-6 relative z-10" />
                <span className="relative z-10">Start Generation</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="flex items-center justify-center gap-2 text-xs font-medium text-slate-400">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                API Systems Operational
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
