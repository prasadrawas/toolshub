"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Trash2 } from "lucide-react";

function jsonToHtmlTable(json: any): string {
  if (!Array.isArray(json)) throw new Error("Input must be a JSON array of objects");
  if (json.length === 0) return "<table></table>";
  if (typeof json[0] !== "object" || json[0] === null) throw new Error("Array items must be objects");

  const headers = Array.from(new Set(json.flatMap((item: any) => Object.keys(item))));

  const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const thead = `  <thead>\n    <tr>\n${headers.map((h) => `      <th>${escape(h)}</th>`).join("\n")}\n    </tr>\n  </thead>`;

  const rows = json.map((item: any) => {
    const cells = headers.map((h) => {
      const val = item[h];
      const display = val === null || val === undefined ? "" : typeof val === "object" ? JSON.stringify(val) : String(val);
      return `      <td>${escape(display)}</td>`;
    });
    return `    <tr>\n${cells.join("\n")}\n    </tr>`;
  });

  const tbody = `  <tbody>\n${rows.join("\n")}\n  </tbody>`;

  return `<table>\n${thead}\n${tbody}\n</table>`;
}

export default function JsonToHtmlTable() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const handleConvert = () => {
    setError("");
    try {
      const parsed = JSON.parse(input);
      setOutput(jsonToHtmlTable(parsed));
    } catch (e: any) { setError(e.message); setOutput(""); }
  };

  const handleCopy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  const handleClear = () => { setInput(""); setOutput(""); setError(""); setShowPreview(false); };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={handleConvert} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100">Convert</button>
        <button onClick={handleCopy} disabled={!output} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? "Copied" : "Copy"}
        </button>
        <button onClick={handleClear} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
          <Trash2 className="h-4 w-4" /> Clear
        </button>
        {output && (
          <button onClick={() => setShowPreview(!showPreview)} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
            {showPreview ? "Show Code" : "Show Preview"}
          </button>
        )}
      </div>
      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">JSON Input</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full h-80 rounded-xl border border-gray-200 bg-white p-4 font-mono text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none resize-none" placeholder='[{"name": "Alice", "age": 30}]' spellCheck={false} />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">
            {showPreview ? "Preview" : "HTML Output"}
          </label>
          {showPreview ? (
            <div className="w-full h-80 rounded-xl border border-gray-200 bg-white p-4 overflow-auto">
              <style>{`
                .preview-table table { border-collapse: collapse; width: 100%; font-size: 0.875rem; }
                .preview-table th, .preview-table td { border: 1px solid #e5e7eb; padding: 8px 12px; text-align: left; }
                .preview-table th { background: #f9fafb; font-weight: 600; }
                .preview-table tr:nth-child(even) { background: #f9fafb; }
              `}</style>
              <div className="preview-table" dangerouslySetInnerHTML={{ __html: output }} />
            </div>
          ) : (
            <textarea value={output} readOnly className="w-full h-80 rounded-xl border border-gray-200 bg-gray-50 p-4 font-mono text-sm resize-none" placeholder="HTML table will appear here..." />
          )}
        </div>
      </div>
    </div>
  );
}
