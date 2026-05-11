"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Trash2, GitCompare } from "lucide-react";

interface DiffLine {
  type: "added" | "removed" | "changed" | "unchanged";
  lineNum1?: number;
  lineNum2?: number;
  text1?: string;
  text2?: string;
}

function computeDiff(text1: string, text2: string): DiffLine[] {
  const lines1 = text1.split("\n");
  const lines2 = text2.split("\n");
  const result: DiffLine[] = [];
  const maxLen = Math.max(lines1.length, lines2.length);

  for (let i = 0; i < maxLen; i++) {
    const l1 = i < lines1.length ? lines1[i] : undefined;
    const l2 = i < lines2.length ? lines2[i] : undefined;

    if (l1 !== undefined && l2 !== undefined) {
      if (l1 === l2) {
        result.push({ type: "unchanged", lineNum1: i + 1, lineNum2: i + 1, text1: l1, text2: l2 });
      } else {
        result.push({ type: "changed", lineNum1: i + 1, lineNum2: i + 1, text1: l1, text2: l2 });
      }
    } else if (l1 !== undefined) {
      result.push({ type: "removed", lineNum1: i + 1, text1: l1 });
    } else if (l2 !== undefined) {
      result.push({ type: "added", lineNum2: i + 1, text2: l2 });
    }
  }
  return result;
}

export default function DiffChecker() {
  const [left, setLeft] = useState("");
  const [right, setRight] = useState("");
  const [diff, setDiff] = useState<DiffLine[] | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCompare = () => {
    setDiff(computeDiff(left, right));
  };

  const handleClear = () => {
    setLeft("");
    setRight("");
    setDiff(null);
  };

  const handleCopy = () => {
    if (!diff) return;
    const text = diff
      .map((d) => {
        const prefix = d.type === "added" ? "+" : d.type === "removed" ? "-" : d.type === "changed" ? "~" : " ";
        return `${prefix} ${d.text1 ?? d.text2 ?? ""}`;
      })
      .join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const stats = diff
    ? {
        added: diff.filter((d) => d.type === "added").length,
        removed: diff.filter((d) => d.type === "removed").length,
        changed: diff.filter((d) => d.type === "changed").length,
        unchanged: diff.filter((d) => d.type === "unchanged").length,
      }
    : null;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={handleCompare}
          disabled={!left && !right}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100 disabled:opacity-50"
        >
          <GitCompare className="h-4 w-4" /> Compare
        </button>
        <button
          onClick={handleCopy}
          disabled={!diff}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy Diff"}
        </button>
        <button
          onClick={handleClear}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
        >
          <Trash2 className="h-4 w-4" /> Clear
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Original</label>
          <textarea
            value={left}
            onChange={(e) => setLeft(e.target.value)}
            className="w-full h-64 rounded-xl border border-gray-200 bg-white p-4 font-mono text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none resize-none"
            placeholder="Paste original text..."
            spellCheck={false}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Modified</label>
          <textarea
            value={right}
            onChange={(e) => setRight(e.target.value)}
            className="w-full h-64 rounded-xl border border-gray-200 bg-white p-4 font-mono text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none resize-none"
            placeholder="Paste modified text..."
            spellCheck={false}
          />
        </div>
      </div>

      {stats && (
        <div className="flex flex-wrap gap-3 text-sm">
          <span className="text-green-700 bg-green-50 px-2 py-0.5 rounded">+{stats.added} added</span>
          <span className="text-red-700 bg-red-50 px-2 py-0.5 rounded">-{stats.removed} removed</span>
          <span className="text-yellow-700 bg-yellow-50 px-2 py-0.5 rounded">~{stats.changed} changed</span>
          <span className="text-gray-600">{stats.unchanged} unchanged</span>
        </div>
      )}

      {diff && (
        <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
          <div className="overflow-auto max-h-96">
            <table className="w-full text-sm font-mono">
              <tbody>
                {diff.map((line, i) => (
                  <tr
                    key={i}
                    className={cn(
                      line.type === "added" && "bg-green-50",
                      line.type === "removed" && "bg-red-50",
                      line.type === "changed" && "bg-yellow-50"
                    )}
                  >
                    <td className="px-2 py-0.5 text-gray-400 text-right w-10 select-none border-r border-gray-100">
                      {line.lineNum1 ?? ""}
                    </td>
                    <td className="px-2 py-0.5 text-gray-400 text-right w-10 select-none border-r border-gray-100">
                      {line.lineNum2 ?? ""}
                    </td>
                    <td className="px-2 py-0.5 w-6 text-center select-none">
                      {line.type === "added" && <span className="text-green-600">+</span>}
                      {line.type === "removed" && <span className="text-red-600">-</span>}
                      {line.type === "changed" && <span className="text-yellow-600">~</span>}
                    </td>
                    <td className="px-2 py-0.5 whitespace-pre-wrap break-all">
                      {line.type === "changed" ? (
                        <div className="space-y-0.5">
                          <div className="text-red-700 line-through">{line.text1}</div>
                          <div className="text-green-700">{line.text2}</div>
                        </div>
                      ) : (
                        <span className={cn(
                          line.type === "added" && "text-green-700",
                          line.type === "removed" && "text-red-700"
                        )}>
                          {line.text1 ?? line.text2}
                        </span>
                      )}
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
