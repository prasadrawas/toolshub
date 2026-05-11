"use client";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Clock, RefreshCw } from "lucide-react";

function getRelativeTime(date: Date): string {
  const now = Date.now();
  const diff = now - date.getTime();
  const abs = Math.abs(diff);
  const future = diff < 0;
  const seconds = Math.floor(abs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  let label = "";
  if (years > 0) label = `${years} year${years > 1 ? "s" : ""}`;
  else if (months > 0) label = `${months} month${months > 1 ? "s" : ""}`;
  else if (weeks > 0) label = `${weeks} week${weeks > 1 ? "s" : ""}`;
  else if (days > 0) label = `${days} day${days > 1 ? "s" : ""}`;
  else if (hours > 0) label = `${hours} hour${hours > 1 ? "s" : ""}`;
  else if (minutes > 0) label = `${minutes} minute${minutes > 1 ? "s" : ""}`;
  else label = `${seconds} second${seconds !== 1 ? "s" : ""}`;

  return future ? `in ${label}` : `${label} ago`;
}

function parseRelativeDescription(desc: string): Date | null {
  const now = new Date();
  const match = desc.match(/(\d+)\s*(second|minute|hour|day|week|month|year)s?\s*(ago|from now|later)?/i);
  if (!match) return null;
  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();
  const isPast = !match[3] || match[3].toLowerCase() === "ago";
  const multiplier = isPast ? -1 : 1;

  const result = new Date(now);
  switch (unit) {
    case "second": result.setSeconds(result.getSeconds() + amount * multiplier); break;
    case "minute": result.setMinutes(result.getMinutes() + amount * multiplier); break;
    case "hour": result.setHours(result.getHours() + amount * multiplier); break;
    case "day": result.setDate(result.getDate() + amount * multiplier); break;
    case "week": result.setDate(result.getDate() + amount * 7 * multiplier); break;
    case "month": result.setMonth(result.getMonth() + amount * multiplier); break;
    case "year": result.setFullYear(result.getFullYear() + amount * multiplier); break;
  }
  return result;
}

export default function RelativeTimeCalculator() {
  const [mode, setMode] = useState<"dateToRelative" | "relativeToDate">("dateToRelative");
  const [dateInput, setDateInput] = useState("");
  const [relativeInput, setRelativeInput] = useState("");
  const [result, setResult] = useState("");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (mode === "dateToRelative" && dateInput) {
      const interval = setInterval(() => setTick((t) => t + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [mode, dateInput]);

  const calculate = () => {
    if (mode === "dateToRelative") {
      const date = new Date(dateInput);
      if (isNaN(date.getTime())) { setResult("Invalid date"); return; }
      setResult(getRelativeTime(date));
    } else {
      const date = parseRelativeDescription(relativeInput);
      if (!date) { setResult("Could not parse. Try: \"2 weeks ago\" or \"3 days from now\""); return; }
      setResult(date.toLocaleString() + " (" + date.toISOString() + ")");
    }
  };

  // Auto-update relative time
  useEffect(() => {
    if (mode === "dateToRelative" && dateInput) {
      const date = new Date(dateInput);
      if (!isNaN(date.getTime())) setResult(getRelativeTime(date));
    }
  }, [tick]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
        <div className="flex gap-2">
          <button
            onClick={() => { setMode("dateToRelative"); setResult(""); }}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium",
              mode === "dateToRelative" ? "bg-brand-50 text-brand-700 ring-2 ring-brand-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            Date to Relative
          </button>
          <button
            onClick={() => { setMode("relativeToDate"); setResult(""); }}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium",
              mode === "relativeToDate" ? "bg-brand-50 text-brand-700 ring-2 ring-brand-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            Relative to Date
          </button>
        </div>

        {mode === "dateToRelative" ? (
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Date</label>
            <input
              type="datetime-local"
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
            />
          </div>
        ) : (
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Relative Description</label>
            <input
              type="text"
              value={relativeInput}
              onChange={(e) => setRelativeInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && calculate()}
              placeholder="2 weeks ago, 3 days from now"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
            />
          </div>
        )}

        <button
          onClick={calculate}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100"
        >
          <Clock className="h-4 w-4" /> Calculate
        </button>
      </div>

      {result && (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Result</label>
          <code className="block text-lg font-mono text-gray-800 bg-gray-50 rounded-lg px-4 py-3">{result}</code>
        </div>
      )}
    </div>
  );
}
