"use client";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Ratio, Trash2 } from "lucide-react";

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}

function simplifyRatio(w: number, h: number): [number, number] {
  const d = gcd(w, h);
  return d > 0 ? [w / d, h / d] : [0, 0];
}

const PRESETS = [
  { label: "16:9", w: 16, h: 9 },
  { label: "4:3", w: 4, h: 3 },
  { label: "1:1", w: 1, h: 1 },
  { label: "21:9", w: 21, h: 9 },
  { label: "3:2", w: 3, h: 2 },
  { label: "9:16", w: 9, h: 16 },
];

export default function AspectRatioCalculator() {
  const [mode, setMode] = useState<"calculate" | "resize">("calculate");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [ratioW, setRatioW] = useState("16");
  const [ratioH, setRatioH] = useState("9");
  const [knownDim, setKnownDim] = useState<"width" | "height">("width");
  const [knownValue, setKnownValue] = useState("");
  const [copied, setCopied] = useState(false);

  const w = parseFloat(width);
  const h = parseFloat(height);
  const ratio = useMemo(() => {
    if (!isNaN(w) && !isNaN(h) && w > 0 && h > 0) {
      const [rw, rh] = simplifyRatio(w, h);
      return { rw, rh, decimal: (w / h).toFixed(4) };
    }
    return null;
  }, [w, h]);

  const calculatedDim = useMemo(() => {
    const rw = parseFloat(ratioW);
    const rh = parseFloat(ratioH);
    const kv = parseFloat(knownValue);
    if (isNaN(rw) || isNaN(rh) || isNaN(kv) || rw <= 0 || rh <= 0 || kv <= 0) return null;
    if (knownDim === "width") return { width: kv, height: Math.round((kv / rw) * rh) };
    return { width: Math.round((kv / rh) * rw), height: kv };
  }, [ratioW, ratioH, knownDim, knownValue]);

  const resultText = mode === "calculate"
    ? ratio ? `${ratio.rw}:${ratio.rh}` : ""
    : calculatedDim ? `${calculatedDim.width} x ${calculatedDim.height}` : "";

  const handleCopy = () => {
    if (!resultText) return;
    navigator.clipboard.writeText(resultText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setMode("calculate")}
            className={cn("rounded-lg px-3 py-1.5 text-sm font-medium", mode === "calculate" ? "bg-brand-50 text-brand-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}
          >
            Calculate Ratio
          </button>
          <button
            onClick={() => setMode("resize")}
            className={cn("rounded-lg px-3 py-1.5 text-sm font-medium", mode === "resize" ? "bg-brand-50 text-brand-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}
          >
            Resize by Ratio
          </button>
        </div>

        {mode === "calculate" ? (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Width</label>
              <input type="number" value={width} onChange={(e) => setWidth(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none" placeholder="e.g., 1920" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Height</label>
              <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none" placeholder="e.g., 1080" />
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap gap-2 mb-2">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  onClick={() => { setRatioW(String(p.w)); setRatioH(String(p.h)); }}
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
                >
                  {p.label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Ratio W</label>
                <input type="number" value={ratioW} onChange={(e) => setRatioW(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Ratio H</label>
                <input type="number" value={ratioH} onChange={(e) => setRatioH(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none" />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Known Dimension</label>
                <select value={knownDim} onChange={(e) => setKnownDim(e.target.value as "width" | "height")} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm bg-white text-gray-700 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none">
                  <option value="width">Width</option>
                  <option value="height">Height</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Value</label>
                <input type="number" value={knownValue} onChange={(e) => setKnownValue(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none" placeholder="e.g., 1920" />
              </div>
            </div>
          </>
        )}

        <div className="flex flex-wrap items-center gap-2">
          <button onClick={handleCopy} disabled={!resultText} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100 disabled:opacity-50">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? "Copied" : "Copy Result"}
          </button>
          <button
            onClick={() => { setWidth(""); setHeight(""); setKnownValue(""); }}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            <Trash2 className="h-4 w-4" /> Clear
          </button>
        </div>
      </div>

      {mode === "calculate" && ratio && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
          <label className="text-sm font-medium text-gray-700 block flex items-center gap-2">
            <Ratio className="h-4 w-4" /> Aspect Ratio
          </label>
          <code className="block text-lg font-mono text-brand-700 bg-brand-50 rounded-lg px-4 py-2 text-center">
            {ratio.rw}:{ratio.rh}
          </code>
          <p className="text-sm text-gray-500 text-center">Decimal: {ratio.decimal}</p>
          <div className="flex justify-center">
            <div
              className="border-2 border-brand-300 bg-brand-50 rounded"
              style={{
                width: `${Math.min(200, ratio.rw * 10)}px`,
                height: `${Math.min(200, ratio.rh * 10)}px`,
                maxWidth: "200px",
                maxHeight: "200px",
                aspectRatio: `${ratio.rw} / ${ratio.rh}`,
              }}
            />
          </div>
        </div>
      )}

      {mode === "resize" && calculatedDim && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
          <label className="text-sm font-medium text-gray-700 block flex items-center gap-2">
            <Ratio className="h-4 w-4" /> Calculated Dimensions
          </label>
          <code className="block text-lg font-mono text-brand-700 bg-brand-50 rounded-lg px-4 py-2 text-center">
            {calculatedDim.width} x {calculatedDim.height}
          </code>
        </div>
      )}
    </div>
  );
}
