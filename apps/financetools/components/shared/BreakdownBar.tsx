"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface BreakdownItem {
  label: string;
  value: number;
  color: string;
}

interface BreakdownBarProps {
  items: BreakdownItem[];
  formatValue?: (value: number) => string;
  className?: string;
}

export function BreakdownBar({ items, formatValue, className }: BreakdownBarProps) {
  const total = items.reduce((sum, item) => sum + item.value, 0);
  if (total === 0) return null;

  const fmt = formatValue || ((v: number) => `$${v.toLocaleString("en-US", { maximumFractionDigits: 0 })}`);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex h-4 rounded-full overflow-hidden bg-gray-100">
        {items.map((item, i) => {
          const pct = (item.value / total) * 100;
          if (pct < 0.5) return null;
          return (
            <div
              key={i}
              className={cn("transition-all duration-500", item.color)}
              style={{ width: `${pct}%` }}
              title={`${item.label}: ${fmt(item.value)} (${pct.toFixed(1)}%)`}
            />
          );
        })}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span className={cn("w-3 h-3 rounded-full shrink-0", item.color)} />
            <span className="text-gray-600 truncate">{item.label}</span>
            <span className="ml-auto font-medium text-gray-900 tabular-nums">{fmt(item.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
