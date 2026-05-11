"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check } from "lucide-react";

export default function GlassmorphismGenerator() {
  const [blur, setBlur] = useState(16);
  const [transparency, setTransparency] = useState(0.15);
  const [borderOpacity, setBorderOpacity] = useState(0.2);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [copied, setCopied] = useState(false);

  const r = parseInt(bgColor.slice(1, 3), 16);
  const g = parseInt(bgColor.slice(3, 5), 16);
  const b = parseInt(bgColor.slice(5, 7), 16);

  const css = `background: rgba(${r}, ${g}, ${b}, ${transparency});
backdrop-filter: blur(${blur}px);
-webkit-backdrop-filter: blur(${blur}px);
border: 1px solid rgba(${r}, ${g}, ${b}, ${borderOpacity});
border-radius: 16px;`;

  const handleCopy = () => {
    navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-4">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Background Color
            <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-10 h-8 rounded border border-gray-200 cursor-pointer" />
            <span className="text-xs font-mono text-gray-500">{bgColor}</span>
          </label>
          <button onClick={handleCopy} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? "Copied" : "Copy CSS"}
          </button>
        </div>
        {([
          ["Blur", blur, setBlur, 0, 40, "px"],
          ["Transparency", Math.round(transparency * 100), (v: number) => setTransparency(v / 100), 0, 100, "%"],
          ["Border Opacity", Math.round(borderOpacity * 100), (v: number) => setBorderOpacity(v / 100), 0, 100, "%"],
        ] as [string, number, (v: number) => void, number, number, string][]).map(([label, val, setter, min, max, unit]) => (
          <label key={label} className="flex items-center gap-2 text-sm text-gray-600">
            <span className="w-28 font-medium text-gray-700">{label}</span>
            <input type="range" min={min} max={max} value={val} onChange={(e) => setter(+e.target.value)} className="flex-1" />
            <span className="w-12 font-mono text-xs text-right">{val}{unit}</span>
          </label>
        ))}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <label className="text-sm font-medium text-gray-700 mb-3 block">Preview</label>
        <div
          className="relative h-64 rounded-lg overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #ffd966 75%, #4facfe 100%)",
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div
              className="w-full max-w-sm p-6"
              style={{
                background: `rgba(${r}, ${g}, ${b}, ${transparency})`,
                backdropFilter: `blur(${blur}px)`,
                WebkitBackdropFilter: `blur(${blur}px)`,
                border: `1px solid rgba(${r}, ${g}, ${b}, ${borderOpacity})`,
                borderRadius: "16px",
              }}
            >
              <h3 className="text-lg font-semibold text-white mb-2">Glassmorphism Card</h3>
              <p className="text-sm text-white/80">This is a preview of the glassmorphism effect with the current settings.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <label className="text-sm font-medium text-gray-700 mb-1.5 block">CSS Code</label>
        <pre className="rounded-lg bg-gray-50 p-3 font-mono text-sm text-gray-800 whitespace-pre-wrap">{css}</pre>
      </div>
    </div>
  );
}
