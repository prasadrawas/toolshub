"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Clock, RefreshCw } from "lucide-react";

const FIELD_NAMES = ["Minute", "Hour", "Day of Month", "Month", "Day of Week"];
const MONTH_NAMES = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function describeCron(parts: string[]): string {
  const [min, hour, dom, month, dow] = parts;
  const segments: string[] = [];

  if (min === "*" && hour === "*") segments.push("Every minute");
  else if (min.startsWith("*/")) segments.push(`Every ${min.slice(2)} minutes`);
  else if (hour === "*") segments.push(`At minute ${min} of every hour`);
  else if (min === "0") segments.push(`At ${hour}:00`);
  else segments.push(`At ${hour}:${min.padStart(2, "0")}`);

  if (dom !== "*") segments.push(`on day ${dom} of the month`);
  if (month !== "*") {
    const m = Number(month);
    segments.push(`in ${(m >= 1 && m <= 12) ? MONTH_NAMES[m] : month}`);
  }
  if (dow !== "*") {
    const d = Number(dow);
    segments.push(`on ${(d >= 0 && d <= 6) ? DAY_NAMES[d] : dow}`);
  }

  return segments.join(" ");
}

function expandField(field: string, min: number, max: number): number[] {
  const values = new Set<number>();
  for (const part of field.split(",")) {
    if (part === "*") {
      for (let i = min; i <= max; i++) values.add(i);
    } else if (part.includes("/")) {
      const [range, stepStr] = part.split("/");
      const step = Number(stepStr);
      const start = range === "*" ? min : Number(range);
      for (let i = start; i <= max; i += step) values.add(i);
    } else if (part.includes("-")) {
      const [a, b] = part.split("-").map(Number);
      for (let i = a; i <= b; i++) values.add(i);
    } else {
      values.add(Number(part));
    }
  }
  return Array.from(values).sort((a, b) => a - b);
}

function getNextRuns(cron: string, count: number): Date[] {
  const parts = cron.trim().split(/\s+/);
  if (parts.length !== 5) return [];

  const minutes = expandField(parts[0], 0, 59);
  const hours = expandField(parts[1], 0, 23);
  const doms = expandField(parts[2], 1, 31);
  const months = expandField(parts[3], 1, 12);
  const dows = expandField(parts[4], 0, 6);

  const results: Date[] = [];
  const now = new Date();
  const cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes() + 1, 0, 0);

  for (let i = 0; i < 366 * 24 * 60 && results.length < count; i++) {
    const d = new Date(cursor.getTime() + i * 60000);
    if (
      minutes.includes(d.getMinutes()) &&
      hours.includes(d.getHours()) &&
      doms.includes(d.getDate()) &&
      months.includes(d.getMonth() + 1) &&
      dows.includes(d.getDay())
    ) {
      results.push(d);
    }
  }
  return results;
}

export default function CronScheduleViewer() {
  const [cron, setCron] = useState("*/5 * * * *");
  const [runs, setRuns] = useState<Date[]>([]);
  const [description, setDescription] = useState("");

  const calculate = () => {
    const parts = cron.trim().split(/\s+/);
    if (parts.length !== 5) {
      setDescription("Invalid cron expression (expected 5 fields)");
      setRuns([]);
      return;
    }
    setDescription(describeCron(parts));
    setRuns(getNextRuns(cron, 10));
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Cron Expression</label>
          <input
            type="text"
            value={cron}
            onChange={(e) => setCron(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && calculate()}
            placeholder="* * * * *"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
          />
          <div className="flex gap-4 mt-2 text-xs text-gray-400 font-mono">
            {FIELD_NAMES.map((name) => (
              <span key={name}>{name}</span>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={calculate} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100">
            <RefreshCw className="h-4 w-4" /> Calculate
          </button>
          {["*/5 * * * *", "0 * * * *", "0 0 * * *", "0 0 * * 1", "0 0 1 * *"].map((preset) => (
            <button
              key={preset}
              onClick={() => setCron(preset)}
              className="rounded-lg px-3 py-1.5 text-xs font-medium font-mono bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {description && (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
          <p className="text-sm text-gray-800">{description}</p>
        </div>
      )}

      {runs.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Next 10 Runs</label>
          <div className="space-y-1">
            {runs.map((run, i) => (
              <div key={i} className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-gray-400" />
                <code className="text-sm font-mono text-gray-800">{run.toLocaleString()}</code>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
