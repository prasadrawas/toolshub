"use client";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Clock, Trash2 } from "lucide-react";

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function describeCron(min: string, hour: string, dom: string, month: string, dow: string): string {
  const parts: string[] = [];

  if (min === "*" && hour === "*" && dom === "*" && month === "*" && dow === "*") {
    return "Every minute";
  }

  // Time description
  if (min !== "*" && hour !== "*") {
    parts.push(`At ${hour.padStart(2, "0")}:${min.padStart(2, "0")}`);
  } else if (min !== "*") {
    parts.push(`At minute ${min}`);
  } else if (hour !== "*") {
    parts.push(`At every minute past hour ${hour}`);
  }

  if (min === "*" && hour === "*") {
    parts.push("Every minute");
  }

  // Handle */n patterns
  if (min.startsWith("*/")) parts[parts.length - 1] = `Every ${min.slice(2)} minutes`;
  if (hour.startsWith("*/")) parts.push(`every ${hour.slice(2)} hours`);

  if (dom !== "*") {
    if (dom.startsWith("*/")) {
      parts.push(`every ${dom.slice(2)} days`);
    } else {
      parts.push(`on day ${dom} of the month`);
    }
  }

  if (month !== "*") {
    if (month.startsWith("*/")) {
      parts.push(`every ${month.slice(2)} months`);
    } else {
      const m = parseInt(month);
      parts.push(`in ${m >= 1 && m <= 12 ? MONTHS[m - 1] : month}`);
    }
  }

  if (dow !== "*") {
    if (dow.includes(",")) {
      const days = dow.split(",").map((d) => WEEKDAYS[parseInt(d)] || d).join(", ");
      parts.push(`on ${days}`);
    } else {
      const d = parseInt(dow);
      parts.push(`on ${d >= 0 && d <= 6 ? WEEKDAYS[d] : dow}`);
    }
  }

  return parts.join(" ") || "Invalid expression";
}

function getNextRuns(min: string, hour: string, dom: string, month: string, dow: string, count: number): Date[] {
  const dates: Date[] = [];
  const now = new Date();
  const check = new Date(now);

  const matchField = (value: string, current: number): boolean => {
    if (value === "*") return true;
    if (value.startsWith("*/")) return current % parseInt(value.slice(2)) === 0;
    if (value.includes(",")) return value.split(",").map(Number).includes(current);
    if (value.includes("-")) {
      const [start, end] = value.split("-").map(Number);
      return current >= start && current <= end;
    }
    return parseInt(value) === current;
  };

  for (let i = 0; i < 525600 && dates.length < count; i++) {
    check.setMinutes(check.getMinutes() + 1);
    if (
      matchField(min, check.getMinutes()) &&
      matchField(hour, check.getHours()) &&
      matchField(dom, check.getDate()) &&
      matchField(month, check.getMonth() + 1) &&
      matchField(dow, check.getDay())
    ) {
      dates.push(new Date(check));
    }
  }
  return dates;
}

export default function CronBuilder() {
  const [minute, setMinute] = useState("0");
  const [hour, setHour] = useState("*");
  const [dayOfMonth, setDayOfMonth] = useState("*");
  const [month, setMonth] = useState("*");
  const [dayOfWeek, setDayOfWeek] = useState("*");
  const [copied, setCopied] = useState(false);

  const expression = `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
  const description = useMemo(() => describeCron(minute, hour, dayOfMonth, month, dayOfWeek), [minute, hour, dayOfMonth, month, dayOfWeek]);
  const nextRuns = useMemo(() => getNextRuns(minute, hour, dayOfMonth, month, dayOfWeek, 5), [minute, hour, dayOfMonth, month, dayOfWeek]);

  const handleCopy = () => {
    navigator.clipboard.writeText(expression);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const fields = [
    { label: "Minute", value: minute, setter: setMinute, placeholder: "0-59, */n, *", hint: "0-59" },
    { label: "Hour", value: hour, setter: setHour, placeholder: "0-23, */n, *", hint: "0-23" },
    { label: "Day of Month", value: dayOfMonth, setter: setDayOfMonth, placeholder: "1-31, */n, *", hint: "1-31" },
    { label: "Month", value: month, setter: setMonth, placeholder: "1-12, */n, *", hint: "1-12" },
    { label: "Day of Week", value: dayOfWeek, setter: setDayOfWeek, placeholder: "0-6, */n, *", hint: "0=Sun, 6=Sat" },
  ];

  const presets = [
    { label: "Every minute", value: "* * * * *" },
    { label: "Every hour", value: "0 * * * *" },
    { label: "Every day at midnight", value: "0 0 * * *" },
    { label: "Every Monday at 9am", value: "0 9 * * 1" },
    { label: "Every 5 minutes", value: "*/5 * * * *" },
    { label: "First of month", value: "0 0 1 * *" },
  ];

  const applyPreset = (expr: string) => {
    const [m, h, d, mo, dw] = expr.split(" ");
    setMinute(m);
    setHour(h);
    setDayOfMonth(d);
    setMonth(mo);
    setDayOfWeek(dw);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p.value}
              onClick={() => applyPreset(p.value)}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {fields.map((field) => (
            <div key={field.label}>
              <label className="text-sm font-medium text-gray-700 mb-1 block">{field.label}</label>
              <input
                type="text"
                value={field.value}
                onChange={(e) => field.setter(e.target.value)}
                className="w-full rounded-lg border border-gray-200 px-2 py-1.5 text-sm font-mono text-center focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
                placeholder={field.placeholder}
              />
              <p className="text-xs text-gray-400 mt-0.5 text-center">{field.hint}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy Expression"}
          </button>
          <button
            onClick={() => applyPreset("* * * * *")}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            <Trash2 className="h-4 w-4" /> Reset
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Cron Expression</label>
          <code className="block text-lg font-mono text-brand-700 bg-brand-50 rounded-lg px-4 py-2 text-center">{expression}</code>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
          <p className="text-sm text-gray-800 bg-gray-50 rounded-lg px-4 py-2">{description}</p>
        </div>
      </div>

      {nextRuns.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
            <Clock className="h-4 w-4" /> Next 5 Run Times
          </label>
          <div className="space-y-1">
            {nextRuns.map((date, i) => (
              <div key={i} className="text-sm font-mono text-gray-700 bg-gray-50 rounded-lg px-3 py-1.5">
                {date.toLocaleString()}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
