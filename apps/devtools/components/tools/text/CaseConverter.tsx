"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Trash2, CaseSensitive } from "lucide-react";

function toTitleCase(s: string) {
  return s.replace(/\w\S*/g, (t) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());
}

function toSentenceCase(s: string) {
  return s.replace(/(^\s*|[.!?]\s+)(\w)/g, (_, p, c) => p + c.toUpperCase()).replace(/^(\w)/, (_, c) => c.toUpperCase());
}

function toCamelCase(s: string) {
  return s
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase())
    .replace(/^[A-Z]/, (c) => c.toLowerCase());
}

function toPascalCase(s: string) {
  const camel = toCamelCase(s);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

function toSnakeCase(s: string) {
  return s
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .toLowerCase();
}

function toKebabCase(s: string) {
  return s
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function toConstantCase(s: string) {
  return toSnakeCase(s).toUpperCase();
}

function toDotCase(s: string) {
  return toSnakeCase(s).replace(/_/g, ".");
}

const converters = [
  { label: "UPPERCASE", fn: (s: string) => s.toUpperCase() },
  { label: "lowercase", fn: (s: string) => s.toLowerCase() },
  { label: "Title Case", fn: toTitleCase },
  { label: "Sentence case", fn: toSentenceCase },
  { label: "camelCase", fn: toCamelCase },
  { label: "PascalCase", fn: toPascalCase },
  { label: "snake_case", fn: toSnakeCase },
  { label: "kebab-case", fn: toKebabCase },
  { label: "CONSTANT_CASE", fn: toConstantCase },
  { label: "dot.case", fn: toDotCase },
];

export default function CaseConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [active, setActive] = useState("");

  const handleConvert = (label: string, fn: (s: string) => string) => {
    setOutput(fn(input));
    setActive(label);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {converters.map((c) => (
          <button
            key={c.label}
            onClick={() => handleConvert(c.label, c.fn)}
            disabled={!input}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium disabled:opacity-50",
              active === c.label
                ? "bg-brand-100 text-brand-800"
                : "bg-brand-50 text-brand-700 hover:bg-brand-100"
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={handleCopy}
          disabled={!output}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy"}
        </button>
        <button
          onClick={() => { setInput(""); setOutput(""); setActive(""); }}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
        >
          <Trash2 className="h-4 w-4" /> Clear
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-64 rounded-xl border border-gray-200 bg-white p-4 font-mono text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none resize-none"
            placeholder="Enter text to convert..."
            spellCheck={false}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Output</label>
          <textarea
            value={output}
            readOnly
            className="w-full h-64 rounded-xl border border-gray-200 bg-gray-50 p-4 font-mono text-sm resize-none"
            placeholder="Converted text will appear here..."
          />
        </div>
      </div>
    </div>
  );
}
