"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Trash2, Wand2, Minimize2 } from "lucide-react";

const SQL_KEYWORDS = [
  "SELECT", "FROM", "WHERE", "AND", "OR", "INSERT INTO", "VALUES",
  "UPDATE", "SET", "DELETE", "JOIN", "INNER JOIN", "LEFT JOIN",
  "RIGHT JOIN", "FULL JOIN", "OUTER JOIN", "ON", "GROUP BY",
  "ORDER BY", "HAVING", "LIMIT", "OFFSET", "UNION", "UNION ALL",
  "CREATE TABLE", "ALTER TABLE", "DROP TABLE", "CREATE INDEX",
  "AS", "IN", "NOT", "NULL", "IS", "LIKE", "BETWEEN", "EXISTS",
  "CASE", "WHEN", "THEN", "ELSE", "END", "DISTINCT", "COUNT",
  "SUM", "AVG", "MIN", "MAX", "ASC", "DESC",
];

const NEWLINE_BEFORE = [
  "SELECT", "FROM", "WHERE", "AND", "OR", "JOIN", "INNER JOIN",
  "LEFT JOIN", "RIGHT JOIN", "FULL JOIN", "OUTER JOIN", "ON",
  "GROUP BY", "ORDER BY", "HAVING", "LIMIT", "OFFSET",
  "UNION", "UNION ALL", "INSERT INTO", "UPDATE", "SET",
  "DELETE", "VALUES",
];

function formatSql(sql: string): string {
  let result = sql.trim().replace(/\s+/g, " ");

  // Uppercase keywords
  for (const keyword of SQL_KEYWORDS) {
    const regex = new RegExp(`\\b${keyword.replace(/ /g, "\\s+")}\\b`, "gi");
    result = result.replace(regex, keyword);
  }

  // Add newlines before major keywords
  for (const keyword of NEWLINE_BEFORE) {
    const regex = new RegExp(`\\s+(?=${keyword.replace(/ /g, "\\s+")}\\b)`, "gi");
    result = result.replace(regex, "\n");
  }

  // Indent lines after SELECT, etc.
  const lines = result.split("\n");
  const formatted: string[] = [];
  let indent = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (/^(FROM|WHERE|GROUP BY|ORDER BY|HAVING|LIMIT|SET|VALUES)\b/i.test(trimmed)) {
      indent = 0;
    }

    if (/^(AND|OR)\b/i.test(trimmed)) {
      formatted.push("  " + trimmed);
    } else {
      formatted.push("  ".repeat(indent) + trimmed);
    }

    if (/^SELECT\b/i.test(trimmed)) {
      indent = 1;
    }
  }

  return formatted.join("\n").trimEnd();
}

function minifySql(sql: string): string {
  return sql
    .replace(/--.*$/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

export default function SqlFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    if (!input.trim()) return;
    setOutput(formatSql(input));
  };

  const handleMinify = () => {
    if (!input.trim()) return;
    setOutput(minifySql(input));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={handleFormat}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors bg-brand-50 text-brand-700 hover:bg-brand-100"
        >
          <Wand2 className="h-4 w-4" />
          Format
        </button>
        <button
          onClick={handleMinify}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors bg-brand-50 text-brand-700 hover:bg-brand-100"
        >
          <Minimize2 className="h-4 w-4" />
          Minify
        </button>
        <button
          onClick={handleCopy}
          disabled={!output}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy"}
        </button>
        <button
          onClick={handleClear}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors bg-gray-100 text-gray-600 hover:bg-gray-200"
        >
          <Trash2 className="h-4 w-4" />
          Clear
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-80 rounded-xl border border-gray-200 bg-white p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-300 resize-none"
            placeholder="Paste your SQL here..."
            spellCheck={false}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Output</label>
          <textarea
            value={output}
            readOnly
            className="w-full h-80 rounded-xl border border-gray-200 bg-gray-50 p-4 font-mono text-sm resize-none"
            placeholder="Formatted output will appear here..."
          />
        </div>
      </div>
    </div>
  );
}
