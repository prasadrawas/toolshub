"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Trash2 } from "lucide-react";

function jsonToGraphql(json: any, typeName = "Root"): string {
  const types: string[] = [];

  function capitalize(s: string): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
  }

  function gqlType(value: any, key: string): string {
    if (value === null) return "String";
    if (typeof value === "string") return "String";
    if (typeof value === "number") return Number.isInteger(value) ? "Int" : "Float";
    if (typeof value === "boolean") return "Boolean";
    if (Array.isArray(value)) {
      if (value.length === 0) return "[String]";
      return `[${gqlType(value[0], key)}]`;
    }
    if (typeof value === "object") {
      const name = capitalize(key);
      generateType(value, name);
      return name;
    }
    return "String";
  }

  function generateType(obj: any, name: string) {
    const fields: string[] = [];
    for (const [key, value] of Object.entries(obj)) {
      const type = gqlType(value, key);
      const required = value !== null ? "!" : "";
      fields.push(`  ${key}: ${type}${required}`);
    }
    types.push(`type ${name} {\n${fields.join("\n")}\n}`);
  }

  if (Array.isArray(json)) {
    if (json.length > 0 && typeof json[0] === "object" && json[0] !== null) {
      generateType(json[0], typeName);
      return `# Type: [${typeName}]\n\n${types.reverse().join("\n\n")}`;
    }
    return `# Array of scalars`;
  }

  if (typeof json === "object" && json !== null) {
    generateType(json, typeName);
    return types.reverse().join("\n\n");
  }

  return `# Scalar type: ${typeof json}`;
}

export default function JsonToGraphql() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [typeName, setTypeName] = useState("Root");

  const handleConvert = () => {
    setError("");
    try {
      const parsed = JSON.parse(input);
      setOutput(jsonToGraphql(parsed, typeName || "Root"));
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
        <div className="ml-auto flex items-center gap-2">
          <label className="text-sm text-gray-500">Type name:</label>
          <input value={typeName} onChange={(e) => setTypeName(e.target.value)} className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-sm w-24" />
        </div>
      </div>
      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">JSON Input</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full h-80 rounded-xl border border-gray-200 bg-white p-4 font-mono text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none resize-none" placeholder="Paste JSON here..." spellCheck={false} />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">GraphQL Output</label>
          <textarea value={output} readOnly className="w-full h-80 rounded-xl border border-gray-200 bg-gray-50 p-4 font-mono text-sm resize-none" placeholder="GraphQL type will appear here..." />
        </div>
      </div>
    </div>
  );
}
