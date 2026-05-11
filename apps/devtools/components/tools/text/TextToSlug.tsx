"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Trash2, Link } from "lucide-react";

function generateSlug(text: string, separator: string, lowercase: boolean, removeSpecial: boolean): string {
  let result = text.trim();
  if (lowercase) result = result.toLowerCase();
  if (removeSpecial) result = result.replace(/[^\w\s-]/g, "");
  result = result.replace(/\s+/g, separator).replace(new RegExp(`[${separator.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}]+`, "g"), separator);
  result = result.replace(new RegExp(`^${separator.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}|${separator.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "g"), "");
  return result;
}

export default function TextToSlug() {
  const [input, setInput] = useState("");
  const [separator, setSeparator] = useState("-");
  const [lowercase, setLowercase] = useState(true);
  const [removeSpecial, setRemoveSpecial] = useState(true);
  const [copied, setCopied] = useState(false);

  const slug = generateSlug(input, separator, lowercase, removeSpecial);

  const handleCopy = () => {
    navigator.clipboard.writeText(slug);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Separator
            <select
              value={separator}
              onChange={(e) => setSeparator(e.target.value)}
              className="rounded-lg border border-gray-200 px-2 py-1 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
            >
              <option value="-">Hyphen (-)</option>
              <option value="_">Underscore (_)</option>
              <option value="/">Slash (/)</option>
            </select>
          </label>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <input
              type="checkbox"
              checked={lowercase}
              onChange={(e) => setLowercase(e.target.checked)}
              className="rounded border-gray-300"
            />
            Lowercase
          </label>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <input
              type="checkbox"
              checked={removeSpecial}
              onChange={(e) => setRemoveSpecial(e.target.checked)}
              className="rounded border-gray-300"
            />
            Remove special chars
          </label>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={handleCopy}
          disabled={!slug}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy Slug"}
        </button>
        <button
          onClick={() => setInput("")}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
        >
          <Trash2 className="h-4 w-4" /> Clear
        </button>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1.5 block">Input Text</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-32 rounded-xl border border-gray-200 bg-white p-4 font-mono text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none resize-none"
          placeholder="Enter text to slugify..."
          spellCheck={false}
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1.5 block">Slug Output</label>
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 font-mono text-sm text-gray-800 min-h-[2.5rem] break-all">
          {slug || <span className="text-gray-400">Slug will appear here...</span>}
        </div>
      </div>
    </div>
  );
}
