"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Trash2 } from "lucide-react";

function jsonToJsonSchema(json: any): any {
  if (json === null) return { type: "null" };
  if (typeof json === "string") return { type: "string" };
  if (typeof json === "number") return Number.isInteger(json) ? { type: "integer" } : { type: "number" };
  if (typeof json === "boolean") return { type: "boolean" };

  if (Array.isArray(json)) {
    if (json.length === 0) return { type: "array", items: {} };
    return { type: "array", items: jsonToJsonSchema(json[0]) };
  }

  if (typeof json === "object") {
    const properties: any = {};
    const required: string[] = [];
    for (const [key, value] of Object.entries(json)) {
      properties[key] = jsonToJsonSchema(value);
      if (value !== null) required.push(key);
    }
    const schema: any = { type: "object", properties };
    if (required.length > 0) schema.required = required;
    return schema;
  }

  return {};
}

function generateJsonSchema(json: any): string {
  const schema = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    ...jsonToJsonSchema(json),
  };
  return JSON.stringify(schema, null, 2);
}

export default function JsonToJsonSchema() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleConvert = () => {
    setError("");
    try {
      const parsed = JSON.parse(input);
      setOutput(generateJsonSchema(parsed));
    } catch (e: any) { setError(e.message); setOutput(""); }
  };

  const handleCopy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  const handleClear = () => { setInput(""); setOutput(""); setError(""); };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={handleConvert} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100">Convert</button>
        <button onClick={handleCopy} disabled={!output} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? "Copied" : "Copy"}
        </button>
        <button onClick={handleClear} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
          <Trash2 className="h-4 w-4" /> Clear
        </button>
      </div>
      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">JSON Input</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full h-80 rounded-xl border border-gray-200 bg-white p-4 font-mono text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none resize-none" placeholder="Paste a JSON example..." spellCheck={false} />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">JSON Schema Output</label>
          <textarea value={output} readOnly className="w-full h-80 rounded-xl border border-gray-200 bg-gray-50 p-4 font-mono text-sm resize-none" placeholder="JSON Schema will appear here..." />
        </div>
      </div>
    </div>
  );
}
