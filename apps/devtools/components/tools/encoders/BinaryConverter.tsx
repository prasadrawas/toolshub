"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, ArrowLeftRight, Trash2, Lock, Unlock } from "lucide-react";

function textToBinary(text: string): string {
  return Array.from(text)
    .map((ch) => ch.charCodeAt(0).toString(2).padStart(8, "0"))
    .join(" ");
}

function binaryToText(bin: string): string {
  const cleaned = bin.replace(/[^01]/g, "");
  if (cleaned.length % 8 !== 0) throw new Error("Binary string length must be a multiple of 8.");
  const chars: string[] = [];
  for (let i = 0; i < cleaned.length; i += 8) {
    chars.push(String.fromCharCode(parseInt(cleaned.substring(i, i + 8), 2)));
  }
  return chars.join("");
}

function numberToBinary(num: string): string {
  const n = parseInt(num, 10);
  if (isNaN(n)) throw new Error("Invalid number.");
  return (n >>> 0).toString(2);
}

function binaryToNumber(bin: string): string {
  const cleaned = bin.replace(/[^01]/g, "");
  if (!cleaned) throw new Error("No binary digits found.");
  return parseInt(cleaned, 2).toString(10);
}

export default function BinaryConverter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"text" | "number">("text");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleEncode = () => {
    setError("");
    try {
      setOutput(mode === "text" ? textToBinary(input) : numberToBinary(input));
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleDecode = () => {
    setError("");
    try {
      setOutput(mode === "text" ? binaryToText(input) : binaryToNumber(input));
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
          value={mode}
          onChange={(e) => { setMode(e.target.value as "text" | "number"); setOutput(""); setError(""); }}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium bg-white text-gray-700 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
        >
          <option value="text">Text Mode</option>
          <option value="number">Number Mode</option>
        </select>
        <button onClick={handleEncode} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100">
          <Lock className="h-4 w-4" /> To Binary
        </button>
        <button onClick={handleDecode} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100">
          <Unlock className="h-4 w-4" /> From Binary
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
          <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full h-80 rounded-xl border border-gray-200 bg-white p-4 font-mono text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none resize-none" placeholder={mode === "text" ? "Enter text or binary (e.g., 01001000 01101001)..." : "Enter a number or binary string..."} spellCheck={false} />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Output</label>
          <textarea value={output} readOnly className="w-full h-80 rounded-xl border border-gray-200 bg-gray-50 p-4 font-mono text-sm resize-none" placeholder="Result will appear here..." />
        </div>
      </div>
    </div>
  );
}
