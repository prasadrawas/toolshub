"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Calculator } from "lucide-react";

function calcDiff(d1: Date, d2: Date) {
  const ms = Math.abs(d2.getTime() - d1.getTime());
  const totalSeconds = Math.floor(ms / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);
  const totalWeeks = Math.floor(totalDays / 7);

  // Calculate years/months
  const start = d1 < d2 ? d1 : d2;
  const end = d1 < d2 ? d2 : d1;
  let years = end.getFullYear() - start.getFullYear();
  let months = end.getMonth() - start.getMonth();
  if (months < 0) { years--; months += 12; }
  if (end.getDate() < start.getDate()) {
    months--;
    if (months < 0) { years--; months += 12; }
  }
  const totalMonths = years * 12 + months;

  // Workdays (Mon-Fri)
  let workdays = 0;
  const current = new Date(start);
  while (current < end) {
    const day = current.getDay();
    if (day !== 0 && day !== 6) workdays++;
    current.setDate(current.getDate() + 1);
  }

  return {
    years, months: totalMonths, days: totalDays, hours: totalHours,
    minutes: totalMinutes, seconds: totalSeconds, weeks: totalWeeks, workdays,
  };
}

export default function DateDiffCalculator() {
  const [date1, setDate1] = useState("");
  const [date2, setDate2] = useState("");
  const [result, setResult] = useState<ReturnType<typeof calcDiff> | null>(null);

  const calculate = () => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return;
    setResult(calcDiff(d1, d2));
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Start Date</label>
            <input
              type="date"
              value={date1}
              onChange={(e) => setDate1(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">End Date</label>
            <input
              type="date"
              value={date2}
              onChange={(e) => setDate2(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
            />
          </div>
        </div>
        <button
          onClick={calculate}
          disabled={!date1 || !date2}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100 disabled:opacity-50"
        >
          <Calculator className="h-4 w-4" /> Calculate
        </button>
      </div>

      {result && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Years", value: result.years },
            { label: "Months", value: result.months },
            { label: "Weeks", value: result.weeks },
            { label: "Days", value: result.days },
            { label: "Hours", value: result.hours.toLocaleString() },
            { label: "Minutes", value: result.minutes.toLocaleString() },
            { label: "Seconds", value: result.seconds.toLocaleString() },
            { label: "Workdays", value: result.workdays.toLocaleString() },
          ].map((item) => (
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
