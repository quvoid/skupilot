"use client";

import { Clock, TrendingDown, FileX, Search, Languages, AlertTriangle } from "lucide-react";

const painPoints = [
  {
    icon: Clock,
    stat: "2–4 hours",
    title: "Wasted per product",
    description:
      "Manual copywriters spend hours researching, writing, and reformatting every single product listing from scratch.",
    color: "bg-red-50 border-red-100",
    iconColor: "text-red-500",
    statColor: "text-red-600",
  },
  {
    icon: TrendingDown,
    stat: "67% lower",
    title: "Conversion without rich content",
    description:
      "Sparse, generic product descriptions kill conversions. Shoppers leave when they can't find the information they need.",
    color: "bg-amber-50 border-amber-100",
    iconColor: "text-amber-500",
    statColor: "text-amber-600",
  },
  {
    icon: FileX,
    stat: "43% missing",
    title: "Critical product attributes",
    description:
      "Marketplace listings with missing attributes are suppressed or buried — you never even get the chance to convert.",
    color: "bg-red-50 border-red-100",
    iconColor: "text-red-500",
    statColor: "text-red-600",
  },
  {
    icon: Search,
    stat: "78% of products",
    title: "Never found organically",
    description:
      "Without proper SEO metadata, product titles, and structured data, your catalog is invisible to search engines.",
    color: "bg-amber-50 border-amber-100",
    iconColor: "text-amber-500",
    statColor: "text-amber-600",
  },
  {
    icon: Languages,
    stat: "90% of sellers",
    title: "Sell only in 1 language",
    description:
      "Translation is too expensive and slow to scale. You're locked out of billions of non-English speaking customers.",
    color: "bg-red-50 border-red-100",
    iconColor: "text-red-500",
    statColor: "text-red-600",
  },
  {
    icon: AlertTriangle,
    stat: "$280K avg.",
    title: "Annual cost of manual ops",
    description:
      "Large catalogs require entire teams just to maintain product content — salaries, software, and agency fees add up fast.",
    color: "bg-amber-50 border-amber-100",
    iconColor: "text-amber-500",
    statColor: "text-amber-600",
  },
];

export default function ProblemSection() {
  return (
    <section className="section-padding bg-slate-50">
      <div className="container-section">
        <div className="text-center mb-16">
          <span className="section-label mb-4 block">The Problem</span>
          <h2 className="mb-4">
            The Problems with{" "}
            <span className="text-slate-700">Manual Product Content</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Ecommerce teams are drowning in repetitive, error-prone data work
            that keeps them from growing their business.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {painPoints.map((point) => {
            const Icon = point.icon;
            return (
              <div
                key={point.title}
                className={`p-6 rounded-xl border ${point.color} transition-transform hover:-translate-y-1 duration-200`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-white rounded-lg shadow-sm">
                    <Icon className={`w-5 h-5 ${point.iconColor}`} />
                  </div>
                  <div
                    className={`text-lg font-bold ${point.statColor}`}
                  >
                    {point.stat}
                  </div>
                </div>
                <h3 className="text-base font-semibold text-slate-800 mb-2">
                  {point.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {point.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
