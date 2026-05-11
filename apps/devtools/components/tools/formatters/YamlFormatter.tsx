"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Trash2, Wand2, ArrowRightLeft } from "lucide-react";

function jsonToYaml(obj: any, indent: number = 0): string {
  const prefix = "  ".repeat(indent);
  const lines: string[] = [];

  if (Array.isArray(obj)) {
    for (const item of obj) {
      if (typeof item === "object" && item !== null) {
        lines.push(`${prefix}-`);
        const nested = jsonToYaml(item, indent + 1);
        lines.push(nested);
      } else {
        lines.push(`${prefix}- ${formatYamlValue(item)}`);
      }
    }
  } else if (typeof obj === "object" && obj !== null) {
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === "object" && value !== null) {
        lines.push(`${prefix}${key}:`);
        lines.push(jsonToYaml(value, indent + 1));
      } else {
        lines.push(`${prefix}${key}: ${formatYamlValue(value)}`);
      }
    }
  } else {
    lines.push(`${prefix}${formatYamlValue(obj)}`);
  }

  return lines.join("\n");
}

function formatYamlValue(value: any): string {
  if (value === null || value === undefined) return "null";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") return String(value);
  if (typeof value === "string") {
    if (
      value.includes(":") ||
      value.includes("#") ||
      value.includes("'") ||
      value.includes('"') ||
      value.startsWith(" ") ||
      value.endsWith(" ") ||
      value === ""
    ) {
      return `"${value.replace(/"/g, '\\"')}"`;
    }
    return value;
  }
  return String(value);
}

function yamlToJson(yaml: string): string {
  // Simple YAML-like parser for basic structures
  const lines = yaml.split("\n").filter((l) => l.trim() && !l.trim().startsWith("#"));
  const result: Record<string, any> = {};
  let currentKey = "";

  for (const line of lines) {
    const match = line.match(/^(\s*)([^:]+):\s*(.*)/);
    if (match) {
      const key = match[2].trim();
      const value = match[3].trim();
      if (value) {
        let parsed: any = value;
        if (value === "true") parsed = true;
        else if (value === "false") parsed = false;
        else if (value === "null") parsed = null;
        else if (!isNaN(Number(value)) && value !== "") parsed = Number(value);
        else if (value.startsWith('"') && value.endsWith('"'))
          parsed = value.slice(1, -1);
        result[key] = parsed;
      } else {
        result[key] = {};
        currentKey = key;
      }
    }
  }

  return JSON.stringify(result, null, 2);
}

export default function YamlFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState<"json-to-yaml" | "yaml-to-json">("json-to-yaml");

  const handleFormat = () => {
    setError("");
    try {
      if (!input.trim()) return;
      if (mode === "json-to-yaml") {
        const parsed = JSON.parse(input);
        setOutput(jsonToYaml(parsed));
      } else {
        setOutput(yamlToJson(input));
      }
    } catch (e: any) {
      setError(e.message);
      setOutput("");
    }
  };

  const handleSwap = () => {
    setMode((m) => (m === "json-to-yaml" ? "yaml-to-json" : "json-to-yaml"));
    setInput(output);
    setOutput("");
    setError("");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={handleFormat}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors bg-brand-50 text-brand-700 hover:bg-brand-100"
        >
          <Wand2 className="h-4 w-4" />
          {mode === "json-to-yaml" ? "JSON to YAML" : "YAML to JSON"}
        </button>
        <button
          onClick={handleSwap}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors bg-brand-50 text-brand-700 hover:bg-brand-100"
        >
          <ArrowRightLeft className="h-4 w-4" />
          Swap
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

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">
            {mode === "json-to-yaml" ? "JSON Input" : "YAML Input"}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-80 rounded-xl border border-gray-200 bg-white p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-300 resize-none"
            placeholder={
              mode === "json-to-yaml"
                ? 'Paste your JSON here...'
                : "Paste your YAML here..."
            }
            spellCheck={false}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">
            {mode === "json-to-yaml" ? "YAML Output" : "JSON Output"}
          </label>
          <textarea
            value={output}
            readOnly
            className="w-full h-80 rounded-xl border border-gray-200 bg-gray-50 p-4 font-mono text-sm resize-none"
            placeholder="Output will appear here..."
          />
        </div>
      </div>
    </div>
  );
}
