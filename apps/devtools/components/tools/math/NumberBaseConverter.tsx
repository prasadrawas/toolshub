"use client";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Trash2, Hash } from "lucide-react";

const COMMON_BASES = [
  { label: "Binary", base: 2 },
  { label: "Octal", base: 8 },
  { label: "Decimal", base: 10 },
  { label: "Hexadecimal", base: 16 },
  { label: "Base36", base: 36 },
];

function convertNumber(value: string, fromBase: number): { base: number; label: string; result: string }[] | null {
  const cleaned = value.trim();
  if (!cleaned) return null;
  const parsed = parseInt(cleaned, fromBase);
  if (isNaN(parsed)) return null;
  return COMMON_BASES.map((b) => ({
    base: b.base,
    label: b.label,
    result: parsed.toString(b.base).toUpperCase(),
  }));
}

export default function NumberBaseConverter() {
  const [input, setInput] = useState("");
  const [fromBase, setFromBase] = useState(10);
  const [customBase, setCustomBase] = useState(32);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const results = useMemo(() => convertNumber(input, fromBase), [input, fromBase]);
  const parsed = input.trim() ? parseInt(input.trim(), fromBase) : NaN;
  const customResult = !isNaN(parsed) ? parsed.toString(customBase).toUpperCase() : "";

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Number</label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
              placeholder="Enter a number..."
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">From Base</label>
            <select
              value={fromBase}
              onChange={(e) => setFromBase(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium bg-white text-gray-700 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
            >
              {Array.from({ length: 35 }, (_, i) => i + 2).map((b) => (
                <option key={b} value={b}>
                  Base {b}{COMMON_BASES.find((c) => c.base === b) ? ` (${COMMON_BASES.find((c) => c.base === b)!.label})` : ""}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={() => { setInput(""); setCopiedIdx(null); }}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
        >
          <Trash2 className="h-4 w-4" /> Clear
        </button>
      </div>

      {results && !isNaN(parsed) && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-2">
          <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
            <Hash className="h-4 w-4" /> Conversions
          </label>
          <div className="space-y-2">
            {results.map((r, i) => (
              <div key={r.base} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2">
                <div>
                  <span className="text-xs font-medium text-gray-500">{r.label} (Base {r.base})</span>
                  <p className="text-sm font-mono text-gray-800 break-all">{r.result}</p>
                </div>
                <button
                  onClick={() => handleCopy(r.result, i)}
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
                >
                  {copiedIdx === i ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </button>
              </div>
            ))}

            <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2">
              <div className="flex items-center gap-3">
                <div>
                  <span className="text-xs font-medium text-gray-500">Custom Base</span>
                  <input
                    type="number"
                    min={2}
                    max={36}
                    value={customBase}
                    onChange={(e) => setCustomBase(Math.max(2, Math.min(36, Number(e.target.value))))}
                    className="block w-16 mt-0.5 rounded border border-gray-200 px-2 py-0.5 text-xs font-mono focus:border-brand-400 focus:outline-none"
                  />
                </div>
                <p className="text-sm font-mono text-gray-800 break-all mt-4">{customResult || "—"}</p>
              </div>
              <button
                onClick={() => handleCopy(customResult, 99)}
                disabled={!customResult}
                className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
              >
                {copiedIdx === 99 ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {input.trim() && isNaN(parsed) && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          Invalid number for base {fromBase}.
        </div>
      )}
    </div>
  );
}
