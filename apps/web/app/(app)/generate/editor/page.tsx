"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useEnrichmentStore } from "@/store/useEnrichmentStore";
import { Download, ShoppingBag, ArrowLeft, RefreshCw, Wand2, CheckCircle2, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ── Shopify Success Modal ─────────────────────────────────────────────────────
function ShopifyModal({ onClose }: { onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        {/* Card */}
        <motion.div
          className="relative bg-white rounded-3xl shadow-2xl p-10 max-w-sm w-full text-center z-10"
          initial={{ scale: 0.85, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-100">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 mb-2">
            Listing Published!
          </h3>
          <p className="text-slate-500 text-sm mb-6 leading-relaxed">
            Your enriched product listing has been successfully pushed to your
            Shopify store. It will appear live within 30 seconds.
          </p>
          <div className="bg-slate-50 rounded-2xl p-4 mb-6 text-left space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              SEO title & description synced
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              Structured attributes uploaded
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              Feature bullets formatted
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              Product images assigned
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl"
          >
            Back to Editor
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Main Editor Page ──────────────────────────────────────────────────────────
export default function EditorPage() {
  const router = useRouter();
  const store = useEnrichmentStore();
  const [showShopifyModal, setShowShopifyModal] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    if (!store.enrichedData || store.status !== "complete") {
      router.push("/generate");
    }
  }, [store.enrichedData, store.status, router]);

  if (!store.enrichedData) return null;

  const data = store.enrichedData;

  // ── Real CSV Export ──────────────────────────────────────────────────────────
  const handleExport = async () => {
    setIsExporting(true);
    try {
      const res = await fetch("/api/export-csv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: store.enrichedData,
          filename: `skupilot-${Date.now()}.csv`,
        }),
      });

      if (!res.ok) throw new Error("Export failed");

      // Trigger browser download
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `skupilot-export.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-slate-50 overflow-hidden">
      {/* Shopify Success Modal */}
      <AnimatePresence>
        {showShopifyModal && (
          <ShopifyModal onClose={() => setShowShopifyModal(false)} />
        )}
      </AnimatePresence>

      {/* Editor Header */}
      <div className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => { store.reset(); router.push("/generate"); }}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-800 flex items-center gap-3">
              {data.seoTitle}
            </h1>
            <p className="text-xs text-slate-500 font-medium">AI-enriched · Ready for review</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 font-semibold text-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Quality Score: {data.qualityScore}%
          </div>
          <div className="h-6 w-px bg-slate-200 mx-2" />
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-semibold transition-colors disabled:opacity-60"
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {isExporting ? "Exporting..." : "Export CSV"}
          </button>
          <button
            onClick={() => setShowShopifyModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            Push to Shopify
          </button>
        </div>
      </div>

      {/* Split Pane Workspace */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left Pane: Original Source */}
        <div className="w-1/3 bg-slate-100 border-r border-slate-200 flex flex-col hidden lg:flex">
          <div className="px-6 py-4 bg-slate-100 border-b border-slate-200 font-semibold text-sm text-slate-700 uppercase tracking-wider">
            Original Input ({store.inputType})
          </div>
          <div className="p-6 flex-1 overflow-auto">
            <div className="bg-slate-900 rounded-xl p-5 font-mono text-xs text-emerald-400 whitespace-pre-wrap leading-relaxed shadow-inner">
              {store.rawInput || "No input provided."}
            </div>
          </div>
        </div>

        {/* Right Pane: Enriched Editor */}
        <div className="flex-1 overflow-auto bg-white">
          <div className="max-w-4xl mx-auto p-8 space-y-8">

            {/* Title Section */}
            <div className="space-y-2 group">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">SEO Title</label>
                <button className="text-xs text-sky-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" /> Regenerate
                </button>
              </div>
              <input
                type="text"
                defaultValue={data.seoTitle}
                className="w-full text-xl font-bold text-slate-900 px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all"
              />
            </div>

            {/* Images Gallery */}
            {data.images && data.images.length > 0 && (
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Generated Media</label>
                <div className="grid grid-cols-4 gap-4">
                  {data.images.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group bg-slate-100">
                      <img src={img} alt={`Generated product ${i}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button className="p-2 bg-white rounded-full text-slate-700 hover:text-sky-500 transition-colors">
                          <Wand2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-white rounded-full text-slate-700 hover:text-sky-500 transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="space-y-2 group">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Rich Description</label>
                <button className="text-xs text-sky-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                  <RefreshCw className="w-3 h-3" /> Regenerate
                </button>
              </div>
              <textarea
                defaultValue={data.description}
                rows={6}
                className="w-full text-sm text-slate-700 px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all leading-relaxed resize-y"
              />
            </div>

            {/* Features & Attributes Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Bullet Points */}
              <div className="space-y-3 group">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Feature Bullets</label>
                  <button className="text-xs text-sky-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" /> Regenerate
                  </button>
                </div>
                <div className="space-y-2">
                  {data.features.map((feature, i) => (
                    <input
                      key={i}
                      type="text"
                      defaultValue={feature}
                      className="w-full text-sm text-slate-700 px-3 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
                    />
                  ))}
                </div>
              </div>

              {/* Attributes */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Structured Attributes</label>
                <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                  <table className="w-full text-sm text-left">
                    <tbody className="divide-y divide-slate-200">
                      {Object.entries(data.attributes).map(([key, value]) => (
                        <tr key={key} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-2.5 font-medium text-slate-600 w-1/3 bg-slate-50/50 border-r border-slate-200">
                            {key}
                          </td>
                          <td className="px-4 py-2.5">
                            <input
                              type="text"
                              defaultValue={value as string}
                              className="w-full bg-transparent outline-none text-slate-800"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
