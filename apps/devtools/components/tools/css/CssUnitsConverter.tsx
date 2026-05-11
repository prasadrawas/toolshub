"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check } from "lucide-react";

const UNITS = ["px", "rem", "em", "vw", "vh", "pt", "cm", "in"] as const;
type Unit = (typeof UNITS)[number];

function convertToPx(value: number, unit: Unit, baseFontSize: number, vw: number, vh: number): number {
  switch (unit) {
    case "px": return value;
    case "rem": return value * baseFontSize;
    case "em": return value * baseFontSize;
    case "vw": return (value / 100) * vw;
    case "vh": return (value / 100) * vh;
    case "pt": return value * (96 / 72);
    case "cm": return value * (96 / 2.54);
    case "in": return value * 96;
  }
}

function convertFromPx(px: number, unit: Unit, baseFontSize: number, vw: number, vh: number): number {
  switch (unit) {
    case "px": return px;
    case "rem": return px / baseFontSize;
    case "em": return px / baseFontSize;
    case "vw": return (px / vw) * 100;
    case "vh": return (px / vh) * 100;
    case "pt": return px / (96 / 72);
    case "cm": return px / (96 / 2.54);
    case "in": return px / 96;
  }
}

export default function CssUnitsConverter() {
  const [value, setValue] = useState("16");
  const [unit, setUnit] = useState<Unit>("px");
  const [baseFontSize, setBaseFontSize] = useState(16);
  const [viewportW, setViewportW] = useState(1920);
  const [viewportH, setViewportH] = useState(1080);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const numValue = parseFloat(value);
  const isValid = !isNaN(numValue);
  const px = isValid ? convertToPx(numValue, unit, baseFontSize, viewportW, viewportH) : 0;

  const results = isValid
    ? UNITS.filter((u) => u !== unit).map((u) => ({
        unit: u,
        value: convertFromPx(px, u, baseFontSize, viewportW, viewportH),
      }))
    : [];

  const handleCopy = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const fmt = (v: number) => {
    const s = v.toFixed(6);
    return parseFloat(s).toString();
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Value
            <input type="text" value={value} onChange={(e) => setValue(e.target.value)} className="w-28 rounded-lg border border-gray-200 px-2 py-1 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none" />
          </label>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Unit
            <select value={unit} onChange={(e) => setUnit(e.target.value as Unit)} className="rounded-lg border border-gray-200 px-2 py-1 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none">
              {UNITS.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Base Font Size
            <input type="number" min="1" max="100" value={baseFontSize} onChange={(e) => setBaseFontSize(+e.target.value)} className="w-16 rounded-lg border border-gray-200 px-2 py-1 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none" />
            <span className="text-xs text-gray-400">px</span>
          </label>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Viewport W
            <input type="number" min="1" value={viewportW} onChange={(e) => setViewportW(+e.target.value)} className="w-20 rounded-lg border border-gray-200 px-2 py-1 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none" />
            <span className="text-xs text-gray-400">px</span>
          </label>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Viewport H
            <input type="number" min="1" value={viewportH} onChange={(e) => setViewportH(+e.target.value)} className="w-20 rounded-lg border border-gray-200 px-2 py-1 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none" />
            <span className="text-xs text-gray-400">px</span>
          </label>
        </div>
      </div>

      {!isValid && value.trim() && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">Please enter a valid number.</div>
      )}

      {isValid && (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <label className="text-sm font-medium text-gray-700 mb-3 block">Conversions</label>
          <div className="space-y-2">
            {results.map((r) => (
              <div key={r.unit} className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-2.5 hover:border-gray-300 transition-colors">
                <div>
                  <span className="text-xs font-medium text-gray-400 uppercase mr-3">{r.unit}</span>
                  <span className="font-mono text-sm text-gray-800">{fmt(r.value)}{r.unit}</span>
                </div>
                <button onClick={() => handleCopy(r.unit, `${fmt(r.value)}${r.unit}`)} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-gray-500 hover:bg-gray-100">
                  {copiedKey === r.unit ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copiedKey === r.unit ? "Copied" : "Copy"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
