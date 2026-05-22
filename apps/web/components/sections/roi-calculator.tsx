"use client";

import { useState, useCallback } from "react";
import { DollarSign, Clock, TrendingUp, BarChart2 } from "lucide-react";

function formatCurrency(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n.toFixed(0)}`;
}

function formatHours(n: number): string {
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K hrs`;
  return `${n.toFixed(0)} hrs`;
}

interface Metric {
  icon: typeof DollarSign;
  label: string;
  value: string;
  sub: string;
  color: string;
  bg: string;
}

export default function ROICalculator() {
  const [products, setProducts] = useState(500);
  const [hoursPerProduct, setHoursPerProduct] = useState(3);
  const [hourlyRate, setHourlyRate] = useState(45);

  const annualHoursSaved = useCallback(() => {
    const skuPilotTime = products * (0.5 / 60); // 30 sec per product
    const manualTime = products * hoursPerProduct;
    return Math.max(0, manualTime - skuPilotTime);
  }, [products, hoursPerProduct]);

  const annualSavings = useCallback(() => {
    return annualHoursSaved() * hourlyRate;
  }, [annualHoursSaved, hourlyRate]);

  const skuPilotCost = useCallback(() => {
    // Rough cost estimate: $299/mo for up to 1000 products
    const monthly = products <= 500 ? 49 : products <= 2000 ? 149 : 299;
    return monthly * 12;
  }, [products]);

  const roi = useCallback(() => {
    const cost = skuPilotCost();
    if (cost === 0) return 0;
    return ((annualSavings() - cost) / cost) * 100;
  }, [annualSavings, skuPilotCost]);

  const timeReduction = useCallback(() => {
    const manual = products * hoursPerProduct;
    if (manual === 0) return 0;
    return ((annualHoursSaved() / manual) * 100).toFixed(0);
  }, [products, hoursPerProduct, annualHoursSaved]);

  const metrics: Metric[] = [
    {
      icon: DollarSign,
      label: "Annual Savings",
      value: formatCurrency(annualSavings()),
      sub: "vs manual cost",
      color: "text-emerald-600",
      bg: "bg-emerald-50 border-emerald-200",
    },
    {
      icon: TrendingUp,
      label: "ROI",
      value: `${roi().toFixed(0)}%`,
      sub: "return on investment",
      color: "text-sky-600",
      bg: "bg-sky-50 border-sky-200",
    },
    {
      icon: Clock,
      label: "Hours Saved",
      value: formatHours(annualHoursSaved()),
      sub: "per year",
      color: "text-cyan-600",
      bg: "bg-cyan-50 border-cyan-200",
    },
    {
      icon: BarChart2,
      label: "Time Reduction",
      value: `${timeReduction()}%`,
      sub: "faster than manual",
      color: "text-amber-600",
      bg: "bg-amber-50 border-amber-200",
    },
  ];

  return (
    <section className="section-padding bg-white">
      <div className="container-section">
        <div className="text-center mb-16">
          <span className="section-label mb-4 block">ROI Calculator</span>
          <h2 className="mb-4">
            Calculate Your{" "}
            <span className="gradient-text">Cost Savings</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            See exactly how much time and money SkuPilot saves your team based
            on your catalog size and team rates.
          </p>
        </div>

        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-10 items-start">
          {/* Sliders */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-8 space-y-8">
            {/* Slider 1: Products */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-slate-700">
                  Number of Products
                </label>
                <span className="text-xl font-bold text-sky-600">
                  {products.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min={50}
                max={10000}
                step={50}
                value={products}
                onChange={(e) => setProducts(Number(e.target.value))}
                className="w-full h-2 bg-sky-200 rounded-lg appearance-none cursor-pointer accent-sky-500"
                aria-label="Number of products"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>50</span>
                <span>10,000</span>
              </div>
            </div>

            {/* Slider 2: Hours */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-slate-700">
                  Hours per Product (Manual)
                </label>
                <span className="text-xl font-bold text-sky-600">
                  {hoursPerProduct} hrs
                </span>
              </div>
              <input
                type="range"
                min={0.5}
                max={8}
                step={0.5}
                value={hoursPerProduct}
                onChange={(e) => setHoursPerProduct(Number(e.target.value))}
                className="w-full h-2 bg-sky-200 rounded-lg appearance-none cursor-pointer accent-sky-500"
                aria-label="Hours per product"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>0.5 hrs</span>
                <span>8 hrs</span>
              </div>
            </div>

            {/* Slider 3: Hourly rate */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm font-semibold text-slate-700">
                  Hourly Rate (per person)
                </label>
                <span className="text-xl font-bold text-sky-600">
                  ${hourlyRate}/hr
                </span>
              </div>
              <input
                type="range"
                min={15}
                max={150}
                step={5}
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="w-full h-2 bg-sky-200 rounded-lg appearance-none cursor-pointer accent-sky-500"
                aria-label="Hourly rate"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>$15/hr</span>
                <span>$150/hr</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-500 leading-relaxed">
                Calculations based on SkuPilot processing each product in under
                30 seconds. Manual time includes research, writing, formatting,
                and QA.
              </p>
            </div>
          </div>

          {/* Metrics */}
          <div className="space-y-4">
            {metrics.map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.label}
                  className={`flex items-center gap-5 p-6 rounded-xl border ${m.bg} transition-all`}
                >
                  <div className="p-3 bg-white rounded-xl shadow-sm flex-shrink-0">
                    <Icon className={`w-6 h-6 ${m.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">
                      {m.label}
                    </div>
                    <div className={`text-3xl font-bold ${m.color}`}>
                      {m.value}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">{m.sub}</div>
                  </div>
                </div>
              );
            })}

            <div className="p-5 bg-sky-500 rounded-xl text-center hidden">
              <p className="text-white text-sm font-medium mb-3">
                Start saving today — no credit card required
              </p>
              <a
                href="/generate"
                className="inline-flex items-center gap-2 bg-white text-sky-600 font-semibold px-6 py-2.5 rounded-lg hover:bg-sky-50 transition-colors text-sm"
              >
                Start Free Trial
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-xl mx-auto mt-12 p-6 bg-sky-500 rounded-2xl text-center shadow-xl">
          <p className="text-white text-base font-medium mb-4">
            Start saving today — no credit card required
          </p>
          <a
            href="/generate"
            className="inline-flex items-center gap-2 bg-white text-sky-600 font-bold px-8 py-3 rounded-xl hover:bg-sky-50 transition-all hover:scale-105 text-sm"
          >
            Start Free Trial
          </a>
        </div>
      </div>
    </section>
  );
}
