"use client";

import { Zap, Twitter, Linkedin, Github, ArrowRight } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "AI Enrichment", href: "#how-it-works" },
    { label: "Image Generation", href: "#" },
    { label: "Video Generation", href: "#" },
    { label: "Bulk Processing", href: "#" },
    { label: "Quality Scores", href: "#" },
  ],
  Solutions: [
    { label: "Ecommerce Brands", href: "#" },
    { label: "Marketplaces", href: "#" },
    { label: "Retailers", href: "#" },
    { label: "Manufacturers", href: "#" },
    { label: "Agencies", href: "#" },
  ],
  Integrations: [
    { label: "Shopify", href: "#" },
    { label: "Amazon", href: "#" },
    { label: "Magento", href: "#" },
    { label: "CSV Export", href: "#" },
    { label: "API Access", href: "#" },
  ],
  Resources: [
    { label: "Documentation", href: "#" },
    { label: "API Reference", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Case Studies", href: "#" },
    { label: "Support", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200">
      {/* CTA Banner */}
      <div className="bg-gradient-to-r from-sky-500 to-cyan-500">
        <div className="container-section py-16 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to enrich your catalog?
          </h2>
          <p className="text-sky-100 text-lg mb-8 max-w-xl mx-auto">
            Join 2,400+ brands using SkuPilot to turn raw data into
            revenue-generating product listings.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/generate"
              className="inline-flex items-center gap-2 bg-white text-sky-600 hover:bg-sky-50 font-semibold px-8 py-3 rounded-xl transition-colors shadow-lg"
            >
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="/generate"
              className="inline-flex items-center gap-2 border-2 border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-3 rounded-xl transition-colors"
            >
              Book a Demo
            </a>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="container-section py-16">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <a href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">
                Sku<span className="text-sky-500">Pilot</span>
              </span>
            </a>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              AI-powered product catalog enrichment. From raw data to
              conversion-ready listings in seconds.
            </p>
            <div className="flex gap-3">
              <a
                href="https://twitter.com"
                aria-label="SkuPilot on Twitter"
                className="p-2 bg-slate-100 rounded-lg hover:bg-sky-50 hover:text-sky-500 transition-colors text-slate-500"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                aria-label="SkuPilot on LinkedIn"
                className="p-2 bg-slate-100 rounded-lg hover:bg-sky-50 hover:text-sky-500 transition-colors text-slate-500"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                aria-label="SkuPilot on GitHub"
                className="p-2 bg-slate-100 rounded-lg hover:bg-sky-50 hover:text-sky-500 transition-colors text-slate-500"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4">
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-slate-500 hover:text-sky-600 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} SkuPilot, Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-slate-400">
            <a href="#" className="hover:text-slate-700 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-700 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-700 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
