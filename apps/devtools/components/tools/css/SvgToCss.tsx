"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Trash2 } from "lucide-react";

function encodeSvgForCss(svg: string): string {
  return svg
    .replace(/\s+/g, " ")
    .replace(/"/g, "'")
    .replace(/%/g, "%25")
    .replace(/#/g, "%23")
    .replace(/\{/g, "%7B")
    .replace(/\}/g, "%7D")
    .replace(/</g, "%3C")
    .replace(/>/g, "%3E")
    .trim();
}

export default function SvgToCss() {
  const [input, setInput] = useState(
    `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`
  );
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const trimmed = input.trim();
  const isSvg = trimmed.startsWith("<svg") && trimmed.endsWith("</svg>");
  const encoded = isSvg ? encodeSvgForCss(trimmed) : "";
  const dataUri = encoded ? `url("data:image/svg+xml,${encoded}")` : "";
  const cssBg = encoded ? `background-image: ${dataUri};` : "";
  const cssMask = encoded ? `mask-image: ${dataUri};\n-webkit-mask-image: ${dataUri};` : "";

  const handleCopy = (key: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => handleCopy("bg", cssBg)} disabled={!cssBg} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100 disabled:opacity-50">
          {copiedKey === "bg" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copiedKey === "bg" ? "Copied" : "Copy background-image"}
        </button>
        <button onClick={() => handleCopy("mask", cssMask)} disabled={!cssMask} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50">
          {copiedKey === "mask" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copiedKey === "mask" ? "Copied" : "Copy mask-image"}
        </button>
        <button onClick={() => handleCopy("uri", dataUri)} disabled={!dataUri} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50">
          {copiedKey === "uri" ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copiedKey === "uri" ? "Copied" : "Copy Data URI"}
        </button>
        <button onClick={() => setInput("")} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
          <Trash2 className="h-4 w-4" /> Clear
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">SVG Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-64 rounded-xl border border-gray-200 bg-white p-4 font-mono text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none resize-none"
            placeholder="Paste SVG markup here..."
            spellCheck={false}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Preview</label>
          <div className="h-64 rounded-xl border border-gray-200 bg-white flex items-center justify-center p-4">
            {isSvg ? (
              <div dangerouslySetInnerHTML={{ __html: trimmed }} className="max-w-full max-h-full [&>svg]:w-24 [&>svg]:h-24" />
            ) : (
              <span className="text-sm text-gray-400">{trimmed ? "Invalid SVG" : "Paste SVG to preview"}</span>
            )}
          </div>
        </div>
      </div>

      {isSvg && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">CSS background-image</label>
            <pre className="rounded-lg bg-gray-50 p-3 font-mono text-sm text-gray-800 whitespace-pre-wrap break-all overflow-x-auto">{cssBg}</pre>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">CSS mask-image</label>
            <pre className="rounded-lg bg-gray-50 p-3 font-mono text-sm text-gray-800 whitespace-pre-wrap break-all overflow-x-auto">{cssMask}</pre>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Data URI</label>
            <pre className="rounded-lg bg-gray-50 p-3 font-mono text-sm text-gray-800 whitespace-pre-wrap break-all overflow-x-auto max-h-32 overflow-y-auto">{dataUri}</pre>
          </div>
        </div>
      )}

      {trimmed && !isSvg && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          Input must be valid SVG markup starting with {"<svg"} and ending with {"</svg>"}.
        </div>
      )}
    </div>
  );
}
