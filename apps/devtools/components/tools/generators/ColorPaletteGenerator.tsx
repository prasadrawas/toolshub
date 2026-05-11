"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, RefreshCw, Palette } from "lucide-react";

function hexToHsl(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

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
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

type PaletteType = "complementary" | "analogous" | "triadic" | "split-complementary" | "tetradic";

function generatePalette(baseHex: string, type: PaletteType): { color: string; label: string }[] {
  const [h, s, l] = hexToHsl(baseHex);
  const colors: { color: string; label: string }[] = [{ color: baseHex, label: "Base" }];

  switch (type) {
    case "complementary":
      colors.push({ color: hslToHex(h + 180, s, l), label: "Complementary" });
      break;
    case "analogous":
      colors.push({ color: hslToHex(h - 30, s, l), label: "Analogous -30" });
      colors.push({ color: hslToHex(h + 30, s, l), label: "Analogous +30" });
      colors.push({ color: hslToHex(h - 60, s, l), label: "Analogous -60" });
      colors.push({ color: hslToHex(h + 60, s, l), label: "Analogous +60" });
      break;
    case "triadic":
      colors.push({ color: hslToHex(h + 120, s, l), label: "Triadic +120" });
      colors.push({ color: hslToHex(h + 240, s, l), label: "Triadic +240" });
      break;
    case "split-complementary":
      colors.push({ color: hslToHex(h + 150, s, l), label: "Split +150" });
      colors.push({ color: hslToHex(h + 210, s, l), label: "Split +210" });
      break;
    case "tetradic":
      colors.push({ color: hslToHex(h + 90, s, l), label: "Tetradic +90" });
      colors.push({ color: hslToHex(h + 180, s, l), label: "Tetradic +180" });
      colors.push({ color: hslToHex(h + 270, s, l), label: "Tetradic +270" });
      break;
  }
  return colors;
}

export default function ColorPaletteGenerator() {
  const [baseColor, setBaseColor] = useState("#3b82f6");
  const [paletteType, setPaletteType] = useState<PaletteType>("complementary");
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const palette = generatePalette(baseColor, paletteType);

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 1500);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(palette.map((p) => p.color).join("\n"));
    setCopiedColor("all");
    setTimeout(() => setCopiedColor(null), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Base Color
            <input
              type="color"
              value={baseColor}
              onChange={(e) => setBaseColor(e.target.value)}
              className="w-10 h-8 rounded border border-gray-200 cursor-pointer"
            />
            <input
              type="text"
              value={baseColor}
              onChange={(e) => {
                if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) setBaseColor(e.target.value);
              }}
              className="w-24 rounded-lg border border-gray-200 px-2 py-1 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
            />
          </label>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Harmony
            <select
              value={paletteType}
              onChange={(e) => setPaletteType(e.target.value as PaletteType)}
              className="rounded-lg border border-gray-200 px-2 py-1 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
            >
              <option value="complementary">Complementary</option>
              <option value="analogous">Analogous</option>
              <option value="triadic">Triadic</option>
              <option value="split-complementary">Split Complementary</option>
              <option value="tetradic">Tetradic</option>
            </select>
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={copyAll}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            {copiedColor === "all" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copiedColor === "all" ? "Copied" : "Copy All"}
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <label className="text-sm font-medium text-gray-700 mb-3 block">Color Palette</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {palette.map((item, i) => (
            <button
              key={i}
              onClick={() => handleCopy(item.color)}
              className="group flex flex-col items-center gap-2 rounded-xl border border-gray-100 p-3 hover:border-gray-300 transition-colors"
            >
              <div
                className="w-full aspect-square rounded-lg shadow-sm border border-gray-100"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-xs font-mono text-gray-700">
                {copiedColor === item.color ? "Copied!" : item.color}
              </span>
              <span className="text-xs text-gray-400">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <label className="text-sm font-medium text-gray-700 mb-3 block">Palette Preview</label>
        <div className="flex rounded-xl overflow-hidden h-20">
          {palette.map((item, i) => (
            <div key={i} className="flex-1" style={{ backgroundColor: item.color }} />
          ))}
        </div>
      </div>
    </div>
  );
}
