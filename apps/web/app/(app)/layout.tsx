import Link from "next/link";
import { Zap, TrendingUp, History, Sparkles } from "lucide-react";

const navLinks = [
  { href: "/generate", icon: Sparkles, label: "Enrich" },
  { href: "/seo-analyzer", icon: TrendingUp, label: "SEO Analyzer" },
  { href: "/history", icon: History, label: "History" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* App Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="container-section h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="bg-sky-500 p-1.5 rounded-lg text-white">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800 group-hover:text-sky-600 transition-colors">
              Sku<span className="text-sky-500">Pilot</span>
            </span>
          </Link>

          {/* Nav Links */}
          <nav className="flex items-center gap-1">
            {navLinks.map(({ href, icon: Icon, label }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all"
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors"
            >
              Exit Workspace
            </Link>
            <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-700 font-bold text-sm">
              U
            </div>
          </div>
        </div>
      </header>

      {/* App Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
