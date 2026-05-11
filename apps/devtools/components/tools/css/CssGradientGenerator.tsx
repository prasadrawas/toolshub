"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Plus, Trash2 } from "lucide-react";

interface ColorStop {
  color: string;
  position: number;
}

export default function CssGradientGenerator() {
  const [type, setType] = useState<"linear" | "radial">("linear");
  const [angle, setAngle] = useState(90);
  const [stops, setStops] = useState<ColorStop[]>([
    { color: "#3b82f6", position: 0 },
    { color: "#8b5cf6", position: 100 },
  ]);
  const [copied, setCopied] = useState(false);

  const stopsStr = stops.map((s) => `${s.color} ${s.position}%`).join(", ");
  const css = type === "linear"
    ? `background: linear-gradient(${angle}deg, ${stopsStr});`
    : `background: radial-gradient(circle, ${stopsStr});`;

  const gradientStyle = type === "linear"
    ? `linear-gradient(${angle}deg, ${stopsStr})`
    : `radial-gradient(circle, ${stopsStr})`;

  const handleCopy = () => {
    navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const addStop = () => {
    setStops([...stops, { color: "#10b981", position: 50 }]);
  };

  const removeStop = (i: number) => {
    if (stops.length <= 2) return;
    setStops(stops.filter((_, idx) => idx !== i));
  };

  const updateStop = (i: number, field: keyof ColorStop, value: string | number) => {
    const next = [...stops];
    if (field === "color") next[i].color = value as string;
    else next[i].position = value as number;
    setStops(next);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Type
            <select value={type} onChange={(e) => setType(e.target.value as "linear" | "radial")} className="rounded-lg border border-gray-200 px-2 py-1 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none">
              <option value="linear">Linear</option>
              <option value="radial">Radial</option>
            </select>
          </label>
          {type === "linear" && (
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              Angle
              <input type="range" min="0" max="360" value={angle} onChange={(e) => setAngle(+e.target.value)} className="w-32" />
              <span className="text-xs font-mono text-gray-500 w-10">{angle}°</span>
            </label>
          )}
          <button onClick={addStop} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100">
            <Plus className="h-4 w-4" /> Add Stop
          </button>
          <button onClick={handleCopy} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? "Copied" : "Copy CSS"}
          </button>
        </div>
        <div className="space-y-2">
          {stops.map((stop, i) => (
            <div key={i} className="flex items-center gap-3">
              <input type="color" value={stop.color} onChange={(e) => updateStop(i, "color", e.target.value)} className="w-10 h-8 rounded border border-gray-200 cursor-pointer" />
              <input type="text" value={stop.color} onChange={(e) => updateStop(i, "color", e.target.value)} className="w-24 rounded-lg border border-gray-200 px-2 py-1 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none" />
              <input type="range" min="0" max="100" value={stop.position} onChange={(e) => updateStop(i, "position", +e.target.value)} className="flex-1" />
              <span className="text-xs font-mono text-gray-500 w-10">{stop.position}%</span>
              <button onClick={() => removeStop(i)} disabled={stops.length <= 2} className="rounded p-1 hover:bg-gray-100 disabled:opacity-30">
                <Trash2 className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <label className="text-sm font-medium text-gray-700 mb-3 block">Preview</label>
        <div className="h-48 rounded-xl border border-gray-100" style={{ background: gradientStyle }} />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <label className="text-sm font-medium text-gray-700 mb-1.5 block">CSS Code</label>
        <pre className="rounded-lg bg-gray-50 p-3 font-mono text-sm text-gray-800 overflow-x-auto">{css}</pre>
      </div>
    </div>
  );
}
