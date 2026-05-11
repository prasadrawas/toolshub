"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, RefreshCw, Trash2 } from "lucide-react";

export default function UuidGenerator() {
  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [hyphens, setHyphens] = useState(true);
  const [uuids, setUuids] = useState<string[]>([]);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generate = () => {
    const results: string[] = [];
    for (let i = 0; i < count; i++) {
      let uuid = crypto.randomUUID();
      if (!hyphens) uuid = uuid.replace(/-/g, "");
      if (uppercase) uuid = uuid.toUpperCase();
      results.push(uuid);
    }
    setUuids(results);
  };

  const copyOne = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(uuids.join("\n"));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Count
            <input
              type="number"
              min={1}
              max={50}
              value={count}
              onChange={(e) => setCount(Math.min(50, Math.max(1, Number(e.target.value))))}
              className="w-20 rounded-lg border border-gray-200 px-2 py-1 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
            />
          </label>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="rounded border-gray-300"
            />
            Uppercase
          </label>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <input
              type="checkbox"
              checked={hyphens}
              onChange={(e) => setHyphens(e.target.checked)}
              className="rounded border-gray-300"
            />
            Hyphens
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={generate}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100"
          >
            <RefreshCw className="h-4 w-4" /> Generate
          </button>
          <button
            onClick={copyAll}
            disabled={uuids.length === 0}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
          >
            {copiedAll ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copiedAll ? "Copied" : "Copy All"}
          </button>
          <button
            onClick={() => setUuids([])}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            <Trash2 className="h-4 w-4" /> Clear
          </button>
        </div>
      </div>

      {uuids.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Generated UUIDs ({uuids.length})</label>
          <div className="space-y-1">
            {uuids.map((uuid, i) => (
              <div key={i} className="flex items-center gap-2 group">
                <code className="flex-1 text-sm font-mono text-gray-800 bg-gray-50 rounded-lg px-3 py-1.5">{uuid}</code>
                <button
                  onClick={() => copyOne(uuid, i)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
                >
                  {copiedIndex === i ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
