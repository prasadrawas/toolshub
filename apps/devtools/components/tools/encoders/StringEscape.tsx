"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, ArrowLeftRight, Trash2, Lock, Unlock } from "lucide-react";

type EscapeContext = "json" | "html" | "regex" | "sql";

function escapeForJson(str: string): string {
  return JSON.stringify(str).slice(1, -1);
}

function unescapeFromJson(str: string): string {
  try {
    return JSON.parse(`"${str}"`);
  } catch {
    throw new Error("Invalid JSON-escaped string.");
  }
}

function escapeForHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function unescapeFromHtml(str: string): string {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = str;
  return textarea.value;
}

function escapeForRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function unescapeFromRegex(str: string): string {
  return str.replace(/\\([.*+?^${}()|[\]\\])/g, "$1");
}

function escapeForSql(str: string): string {
  return str.replace(/'/g, "''").replace(/\\/g, "\\\\");
}

function unescapeFromSql(str: string): string {
  return str.replace(/''/g, "'").replace(/\\\\/g, "\\");
}

const ESCAPERS: Record<EscapeContext, { escape: (s: string) => string; unescape: (s: string) => string }> = {
  json: { escape: escapeForJson, unescape: unescapeFromJson },
  html: { escape: escapeForHtml, unescape: unescapeFromHtml },
  regex: { escape: escapeForRegex, unescape: unescapeFromRegex },
  sql: { escape: escapeForSql, unescape: unescapeFromSql },
};

const CONTEXT_LABELS: Record<EscapeContext, string> = {
  json: "JSON",
  html: "HTML",
  regex: "Regex",
  sql: "SQL",
};

export default function StringEscape() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [context, setContext] = useState<EscapeContext>("json");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleEscape = () => {
    setError("");
    try {
      setOutput(ESCAPERS[context].escape(input));
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleUnescape = () => {
    setError("");
    try {
      setOutput(ESCAPERS[context].unescape(input));
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleClear = () => { setInput(""); setOutput(""); setError(""); };
  const handleSwap = () => { setInput(output); setOutput(""); setError(""); };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={context}
          onChange={(e) => { setContext(e.target.value as EscapeContext); setOutput(""); setError(""); }}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium bg-white text-gray-700 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
        >
          {(Object.keys(CONTEXT_LABELS) as EscapeContext[]).map((ctx) => (
            <option key={ctx} value={ctx}>{CONTEXT_LABELS[ctx]}</option>
          ))}
        </select>
        <button onClick={handleEscape} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100">
          <Lock className="h-4 w-4" /> Escape
        </button>
        <button onClick={handleUnescape} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100">
          <Unlock className="h-4 w-4" /> Unescape
        </button>
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
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Input</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full h-80 rounded-xl border border-gray-200 bg-white p-4 font-mono text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none resize-none" placeholder={`Enter string to escape/unescape for ${CONTEXT_LABELS[context]}...`} spellCheck={false} />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Output ({CONTEXT_LABELS[context]})</label>
          <textarea value={output} readOnly className="w-full h-80 rounded-xl border border-gray-200 bg-gray-50 p-4 font-mono text-sm resize-none" placeholder="Result will appear here..." />
        </div>
      </div>
    </div>
  );
}
