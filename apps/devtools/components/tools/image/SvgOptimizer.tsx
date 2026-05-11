"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Trash2, Zap } from "lucide-react";

function optimizeSvg(svg: string): string {
  let result = svg;
  // Remove comments
  result = result.replace(/<!--[\s\S]*?-->/g, "");
  // Remove empty attributes like attr=""
  result = result.replace(/\s+\w+=""/g, "");
  // Remove default attributes
  result = result.replace(/\s+version="1\.\d"/g, "");
  result = result.replace(/\s+xmlns:xlink="http:\/\/www\.w3\.org\/1999\/xlink"/g, "");
  // Collapse whitespace between tags
  result = result.replace(/>\s+</g, "><");
  // Collapse multiple spaces/newlines
  result = result.replace(/\s{2,}/g, " ");
  // Trim
  result = result.trim();
  return result;
}

export default function SvgOptimizer() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleOptimize = () => {
    setOutput(optimizeSvg(input));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const inputSize = new Blob([input]).size;
  const outputSize = new Blob([output]).size;
  const savings = inputSize > 0 ? ((1 - outputSize / inputSize) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={handleOptimize}
          disabled={!input}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100 disabled:opacity-50"
        >
          <Zap className="h-4 w-4" /> Optimize
        </button>
        <button
          onClick={handleCopy}
          disabled={!output}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy"}
        </button>
        <button
          onClick={() => { setInput(""); setOutput(""); }}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
        >
          <Trash2 className="h-4 w-4" /> Clear
        </button>
      </div>

      {output && (
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-gray-200 bg-white p-3 text-center">
            <div className="text-lg font-semibold text-gray-800">{inputSize} B</div>
            <div className="text-xs text-gray-500">Original</div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-3 text-center">
            <div className="text-lg font-semibold text-gray-800">{outputSize} B</div>
            <div className="text-xs text-gray-500">Optimized</div>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-3 text-center">
            <div className="text-lg font-semibold text-green-600">{savings}%</div>
            <div className="text-xs text-gray-500">Saved</div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Input SVG</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-64 rounded-xl border border-gray-200 bg-white p-4 font-mono text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none resize-none"
            placeholder="Paste SVG markup here..."
            spellCheck={false}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Optimized SVG</label>
          <textarea
            readOnly
            value={output}
            className="w-full h-64 rounded-xl border border-gray-200 bg-gray-50 p-4 font-mono text-sm focus:outline-none resize-none"
          />
        </div>
      </div>
    </div>
  );
}
