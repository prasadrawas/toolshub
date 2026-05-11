import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Code2, Shield, Zap, Globe } from "lucide-react";
import { tools } from "@/lib/data/tools";
import { categories } from "@/lib/data/categories";
import HomeContent from "./HomeContent";

export const metadata: Metadata = {
  title: "DevTools — Free Online Developer Tools",
  description:
    "150 free browser-based developer tools for formatting, converting, encoding, generating, and more. No sign-up required. 100% client-side — your data never leaves your device.",
};

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative hero-gradient overflow-hidden">
        {/* Decorative orbs */}
        <div className="mesh-orb w-[500px] h-[500px] bg-violet-400 top-[-200px] right-[-100px]" />
        <div className="mesh-orb w-[400px] h-[400px] bg-indigo-500 bottom-[-150px] left-[-100px]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNSkiLz48L3N2Zz4=')] opacity-60" />

        <div className="relative container mx-auto max-w-5xl px-4 py-24 md:py-32 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 backdrop-blur-md border border-white/20 px-5 py-2 text-sm font-medium text-white/90 mb-8 shadow-sm">
            <Shield className="h-4 w-4" />
            100% client-side &mdash; your data never leaves your device
          </div>

          <h1 className="font-display text-5xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl text-balance">
            Developer tools that
            <br />
            <span className="bg-gradient-to-r from-violet-200 via-white to-violet-200 bg-clip-text text-transparent">
              respect your privacy
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg text-violet-200 leading-relaxed">
            150 free browser-based tools. No backend. Your data never leaves your device.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/formatters/json-formatter"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-brand-700 shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all"
            >
              Try JSON Formatter
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#tools"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/20 transition-all"
            >
              Browse All Tools
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-3 sm:grid-cols-4 max-w-2xl mx-auto">
            {[
              { value: "150", label: "Tools", icon: Code2 },
              { value: "12", label: "Categories", icon: Globe },
              { value: "100%", label: "Client-Side", icon: Shield },
              { value: "Zero", label: "Tracking", icon: Zap },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-4"
              >
                <p className="text-2xl font-display font-bold text-white">{stat.value}</p>
                <p className="text-xs font-medium text-violet-300 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TOOL GRID */}
      <section id="tools" className="container mx-auto max-w-6xl px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl font-bold text-gray-900 tracking-tight">
            Explore Developer Tools
          </h2>
          <p className="mt-2 text-gray-500 max-w-lg mx-auto">
            Find the right tool for any development task
          </p>
        </div>
        <HomeContent tools={tools} categories={categories} />
      </section>
    </>
  );
}
