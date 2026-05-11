"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Trash2, Wand2, Minimize2 } from "lucide-react";

function formatNginx(config: string): string {
  // Normalize and tokenize
  let result = config.trim();
  result = result.replace(/\s+/g, " ");
  result = result.replace(/\{/g, " {\n");
  result = result.replace(/\}/g, "\n}\n");
  result = result.replace(/;/g, ";\n");

  const lines = result.split("\n");
  let indent = 0;
  const formatted: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Handle comments
    if (trimmed.startsWith("#")) {
      formatted.push("    ".repeat(indent) + trimmed);
      continue;
    }

    if (trimmed === "}" || trimmed.startsWith("}")) {
      indent = Math.max(0, indent - 1);
    }

    formatted.push("    ".repeat(indent) + trimmed);

    if (trimmed.endsWith("{")) {
      indent++;
    }
  }

  return formatted.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd();
}

function minifyNginx(config: string): string {
  return config
    .replace(/#.*$/gm, "")
    .replace(/\s+/g, " ")
    .replace(/\s*\{\s*/g, "{")
    .replace(/\s*\}\s*/g, "}")
    .replace(/\s*;\s*/g, ";")
    .trim();
}

export default function NginxFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    if (!input.trim()) return;
    setOutput(formatNginx(input));
  };

  const handleMinify = () => {
    if (!input.trim()) return;
    setOutput(minifyNginx(input));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={handleFormat}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors bg-brand-50 text-brand-700 hover:bg-brand-100"
        >
          <Wand2 className="h-4 w-4" />
          Format
        </button>
        <button
          onClick={handleMinify}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors bg-brand-50 text-brand-700 hover:bg-brand-100"
        >
          <Minimize2 className="h-4 w-4" />
          Minify
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-80 rounded-xl border border-gray-200 bg-white p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-300 resize-none"
            placeholder="Paste your nginx config here..."
            spellCheck={false}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Output</label>
          <textarea
            value={output}
            readOnly
            className="w-full h-80 rounded-xl border border-gray-200 bg-gray-50 p-4 font-mono text-sm resize-none"
            placeholder="Formatted output will appear here..."
          />
        </div>
      </div>
    </div>
  );
}
