"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Trash2, Wand2, Minimize2 } from "lucide-react";

type Language = "json" | "html" | "css" | "javascript" | "sql";

// --- JSON ---
function formatJson(input: string, indent: number): string {
  const parsed = JSON.parse(input);
  return JSON.stringify(parsed, null, indent);
}
function minifyJson(input: string): string {
  return JSON.stringify(JSON.parse(input));
}

// --- HTML ---
function formatHtml(html: string): string {
  let formatted = "";
  let indent = 0;
  const tokens = html.replace(/>\s*</g, "><").replace(/></g, ">\n<").split("\n");
  for (const token of tokens) {
    const t = token.trim();
    if (!t) continue;
    if (t.startsWith("</")) indent = Math.max(0, indent - 1);
    formatted += "  ".repeat(indent) + t + "\n";
    if (t.startsWith("<") && !t.startsWith("</") && !t.startsWith("<!") && !t.endsWith("/>") && !/<\/[^>]+>$/.test(t)) indent++;
  }
  return formatted.trimEnd();
}
function minifyHtml(html: string): string {
  return html.replace(/\n/g, "").replace(/\s{2,}/g, " ").replace(/>\s+</g, "><").trim();
}

// --- CSS ---
function formatCss(css: string): string {
  let r = css.trim().replace(/\s+/g, " ");
  r = r.replace(/\{/g, " {\n").replace(/\}/g, "\n}\n\n").replace(/;/g, ";\n");
  const lines = r.split("\n");
  let indent = 0;
  const out: string[] = [];
  for (const l of lines) {
    const t = l.trim();
    if (!t) continue;
    if (t === "}") indent = Math.max(0, indent - 1);
    out.push("  ".repeat(indent) + t);
    if (t.endsWith("{")) indent++;
  }
  return out.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd();
}
function minifyCss(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").replace(/\s*\{\s*/g, "{").replace(/\s*\}\s*/g, "}").replace(/\s*;\s*/g, ";").replace(/\s*:\s*/g, ":").trim();
}

// --- JavaScript ---
function formatJs(code: string): string {
  let r = code.trim().replace(/\s+/g, " ");
  r = r.replace(/\{/g, " {\n").replace(/\}/g, "\n}\n").replace(/;/g, ";\n");
  const lines = r.split("\n");
  let indent = 0;
  const out: string[] = [];
  for (const l of lines) {
    const t = l.trim();
    if (!t) continue;
    if (t.startsWith("}")) indent = Math.max(0, indent - 1);
    out.push("  ".repeat(indent) + t);
    if (t.endsWith("{")) indent++;
  }
  return out.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd();
}
function minifyJs(code: string): string {
  return code.replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, "").replace(/\s+/g, " ").replace(/\s*\{\s*/g, "{").replace(/\s*\}\s*/g, "}").replace(/\s*;\s*/g, ";").trim();
}

// --- SQL ---
const SQL_KW = ["SELECT","FROM","WHERE","AND","OR","INSERT INTO","VALUES","UPDATE","SET","DELETE","JOIN","INNER JOIN","LEFT JOIN","RIGHT JOIN","ON","GROUP BY","ORDER BY","HAVING","LIMIT","OFFSET","UNION"];
const SQL_NL = ["SELECT","FROM","WHERE","AND","OR","JOIN","INNER JOIN","LEFT JOIN","RIGHT JOIN","ON","GROUP BY","ORDER BY","HAVING","LIMIT","OFFSET","UNION","INSERT INTO","UPDATE","SET","DELETE","VALUES"];

function formatSql(sql: string): string {
  let r = sql.trim().replace(/\s+/g, " ");
  for (const kw of SQL_KW) {
    r = r.replace(new RegExp(`\\b${kw.replace(/ /g, "\\s+")}\\b`, "gi"), kw);
  }
  for (const kw of SQL_NL) {
    r = r.replace(new RegExp(`\\s+(?=${kw.replace(/ /g, "\\s+")}\\b)`, "gi"), "\n");
  }
  return r.trimEnd();
}
function minifySql(sql: string): string {
  return sql.replace(/--.*$/gm, "").replace(/\s+/g, " ").trim();
}

const FORMATTERS: Record<Language, { format: (s: string) => string; minify: (s: string) => string }> = {
  json: { format: (s) => formatJson(s, 2), minify: minifyJson },
  html: { format: formatHtml, minify: minifyHtml },
  css: { format: formatCss, minify: minifyCss },
  javascript: { format: formatJs, minify: minifyJs },
  sql: { format: formatSql, minify: minifySql },
};

const LANGUAGE_LABELS: Record<Language, string> = {
  json: "JSON",
  html: "HTML",
  css: "CSS",
  javascript: "JavaScript",
  sql: "SQL",
};

const PLACEHOLDERS: Record<Language, string> = {
  json: '{"key": "value", "array": [1, 2, 3]}',
  html: "<div><p>Hello World</p></div>",
  css: "body { margin: 0; padding: 0; } .container { display: flex; }",
  javascript: "function hello() { const x = 1; if (x) { console.log(x); } }",
  sql: "select id, name from users where active = true order by name",
};

export default function PrettierPlayground() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [language, setLanguage] = useState<Language>("json");

  const handleFormat = () => {
    setError("");
    try {
      if (!input.trim()) return;
      setOutput(FORMATTERS[language].format(input));
    } catch (e: any) {
      setError(e.message);
      setOutput("");
    }
  };

  const handleMinify = () => {
    setError("");
    try {
      if (!input.trim()) return;
      setOutput(FORMATTERS[language].minify(input));
    } catch (e: any) {
      setError(e.message);
      setOutput("");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  const handleLoadExample = () => {
    setInput(PLACEHOLDERS[language]);
    setOutput("");
    setError("");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-500">Language:</label>
          <select
            value={language}
            onChange={(e) => {
              setLanguage(e.target.value as Language);
              setOutput("");
              setError("");
            }}
            className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm font-medium"
          >
            {Object.entries(LANGUAGE_LABELS).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
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
        <button
          onClick={handleLoadExample}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors bg-gray-100 text-gray-600 hover:bg-gray-200"
        >
          Load Example
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">
            {LANGUAGE_LABELS[language]} Input
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-80 rounded-xl border border-gray-200 bg-white p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-300 resize-none"
            placeholder={`Paste your ${LANGUAGE_LABELS[language]} here...`}
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
