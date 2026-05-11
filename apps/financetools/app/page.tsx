import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Home as HomeIcon, TrendingUp, Receipt, Calculator } from "lucide-react";
import { AdSlot } from "@/components/shared/AdSlot";
import { tools } from "@/lib/data/tools";
import { categories } from "@/lib/data/categories";
import dynamic from "next/dynamic";
import HomeContent from "./HomeContent";

const MortgageCalculator = dynamic(
  () => import("@/components/calculators/MortgageCalculator").then(m => ({ default: m.MortgageCalculator })),
  { loading: () => <div className="h-96 rounded-2xl bg-white animate-pulse" /> }
);

export const metadata: Metadata = {
  title: "USFinanceTools — Free Financial Calculators for 2026",
  description:
    "112 free financial calculators for mortgages, retirement, taxes, debt, investing, and more. No sign-up required. Trusted, accurate, and updated for 2026.",
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
            <Calculator className="h-4 w-4" />
            112 free calculators — no sign-up required
          </div>

          <h1 className="font-display text-5xl font-bold tracking-tight text-white md:text-6xl lg:text-7xl text-balance">
            Make smarter
            <br />
            <span className="bg-gradient-to-r from-violet-200 via-white to-violet-200 bg-clip-text text-transparent">
              money decisions
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg text-violet-200 leading-relaxed">
            Free tools for mortgages, retirement, taxes, debt, and investing.
            Trusted by millions. Updated for 2026.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/mortgage/mortgage-payment-calculator"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-brand-700 shadow-lg hover:shadow-xl hover:bg-gray-50 transition-all"
            >
              Try Mortgage Calculator
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#calculators"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/20 transition-all"
            >
              Browse All Tools
            </Link>
          </div>

          <div className="mt-16 grid grid-cols-2 gap-3 sm:grid-cols-4 max-w-2xl mx-auto">
            {[
              { value: "112", label: "Free Tools" },
              { value: "8", label: "Categories" },
              { value: "50", label: "States" },
              { value: "2026", label: "Updated" },
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
      <section id="calculators" className="container mx-auto max-w-6xl px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="font-display text-h2 text-gray-900">Explore Our Calculators</h2>
          <p className="mt-2 text-gray-500 max-w-lg mx-auto">Find the right tool for any financial decision</p>
        </div>
        <HomeContent tools={tools} categories={categories} />
      </section>

      {/* FEATURED CALCULATOR */}
      <section className="bg-gradient-to-b from-brand-50 to-white py-16">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700 mb-4">
              Most Popular
            </span>
            <h2 className="font-display text-h2 text-gray-900">
              Mortgage Payment Calculator
            </h2>
            <p className="mt-2 text-gray-500">Calculate your monthly mortgage payment instantly</p>
          </div>

          <MortgageCalculator />

          <div className="mt-8 text-center">
            <Link
              href="/mortgage/mortgage-payment-calculator"
              className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-brand-700 transition-all"
            >
              Open Full Calculator
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="relative hero-gradient overflow-hidden py-20">
        <div className="mesh-orb w-[300px] h-[300px] bg-violet-400 top-[-100px] left-[20%]" />
        <div className="relative container mx-auto max-w-6xl px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-white tracking-tight">
              Tools for every financial goal
            </h2>
            <p className="mt-3 text-violet-200 max-w-lg mx-auto">
              From buying your first home to planning retirement, we have you covered
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                icon: HomeIcon,
                title: "Mortgage & Home",
                desc: "Calculate payments, compare loan terms, check affordability, and see full amortization schedules with PMI estimates.",
                href: "/mortgage",
                count: "18 tools",
              },
              {
                icon: TrendingUp,
                title: "Investing & Retirement",
                desc: "Project 401(k) growth, compound interest, dividend income, and find out if you are on track to retire comfortably.",
                href: "/retirement",
                count: "31 tools",
              },
              {
                icon: Receipt,
                title: "Tax & Debt",
                desc: "Estimate federal and state taxes, plan debt payoff with snowball or avalanche methods, and maximize your take-home pay.",
                href: "/tax",
                count: "27 tools",
              },
            ].map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 p-7 hover:bg-white/15 transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/15">
                    <item.icon className="h-5 w-5 text-violet-200" />
                  </div>
                  <span className="text-xs font-semibold text-violet-300 bg-white/10 rounded-full px-2.5 py-0.5">{item.count}</span>
                </div>
                <h3 className="text-lg font-display font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-violet-200/80 leading-relaxed">
                  {item.desc}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-violet-300 group-hover:text-white transition-colors">
                  Explore tools
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="py-12">
        <AdSlot slot="leaderboard" />
      </div>
    </>
  );
}
