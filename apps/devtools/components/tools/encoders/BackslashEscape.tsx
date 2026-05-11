"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, ArrowLeftRight, Trash2, Lock, Unlock } from "lucide-react";

const ESCAPE_MAP: Record<string, string> = {
  "\n": "\\n",
  "\r": "\\r",
  "\t": "\\t",
  "\\": "\\\\",
  '"': '\\"',
  "'": "\\'",
  "\0": "\\0",
  "\b": "\\b",
  "\f": "\\f",
  "\v": "\\v",
};

const UNESCAPE_MAP: Record<string, string> = {
  "\\n": "\n",
  "\\r": "\r",
  "\\t": "\t",
  "\\\\": "\\",
  '\\"': '"',
  "\\'": "'",
  "\\0": "\0",
  "\\b": "\b",
  "\\f": "\f",
  "\\v": "\v",
};

function escapeBackslash(text: string): string {
  return text.replace(/[\n\r\t\\\"\'\0\b\f\v]/g, (ch) => ESCAPE_MAP[ch] || ch);
}

function unescapeBackslash(text: string): string {
  return text.replace(/\\[nrt\\\"\'\0bfv]/g, (seq) => UNESCAPE_MAP[seq] || seq);
}

export default function BackslashEscape() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleEscape = () => {
    setError("");
    setOutput(escapeBackslash(input));
  };

  const handleUnescape = () => {
    setError("");
    try {
      setOutput(unescapeBackslash(input));
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
          <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full h-80 rounded-xl border border-gray-200 bg-white p-4 font-mono text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none resize-none" placeholder="Enter text with backslash sequences (\n, \t, \\, etc.)..." spellCheck={false} />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Output</label>
          <textarea value={output} readOnly className="w-full h-80 rounded-xl border border-gray-200 bg-gray-50 p-4 font-mono text-sm resize-none" placeholder="Result will appear here..." />
        </div>
      </div>
    </div>
  );
}
