"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, ArrowLeftRight, Trash2 } from "lucide-react";

function jsonToToml(obj: any): string {
  if (typeof obj !== "object" || obj === null || Array.isArray(obj))
    throw new Error("Top-level value must be an object");

  const lines: string[] = [];

  function tomlValue(val: any): string {
    if (val === null) return '""';
    if (typeof val === "string") return `"${val.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
    if (typeof val === "number" || typeof val === "boolean") return String(val);
    if (Array.isArray(val)) return `[${val.map(tomlValue).join(", ")}]`;
    return `"${String(val)}"`;
  }

  function isTable(val: any): boolean {
    return typeof val === "object" && val !== null && !Array.isArray(val);
  }

  function isArrayOfTables(val: any): boolean {
    return Array.isArray(val) && val.length > 0 && val.every((v: any) => isTable(v));
  }

  function writeSection(obj: any, prefix: string) {
    const simpleKeys: string[] = [];
    const tableKeys: string[] = [];
    const arrayTableKeys: string[] = [];

    for (const key of Object.keys(obj)) {
      const val = obj[key];
      if (isArrayOfTables(val)) arrayTableKeys.push(key);
      else if (isTable(val)) tableKeys.push(key);
      else simpleKeys.push(key);
    }

    for (const key of simpleKeys) {
      lines.push(`${key} = ${tomlValue(obj[key])}`);
    }

    for (const key of tableKeys) {
      const path = prefix ? `${prefix}.${key}` : key;
      lines.push("");
      lines.push(`[${path}]`);
      writeSection(obj[key], path);
    }

    for (const key of arrayTableKeys) {
      const path = prefix ? `${prefix}.${key}` : key;
      for (const item of obj[key]) {
        lines.push("");
        lines.push(`[[${path}]]`);
        writeSection(item, path);
      }
    }
  }

  writeSection(obj, "");
  return lines.join("\n").trim();
}

export default function JsonToToml() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleConvert = () => {
    setError("");
    try {
      const parsed = JSON.parse(input);
      setOutput(jsonToToml(parsed));
    } catch (e: any) { setError(e.message); setOutput(""); }
  };

  const handleCopy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  const handleClear = () => { setInput(""); setOutput(""); setError(""); };
  const handleSwap = () => { setInput(output); setOutput(""); setError(""); };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={handleConvert} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100">Convert</button>
        <button onClick={handleCopy} disabled={!output} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? "Copied" : "Copy"}
        </button>
        <button onClick={handleSwap} disabled={!output} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50">
          <ArrowLeftRight className="h-4 w-4" /> Swap
        </button>
        <button onClick={handleClear} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
          <Trash2 className="h-4 w-4" /> Clear
        </button>
      </div>
      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">JSON Input</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full h-80 rounded-xl border border-gray-200 bg-white p-4 font-mono text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none resize-none" placeholder="Paste JSON here..." spellCheck={false} />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">TOML Output</label>
          <textarea value={output} readOnly className="w-full h-80 rounded-xl border border-gray-200 bg-gray-50 p-4 font-mono text-sm resize-none" placeholder="TOML output will appear here..." />
        </div>
      </div>
    </div>
  );
}
