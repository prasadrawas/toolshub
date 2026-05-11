"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Trash2, Scissors } from "lucide-react";

function truncate(text: string, maxLength: number, position: "end" | "middle" | "start", suffix: string): string {
  if (text.length <= maxLength) return text;
  const suffixLen = suffix.length;
  if (maxLength <= suffixLen) return suffix.slice(0, maxLength);

  if (position === "end") {
    return text.slice(0, maxLength - suffixLen) + suffix;
  } else if (position === "start") {
    return suffix + text.slice(text.length - (maxLength - suffixLen));
  } else {
    const available = maxLength - suffixLen;
    const frontLen = Math.ceil(available / 2);
    const backLen = Math.floor(available / 2);
    return text.slice(0, frontLen) + suffix + text.slice(text.length - backLen);
  }
}

export default function TextTruncator() {
  const [input, setInput] = useState("");
  const [maxLength, setMaxLength] = useState(50);
  const [position, setPosition] = useState<"end" | "middle" | "start">("end");
  const [suffixType, setSuffixType] = useState<"dots3" | "ellipsis" | "custom">("dots3");
  const [customSuffix, setCustomSuffix] = useState("");
  const [copied, setCopied] = useState(false);

  const suffix = suffixType === "dots3" ? "..." : suffixType === "ellipsis" ? "\u2026" : customSuffix;
  const output = truncate(input, maxLength, position, suffix);

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
            Max length
            <input
              type="number"
              min={1}
              max={10000}
              value={maxLength}
              onChange={(e) => setMaxLength(Number(e.target.value))}
              className="w-24 rounded-lg border border-gray-200 px-2 py-1 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
            />
          </label>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Position
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value as any)}
              className="rounded-lg border border-gray-200 px-2 py-1 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
            >
              <option value="end">End</option>
              <option value="middle">Middle</option>
              <option value="start">Start</option>
            </select>
          </label>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Suffix
            <select
              value={suffixType}
              onChange={(e) => setSuffixType(e.target.value as any)}
              className="rounded-lg border border-gray-200 px-2 py-1 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
            >
              <option value="dots3">... (three dots)</option>
              <option value="ellipsis">... (ellipsis char)</option>
              <option value="custom">Custom</option>
            </select>
          </label>
          {suffixType === "custom" && (
            <input
              value={customSuffix}
              onChange={(e) => setCustomSuffix(e.target.value)}
              className="w-24 rounded-lg border border-gray-200 px-2 py-1 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
              placeholder="Suffix..."
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
        {input && (
          <span className="text-sm text-gray-500">
            {input.length} &rarr; {output.length} chars
          </span>
        )}
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1.5 block">Input</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-32 rounded-xl border border-gray-200 bg-white p-4 font-mono text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none resize-none"
          placeholder="Enter text to truncate..."
          spellCheck={false}
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1.5 block">Truncated Output</label>
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 font-mono text-sm text-gray-800 min-h-[2.5rem] break-all whitespace-pre-wrap">
          {output || <span className="text-gray-400">Output will appear here...</span>}
        </div>
      </div>
    </div>
  );
}
