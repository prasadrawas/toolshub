"use client";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Trash2 } from "lucide-react";

export default function SvgPathViewer() {
  const [pathD, setPathD] = useState("");
  const [copied, setCopied] = useState(false);
  const [fill, setFill] = useState("none");
  const [stroke, setStroke] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(2);

  const bbox = useMemo(() => {
    if (!pathD) return null;
    try {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", pathD);
      svg.appendChild(path);
      document.body.appendChild(svg);
      const box = path.getBBox();
      document.body.removeChild(svg);
      return { x: box.x, y: box.y, width: box.width, height: box.height };
    } catch {
      return null;
    }
  }, [pathD]);

  const viewBox = bbox
    ? `${bbox.x - 5} ${bbox.y - 5} ${bbox.width + 10} ${bbox.height + 10}`
    : "0 0 100 100";

  const handleCopy = () => {
    const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}"><path d="${pathD}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" /></svg>`;
    navigator.clipboard.writeText(svgStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={handleCopy}
          disabled={!pathD}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy SVG"}
        </button>
        <button
          onClick={() => setPathD("")}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
        >
          <Trash2 className="h-4 w-4" /> Clear
        </button>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1.5 block">SVG Path d attribute</label>
        <textarea
          value={pathD}
          onChange={(e) => setPathD(e.target.value)}
          className="w-full h-24 rounded-xl border border-gray-200 bg-white p-4 font-mono text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none resize-none"
          placeholder="M10 10 L90 10 L90 90 L10 90 Z"
          spellCheck={false}
        />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-4">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Stroke
            <input type="color" value={stroke} onChange={(e) => setStroke(e.target.value)} className="w-8 h-8 rounded border border-gray-200 cursor-pointer" />
          </label>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Fill
            <select value={fill} onChange={(e) => setFill(e.target.value)} className="rounded-lg border border-gray-200 px-2 py-1 text-sm">
              <option value="none">None</option>
              <option value="#000000">Black</option>
              <option value="#3b82f6">Blue</option>
              <option value="#ef4444">Red</option>
              <option value="#22c55e">Green</option>
            </select>
          </label>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Stroke Width
            <input
              type="number"
              min={0.5}
              max={10}
              step={0.5}
              value={strokeWidth}
              onChange={(e) => setStrokeWidth(Number(e.target.value))}
              className="w-20 rounded-lg border border-gray-200 px-2 py-1 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
            />
          </label>
        </div>
      </div>

      {bbox && (
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "X", value: bbox.x.toFixed(1) },
            { label: "Y", value: bbox.y.toFixed(1) },
            { label: "Width", value: bbox.width.toFixed(1) },
            { label: "Height", value: bbox.height.toFixed(1) },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-gray-200 bg-white p-3 text-center">
              <div className="text-lg font-semibold text-gray-800">{item.value}</div>
              <div className="text-xs text-gray-500">{item.label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-4 flex justify-center" style={{ minHeight: 200 }}>
        {pathD ? (
          <svg viewBox={viewBox} className="w-full max-w-md" style={{ maxHeight: 300 }}>
            <path d={pathD} fill={fill} stroke={stroke} strokeWidth={strokeWidth} />
          </svg>
        ) : (
          <p className="text-sm text-gray-400 self-center">Enter a path to preview</p>
        )}
      </div>
    </div>
  );
}
