"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, ArrowLeftRight, Trash2 } from "lucide-react";

function tomlToJson(toml: string): any {
  const result: any = {};
  let currentSection = result;
  let currentPath: string[] = [];

  const lines = toml.split("\n");

  function parseValue(val: string): any {
    const trimmed = val.trim();
    if (trimmed === "true") return true;
    if (trimmed === "false") return false;
    if (/^-?\d+$/.test(trimmed)) return parseInt(trimmed, 10);
    if (/^-?\d+\.\d+$/.test(trimmed)) return parseFloat(trimmed);
    if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'")))
      return trimmed.slice(1, -1);
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      const inner = trimmed.slice(1, -1).trim();
      if (inner === "") return [];
      return inner.split(",").map((v) => parseValue(v.trim()));
    }
    return trimmed;
  }

  function setNested(obj: any, path: string[], key: string, value: any) {
    let current = obj;
    for (const p of path) {
      if (Array.isArray(current[p])) {
        current = current[p][current[p].length - 1];
      } else {
        if (!current[p]) current[p] = {};
        current = current[p];
      }
    }
    current[key] = value;
  }

  function getOrCreateSection(obj: any, path: string[]): any {
    let current = obj;
    for (const p of path) {
      if (Array.isArray(current[p])) {
        current = current[p][current[p].length - 1];
      } else {
        if (!current[p]) current[p] = {};
        current = current[p];
      }
    }
    return current;
  }

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === "" || trimmed.startsWith("#")) continue;

    const arrayTableMatch = trimmed.match(/^\[\[(.+)\]\]$/);
    if (arrayTableMatch) {
      const path = arrayTableMatch[1].split(".").map((s) => s.trim());
      currentPath = path;
      let parent = result;
      for (let i = 0; i < path.length - 1; i++) {
        if (!parent[path[i]]) parent[path[i]] = {};
        if (Array.isArray(parent[path[i]])) {
          parent = parent[path[i]][parent[path[i]].length - 1];
        } else {
          parent = parent[path[i]];
        }
      }
      const lastKey = path[path.length - 1];
      if (!parent[lastKey]) parent[lastKey] = [];
      parent[lastKey].push({});
      currentSection = parent[lastKey][parent[lastKey].length - 1];
      continue;
    }

    const tableMatch = trimmed.match(/^\[(.+)\]$/);
    if (tableMatch) {
      const path = tableMatch[1].split(".").map((s) => s.trim());
      currentPath = path;
      currentSection = getOrCreateSection(result, path);
      continue;
    }

    const kvMatch = trimmed.match(/^([^=]+)=(.+)$/);
    if (kvMatch) {
      const key = kvMatch[1].trim();
      const value = parseValue(kvMatch[2]);
      currentSection[key] = value;
    }
  }

  return result;
}

export default function TomlToJson() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleConvert = () => {
    setError("");
    try {
      const result = tomlToJson(input);
      setOutput(JSON.stringify(result, null, 2));
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
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">TOML Input</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full h-80 rounded-xl border border-gray-200 bg-white p-4 font-mono text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none resize-none" placeholder="Paste TOML here..." spellCheck={false} />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">JSON Output</label>
          <textarea value={output} readOnly className="w-full h-80 rounded-xl border border-gray-200 bg-gray-50 p-4 font-mono text-sm resize-none" placeholder="JSON output will appear here..." />
        </div>
      </div>
    </div>
  );
}
