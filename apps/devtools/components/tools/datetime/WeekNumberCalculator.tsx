"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";

function getISOWeek(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / 86400000);
}

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function getQuarter(date: Date): number {
  return Math.floor(date.getMonth() / 3) + 1;
}

function getDaysRemaining(date: Date): number {
  const endOfYear = new Date(date.getFullYear(), 11, 31);
  return Math.ceil((endOfYear.getTime() - date.getTime()) / 86400000);
}

export default function WeekNumberCalculator() {
  const [dateStr, setDateStr] = useState(new Date().toISOString().slice(0, 10));

  const date = new Date(dateStr + "T00:00:00");
  const valid = !isNaN(date.getTime());

  const stats = valid
    ? [
        { label: "ISO Week", value: getISOWeek(date) },
        { label: "Day of Year", value: getDayOfYear(date) },
        { label: "Quarter", value: `Q${getQuarter(date)}` },
        { label: "Leap Year", value: isLeapYear(date.getFullYear()) ? "Yes" : "No" },
        { label: "Days Remaining", value: getDaysRemaining(date) },
        { label: "Day of Week", value: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][date.getDay()] },
        { label: "Days in Year", value: isLeapYear(date.getFullYear()) ? 366 : 365 },
        { label: "Week Day #", value: date.getDay() },
      ]
    : [];

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Date</label>
            <input
              type="date"
              value={dateStr}
              onChange={(e) => setDateStr(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
            />
          </div>
          <button
            onClick={() => setDateStr(new Date().toISOString().slice(0, 10))}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            <Calendar className="h-4 w-4" /> Today
          </button>
        </div>
      </div>

      {stats.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map((item) => (
            <div key={item.label} className="rounded-xl border border-gray-200 bg-white p-3 text-center">
              <div className="text-lg font-semibold text-gray-800">{item.value}</div>
              <div className="text-xs text-gray-500">{item.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
