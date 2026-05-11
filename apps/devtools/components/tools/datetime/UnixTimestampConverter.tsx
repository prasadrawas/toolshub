"use client";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Clock, RefreshCw } from "lucide-react";

function getRelativeTime(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const abs = Math.abs(diff);
  const future = diff < 0;
  const seconds = Math.floor(abs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  let label = "";
  if (years > 0) label = `${years} year${years > 1 ? "s" : ""}`;
  else if (months > 0) label = `${months} month${months > 1 ? "s" : ""}`;
  else if (days > 0) label = `${days} day${days > 1 ? "s" : ""}`;
  else if (hours > 0) label = `${hours} hour${hours > 1 ? "s" : ""}`;
  else if (minutes > 0) label = `${minutes} minute${minutes > 1 ? "s" : ""}`;
  else label = `${seconds} second${seconds !== 1 ? "s" : ""}`;

  return future ? `in ${label}` : `${label} ago`;
}

export default function UnixTimestampConverter() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"toDate" | "toUnix">("toDate");
  const [result, setResult] = useState("");
  const [relative, setRelative] = useState("");
  const [currentTs, setCurrentTs] = useState(Math.floor(Date.now() / 1000));
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTs(Math.floor(Date.now() / 1000)), 1000);
    return () => clearInterval(interval);
  }, []);

  const convert = () => {
    try {
      if (mode === "toDate") {
        let ts = Number(input);
        if (isNaN(ts)) { setResult("Invalid timestamp"); return; }
        // Auto-detect seconds vs milliseconds
        if (ts > 1e12) {
          // milliseconds
        } else {
          ts = ts * 1000;
        }
        const date = new Date(ts);
        setResult(date.toISOString());
        setRelative(getRelativeTime(date));
      } else {
        const date = new Date(input);
        if (isNaN(date.getTime())) { setResult("Invalid date"); return; }
        setResult(String(Math.floor(date.getTime() / 1000)));
        setRelative(getRelativeTime(date));
      }
    } catch {
      setResult("Invalid input");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 flex items-center gap-3">
        <Clock className="h-5 w-5 text-gray-400" />
        <div>
          <div className="text-xs text-gray-500">Current Unix Timestamp</div>
          <div className="text-lg font-mono font-semibold text-gray-800">{currentTs}</div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => { setMode("toDate"); setResult(""); }}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium",
              mode === "toDate" ? "bg-brand-50 text-brand-700 ring-2 ring-brand-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            Timestamp to Date
          </button>
          <button
            onClick={() => { setMode("toUnix"); setResult(""); }}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium",
              mode === "toUnix" ? "bg-brand-50 text-brand-700 ring-2 ring-brand-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            Date to Timestamp
          </button>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">
            {mode === "toDate" ? "Unix Timestamp (seconds or milliseconds)" : "Date String"}
          </label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && convert()}
            placeholder={mode === "toDate" ? "1700000000" : "2024-01-15T10:30:00Z"}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={convert}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100"
          >
            <RefreshCw className="h-4 w-4" /> Convert
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

      {result && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-2">
          <label className="text-sm font-medium text-gray-700 block">Result</label>
          <code className="block text-sm font-mono text-gray-800 bg-gray-50 rounded-lg px-3 py-2">{result}</code>
          {relative && (
            <div className="text-sm text-gray-500">{relative}</div>
          )}
        </div>
      )}
    </div>
  );
}
