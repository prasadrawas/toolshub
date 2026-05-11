"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, RefreshCw } from "lucide-react";

export default function Iso8601Formatter() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [parts, setParts] = useState<Record<string, string> | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const convert = () => {
    setError("");
    setParts(null);
    try {
      const date = new Date(input);
      if (isNaN(date.getTime())) { setError("Invalid date string"); return; }
      const iso = date.toISOString();
      setResult(iso);
      setParts({
        Year: String(date.getUTCFullYear()),
        Month: String(date.getUTCMonth() + 1).padStart(2, "0"),
        Day: String(date.getUTCDate()).padStart(2, "0"),
        Hour: String(date.getUTCHours()).padStart(2, "0"),
        Minute: String(date.getUTCMinutes()).padStart(2, "0"),
        Second: String(date.getUTCSeconds()).padStart(2, "0"),
        Milliseconds: String(date.getUTCMilliseconds()).padStart(3, "0"),
        Timezone: "UTC (Z)",
        "Day of Week": ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][date.getUTCDay()],
        "Unix Timestamp": String(Math.floor(date.getTime() / 1000)),
      });
    } catch {
      setError("Could not parse date");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const useNow = () => {
    setInput(new Date().toString());
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Date String (any format)</label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && convert()}
            placeholder="Jan 15, 2024 3:30 PM"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={convert}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100"
          >
            <RefreshCw className="h-4 w-4" /> Format
          </button>
          <button
            onClick={useNow}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            Use Now
          </button>
          <button
            onClick={handleCopy}
            disabled={!result}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>
      )}

      {result && (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block">ISO 8601</label>
          <code className="block text-lg font-mono text-gray-800 bg-gray-50 rounded-lg px-4 py-3">{result}</code>
        </div>
      )}

      {parts && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {Object.entries(parts).map(([label, value]) => (
            <div key={label} className="rounded-xl border border-gray-200 bg-white p-3 text-center">
              <div className="text-lg font-semibold text-gray-800 font-mono">{value}</div>
              <div className="text-xs text-gray-500">{label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
