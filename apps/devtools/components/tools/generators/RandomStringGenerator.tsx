"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, RefreshCw, Trash2 } from "lucide-react";

const CHARSETS: Record<string, string> = {
  alphanumeric: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
  alpha: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  numeric: "0123456789",
  hex: "0123456789abcdef",
  custom: "",
};

function randomString(length: number, charset: string): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  let result = "";
  for (let i = 0; i < length; i++) {
    result += charset[bytes[i] % charset.length];
  }
  return result;
}

export default function RandomStringGenerator() {
  const [length, setLength] = useState(32);
  const [charsetType, setCharsetType] = useState("alphanumeric");
  const [customChars, setCustomChars] = useState("ABCDEFabcdef0123456789!@#");
  const [count, setCount] = useState(5);
  const [strings, setStrings] = useState<string[]>([]);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generate = () => {
    const chars = charsetType === "custom" ? customChars : CHARSETS[charsetType];
    if (!chars) return;
    const results: string[] = [];
    for (let i = 0; i < count; i++) {
      results.push(randomString(length, chars));
    }
    setStrings(results);
  };

  const copyOne = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(strings.join("\n"));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Length
            <input
              type="number"
              min={1}
              max={256}
              value={length}
              onChange={(e) => setLength(Math.min(256, Math.max(1, Number(e.target.value))))}
              className="w-20 rounded-lg border border-gray-200 px-2 py-1 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
            />
          </label>
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
            Charset
            <select
              value={charsetType}
              onChange={(e) => setCharsetType(e.target.value)}
              className="rounded-lg border border-gray-200 px-2 py-1 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
            >
              <option value="alphanumeric">Alphanumeric</option>
              <option value="alpha">Alpha only</option>
              <option value="numeric">Numeric only</option>
              <option value="hex">Hexadecimal</option>
              <option value="custom">Custom</option>
            </select>
          </label>
        </div>
        {charsetType === "custom" && (
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Custom Characters</label>
            <input
              type="text"
              value={customChars}
              onChange={(e) => setCustomChars(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
            />
          </div>
        )}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={generate}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100"
          >
            <RefreshCw className="h-4 w-4" /> Generate
          </button>
          <button
            onClick={copyAll}
            disabled={strings.length === 0}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
          >
            {copiedAll ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copiedAll ? "Copied" : "Copy All"}
          </button>
          <button
            onClick={() => setStrings([])}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            <Trash2 className="h-4 w-4" /> Clear
          </button>
        </div>
      </div>

      {strings.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Generated Strings ({strings.length})</label>
          <div className="space-y-1">
            {strings.map((str, i) => (
              <div key={i} className="flex items-center gap-2 group">
                <code className="flex-1 text-sm font-mono text-gray-800 bg-gray-50 rounded-lg px-3 py-1.5 break-all">{str}</code>
                <button
                  onClick={() => copyOne(str, i)}
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
