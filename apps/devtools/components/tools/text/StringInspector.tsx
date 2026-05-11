"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Trash2, ScanSearch } from "lucide-react";

function getCategory(code: number): string {
  if (code <= 0x1f || code === 0x7f || (code >= 0x80 && code <= 0x9f)) return "control";
  if (code >= 0x30 && code <= 0x39) return "digit";
  if ((code >= 0x41 && code <= 0x5a) || (code >= 0x61 && code <= 0x7a)) return "letter";
  if (code === 0x20) return "space";
  if (code === 0x09) return "tab";
  if (code === 0x0a) return "newline";
  if (code === 0x0d) return "carriage return";
  if ([0xa0, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200a, 0x200b, 0x200c, 0x200d, 0x2028, 0x2029, 0x202f, 0x205f, 0x3000, 0xfeff].includes(code)) return "invisible";
  if (code > 0x7a) return "letter";
  return "punctuation";
}

function getUtf8Hex(char: string): string {
  const bytes = new TextEncoder().encode(char);
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0").toUpperCase()).join(" ");
}

function getDisplayChar(char: string, code: number): string {
  if (code === 0x20) return "\u2423"; // open box for space
  if (code === 0x09) return "\u2192"; // arrow for tab
  if (code === 0x0a) return "\u21b5"; // return symbol for newline
  if (code === 0x0d) return "\\r";
  if (code <= 0x1f || code === 0x7f) return `\\x${code.toString(16).padStart(2, "0")}`;
  if (getCategory(code) === "invisible") return `[U+${code.toString(16).padStart(4, "0").toUpperCase()}]`;
  return char;
}

const categoryColors: Record<string, string> = {
  letter: "text-blue-700 bg-blue-50",
  digit: "text-purple-700 bg-purple-50",
  space: "text-green-700 bg-green-50",
  tab: "text-green-700 bg-green-50",
  newline: "text-green-700 bg-green-50",
  "carriage return": "text-green-700 bg-green-50",
  punctuation: "text-orange-700 bg-orange-50",
  control: "text-red-700 bg-red-50",
  invisible: "text-red-700 bg-red-50",
};

export default function StringInspector() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const chars = input.split("").map((char) => {
    const code = char.codePointAt(0)!;
    return {
      char,
      display: getDisplayChar(char, code),
      codePoint: `U+${code.toString(16).padStart(4, "0").toUpperCase()}`,
      utf8: getUtf8Hex(char),
      category: getCategory(code),
    };
  });

  const handleCopy = () => {
    const text = chars.map((c) => `${c.display}\t${c.codePoint}\t${c.utf8}\t${c.category}`).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={handleCopy} disabled={!input} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy Table"}
        </button>
        <button onClick={() => setInput("")} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
          <Trash2 className="h-4 w-4" /> Clear
        </button>
        <span className="text-sm text-gray-500">{chars.length} character{chars.length !== 1 ? "s" : ""}</span>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1.5 block">Input</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-32 rounded-xl border border-gray-200 bg-white p-4 font-mono text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none resize-none"
          placeholder="Paste text to inspect..."
          spellCheck={false}
        />
      </div>

      {chars.length > 0 && (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="overflow-auto max-h-96">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">#</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Char</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Code Point</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">UTF-8 (hex)</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">Category</th>
                </tr>
              </thead>
              <tbody>
                {chars.map((c, i) => (
                  <tr key={i} className="border-t border-gray-100">
                    <td className="px-3 py-1.5 text-gray-400 font-mono">{i}</td>
                    <td className="px-3 py-1.5 font-mono font-semibold">{c.display}</td>
                    <td className="px-3 py-1.5 font-mono text-gray-600">{c.codePoint}</td>
                    <td className="px-3 py-1.5 font-mono text-gray-600">{c.utf8}</td>
                    <td className="px-3 py-1.5">
                      <span className={cn("text-xs px-1.5 py-0.5 rounded font-medium", categoryColors[c.category] || "text-gray-600 bg-gray-100")}>
                        {c.category}
                      </span>
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
