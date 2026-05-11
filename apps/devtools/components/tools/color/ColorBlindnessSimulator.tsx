"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Eye } from "lucide-react";

function hexToRgb(hex: string): [number, number, number] | null {
  const m = hex.trim().match(/^#?([0-9a-f]{6})$/i);
  if (!m) return null;
  return [parseInt(m[1].slice(0, 2), 16), parseInt(m[1].slice(2, 4), 16), parseInt(m[1].slice(4, 6), 16)];
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("")}`;
}

function linearize(c: number): number {
  c /= 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function delinearize(c: number): number {
  c = Math.max(0, Math.min(1, c));
  return c <= 0.0031308 ? Math.round(c * 12.92 * 255) : Math.round((1.055 * Math.pow(c, 1 / 2.4) - 0.055) * 255);
}

type Matrix = [number, number, number, number, number, number, number, number, number];

function applyMatrix(r: number, g: number, b: number, m: Matrix): [number, number, number] {
  const lr = linearize(r), lg = linearize(g), lb = linearize(b);
  return [
    delinearize(m[0] * lr + m[1] * lg + m[2] * lb),
    delinearize(m[3] * lr + m[4] * lg + m[5] * lb),
    delinearize(m[6] * lr + m[7] * lg + m[8] * lb),
  ];
}

const simulations: { label: string; description: string; matrix: Matrix }[] = [
  {
    label: "Protanopia",
    description: "No red cones (1% of males)",
    matrix: [0.567, 0.433, 0, 0.558, 0.442, 0, 0, 0.242, 0.758],
  },
  {
    label: "Deuteranopia",
    description: "No green cones (1% of males)",
    matrix: [0.625, 0.375, 0, 0.7, 0.3, 0, 0, 0.3, 0.7],
  },
  {
    label: "Tritanopia",
    description: "No blue cones (rare)",
    matrix: [0.95, 0.05, 0, 0, 0.433, 0.567, 0, 0.475, 0.525],
  },
  {
    label: "Achromatopsia",
    description: "Total color blindness (very rare)",
    matrix: [0.299, 0.587, 0.114, 0.299, 0.587, 0.114, 0.299, 0.587, 0.114],
  },
];

export default function ColorBlindnessSimulator() {
  const [input, setInput] = useState("#3b82f6");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const rgb = hexToRgb(input);

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
            <Eye className="h-4 w-4" /> Input Color
            <input type="color" value={rgb ? rgbToHex(...rgb) : "#000000"} onChange={(e) => setInput(e.target.value)} className="w-10 h-8 rounded border border-gray-200 cursor-pointer" />
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} className="w-28 rounded-lg border border-gray-200 px-2 py-1 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none" placeholder="#3b82f6" />
          </label>
        </div>
      </div>

      {!rgb && input.trim() && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">Please enter a valid hex color (e.g. #3b82f6).</div>
      )}

      {rgb && (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <label className="text-sm font-medium text-gray-700 mb-3 block">Simulations</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex flex-col items-center gap-2 rounded-xl border border-gray-100 p-4">
              <div className="w-full aspect-square rounded-lg border border-gray-100 shadow-sm" style={{ backgroundColor: rgbToHex(...rgb) }} />
              <span className="font-mono text-xs text-gray-700">{rgbToHex(...rgb)}</span>
              <span className="text-xs text-gray-500 font-medium">Normal Vision</span>
            </div>
            {simulations.map((sim) => {
              const [sr, sg, sb] = applyMatrix(rgb[0], rgb[1], rgb[2], sim.matrix);
              const simHex = rgbToHex(sr, sg, sb);
              return (
                <div key={sim.label} className="flex flex-col items-center gap-2 rounded-xl border border-gray-100 p-4">
                  <div className="w-full aspect-square rounded-lg border border-gray-100 shadow-sm" style={{ backgroundColor: simHex }} />
                  <div className="flex items-center gap-1">
                    <span className="font-mono text-xs text-gray-700">{simHex}</span>
                    <button onClick={() => handleCopy(sim.label, simHex)} className="rounded p-0.5 hover:bg-gray-100">
                      {copiedKey === sim.label ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3 text-gray-400" />}
                    </button>
                  </div>
                  <span className="text-xs font-medium text-gray-700">{sim.label}</span>
                  <span className="text-xs text-gray-400 text-center">{sim.description}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
