"use client";

import { useState, useEffect } from "react";
import { Menu, X, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Product", href: "#how-it-works" },
  { label: "Solutions", href: "#comparison" },
  { label: "Pricing", href: "#pricing" },
  { label: "Resources", href: "#faq" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-sm"
          : "bg-white border-b border-slate-100"
      )}
    >
      <div className="container-section">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center group-hover:bg-sky-600 transition-colors">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">
              Sku<span className="text-sky-500">Pilot</span>
            </span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-slate-600 hover:text-slate-900 hover:bg-slate-50 px-4 py-2 rounded-lg text-sm font-medium transition-all"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <a href="/login" className="btn-ghost text-sm">
              Log in
            </a>
            <a href="/generate" className="btn-primary text-sm">
              Get a Demo
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-slate-100 pt-3">
            <nav className="flex flex-col gap-1 mb-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="flex flex-col gap-2">
              <a href="/login" className="btn-ghost text-sm justify-center">
                Log in
              </a>
              <a href="/generate" className="btn-primary text-sm justify-center">
                Get a Demo
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
