"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, ArrowLeftRight, Trash2, RotateCw } from "lucide-react";

function rot13(text: string): string {
  return text.replace(/[a-zA-Z]/g, (ch) => {
    const base = ch <= "Z" ? 65 : 97;
    return String.fromCharCode(((ch.charCodeAt(0) - base + 13) % 26) + base);
  });
}

function rot47(text: string): string {
  return text.replace(/[!-~]/g, (ch) => {
    return String.fromCharCode(((ch.charCodeAt(0) - 33 + 47) % 94) + 33);
  });
}

export default function Rot13Encoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"rot13" | "rot47">("rot13");
  const [copied, setCopied] = useState(false);

  const handleEncode = () => {
    setOutput(mode === "rot13" ? rot13(input) : rot47(input));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleClear = () => { setInput(""); setOutput(""); };
  const handleSwap = () => { setInput(output); setOutput(""); };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={mode}
          onChange={(e) => { setMode(e.target.value as "rot13" | "rot47"); setOutput(""); }}
          className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium bg-white text-gray-700 focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
        >
          <option value="rot13">ROT13</option>
          <option value="rot47">ROT47</option>
        </select>
        <button onClick={handleEncode} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100">
          <RotateCw className="h-4 w-4" /> Encode / Decode
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Input</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full h-80 rounded-xl border border-gray-200 bg-white p-4 font-mono text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none resize-none" placeholder="Enter text to encode/decode..." spellCheck={false} />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Output</label>
          <textarea value={output} readOnly className="w-full h-80 rounded-xl border border-gray-200 bg-gray-50 p-4 font-mono text-sm resize-none" placeholder="Result will appear here..." />
        </div>
      </div>
    </div>
  );
}
