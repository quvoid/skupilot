import { create } from "zustand";

export type InputType = "url" | "raw" | "csv";

export interface EnrichedData {
  seoTitle: string;
  description: string;
  features: string[];
  attributes: Record<string, string>;
  qualityScore: number;
  images?: string[];
}

interface EnrichmentState {
  // Input
  inputType: InputType;
  rawInput: string;
  setInputType: (type: InputType) => void;
  setRawInput: (input: string) => void;

  // Settings
  tone: string;
  generateImages: boolean;
  setTone: (tone: string) => void;
  setGenerateImages: (gen: boolean) => void;

  // Processing State
  status: "idle" | "processing" | "complete";
  setStatus: (status: "idle" | "processing" | "complete") => void;

  // Result
  enrichedData: EnrichedData | null;
  setEnrichedData: (data: EnrichedData | null) => void;

  reset: () => void;
}

export const useEnrichmentStore = create<EnrichmentState>((set) => ({
  inputType: "url",
  rawInput: "",
  setInputType: (type) => set({ inputType: type }),
  setRawInput: (input) => set({ rawInput: input }),

  tone: "Professional",
  generateImages: true,
  setTone: (tone) => set({ tone }),
  setGenerateImages: (gen) => set({ generateImages: gen }),

  status: "idle",
  setStatus: (status) => set({ status }),

  enrichedData: null,
  setEnrichedData: (data) => set({ enrichedData: data }),

  reset: () =>
    set({
      rawInput: "",
      status: "idle",
      enrichedData: null,
    }),
}));
