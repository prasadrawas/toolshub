"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check } from "lucide-react";

export default function GridGenerator() {
  const [cols, setCols] = useState(3);
  const [rows, setRows] = useState(3);
  const [gap, setGap] = useState(8);
  const [colTemplate, setColTemplate] = useState("1fr");
  const [rowTemplate, setRowTemplate] = useState("1fr");
  const [copied, setCopied] = useState(false);

  const gridTemplateCols = Array(cols).fill(colTemplate).join(" ");
  const gridTemplateRows = Array(rows).fill(rowTemplate).join(" ");

  const css = `display: grid;\ngrid-template-columns: ${gridTemplateCols};\ngrid-template-rows: ${gridTemplateRows};\ngap: ${gap}px;`;

  const handleCopy = () => {
    navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const totalCells = cols * rows;
  const colors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4", "#f97316", "#84cc16", "#f43f5e", "#14b8a6", "#a855f7"];

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Columns
            <input type="number" min="1" max="12" value={cols} onChange={(e) => setCols(Math.max(1, +e.target.value))} className="w-16 rounded-lg border border-gray-200 px-2 py-1 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none" />
          </label>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Rows
            <input type="number" min="1" max="12" value={rows} onChange={(e) => setRows(Math.max(1, +e.target.value))} className="w-16 rounded-lg border border-gray-200 px-2 py-1 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none" />
          </label>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Gap
            <input type="range" min="0" max="40" value={gap} onChange={(e) => setGap(+e.target.value)} className="w-24" />
            <span className="text-xs font-mono text-gray-500">{gap}px</span>
          </label>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Col Size
            <select value={colTemplate} onChange={(e) => setColTemplate(e.target.value)} className="rounded-lg border border-gray-200 px-2 py-1 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none">
              <option value="1fr">1fr</option>
              <option value="auto">auto</option>
              <option value="100px">100px</option>
              <option value="minmax(100px, 1fr)">minmax(100px, 1fr)</option>
            </select>
          </label>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Row Size
            <select value={rowTemplate} onChange={(e) => setRowTemplate(e.target.value)} className="rounded-lg border border-gray-200 px-2 py-1 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none">
              <option value="1fr">1fr</option>
              <option value="auto">auto</option>
              <option value="80px">80px</option>
              <option value="minmax(60px, 1fr)">minmax(60px, 1fr)</option>
            </select>
          </label>
          <button onClick={handleCopy} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? "Copied" : "Copy CSS"}
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <label className="text-sm font-medium text-gray-700 mb-3 block">Preview</label>
        <div
          className="rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4"
          style={{ display: "grid", gridTemplateColumns: gridTemplateCols, gridTemplateRows: gridTemplateRows, gap: `${gap}px` }}
        >
          {Array.from({ length: totalCells }, (_, i) => (
            <div
              key={i}
              className="rounded-lg flex items-center justify-center text-white text-sm font-medium min-h-[60px]"
              style={{ backgroundColor: colors[i % colors.length] }}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <label className="text-sm font-medium text-gray-700 mb-1.5 block">CSS Code</label>
        <pre className="rounded-lg bg-gray-50 p-3 font-mono text-sm text-gray-800 whitespace-pre-wrap">{css}</pre>
      </div>
    </div>
  );
}
