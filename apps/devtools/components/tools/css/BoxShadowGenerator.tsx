"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Plus, Trash2 } from "lucide-react";

interface Shadow {
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
  inset: boolean;
}

function shadowToCSS(s: Shadow): string {
  const r = parseInt(s.color.slice(1, 3), 16);
  const g = parseInt(s.color.slice(3, 5), 16);
  const b = parseInt(s.color.slice(5, 7), 16);
  return `${s.inset ? "inset " : ""}${s.x}px ${s.y}px ${s.blur}px ${s.spread}px rgba(${r}, ${g}, ${b}, ${s.opacity})`;
}

export default function BoxShadowGenerator() {
  const [shadows, setShadows] = useState<Shadow[]>([
    { x: 4, y: 4, blur: 15, spread: 0, color: "#000000", opacity: 0.15, inset: false },
  ]);
  const [copied, setCopied] = useState(false);

  const cssValue = shadows.map(shadowToCSS).join(", ");
  const css = `box-shadow: ${cssValue};`;

  const handleCopy = () => {
    navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const addShadow = () => {
    setShadows([...shadows, { x: 0, y: 2, blur: 8, spread: 0, color: "#000000", opacity: 0.1, inset: false }]);
  };

  const removeShadow = (i: number) => {
    if (shadows.length <= 1) return;
    setShadows(shadows.filter((_, idx) => idx !== i));
  };

  const update = (i: number, field: keyof Shadow, value: number | string | boolean) => {
    const next = [...shadows];
    (next[i] as any)[field] = value;
    setShadows(next);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={addShadow} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100">
          <Plus className="h-4 w-4" /> Add Shadow
        </button>
        <button onClick={handleCopy} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? "Copied" : "Copy CSS"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-3">
          {shadows.map((s, i) => (
            <div key={i} className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Shadow {i + 1}</span>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 text-xs text-gray-600">
                    <input type="checkbox" checked={s.inset} onChange={(e) => update(i, "inset", e.target.checked)} className="rounded" />
                    Inset
                  </label>
                  <button onClick={() => removeShadow(i)} disabled={shadows.length <= 1} className="rounded p-1 hover:bg-gray-100 disabled:opacity-30">
                    <Trash2 className="h-4 w-4 text-gray-400" />
                  </button>
                </div>
              </div>
              {([
                ["X Offset", "x", -50, 50],
                ["Y Offset", "y", -50, 50],
                ["Blur", "blur", 0, 100],
                ["Spread", "spread", -50, 50],
              ] as const).map(([label, field, min, max]) => (
                <label key={field} className="flex items-center gap-2 text-xs text-gray-600">
                  <span className="w-16">{label}</span>
                  <input type="range" min={min} max={max} value={s[field]} onChange={(e) => update(i, field, +e.target.value)} className="flex-1" />
                  <span className="w-12 font-mono text-right">{s[field]}px</span>
                </label>
              ))}
              <label className="flex items-center gap-2 text-xs text-gray-600">
                <span className="w-16">Opacity</span>
                <input type="range" min="0" max="100" value={Math.round(s.opacity * 100)} onChange={(e) => update(i, "opacity", +e.target.value / 100)} className="flex-1" />
                <span className="w-12 font-mono text-right">{Math.round(s.opacity * 100)}%</span>
              </label>
              <label className="flex items-center gap-2 text-xs text-gray-600">
                <span className="w-16">Color</span>
                <input type="color" value={s.color} onChange={(e) => update(i, "color", e.target.value)} className="w-8 h-6 rounded border border-gray-200 cursor-pointer" />
                <span className="font-mono">{s.color}</span>
              </label>
            </div>
          ))}
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <label className="text-sm font-medium text-gray-700 mb-3 block">Preview</label>
            <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
              <div className="w-40 h-40 bg-white rounded-xl" style={{ boxShadow: cssValue }} />
            </div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">CSS Code</label>
            <pre className="rounded-lg bg-gray-50 p-3 font-mono text-sm text-gray-800 overflow-x-auto whitespace-pre-wrap">{css}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
