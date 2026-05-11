"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Trash2, Filter } from "lucide-react";

export default function RemoveDuplicateLines() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [trimWhitespace, setTrimWhitespace] = useState(true);
  const [keepOccurrence, setKeepOccurrence] = useState<"first" | "last">("first");
  const [removedCount, setRemovedCount] = useState(0);

  const handleRemove = () => {
    const lines = input.split("\n");
    const seen = new Map<string, number>();
    const result: string[] = [];

    if (keepOccurrence === "first") {
      for (const line of lines) {
        const key = trimWhitespace ? line.trim() : line;
        const normalizedKey = caseSensitive ? key : key.toLowerCase();
        if (!seen.has(normalizedKey)) {
          seen.set(normalizedKey, 1);
          result.push(line);
        } else {
          seen.set(normalizedKey, seen.get(normalizedKey)! + 1);
        }
      }
    } else {
      // Keep last: iterate in reverse
      const seenLast = new Set<string>();
      const indices: number[] = [];
      for (let i = lines.length - 1; i >= 0; i--) {
        const key = trimWhitespace ? lines[i].trim() : lines[i];
        const normalizedKey = caseSensitive ? key : key.toLowerCase();
        if (!seenLast.has(normalizedKey)) {
          seenLast.add(normalizedKey);
          indices.push(i);
        }
      }
      indices.reverse();
      for (const i of indices) {
        result.push(lines[i]);
      }
    }

    const removed = lines.length - result.length;
    setRemovedCount(removed);
    setOutput(result.join("\n"));
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
            <input type="checkbox" checked={caseSensitive} onChange={(e) => setCaseSensitive(e.target.checked)} className="rounded border-gray-300" />
            Case sensitive
          </label>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <input type="checkbox" checked={trimWhitespace} onChange={(e) => setTrimWhitespace(e.target.checked)} className="rounded border-gray-300" />
            Trim whitespace
          </label>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Keep
            <select
              value={keepOccurrence}
              onChange={(e) => setKeepOccurrence(e.target.value as any)}
              className="rounded-lg border border-gray-200 px-2 py-1 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
            >
              <option value="first">First occurrence</option>
              <option value="last">Last occurrence</option>
            </select>
          </label>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button onClick={handleRemove} disabled={!input} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100 disabled:opacity-50">
          <Filter className="h-4 w-4" /> Remove Duplicates
        </button>
        <button onClick={handleCopy} disabled={!output} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy"}
        </button>
        <button onClick={() => { setInput(""); setOutput(""); setRemovedCount(0); }} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
          <Trash2 className="h-4 w-4" /> Clear
        </button>
        {output && (
          <span className="text-sm text-gray-500">
            Removed {removedCount} duplicate{removedCount !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">
            Input ({input === "" ? 0 : input.split("\n").length} lines)
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-80 rounded-xl border border-gray-200 bg-white p-4 font-mono text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none resize-none"
            placeholder="Paste lines of text..."
            spellCheck={false}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">
            Output ({output === "" ? 0 : output.split("\n").length} lines)
          </label>
          <textarea
            value={output}
            readOnly
            className="w-full h-80 rounded-xl border border-gray-200 bg-gray-50 p-4 font-mono text-sm resize-none"
            placeholder="Deduplicated text will appear here..."
          />
        </div>
      </div>
    </div>
  );
}
