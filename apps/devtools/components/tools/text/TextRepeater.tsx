"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Trash2, Repeat } from "lucide-react";

export default function TextRepeater() {
  const [input, setInput] = useState("");
  const [count, setCount] = useState(3);
  const [separatorType, setSeparatorType] = useState<"newline" | "space" | "comma" | "custom">("newline");
  const [customSeparator, setCustomSeparator] = useState("");
  const [copied, setCopied] = useState(false);

  const separator =
    separatorType === "newline" ? "\n" :
    separatorType === "space" ? " " :
    separatorType === "comma" ? ", " :
    customSeparator;

  const output = input ? Array(Math.min(Math.max(count, 1), 1000)).fill(input).join(separator) : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-4">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Count
            <input
              type="number"
              min={1}
              max={1000}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="w-20 rounded-lg border border-gray-200 px-2 py-1 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
            />
          </label>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Separator
            <select
              value={separatorType}
              onChange={(e) => setSeparatorType(e.target.value as any)}
              className="rounded-lg border border-gray-200 px-2 py-1 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
            >
              <option value="newline">Newline</option>
              <option value="space">Space</option>
              <option value="comma">Comma</option>
              <option value="custom">Custom</option>
            </select>
          </label>
          {separatorType === "custom" && (
            <input
              value={customSeparator}
              onChange={(e) => setCustomSeparator(e.target.value)}
              className="w-32 rounded-lg border border-gray-200 px-2 py-1 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
              placeholder="Separator..."
            />
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button onClick={handleCopy} disabled={!output} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy"}
        </button>
        <button onClick={() => setInput("")} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
          <Trash2 className="h-4 w-4" /> Clear
        </button>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1.5 block">Input Text</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-24 rounded-xl border border-gray-200 bg-white p-4 font-mono text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none resize-none"
          placeholder="Enter text to repeat..."
          spellCheck={false}
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1.5 block">Output ({output.length} chars)</label>
        <textarea
          value={output}
          readOnly
          className="w-full h-48 rounded-xl border border-gray-200 bg-gray-50 p-4 font-mono text-sm resize-none"
          placeholder="Repeated text will appear here..."
        />
      </div>
    </div>
  );
}
