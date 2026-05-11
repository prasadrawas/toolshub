"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Trash2, Eraser } from "lucide-react";

export default function WhitespaceRemover() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [options, setOptions] = useState({
    trimLines: true,
    removeEmptyLines: false,
    collapseSpaces: false,
    removeAllWhitespace: false,
    removeTabs: false,
  });

  const apply = () => {
    let result = input;
    if (options.removeAllWhitespace) {
      result = result.replace(/\s/g, "");
    } else {
      if (options.trimLines) {
        result = result.split("\n").map((l) => l.trim()).join("\n");
      }
      if (options.removeTabs) {
        result = result.replace(/\t/g, "");
      }
      if (options.collapseSpaces) {
        result = result.replace(/ {2,}/g, " ");
      }
      if (options.removeEmptyLines) {
        result = result.split("\n").filter((l) => l.trim().length > 0).join("\n");
      }
    }
    setOutput(result);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-4">
          {([
            ["trimLines", "Trim lines"],
            ["removeEmptyLines", "Remove empty lines"],
            ["collapseSpaces", "Collapse multiple spaces"],
            ["removeAllWhitespace", "Remove all whitespace"],
            ["removeTabs", "Remove tabs"],
          ] as const).map(([key, label]) => (
            <label key={key} className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <input
                type="checkbox"
                checked={options[key]}
                onChange={(e) => setOptions({ ...options, [key]: e.target.checked })}
                className="rounded border-gray-300"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button onClick={apply} disabled={!input} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100 disabled:opacity-50">
          <Eraser className="h-4 w-4" /> Apply
        </button>
        <button onClick={handleCopy} disabled={!output} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy"}
        </button>
        <button onClick={() => { setInput(""); setOutput(""); }} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
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
            placeholder="Paste text with whitespace issues..."
            spellCheck={false}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Output</label>
          <textarea
            value={output}
            readOnly
            className="w-full h-64 rounded-xl border border-gray-200 bg-gray-50 p-4 font-mono text-sm resize-none"
            placeholder="Cleaned text will appear here..."
          />
        </div>
      </div>
    </div>
  );
}
