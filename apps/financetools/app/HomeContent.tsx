"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ArrowRight } from "lucide-react";
import type { Tool, Category } from "@/lib/data/tools";
import type { CategoryInfo } from "@/lib/data/categories";

const TAB_CATEGORIES: { label: string; value: Category | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Mortgage", value: "mortgage" },
  { label: "Retirement", value: "retirement" },
  { label: "Debt", value: "debt" },
  { label: "Tax", value: "tax" },
  { label: "Investing", value: "investing" },
  { label: "Auto", value: "auto" },
  { label: "Insurance", value: "insurance" },
  { label: "Real Estate", value: "real-estate" },
];

interface HomeContentProps {
  tools: Tool[];
  categories: CategoryInfo[];
}

export default function HomeContent({ tools, categories }: HomeContentProps) {
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);

  const filteredTools = useMemo(() => {
    let result = tools;

    if (activeCategory !== "all") {
      result = result.filter((t) => t.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.keywords.some((k) => k.toLowerCase().includes(q))
      );
    }

    return result;
  }, [tools, activeCategory, searchQuery]);

  const visibleTools = showAll ? filteredTools : filteredTools.slice(0, 12);

  function getCategoryName(cat: Category): string {
    const found = categories.find((c) => c.id === cat);
    return found?.name ?? cat;
  }

  return (
    <div>
      {/* Search bar */}
      <div className="mx-auto mb-10 max-w-md">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search 112 calculators..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowAll(false);
            }}
            className="w-full rounded-2xl border border-gray-200 bg-white py-3.5 pl-11 pr-4 text-sm shadow-soft placeholder:text-gray-400 focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-100 transition-all"
          />
        </div>
      </div>

      {/* Category tabs */}
      <div className="mb-10 flex gap-1.5 overflow-x-auto scrollbar-hide pb-1 justify-center">
        {TAB_CATEGORIES.map((tab) => (
          <button
            key={tab.value}
            onClick={() => {
              setActiveCategory(tab.value);
              setShowAll(false);
            }}
            className={`inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ${
              activeCategory === tab.value
                ? "bg-brand text-white shadow-sm"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tool grid */}
      <h2 className="sr-only">Financial Calculators</h2>
      {visibleTools.length === 0 ? (
        <p className="py-16 text-center text-gray-400 text-sm">
          No calculators match your search. Try a different term.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleTools.map((tool) => (
            <Link
              key={tool.id}
              href={`/${tool.category}/${tool.slug}`}
              className="group relative rounded-2xl border border-gray-200/80 bg-white p-6 shadow-soft transition-all duration-200 hover:shadow-card-hover hover:border-brand-200 hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-brand-600">
                  {getCategoryName(tool.category)}
                </span>
                {tool.isPopular && (
                  <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-600">
                    Popular
                  </span>
                )}
              </div>
              <h3 className="font-display font-semibold text-gray-900 group-hover:text-brand-700 transition-colors">
                {tool.name}
              </h3>
              <p className="mt-1.5 text-sm text-gray-500 leading-relaxed line-clamp-2">
                {tool.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-600 opacity-0 group-hover:opacity-100 transition-opacity">
                Open calculator
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          ))}
        </div>
      )}

      {/* Show all button */}
      {!showAll && filteredTools.length > 12 && (
        <div className="mt-10 text-center">
          <button
            onClick={() => setShowAll(true)}
            className="inline-flex items-center gap-2 rounded-full bg-brand px-7 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-brand-700 hover:shadow-glow"
          >
            Show all {filteredTools.length} calculators
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
