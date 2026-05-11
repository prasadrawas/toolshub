"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Trash2, Hash } from "lucide-react";

function toNumeronym(word: string): string {
  if (word.length <= 3) return word;
  return word[0] + (word.length - 2).toString() + word[word.length - 1];
}

export default function NumeronymGenerator() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const words = input
    .split(/[\s,;]+/)
    .filter((w) => w.length > 0)
    .map((word) => ({
      original: word,
      numeronym: toNumeronym(word.toLowerCase()),
    }));

  const handleCopy = () => {
    const text = words.map((w) => w.numeronym).join(" ");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={handleCopy} disabled={!words.length} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy Numeronyms"}
        </button>
        <button onClick={() => setInput("")} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
          <Trash2 className="h-4 w-4" /> Clear
        </button>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1.5 block">Input Words</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-32 rounded-xl border border-gray-200 bg-white p-4 font-mono text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none resize-none"
          placeholder="internationalization localization accessibility kubernetes..."
          spellCheck={false}
        />
      </div>

      {words.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="overflow-auto max-h-96">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Original</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500">Arrow</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Numeronym</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Saved</th>
                </tr>
              </thead>
              <tbody>
                {words.map((w, i) => (
                  <tr key={i} className="border-t border-gray-100">
                    <td className="px-4 py-2 font-mono text-gray-700">{w.original}</td>
                    <td className="px-4 py-2 text-center text-gray-400">&rarr;</td>
                    <td className="px-4 py-2 font-mono font-semibold text-brand-700">{w.numeronym}</td>
                    <td className="px-4 py-2 text-right text-gray-500 text-xs">
                      {w.original.length > 3
                        ? `-${w.original.length - w.numeronym.length} chars`
                        : "no change"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
