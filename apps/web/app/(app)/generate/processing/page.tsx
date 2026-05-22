"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEnrichmentStore } from "@/store/useEnrichmentStore";
import { cn } from "@/lib/utils";

const processingSteps = [
  { id: 1, text: "Crawling product page with Firecrawl..." },
  { id: 2, text: "Extracting attributes & raw schema..." },
  { id: 3, text: "Generating SEO title & description with Gemini..." },
  { id: 4, text: "Writing conversion-optimized feature bullets..." },
  { id: 5, text: "Finalizing catalog entry & saving..." },
];

export default function ProcessingPage() {
  const router = useRouter();
  const store = useEnrichmentStore();
  const [currentStep, setCurrentStep] = useState(0);

  const hasStarted = useRef(false);

  useEffect(() => {
    // Guard: if status isn't "processing" on first mount, send back
    if (store.status !== "processing") {
      router.push("/generate");
      return;
    }

    // Guard: prevent re-running when store state updates mid-flight
    if (hasStarted.current) return;
    hasStarted.current = true;

    // Step cycler (advance a step every 1.2s for visual effect)
    const stepInterval = setInterval(() => {
      setCurrentStep((s) => Math.min(s + 1, processingSteps.length - 1));
    }, 1200);

    // Hit the real API
    const runEnrichment = async () => {
      try {
        const res = await fetch("/api/enrich", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            inputType: store.inputType,
            rawInput: store.rawInput,
            settings: { tone: store.tone, images: store.generateImages },
          }),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `Server error ${res.status}`);
        }

        const data = await res.json();

        store.setEnrichedData(data);
        store.setStatus("complete");

        // Slight delay before jumping to editor so they see 100% completion
        setTimeout(() => {
          router.push("/generate/editor");
        }, 600);

      } catch (err: unknown) {
        console.error("[Processing] Enrichment failed:", err);
        const msg = err instanceof Error ? err.message : "Enrichment failed";
        alert(`Enrichment failed: ${msg}\n\nCheck that your GEMINI_API_KEY is set in .env.local`);
        store.setStatus("idle");
        router.push("/generate");
      }
    };

    runEnrichment();

    return () => clearInterval(stepInterval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps — we only want this to fire once on mount

  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[calc(100vh-64px)] bg-slate-50 p-6">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden p-8">
        
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute inset-0 bg-sky-200 rounded-full blur-xl animate-pulse" />
            <div className="relative bg-gradient-to-tr from-sky-500 to-cyan-400 w-16 h-16 rounded-full flex items-center justify-center shadow-lg">
              <Sparkles className="w-8 h-8 text-white animate-pulse" />
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">
          Enriching Product
        </h2>
        <p className="text-center text-slate-500 text-sm mb-8">
          Claude and Flux are transforming your data.
        </p>

        <div className="space-y-4">
          {processingSteps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep;

            return (
              <div key={step.id} className="flex items-center gap-3">
                <div className="w-6 flex justify-center">
                  {isCompleted ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    </motion.div>
                  ) : isCurrent ? (
                    <div className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-slate-200" />
                  )}
                </div>
                <span
                  className={cn(
                    "text-sm font-medium transition-colors duration-300",
                    isCompleted ? "text-slate-700" : isCurrent ? "text-sky-600" : "text-slate-400"
                  )}
                >
                  {step.text}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="mt-8 h-2 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-sky-400 to-cyan-400"
            initial={{ width: "0%" }}
            animate={{ width: `${Math.min(100, ((currentStep + 1) / processingSteps.length) * 100)}%` }}
            transition={{ ease: "easeInOut", duration: 0.5 }}
          />
        </div>

      </div>
    </div>
  );
}
