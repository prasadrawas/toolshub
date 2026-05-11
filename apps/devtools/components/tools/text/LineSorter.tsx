"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Trash2, ArrowDownAZ, ArrowUpZA, ArrowDownWideNarrow, RotateCcw, Shuffle, Filter } from "lucide-react";

export default function LineSorter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const getLines = () => input.split("\n").filter((l) => l.length > 0);

  const sortAZ = () => setOutput(getLines().sort((a, b) => a.localeCompare(b)).join("\n"));
  const sortZA = () => setOutput(getLines().sort((a, b) => b.localeCompare(a)).join("\n"));
  const sortByLength = () => setOutput(getLines().sort((a, b) => a.length - b.length).join("\n"));
  const reverse = () => setOutput(getLines().reverse().join("\n"));
  const shuffle = () => {
    const lines = getLines();
    for (let i = lines.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [lines[i], lines[j]] = [lines[j], lines[i]];
    }
    setOutput(lines.join("\n"));
  };
  const removeDuplicates = () => setOutput(Array.from(new Set(getLines())).join("\n"));

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const lineCount = input.trim() === "" ? 0 : getLines().length;
  const outputLineCount = output.trim() === "" ? 0 : output.split("\n").filter((l) => l.length > 0).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={sortAZ} disabled={!input} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100 disabled:opacity-50">
          <ArrowDownAZ className="h-4 w-4" /> Sort A-Z
        </button>
        <button onClick={sortZA} disabled={!input} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100 disabled:opacity-50">
          <ArrowUpZA className="h-4 w-4" /> Sort Z-A
        </button>
        <button onClick={sortByLength} disabled={!input} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100 disabled:opacity-50">
          <ArrowDownWideNarrow className="h-4 w-4" /> By Length
        </button>
        <button onClick={reverse} disabled={!input} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100 disabled:opacity-50">
          <RotateCcw className="h-4 w-4" /> Reverse
        </button>
        <button onClick={shuffle} disabled={!input} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100 disabled:opacity-50">
          <Shuffle className="h-4 w-4" /> Shuffle
        </button>
        <button onClick={removeDuplicates} disabled={!input} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100 disabled:opacity-50">
          <Filter className="h-4 w-4" /> Remove Duplicates
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button onClick={handleCopy} disabled={!output} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy"}
        </button>
        <button onClick={() => { setInput(""); setOutput(""); }} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
          <Trash2 className="h-4 w-4" /> Clear
        </button>
        <span className="text-sm text-gray-500">
          {lineCount} line{lineCount !== 1 ? "s" : ""} input
          {output && ` / ${outputLineCount} line${outputLineCount !== 1 ? "s" : ""} output`}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-80 rounded-xl border border-gray-200 bg-white p-4 font-mono text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none resize-none"
            placeholder="Enter lines of text..."
            spellCheck={false}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Output</label>
          <textarea
            value={output}
            readOnly
            className="w-full h-80 rounded-xl border border-gray-200 bg-gray-50 p-4 font-mono text-sm resize-none"
            placeholder="Sorted output..."
          />
        </div>
      </div>
    </div>
  );
}
