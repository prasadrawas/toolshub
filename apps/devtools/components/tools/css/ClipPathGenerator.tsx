"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check } from "lucide-react";

type ShapeType = "circle" | "ellipse" | "triangle" | "pentagon" | "hexagon" | "star" | "custom";

function getClipPath(shape: ShapeType, customPoints: string): string {
  switch (shape) {
    case "circle":
      return "circle(50% at 50% 50%)";
    case "ellipse":
      return "ellipse(50% 35% at 50% 50%)";
    case "triangle":
      return "polygon(50% 0%, 0% 100%, 100% 100%)";
    case "pentagon":
      return "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)";
    case "hexagon":
      return "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)";
    case "star":
      return "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)";
    case "custom":
      return customPoints || "polygon(50% 0%, 100% 100%, 0% 100%)";
  }
}

const SHAPES: { value: ShapeType; label: string }[] = [
  { value: "circle", label: "Circle" },
  { value: "ellipse", label: "Ellipse" },
  { value: "triangle", label: "Triangle" },
  { value: "pentagon", label: "Pentagon" },
  { value: "hexagon", label: "Hexagon" },
  { value: "star", label: "Star" },
  { value: "custom", label: "Custom" },
];

export default function ClipPathGenerator() {
  const [shape, setShape] = useState<ShapeType>("hexagon");
  const [customPoints, setCustomPoints] = useState("polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)");
  const [copied, setCopied] = useState(false);

  const clipPath = getClipPath(shape, customPoints);
  const css = `clip-path: ${clipPath};`;

  const handleCopy = () => {
    navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Shape
            <select value={shape} onChange={(e) => setShape(e.target.value as ShapeType)} className="rounded-lg border border-gray-200 px-2 py-1 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none">
              {SHAPES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </label>
          <button onClick={handleCopy} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? "Copied" : "Copy CSS"}
          </button>
        </div>
        {shape === "custom" && (
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Custom clip-path value</label>
            <input
              type="text"
              value={customPoints}
              onChange={(e) => setCustomPoints(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
              placeholder="polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)"
            />
          </div>
        )}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <label className="text-sm font-medium text-gray-700 mb-3 block">Preview</label>
        <div className="flex items-center justify-center h-72 bg-gray-50 rounded-lg">
          <div className="relative w-56 h-56">
            <div className="absolute inset-0 bg-gray-200 rounded-lg opacity-30" />
            <div className="absolute inset-0 bg-brand-500" style={{ clipPath: clipPath }} />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <label className="text-sm font-medium text-gray-700 mb-3 block">Shape Presets</label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {SHAPES.filter((s) => s.value !== "custom").map((s) => (
            <button key={s.value} onClick={() => setShape(s.value)} className={cn("flex flex-col items-center gap-2 rounded-xl border p-3 transition-colors", shape === s.value ? "border-brand-400 bg-brand-50" : "border-gray-100 hover:border-gray-300")}>
              <div className="w-12 h-12 bg-brand-400" style={{ clipPath: getClipPath(s.value, "") }} />
              <span className="text-xs text-gray-600">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <label className="text-sm font-medium text-gray-700 mb-1.5 block">CSS Code</label>
        <pre className="rounded-lg bg-gray-50 p-3 font-mono text-sm text-gray-800">{css}</pre>
      </div>
    </div>
  );
}
