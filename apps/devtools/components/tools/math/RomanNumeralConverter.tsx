"use client";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Trash2, ArrowLeftRight, Columns2 } from "lucide-react";

const ROMAN_MAP: [number, string][] = [
  [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
  [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
  [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
];

function toRoman(num: number): { result: string; steps: string[] } | null {
  if (!Number.isInteger(num) || num < 1 || num > 3999) return null;
  const steps: string[] = [];
  let result = "";
  let remaining = num;
  for (const [value, symbol] of ROMAN_MAP) {
    while (remaining >= value) {
      result += symbol;
      remaining -= value;
      steps.push(`${symbol} = ${value} (remaining: ${remaining})`);
    }
  }
  return { result, steps };
}

function fromRoman(s: string): { result: number; steps: string[] } | null {
  const cleaned = s.trim().toUpperCase();
  if (!/^[MDCLXVI]+$/.test(cleaned)) return null;
  const values: Record<string, number> = { M: 1000, D: 500, C: 100, L: 50, X: 10, V: 5, I: 1 };
  let total = 0;
  const steps: string[] = [];
  for (let i = 0; i < cleaned.length; i++) {
    const curr = values[cleaned[i]];
    const next = i + 1 < cleaned.length ? values[cleaned[i + 1]] : 0;
    if (curr < next) {
      total -= curr;
      steps.push(`${cleaned[i]} (${curr}) subtracted (before ${cleaned[i + 1]})`);
    } else {
      total += curr;
      steps.push(`${cleaned[i]} (${curr}) added`);
    }
  }
  if (total < 1 || total > 3999) return null;
  // Validate by converting back
  const check = toRoman(total);
  if (check && check.result !== cleaned) return null;
  return { result: total, steps };
}

export default function RomanNumeralConverter() {
  const [mode, setMode] = useState<"toRoman" | "fromRoman">("toRoman");
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => {
    if (!input.trim()) return null;
    if (mode === "toRoman") {
      const n = parseInt(input);
      if (isNaN(n)) return null;
      return toRoman(n);
    } else {
      return fromRoman(input);
    }
  }, [input, mode]);

  const resultText = result ? String(result.result) : "";

  const handleCopy = () => {
    if (!resultText) return;
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { setMode("toRoman"); setInput(""); }}
            className={cn("rounded-lg px-3 py-1.5 text-sm font-medium", mode === "toRoman" ? "bg-brand-50 text-brand-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}
          >
            Decimal to Roman
          </button>
          <button
            onClick={() => { setMode("fromRoman"); setInput(""); }}
            className={cn("rounded-lg px-3 py-1.5 text-sm font-medium", mode === "fromRoman" ? "bg-brand-50 text-brand-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}
          >
            Roman to Decimal
          </button>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">
            {mode === "toRoman" ? "Decimal Number (1-3999)" : "Roman Numeral"}
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
            placeholder={mode === "toRoman" ? "e.g., 1984" : "e.g., MCMLXXXIV"}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button onClick={handleCopy} disabled={!resultText} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100 disabled:opacity-50">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? "Copied" : "Copy"}
          </button>
          <button onClick={() => setInput("")} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
            <Trash2 className="h-4 w-4" /> Clear
          </button>
          <button
            onClick={() => {
              if (resultText) {
                setMode(mode === "toRoman" ? "fromRoman" : "toRoman");
                setInput(resultText);
              }
            }}
            disabled={!resultText}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
          >
            <ArrowLeftRight className="h-4 w-4" /> Swap
          </button>
        </div>
      </div>

      {result && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
          <label className="text-sm font-medium text-gray-700 block flex items-center gap-2">
            <Columns2 className="h-4 w-4" /> Result
          </label>
          <code className="block text-lg font-mono text-brand-700 bg-brand-50 rounded-lg px-4 py-2 text-center">
            {resultText}
          </code>

          {result.steps.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">Steps</label>
              <div className="space-y-1 max-h-48 overflow-y-auto">
                {result.steps.map((step, i) => (
                  <div key={i} className="text-xs font-mono text-gray-600 bg-gray-50 rounded px-3 py-1">
                    {step}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {input.trim() && !result && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {mode === "toRoman"
            ? "Invalid input. Enter a whole number between 1 and 3999."
            : "Invalid Roman numeral. Use characters M, D, C, L, X, V, I."}
        </div>
      )}
    </div>
  );
}
