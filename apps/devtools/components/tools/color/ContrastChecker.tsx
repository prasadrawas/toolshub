"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, AlertTriangle, CheckCircle } from "lucide-react";

function hexToRgb(hex: string): [number, number, number] | null {
  const m = hex.trim().match(/^#?([0-9a-f]{6})$/i);
  if (!m) return null;
  return [parseInt(m[1].slice(0, 2), 16), parseInt(m[1].slice(2, 4), 16), parseInt(m[1].slice(4, 6), 16)];
}

function relativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(fg: [number, number, number], bg: [number, number, number]): number {
  const l1 = relativeLuminance(...fg);
  const l2 = relativeLuminance(...bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

export default function ContrastChecker() {
  const [fg, setFg] = useState("#ffffff");
  const [bg, setBg] = useState("#3b82f6");
  const [copied, setCopied] = useState(false);

  const fgRgb = hexToRgb(fg);
  const bgRgb = hexToRgb(bg);
  const ratio = fgRgb && bgRgb ? contrastRatio(fgRgb, bgRgb) : null;

  const results = ratio
    ? [
        { label: "AA Normal Text (4.5:1)", pass: ratio >= 4.5 },
        { label: "AA Large Text (3:1)", pass: ratio >= 3 },
        { label: "AAA Normal Text (7:1)", pass: ratio >= 7 },
        { label: "AAA Large Text (4.5:1)", pass: ratio >= 4.5 },
      ]
    : [];

  const handleSwap = () => { setFg(bg); setBg(fg); };

  const handleCopy = () => {
    if (ratio) {
      navigator.clipboard.writeText(`Contrast ratio: ${ratio.toFixed(2)}:1\nForeground: ${fg}\nBackground: ${bg}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Foreground
            <input type="color" value={fgRgb ? rgbToHex(...fgRgb) : "#ffffff"} onChange={(e) => setFg(e.target.value)} className="w-10 h-8 rounded border border-gray-200 cursor-pointer" />
            <input type="text" value={fg} onChange={(e) => setFg(e.target.value)} className="w-24 rounded-lg border border-gray-200 px-2 py-1 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none" />
          </label>
          <button onClick={handleSwap} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">Swap</button>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Background
            <input type="color" value={bgRgb ? rgbToHex(...bgRgb) : "#3b82f6"} onChange={(e) => setBg(e.target.value)} className="w-10 h-8 rounded border border-gray-200 cursor-pointer" />
            <input type="text" value={bg} onChange={(e) => setBg(e.target.value)} className="w-24 rounded-lg border border-gray-200 px-2 py-1 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none" />
          </label>
          <button onClick={handleCopy} disabled={!ratio} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      {fgRgb && bgRgb && ratio !== null && (
        <>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <label className="text-sm font-medium text-gray-700 mb-3 block">Preview</label>
            <div className="rounded-xl p-6 space-y-2" style={{ backgroundColor: bg, color: fg }}>
              <p className="text-2xl font-bold">Large Text (24px bold)</p>
              <p className="text-base">Normal text (16px). The quick brown fox jumps over the lazy dog.</p>
              <p className="text-sm">Small text (14px). Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <label className="text-sm font-medium text-gray-700 mb-3 block">
              Contrast Ratio: <span className="text-lg font-semibold text-gray-900">{ratio.toFixed(2)}:1</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {results.map((r) => (
                <div key={r.label} className={cn("flex items-center gap-2 rounded-lg border px-4 py-3", r.pass ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50")}>
                  {r.pass ? <CheckCircle className="h-5 w-5 text-green-600" /> : <AlertTriangle className="h-5 w-5 text-red-500" />}
                  <div>
                    <span className={cn("text-sm font-medium", r.pass ? "text-green-800" : "text-red-800")}>{r.pass ? "Pass" : "Fail"}</span>
                    <span className="text-sm text-gray-600 ml-2">{r.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {(!fgRgb || !bgRgb) && (fg.trim() || bg.trim()) && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          Please enter valid hex colors (e.g. #ffffff).
        </div>
      )}
    </div>
  );
}
