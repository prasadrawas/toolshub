"use client";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Trash2, FlaskConical } from "lucide-react";

function toScientific(n: number): string {
  return n.toExponential();
}

function toEngineering(n: number): string {
  if (n === 0) return "0e+0";
  const exp = Math.floor(Math.log10(Math.abs(n)));
  const engExp = Math.floor(exp / 3) * 3;
  const mantissa = n / Math.pow(10, engExp);
  const sign = engExp >= 0 ? "+" : "";
  return `${mantissa}e${sign}${engExp}`;
}

function toExpanded(n: number): string {
  if (n === 0) return "0";
  const str = n.toFixed(20);
  // Remove trailing zeros after decimal
  const cleaned = str.includes(".") ? str.replace(/0+$/, "").replace(/\.$/, "") : str;
  return cleaned;
}

function parseScientific(input: string): number | null {
  const cleaned = input.trim().replace(/\s/g, "").replace(/[xX×]\s*10\s*\^\s*/i, "e");
  const n = Number(cleaned);
  return isNaN(n) ? null : n;
}

export default function ScientificNotationConverter() {
  const [mode, setMode] = useState<"toSci" | "fromSci">("toSci");
  const [input, setInput] = useState("");
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const results = useMemo(() => {
    if (!input.trim()) return null;
    if (mode === "toSci") {
      const n = parseFloat(input);
      if (isNaN(n)) return null;
      return [
        { label: "Scientific Notation", value: toScientific(n) },
        { label: "Engineering Notation", value: toEngineering(n) },
        { label: "Expanded Form", value: toExpanded(n) },
        { label: "Decimal", value: String(n) },
      ];
    } else {
      const n = parseScientific(input);
      if (n === null) return null;
      return [
        { label: "Decimal", value: toExpanded(n) },
        { label: "Scientific Notation", value: toScientific(n) },
        { label: "Engineering Notation", value: toEngineering(n) },
        { label: "Number", value: n.toLocaleString() },
      ];
    }
  }, [input, mode]);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => { setMode("toSci"); setInput(""); }}
            className={cn("rounded-lg px-3 py-1.5 text-sm font-medium", mode === "toSci" ? "bg-brand-50 text-brand-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}
          >
            Number to Scientific
          </button>
          <button
            onClick={() => { setMode("fromSci"); setInput(""); }}
            className={cn("rounded-lg px-3 py-1.5 text-sm font-medium", mode === "fromSci" ? "bg-brand-50 text-brand-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}
          >
            Scientific to Number
          </button>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">
            {mode === "toSci" ? "Number" : "Scientific Notation"}
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
            placeholder={mode === "toSci" ? "e.g., 123456.789" : "e.g., 1.23e+5"}
          />
        </div>

        <button onClick={() => setInput("")} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
          <Trash2 className="h-4 w-4" /> Clear
        </button>
      </div>

      {results && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-2">
          <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
            <FlaskConical className="h-4 w-4" /> Results
          </label>
          <div className="space-y-2">
            {results.map((r, i) => (
              <div key={r.label} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-2">
                <div>
                  <span className="text-xs font-medium text-gray-500">{r.label}</span>
                  <p className="text-sm font-mono text-gray-800 break-all">{r.value}</p>
                </div>
                <button
                  onClick={() => handleCopy(r.value, i)}
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
                >
                  {copiedIdx === i ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {input.trim() && !results && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          Invalid input. {mode === "toSci" ? "Enter a valid number." : "Enter valid scientific notation (e.g., 1.23e+5)."}
        </div>
      )}
    </div>
  );
}
