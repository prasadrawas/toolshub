"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Plus, Trash2 } from "lucide-react";

interface FlexItem {
  id: number;
  grow: number;
  shrink: number;
  basis: string;
}

let nextId = 4;

export default function FlexboxPlayground() {
  const [direction, setDirection] = useState("row");
  const [justify, setJustify] = useState("flex-start");
  const [alignItems, setAlignItems] = useState("stretch");
  const [wrap, setWrap] = useState("nowrap");
  const [gap, setGap] = useState(8);
  const [items, setItems] = useState<FlexItem[]>([
    { id: 1, grow: 0, shrink: 1, basis: "auto" },
    { id: 2, grow: 0, shrink: 1, basis: "auto" },
    { id: 3, grow: 0, shrink: 1, basis: "auto" },
  ]);
  const [copied, setCopied] = useState(false);

  const containerCss = `display: flex;\nflex-direction: ${direction};\njustify-content: ${justify};\nalign-items: ${alignItems};\nflex-wrap: ${wrap};\ngap: ${gap}px;`;

  const handleCopy = () => {
    navigator.clipboard.writeText(containerCss);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const addItem = () => {
    setItems([...items, { id: nextId++, grow: 0, shrink: 1, basis: "auto" }]);
  };

  const removeItem = (id: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((it) => it.id !== id));
  };

  const updateItem = (id: number, field: keyof FlexItem, value: number | string) => {
    setItems(items.map((it) => (it.id === id ? { ...it, [field]: value } : it)));
  };

  const colors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4", "#f97316"];

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          {([
            ["Direction", direction, setDirection, ["row", "row-reverse", "column", "column-reverse"]],
            ["Justify", justify, setJustify, ["flex-start", "flex-end", "center", "space-between", "space-around", "space-evenly"]],
            ["Align Items", alignItems, setAlignItems, ["stretch", "flex-start", "flex-end", "center", "baseline"]],
            ["Wrap", wrap, setWrap, ["nowrap", "wrap", "wrap-reverse"]],
          ] as const).map(([label, val, setter, opts]) => (
            <label key={label} className="text-sm font-medium text-gray-700 flex items-center gap-2">
              {label}
              <select value={val} onChange={(e) => (setter as (v: string) => void)(e.target.value)} className="rounded-lg border border-gray-200 px-2 py-1 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none">
                {opts.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </label>
          ))}
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Gap
            <input type="range" min="0" max="40" value={gap} onChange={(e) => setGap(+e.target.value)} className="w-24" />
            <span className="text-xs font-mono text-gray-500">{gap}px</span>
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={addItem} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100">
            <Plus className="h-4 w-4" /> Add Item
          </button>
          <button onClick={handleCopy} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? "Copied" : "Copy CSS"}
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <label className="text-sm font-medium text-gray-700 mb-3 block">Preview</label>
        <div
          className="min-h-[200px] rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4"
          style={{ display: "flex", flexDirection: direction as any, justifyContent: justify, alignItems, flexWrap: wrap as any, gap: `${gap}px` }}
        >
          {items.map((item, i) => (
            <div
              key={item.id}
              className="rounded-lg px-4 py-3 text-white text-sm font-medium min-w-[60px] text-center"
              style={{ backgroundColor: colors[i % colors.length], flexGrow: item.grow, flexShrink: item.shrink, flexBasis: item.basis }}
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <label className="text-sm font-medium text-gray-700 mb-3 block">Item Properties</label>
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={item.id} className="flex items-center gap-3 rounded-lg border border-gray-100 px-3 py-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: colors[i % colors.length] }} />
              <span className="text-sm text-gray-700 w-16">Item {i + 1}</span>
              <label className="flex items-center gap-1 text-xs text-gray-600">
                grow
                <input type="number" min="0" max="10" value={item.grow} onChange={(e) => updateItem(item.id, "grow", +e.target.value)} className="w-14 rounded border border-gray-200 px-1.5 py-0.5 text-sm font-mono focus:border-brand-400 focus:outline-none" />
              </label>
              <label className="flex items-center gap-1 text-xs text-gray-600">
                shrink
                <input type="number" min="0" max="10" value={item.shrink} onChange={(e) => updateItem(item.id, "shrink", +e.target.value)} className="w-14 rounded border border-gray-200 px-1.5 py-0.5 text-sm font-mono focus:border-brand-400 focus:outline-none" />
              </label>
              <label className="flex items-center gap-1 text-xs text-gray-600">
                basis
                <input type="text" value={item.basis} onChange={(e) => updateItem(item.id, "basis", e.target.value)} className="w-20 rounded border border-gray-200 px-1.5 py-0.5 text-sm font-mono focus:border-brand-400 focus:outline-none" />
              </label>
              <button onClick={() => removeItem(item.id)} disabled={items.length <= 1} className="ml-auto rounded p-1 hover:bg-gray-100 disabled:opacity-30">
                <Trash2 className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <label className="text-sm font-medium text-gray-700 mb-1.5 block">CSS Code</label>
        <pre className="rounded-lg bg-gray-50 p-3 font-mono text-sm text-gray-800 whitespace-pre-wrap">{containerCss}</pre>
      </div>
    </div>
  );
}
