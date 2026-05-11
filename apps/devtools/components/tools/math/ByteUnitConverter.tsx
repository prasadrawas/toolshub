"use client";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Trash2, HardDrive } from "lucide-react";

const UNITS = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
const BINARY_FACTORS = [1, 1024, 1024 ** 2, 1024 ** 3, 1024 ** 4, 1024 ** 5];
const SI_FACTORS = [1, 1000, 1000 ** 2, 1000 ** 3, 1000 ** 4, 1000 ** 5];

function convertBytes(value: number, fromIdx: number, useBinary: boolean) {
  const factors = useBinary ? BINARY_FACTORS : SI_FACTORS;
  const bytes = value * factors[fromIdx];
  return UNITS.map((unit, i) => ({
    unit,
    value: bytes / factors[i],
  }));
}

function formatValue(n: number): string {
  if (n === 0) return "0";
  if (Number.isInteger(n) && Math.abs(n) < 1e15) return n.toLocaleString();
  if (Math.abs(n) < 0.001) return n.toExponential(4);
  return n.toLocaleString(undefined, { maximumFractionDigits: 6 });
}

export default function ByteUnitConverter() {
  const [input, setInput] = useState("");
  const [fromUnit, setFromUnit] = useState(2); // MB
  const [binary, setBinary] = useState(true);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const value = parseFloat(input);
  const results = useMemo(
    () => (!isNaN(value) ? convertBytes(value, fromUnit, binary) : null),
    [value, fromUnit, binary]
  );

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Value</label>
            <input
              type="number"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
              placeholder="Enter a value..."
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Unit</label>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(Number(e.target.value))}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium bg-white text-gray-700 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
            >
              {UNITS.map((u, i) => (
                <option key={u} value={i}>{u}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">System</label>
            <div className="flex gap-2">
              <button
                onClick={() => setBinary(true)}
                className={cn(
                  "flex-1 rounded-lg px-3 py-2 text-sm font-medium",
                  binary ? "bg-brand-50 text-brand-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                Binary (1024)
              </button>
              <button
                onClick={() => setBinary(false)}
                className={cn(
                  "flex-1 rounded-lg px-3 py-2 text-sm font-medium",
                  !binary ? "bg-brand-50 text-brand-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                SI (1000)
              </button>
            </div>
          </div>
        </div>
        <button
          onClick={() => setInput("")}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
        >
          <Trash2 className="h-4 w-4" /> Clear
        </button>
      </div>

      {results && (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
            <HardDrive className="h-4 w-4" /> Results
          </label>
          <div className="space-y-2">
            {results.map((r, i) => (
              <div key={r.unit} className={cn("flex items-center justify-between rounded-lg px-4 py-2", i === fromUnit ? "bg-brand-50" : "bg-gray-50")}>
                <div>
                  <span className="text-xs font-medium text-gray-500">{r.unit}</span>
                  <p className="text-sm font-mono text-gray-800">{formatValue(r.value)}</p>
                </div>
                <button
                  onClick={() => handleCopy(String(r.value), i)}
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
                >
                  {copiedIdx === i ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
