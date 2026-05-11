"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Trash2 } from "lucide-react";

function parseColor(input: string): [number, number, number, number] | null {
  let m: RegExpMatchArray | null;
  const s = input.trim();
  if ((m = s.match(/^#([0-9a-f]{3})$/i))) {
    const r = parseInt(m[1][0] + m[1][0], 16);
    const g = parseInt(m[1][1] + m[1][1], 16);
    const b = parseInt(m[1][2] + m[1][2], 16);
    return [r, g, b, 1];
  }
  if ((m = s.match(/^#([0-9a-f]{6})$/i))) {
    return [parseInt(m[1].slice(0, 2), 16), parseInt(m[1].slice(2, 4), 16), parseInt(m[1].slice(4, 6), 16), 1];
  }
  if ((m = s.match(/^#([0-9a-f]{8})$/i))) {
    return [parseInt(m[1].slice(0, 2), 16), parseInt(m[1].slice(2, 4), 16), parseInt(m[1].slice(4, 6), 16), parseInt(m[1].slice(6, 8), 16) / 255];
  }
  if ((m = s.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+))?\s*\)$/i))) {
    return [+m[1], +m[2], +m[3], m[4] !== undefined ? +m[4] : 1];
  }
  if ((m = s.match(/^hsla?\(\s*([\d.]+)\s*,\s*([\d.]+)%?\s*,\s*([\d.]+)%?\s*(?:,\s*([\d.]+))?\s*\)$/i))) {
    const [r, g, b] = hslToRgb(+m[1], +m[2], +m[3]);
    return [r, g, b, m[4] !== undefined ? +m[4] : 1];
  }
  return null;
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("")}`;
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return Math.round(255 * (l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)));
  };
  return [f(0), f(8), f(4)];
}

function rgbToCmyk(r: number, g: number, b: number): [number, number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const k = 1 - Math.max(r, g, b);
  if (k === 1) return [0, 0, 0, 100];
  return [
    Math.round(((1 - r - k) / (1 - k)) * 100),
    Math.round(((1 - g - k) / (1 - k)) * 100),
    Math.round(((1 - b - k) / (1 - k)) * 100),
    Math.round(k * 100),
  ];
}

function rgbToHwb(r: number, g: number, b: number): [number, number, number] {
  const [h] = rgbToHsl(r, g, b);
  const w = Math.min(r, g, b) / 255 * 100;
  const bl = (1 - Math.max(r, g, b) / 255) * 100;
  return [h, Math.round(w), Math.round(bl)];
}

export default function ColorConverter() {
  const [input, setInput] = useState("#3b82f6");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const parsed = parseColor(input);

  const formats: { label: string; value: string }[] = [];
  if (parsed) {
    const [r, g, b, a] = parsed;
    const [h, s, l] = rgbToHsl(r, g, b);
    const [c, m, y, k] = rgbToCmyk(r, g, b);
    const [hh, w, bl] = rgbToHwb(r, g, b);
    formats.push(
      { label: "HEX", value: rgbToHex(r, g, b) },
      { label: "RGB", value: `rgb(${r}, ${g}, ${b})` },
      { label: "RGBA", value: `rgba(${r}, ${g}, ${b}, ${a})` },
      { label: "HSL", value: `hsl(${h}, ${s}%, ${l}%)` },
      { label: "HSLA", value: `hsla(${h}, ${s}%, ${l}%, ${a})` },
      { label: "CMYK", value: `cmyk(${c}%, ${m}%, ${y}%, ${k}%)` },
      { label: "HWB", value: `hwb(${hh} ${w}% ${bl}%)` },
    );
  }

  const handleCopy = (key: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Color Input
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-64 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
              placeholder="#3b82f6, rgb(59,130,246), hsl(217,91%,60%)"
            />
          </label>
          {parsed && (
            <input
              type="color"
              value={rgbToHex(parsed[0], parsed[1], parsed[2])}
              onChange={(e) => setInput(e.target.value)}
              className="w-10 h-8 rounded border border-gray-200 cursor-pointer"
            />
          )}
          <button onClick={() => setInput("")} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
            <Trash2 className="h-4 w-4" /> Clear
          </button>
        </div>
      </div>

      {!parsed && input.trim() && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          Could not parse color. Try HEX (#ff0000), RGB (rgb(255,0,0)), or HSL (hsl(0,100%,50%)).
        </div>
      )}

      {parsed && (
        <>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <label className="text-sm font-medium text-gray-700 mb-3 block">Preview</label>
            <div className="h-20 rounded-xl border border-gray-100 shadow-sm" style={{ backgroundColor: `rgba(${parsed[0]},${parsed[1]},${parsed[2]},${parsed[3]})` }} />
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <label className="text-sm font-medium text-gray-700 mb-3 block">Conversions</label>
            <div className="space-y-2">
              {formats.map((f) => (
                <div key={f.label} className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-2.5 hover:border-gray-300 transition-colors">
                  <div>
                    <span className="text-xs font-medium text-gray-400 uppercase mr-3">{f.label}</span>
                    <span className="font-mono text-sm text-gray-800">{f.value}</span>
                  </div>
                  <button onClick={() => handleCopy(f.label, f.value)} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-gray-500 hover:bg-gray-100">
                    {copiedKey === f.label ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    {copiedKey === f.label ? "Copied" : "Copy"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
