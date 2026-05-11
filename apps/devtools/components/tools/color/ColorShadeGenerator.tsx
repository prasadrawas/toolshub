"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Palette } from "lucide-react";

function hexToHsl(hex: string): [number, number, number] | null {
  const m = hex.trim().match(/^#?([0-9a-f]{6})$/i);
  if (!m) return null;
  const r = parseInt(m[1].slice(0, 2), 16) / 255;
  const g = parseInt(m[1].slice(2, 4), 16) / 255;
  const b = parseInt(m[1].slice(4, 6), 16) / 255;
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
  return [h * 360, s * 100, l * 100];
}

function hslToHex(h: number, s: number, l: number): string {
  h = ((h % 360) + 360) % 360;
  s = Math.max(0, Math.min(100, s)) / 100;
  l = Math.max(0, Math.min(100, l)) / 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    return Math.round(255 * (l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1))).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

const SHADE_LABELS = ["50", "100", "200", "300", "400", "500", "600", "700", "800", "900", "950"];
const SHADE_LIGHTNESS = [97, 93, 86, 76, 64, 50, 40, 32, 24, 17, 10];

function generateShades(hex: string): { label: string; hex: string }[] {
  const hsl = hexToHsl(hex);
  if (!hsl) return [];
  const [h, s] = hsl;
  return SHADE_LABELS.map((label, i) => ({
    label,
    hex: hslToHex(h, Math.min(100, s + (i > 5 ? 5 : 0)), SHADE_LIGHTNESS[i]),
  }));
}

export default function ColorShadeGenerator() {
  const [input, setInput] = useState("#3b82f6");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const isValid = /^#?[0-9a-fA-F]{6}$/.test(input.trim());
  const normalizedInput = input.trim().startsWith("#") ? input.trim() : `#${input.trim()}`;
  const shades = isValid ? generateShades(normalizedInput) : [];

  const handleCopy = (key: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const handleCopyAll = () => {
    const vars = shades.map((s) => `  --color-${s.label}: ${s.hex};`).join("\n");
    navigator.clipboard.writeText(`:root {\n${vars}\n}`);
    setCopiedKey("all");
    setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <Palette className="h-4 w-4" /> Base Color
            <input type="color" value={isValid ? normalizedInput : "#000000"} onChange={(e) => setInput(e.target.value)} className="w-10 h-8 rounded border border-gray-200 cursor-pointer" />
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} className="w-28 rounded-lg border border-gray-200 px-2 py-1 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none" placeholder="#3b82f6" />
          </label>
          {shades.length > 0 && (
            <button onClick={handleCopyAll} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
              {copiedKey === "all" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copiedKey === "all" ? "Copied CSS Vars" : "Copy as CSS Variables"}
            </button>
          )}
        </div>
      </div>

      {!isValid && input.trim() && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">Please enter a valid hex color (e.g. #3b82f6).</div>
      )}

      {shades.length > 0 && (
        <>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <label className="text-sm font-medium text-gray-700 mb-3 block">Shade Scale</label>
            <div className="flex rounded-xl overflow-hidden h-16">
              {shades.map((s) => (
                <div key={s.label} className="flex-1" style={{ backgroundColor: s.hex }} />
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <label className="text-sm font-medium text-gray-700 mb-3 block">Individual Shades</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {shades.map((s) => (
                <button
                  key={s.label}
                  onClick={() => handleCopy(s.label, s.hex)}
                  className="flex flex-col items-center gap-2 rounded-xl border border-gray-100 p-3 hover:border-gray-300 transition-colors"
                >
                  <div className="w-full aspect-square rounded-lg border border-gray-100 shadow-sm" style={{ backgroundColor: s.hex }} />
                  <span className="text-xs font-medium text-gray-700">{s.label}</span>
                  <span className="font-mono text-xs text-gray-500">{copiedKey === s.label ? "Copied!" : s.hex}</span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
