"use client";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Trash2, Search } from "lucide-react";

interface MatchResult {
  match: string;
  index: number;
  groups: string[];
}

export default function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState({ g: true, i: false, m: false });
  const [testString, setTestString] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const flagString = Object.entries(flags)
    .filter(([, v]) => v)
    .map(([k]) => k)
    .join("");

  const { matches, highlightedHtml } = useMemo(() => {
    if (!pattern || !testString) return { matches: [] as MatchResult[], highlightedHtml: "" };

    try {
      const regex = new RegExp(pattern, flagString);
      const results: MatchResult[] = [];
      let match: RegExpExecArray | null;

      if (flags.g) {
        while ((match = regex.exec(testString)) !== null) {
          results.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
          });
          if (match[0].length === 0) regex.lastIndex++;
        }
      } else {
        match = regex.exec(testString);
        if (match) {
          results.push({
            match: match[0],
            index: match.index,
            groups: match.slice(1),
          });
        }
      }

      // Build highlighted HTML
      let html = "";
      let lastIndex = 0;
      const allMatches = [...results].sort((a, b) => a.index - b.index);
      for (const m of allMatches) {
        const before = testString.slice(lastIndex, m.index);
        html += escapeHtml(before);
        html += `<mark class="bg-yellow-200 text-yellow-900 rounded px-0.5">${escapeHtml(m.match)}</mark>`;
        lastIndex = m.index + m.match.length;
      }
      html += escapeHtml(testString.slice(lastIndex));

      return { matches: results, highlightedHtml: html };
    } catch (e: any) {
      return { matches: [] as MatchResult[], highlightedHtml: "", error: e.message };
    }
  }, [pattern, testString, flagString, flags.g]);

  function escapeHtml(str: string): string {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br/>");
  }

  let regexError = "";
  if (pattern) {
    try {
      new RegExp(pattern, flagString);
    } catch (e: any) {
      regexError = e.message;
    }
  }

  const handleCopy = () => {
    const text = matches.map((m, i) => `Match ${i + 1}: "${m.match}" at index ${m.index}${m.groups.length ? ` groups: [${m.groups.join(", ")}]` : ""}`).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Regex Pattern</label>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 font-mono">/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
              placeholder="Enter regex pattern..."
            />
            <span className="text-gray-400 font-mono">/{flagString}</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          {(["g", "i", "m"] as const).map((flag) => (
            <label key={flag} className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <input
                type="checkbox"
                checked={flags[flag]}
                onChange={(e) => setFlags({ ...flags, [flag]: e.target.checked })}
                className="rounded border-gray-300"
              />
              <span className="font-mono">{flag}</span>
              <span className="text-gray-400 text-xs">
                ({flag === "g" ? "global" : flag === "i" ? "case-insensitive" : "multiline"})
              </span>
            </label>
          ))}
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Test String</label>
          <textarea
            value={testString}
            onChange={(e) => setTestString(e.target.value)}
            className="w-full h-32 rounded-xl border border-gray-200 bg-white p-4 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none resize-none"
            placeholder="Enter text to test against..."
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopy}
            disabled={matches.length === 0}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy Matches"}
          </button>
          <button
            onClick={() => { setPattern(""); setTestString(""); }}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            <Trash2 className="h-4 w-4" /> Clear
          </button>
        </div>
      </div>

      {regexError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">{regexError}</div>
      )}

      {pattern && testString && !regexError && (
        <>
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                Highlighted Matches ({matches.length} {matches.length === 1 ? "match" : "matches"})
              </label>
            </div>
            <div
              className="text-sm bg-gray-50 rounded-lg p-4 font-mono whitespace-pre-wrap break-all"
              dangerouslySetInnerHTML={{ __html: highlightedHtml }}
            />
          </div>

          {matches.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white p-4">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Match Details</label>
              <div className="space-y-2">
                {matches.map((m, i) => (
                  <div key={i} className="text-sm bg-gray-50 rounded-lg px-3 py-2 font-mono">
                    <span className="text-gray-400">#{i + 1}</span>{" "}
                    <span className="text-brand-700">&quot;{m.match}&quot;</span>{" "}
                    <span className="text-gray-400">at index {m.index}</span>
                    {m.groups.length > 0 && (
                      <div className="ml-4 mt-1 text-xs text-gray-500">
                        Groups: {m.groups.map((g, gi) => (
                          <span key={gi} className="inline-flex items-center gap-1 mr-2">
                            <span className="text-gray-400">${gi + 1}:</span>
                            <span className="text-green-700">&quot;{g}&quot;</span>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
