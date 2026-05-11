"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Trash2, WrapText, SplitSquareHorizontal } from "lucide-react";

export default function MultilineToSingle() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"join" | "split">("join");
  const [separatorType, setSeparatorType] = useState<"space" | "comma" | "semicolon" | "custom">("space");
  const [customSeparator, setCustomSeparator] = useState("");
  const [copied, setCopied] = useState(false);

  const separator =
    separatorType === "space" ? " " :
    separatorType === "comma" ? ", " :
    separatorType === "semicolon" ? "; " :
    customSeparator;

  const handleConvert = () => {
    if (mode === "join") {
      setOutput(input.split("\n").filter((l) => l.trim().length > 0).join(separator));
    } else {
      const splitSep = separatorType === "space" ? /\s+/ :
        separatorType === "comma" ? /,\s*/ :
        separatorType === "semicolon" ? /;\s*/ :
        customSeparator;
      setOutput(input.split(splitSep).filter((s) => s.trim().length > 0).join("\n"));
    }
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
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Mode
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as any)}
              className="rounded-lg border border-gray-200 px-2 py-1 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
            >
              <option value="join">Multiline to Single line</option>
              <option value="split">Single line to Multiline</option>
            </select>
          </label>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Separator
            <select
              value={separatorType}
              onChange={(e) => setSeparatorType(e.target.value as any)}
              className="rounded-lg border border-gray-200 px-2 py-1 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
            >
              <option value="space">Space</option>
              <option value="comma">Comma</option>
              <option value="semicolon">Semicolon</option>
              <option value="custom">Custom</option>
            </select>
          </label>
          {separatorType === "custom" && (
            <input
              value={customSeparator}
              onChange={(e) => setCustomSeparator(e.target.value)}
              className="w-32 rounded-lg border border-gray-200 px-2 py-1 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
              placeholder="Separator..."
            />
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button onClick={handleConvert} disabled={!input} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100 disabled:opacity-50">
          {mode === "join" ? <WrapText className="h-4 w-4" /> : <SplitSquareHorizontal className="h-4 w-4" />}
          Convert
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
            placeholder={mode === "join" ? "Enter multiline text..." : "Enter single line text..."}
            spellCheck={false}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Output</label>
          <textarea
            value={output}
            readOnly
            className="w-full h-64 rounded-xl border border-gray-200 bg-gray-50 p-4 font-mono text-sm resize-none"
            placeholder="Converted text will appear here..."
          />
        </div>
      </div>
    </div>
  );
}
