"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight } from "lucide-react";
import { searchTools, type Tool } from "@/lib/data/tools";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Tool[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    if (query.length > 0) {
      const filtered = searchTools(query).slice(0, 20);
      setResults(filtered);
      setSelectedIndex(0);
    } else {
      setResults([]);
    }
  }, [query]);

  const navigate = useCallback(
    (tool: Tool) => {
      router.push(`/${tool.category}/${tool.slug}`);
      onClose();
    },
    [router, onClose]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter" && results[selectedIndex]) {
        navigate(results[selectedIndex]);
      } else if (e.key === "Escape") {
        onClose();
      }
    },
    [results, selectedIndex, navigate, onClose]
  );

  if (!open) return null;

  const groupedResults = results.reduce<Record<string, Tool[]>>((acc, tool) => {
    if (!acc[tool.category]) acc[tool.category] = [];
    acc[tool.category].push(tool);
    return acc;
  }, {});

  let flatIndex = -1;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="mx-auto mt-[12vh] max-w-xl bg-white rounded-3xl shadow-2xl border border-gray-200/60 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-5 border-b border-gray-100">
          <Search className="h-5 w-5 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search 150 developer tools..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 h-14 bg-transparent text-gray-900 placeholder:text-gray-400 focus:outline-none text-sm"
          />
          <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded-md border border-gray-200 bg-gray-50 px-1.5 py-0.5 text-[10px] font-mono text-gray-400">
            ESC
          </kbd>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        </div>

        {results.length > 0 && (
          <div className="max-h-[50vh] overflow-y-auto p-2">
            {Object.entries(groupedResults).map(([category, tools]) => (
              <div key={category}>
                <p className="px-3 py-2 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  {category}
                </p>
                {tools.map((tool) => {
                  flatIndex++;
                  const idx = flatIndex;
                  return (
                    <button
                      key={tool.id}
                      onClick={() => navigate(tool)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all ${
                        idx === selectedIndex
                          ? "bg-brand-50 text-brand-700"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      <span className="font-medium">{tool.name}</span>
                      <span className="flex items-center justify-between mt-0.5">
                        <span className="text-xs text-gray-500 line-clamp-1">
                          {tool.description}
                        </span>
                        {idx === selectedIndex && (
                          <ArrowRight className="h-3 w-3 text-brand-500 shrink-0 ml-2" />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {query.length > 0 && results.length === 0 && (
          <div className="p-10 text-center text-gray-400 text-sm">
            No tools found for &ldquo;{query}&rdquo;
          </div>
        )}

        {query.length === 0 && (
          <div className="p-10 text-center text-gray-400 text-sm">
            Start typing to search tools...
          </div>
        )}
      </div>
    </div>
  );
}
