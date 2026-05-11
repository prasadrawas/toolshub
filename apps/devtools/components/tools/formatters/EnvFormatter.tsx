"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Trash2, Wand2, ArrowDownAZ } from "lucide-react";

function formatEnv(input: string): string {
  const lines = input.split("\n");
  const entries: { key: string; value: string; prefix: string }[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    // Skip empty lines and comments
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;

    const key = trimmed.substring(0, eqIdx).trim();
    const value = trimmed.substring(eqIdx + 1).trim();
    const underscoreIdx = key.indexOf("_");
    const prefix = underscoreIdx > 0 ? key.substring(0, underscoreIdx) : key;

    entries.push({ key, value, prefix });
  }

  // Sort alphabetically
  entries.sort((a, b) => a.key.localeCompare(b.key));

  // Group by prefix
  const groups: Map<string, typeof entries> = new Map();
  for (const entry of entries) {
    const group = groups.get(entry.prefix) || [];
    group.push(entry);
    groups.set(entry.prefix, group);
  }

  // Find max key length for alignment
  const maxKeyLen = Math.max(...entries.map((e) => e.key.length), 0);

  const formatted: string[] = [];
  let first = true;
  for (const [prefix, group] of Array.from(groups)) {
    if (!first) formatted.push("");
    formatted.push(`# ${prefix}`);
    for (const entry of group) {
      formatted.push(`${entry.key.padEnd(maxKeyLen)} = ${entry.value}`);
    }
    first = false;
  }

  return formatted.join("\n");
}

function compactEnv(input: string): string {
  const lines = input.split("\n");
  const entries: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;

    const key = trimmed.substring(0, eqIdx).trim();
    const value = trimmed.substring(eqIdx + 1).trim();
    entries.push(`${key}=${value}`);
  }

  entries.sort((a, b) => a.localeCompare(b));
  return entries.join("\n");
}

export default function EnvFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    if (!input.trim()) return;
    setOutput(formatEnv(input));
  };

  const handleMinify = () => {
    if (!input.trim()) return;
    setOutput(compactEnv(input));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={handleFormat}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors bg-brand-50 text-brand-700 hover:bg-brand-100"
        >
          <Wand2 className="h-4 w-4" />
          Format & Group
        </button>
        <button
          onClick={handleMinify}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors bg-brand-50 text-brand-700 hover:bg-brand-100"
        >
          <ArrowDownAZ className="h-4 w-4" />
          Sort & Compact
        </button>
        <button
          onClick={handleCopy}
          disabled={!output}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy"}
        </button>
        <button
          onClick={handleClear}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors bg-gray-100 text-gray-600 hover:bg-gray-200"
        >
          <Trash2 className="h-4 w-4" />
          Clear
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-80 rounded-xl border border-gray-200 bg-white p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-300 resize-none"
            placeholder="Paste your .env file here..."
            spellCheck={false}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Output</label>
          <textarea
            value={output}
            readOnly
            className="w-full h-80 rounded-xl border border-gray-200 bg-gray-50 p-4 font-mono text-sm resize-none"
            placeholder="Formatted output will appear here..."
          />
        </div>
      </div>
    </div>
  );
}
