"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Trash2, Wand2, Minimize2 } from "lucide-react";

const BLOCK_STARTERS = /^(def |class |if |elif |else:|for |while |with |try:|except |finally:|async def |async for |async with )/;

function formatPython(code: string): string {
  const lines = code.split("\n");
  const formatted: string[] = [];
  let indent = 0;

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines but preserve single blank lines
    if (!trimmed) {
      if (formatted.length > 0 && formatted[formatted.length - 1] !== "") {
        formatted.push("");
      }
      continue;
    }

    // Decrease indent for dedent keywords
    if (/^(elif |else:|except |finally:|except:)/.test(trimmed)) {
      indent = Math.max(0, indent - 1);
    }

    // Handle return/break/continue/pass after which we might dedent
    formatted.push("    ".repeat(indent) + trimmed);

    // Increase indent after block starters ending with ':'
    if (trimmed.endsWith(":") && BLOCK_STARTERS.test(trimmed)) {
      indent++;
    }

    // Dedent after return/break/continue/pass
    if (/^(return\b|break\b|continue\b|pass\b|raise\b)/.test(trimmed)) {
      indent = Math.max(0, indent - 1);
    }
  }

  return formatted.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd();
}

function minifyPython(code: string): string {
  // Python can't truly be minified due to significant whitespace
  // So we just remove comments and blank lines
  return code
    .split("\n")
    .map((line) => {
      // Remove inline comments (but not # in strings - simplified)
      const commentIdx = line.indexOf("#");
      if (commentIdx > 0) {
        const beforeComment = line.substring(0, commentIdx);
        // Simple check: if quotes are balanced before #, it's a comment
        const singleQuotes = (beforeComment.match(/'/g) || []).length;
        const doubleQuotes = (beforeComment.match(/"/g) || []).length;
        if (singleQuotes % 2 === 0 && doubleQuotes % 2 === 0) {
          return beforeComment.trimEnd();
        }
      }
      if (line.trim().startsWith("#")) return "";
      return line.trimEnd();
    })
    .filter((line) => line.trim() !== "")
    .join("\n");
}

export default function PythonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    if (!input.trim()) return;
    setOutput(formatPython(input));
  };

  const handleMinify = () => {
    if (!input.trim()) return;
    setOutput(minifyPython(input));
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
          Compact
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
            placeholder="Paste your Python code here..."
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
