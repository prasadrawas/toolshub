"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Trash2, Search } from "lucide-react";

interface CharInfo {
  char: string;
  codePoint: string;
  bytes: string[];
  byteCount: number;
}

function inspectUtf8(text: string): CharInfo[] {
  const encoder = new TextEncoder();
  const result: CharInfo[] = [];
  for (const char of text) {
    const encoded = encoder.encode(char);
    result.push({
      char,
      codePoint: "U+" + (char.codePointAt(0) || 0).toString(16).toUpperCase().padStart(4, "0"),
      bytes: Array.from(encoded).map((b) => "0x" + b.toString(16).toUpperCase().padStart(2, "0")),
      byteCount: encoded.length,
    });
  }
  return result;
}

export default function Utf8Inspector() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [stats, setStats] = useState({ chars: 0, bytes: 0 });
  const [copied, setCopied] = useState(false);

  const handleInspect = () => {
    const chars = inspectUtf8(input);
    const totalBytes = chars.reduce((sum, c) => sum + c.byteCount, 0);
    setStats({ chars: chars.length, bytes: totalBytes });

    const lines = chars.map((c) => {
      const display = c.char === "\n" ? "\\n" : c.char === "\r" ? "\\r" : c.char === "\t" ? "\\t" : c.char === " " ? "SP" : c.char;
      return `${display.padEnd(4)} ${c.codePoint.padEnd(10)} ${c.byteCount} byte(s)  [${c.bytes.join(" ")}]`;
    });
    setOutput(lines.join("\n"));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setStats({ chars: 0, bytes: 0 });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={handleInspect} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100">
          <Search className="h-4 w-4" /> Inspect
        </button>
        <button onClick={handleCopy} disabled={!output} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? "Copied" : "Copy"}
        </button>
        <button onClick={handleClear} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
          <Trash2 className="h-4 w-4" /> Clear
        </button>
        {stats.chars > 0 && (
          <span className="text-sm text-gray-500">
            {stats.chars} character{stats.chars !== 1 ? "s" : ""}, {stats.bytes} byte{stats.bytes !== 1 ? "s" : ""}
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Input Text</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full h-80 rounded-xl border border-gray-200 bg-white p-4 font-mono text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none resize-none" placeholder="Enter text to inspect UTF-8 encoding..." spellCheck={false} />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">UTF-8 Byte Inspection</label>
          <textarea value={output} readOnly className="w-full h-80 rounded-xl border border-gray-200 bg-gray-50 p-4 font-mono text-sm resize-none" placeholder="Char  CodePoint   Bytes  [Hex values]" />
        </div>
      </div>
    </div>
  );
}
