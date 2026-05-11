"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, RefreshCw, Trash2, Key } from "lucide-react";

function generateToken(length: number, format: string, prefix: string): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);

  let token = "";
  switch (format) {
    case "hex":
      token = Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")
        .slice(0, length);
      break;
    case "base64": {
      const binary = Array.from(bytes)
        .map((b) => String.fromCharCode(b))
        .join("");
      token = btoa(binary)
        .replace(/[+/=]/g, "")
        .slice(0, length);
      break;
    }
    case "alphanumeric": {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      token = Array.from(bytes)
        .map((b) => chars[b % chars.length])
        .join("")
        .slice(0, length);
      break;
    }
  }

  return prefix + token;
}

export default function TokenGenerator() {
  const [length, setLength] = useState(32);
  const [format, setFormat] = useState("hex");
  const [prefix, setPrefix] = useState("");
  const [count, setCount] = useState(5);
  const [tokens, setTokens] = useState<string[]>([]);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generate = () => {
    const results: string[] = [];
    for (let i = 0; i < count; i++) {
      results.push(generateToken(length, format, prefix));
    }
    setTokens(results);
  };

  const copyOne = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(tokens.join("\n"));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1500);
  };

  const prefixPresets = ["", "sk_", "pk_", "sk_live_", "sk_test_", "api_", "tok_", "key_"];

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Length
            <input
              type="number"
              min={8}
              max={128}
              value={length}
              onChange={(e) => setLength(Math.min(128, Math.max(8, Number(e.target.value))))}
              className="w-20 rounded-lg border border-gray-200 px-2 py-1 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
            />
          </label>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Format
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="rounded-lg border border-gray-200 px-2 py-1 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
            >
              <option value="hex">Hexadecimal</option>
              <option value="base64">Base64 (URL-safe)</option>
              <option value="alphanumeric">Alphanumeric</option>
            </select>
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
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Prefix</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
              placeholder="Optional prefix (e.g. sk_)"
            />
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {prefixPresets.map((p) => (
              <button
                key={p}
                onClick={() => setPrefix(p)}
                className={cn(
                  "rounded-lg px-2 py-1 text-xs font-mono transition-colors",
                  prefix === p
                    ? "bg-brand-50 text-brand-700 ring-1 ring-brand-200"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                )}
              >
                {p || "(none)"}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={generate}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100"
          >
            <Key className="h-4 w-4" /> Generate Tokens
          </button>
          <button
            onClick={copyAll}
            disabled={tokens.length === 0}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
          >
            {copiedAll ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copiedAll ? "Copied" : "Copy All"}
          </button>
          <button
            onClick={() => setTokens([])}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            <Trash2 className="h-4 w-4" /> Clear
          </button>
        </div>
      </div>

      {tokens.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Generated Tokens ({tokens.length})</label>
          <div className="space-y-1">
            {tokens.map((token, i) => (
              <div key={i} className="flex items-center gap-2 group">
                <code className="flex-1 text-sm font-mono text-gray-800 bg-gray-50 rounded-lg px-3 py-1.5 break-all">{token}</code>
                <button
                  onClick={() => copyOne(token, i)}
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
