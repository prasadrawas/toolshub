"use client";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Trash2, Search, Replace } from "lucide-react";

export default function FindAndReplace() {
  const [text, setText] = useState("");
  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");
  const [useRegex, setUseRegex] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const matches = useMemo(() => {
    if (!find || !text) return [];
    try {
      setError("");
      const flags = caseSensitive ? "g" : "gi";
      const pattern = useRegex ? new RegExp(find, flags) : new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), flags);
      const results: { start: number; end: number }[] = [];
      let match;
      while ((match = pattern.exec(text)) !== null) {
        results.push({ start: match.index, end: match.index + match[0].length });
        if (match[0].length === 0) pattern.lastIndex++;
      }
      return results;
    } catch (e: any) {
      setError(e.message);
      return [];
    }
  }, [text, find, useRegex, caseSensitive]);

  const handleReplace = () => {
    if (!find) return;
    try {
      const flags = caseSensitive ? "g" : "gi";
      const pattern = useRegex ? new RegExp(find, flags) : new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), flags);
      setText(text.replace(pattern, replace));
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const highlightedText = useMemo(() => {
    if (!matches.length) return null;
    const parts: { text: string; highlight: boolean }[] = [];
    let lastEnd = 0;
    for (const m of matches) {
      if (m.start > lastEnd) parts.push({ text: text.slice(lastEnd, m.start), highlight: false });
      parts.push({ text: text.slice(m.start, m.end), highlight: true });
      lastEnd = m.end;
    }
    if (lastEnd < text.length) parts.push({ text: text.slice(lastEnd), highlight: false });
    return parts;
  }, [text, matches]);

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Find</label>
            <input
              value={find}
              onChange={(e) => setFind(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
              placeholder="Search text..."
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Replace with</label>
            <input
              value={replace}
              onChange={(e) => setReplace(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
              placeholder="Replacement..."
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <input type="checkbox" checked={useRegex} onChange={(e) => setUseRegex(e.target.checked)} className="rounded border-gray-300" />
            Regex
          </label>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <input type="checkbox" checked={caseSensitive} onChange={(e) => setCaseSensitive(e.target.checked)} className="rounded border-gray-300" />
            Case sensitive
          </label>
          <span className="text-sm text-gray-500">{matches.length} match{matches.length !== 1 ? "es" : ""}</span>
        </div>
      </div>

      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={handleReplace}
          disabled={!find || !matches.length}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100 disabled:opacity-50"
        >
          <Replace className="h-4 w-4" /> Replace All
        </button>
        <button onClick={handleCopy} disabled={!text} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy"}
        </button>
        <button onClick={() => { setText(""); setFind(""); setReplace(""); setError(""); }} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
          <Trash2 className="h-4 w-4" /> Clear
        </button>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1.5 block">Text</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-48 rounded-xl border border-gray-200 bg-white p-4 font-mono text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none resize-none"
          placeholder="Enter or paste text..."
          spellCheck={false}
        />
      </div>

      {highlightedText && (
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Preview (highlighted matches)</label>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 font-mono text-sm whitespace-pre-wrap break-all max-h-64 overflow-auto">
            {highlightedText.map((part, i) =>
              part.highlight ? (
                <mark key={i} className="bg-yellow-200 text-yellow-900 rounded px-0.5">{part.text}</mark>
              ) : (
                <span key={i}>{part.text}</span>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
