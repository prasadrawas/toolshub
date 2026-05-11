"use client";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Percent, Trash2 } from "lucide-react";

type Mode = "of" | "is" | "change";

export default function PercentageCalculator() {
  const [mode, setMode] = useState<Mode>("of");
  const [a, setA] = useState("");
  const [b, setB] = useState("");

  const result = useMemo(() => {
    const x = parseFloat(a);
    const y = parseFloat(b);
    if (isNaN(x) || isNaN(y)) return null;
    switch (mode) {
      case "of":
        return (x / 100) * y;
      case "is":
        return y === 0 ? null : (x / y) * 100;
      case "change":
        return x === 0 ? null : ((y - x) / Math.abs(x)) * 100;
      default:
        return null;
    }
  }, [mode, a, b]);

  const modes: { key: Mode; label: string; labelA: string; labelB: string; prefix: string; suffix: string }[] = [
    { key: "of", label: "What is X% of Y?", labelA: "Percentage (%)", labelB: "Of Value", prefix: "", suffix: "" },
    { key: "is", label: "X is what % of Y?", labelA: "Value", labelB: "Of Total", prefix: "", suffix: "%" },
    { key: "change", label: "% change from X to Y", labelA: "From", labelB: "To", prefix: "", suffix: "%" },
  ];

  const current = modes.find((m) => m.key === mode)!;

  const formatResult = (val: number): string => {
    if (Number.isInteger(val)) return val.toLocaleString();
    return val.toLocaleString(undefined, { maximumFractionDigits: 6 });
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
        <div className="flex flex-wrap gap-2">
          {modes.map((m) => (
            <button
              key={m.key}
              onClick={() => { setMode(m.key); setA(""); setB(""); }}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium",
                mode === m.key ? "bg-brand-50 text-brand-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">{current.labelA}</label>
            <input
              type="number"
              value={a}
              onChange={(e) => setA(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
              placeholder={mode === "of" ? "e.g., 25" : mode === "is" ? "e.g., 50" : "e.g., 100"}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">{current.labelB}</label>
            <input
              type="number"
              value={b}
              onChange={(e) => setB(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
              placeholder={mode === "of" ? "e.g., 200" : mode === "is" ? "e.g., 200" : "e.g., 150"}
            />
          </div>
        </div>

        <button
          onClick={() => { setA(""); setB(""); }}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
        >
          <Trash2 className="h-4 w-4" /> Clear
        </button>
      </div>

      {result !== null && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-2">
          <label className="text-sm font-medium text-gray-700 block flex items-center gap-2">
            <Percent className="h-4 w-4" /> Result
          </label>
          <code className="block text-lg font-mono text-brand-700 bg-brand-50 rounded-lg px-4 py-2 text-center">
            {current.prefix}{formatResult(result)}{current.suffix}
          </code>
          {mode === "of" && (
            <p className="text-sm text-gray-500 text-center">{a}% of {b} = {formatResult(result)}</p>
          )}
          {mode === "is" && (
            <p className="text-sm text-gray-500 text-center">{a} is {formatResult(result)}% of {b}</p>
          )}
          {mode === "change" && (
            <p className="text-sm text-gray-500 text-center">
              {result >= 0 ? "Increase" : "Decrease"} of {formatResult(Math.abs(result))}% from {a} to {b}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
