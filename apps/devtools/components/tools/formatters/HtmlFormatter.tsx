"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Trash2, Wand2, Minimize2 } from "lucide-react";

const VOID_ELEMENTS = new Set([
  "area", "base", "br", "col", "embed", "hr", "img", "input",
  "link", "meta", "param", "source", "track", "wbr",
]);

function formatHtml(html: string, indentStr: string = "  "): string {
  let formatted = "";
  let indent = 0;

  const tokens = html
    .replace(/>\s*</g, "><")
    .replace(/></g, ">\n<")
    .split("\n");

  for (const token of tokens) {
    const trimmed = token.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("</")) {
      indent = Math.max(0, indent - 1);
    }

    formatted += indentStr.repeat(indent) + trimmed + "\n";

    const tagMatch = trimmed.match(/^<([a-zA-Z][a-zA-Z0-9]*)/);
    if (
      tagMatch &&
      !trimmed.startsWith("</") &&
      !trimmed.startsWith("<!") &&
      !trimmed.endsWith("/>") &&
      !VOID_ELEMENTS.has(tagMatch[1].toLowerCase()) &&
      !/<\/[^>]+>$/.test(trimmed)
    ) {
      indent++;
    }
  }

  return formatted.trimEnd();
}

function minifyHtml(html: string): string {
  return html
    .replace(/\n/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/>\s+</g, "><")
    .trim();
}

export default function HtmlFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    if (!input.trim()) return;
    setOutput(formatHtml(input));
  };

  const handleMinify = () => {
    if (!input.trim()) return;
    setOutput(minifyHtml(input));
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
            placeholder="Paste your HTML here..."
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
