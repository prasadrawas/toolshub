"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, ArrowLeftRight, Trash2 } from "lucide-react";

function htmlToJsx(html: string): string {
  let jsx = html;

  // class -> className
  jsx = jsx.replace(/\bclass=/g, "className=");

  // for -> htmlFor
  jsx = jsx.replace(/\bfor=/g, "htmlFor=");

  // tabindex -> tabIndex
  jsx = jsx.replace(/\btabindex=/g, "tabIndex=");

  // readonly -> readOnly
  jsx = jsx.replace(/\breadonly\b/g, "readOnly");

  // maxlength -> maxLength
  jsx = jsx.replace(/\bmaxlength=/g, "maxLength=");

  // cellpadding -> cellPadding, cellspacing -> cellSpacing
  jsx = jsx.replace(/\bcellpadding=/g, "cellPadding=");
  jsx = jsx.replace(/\bcellspacing=/g, "cellSpacing=");

  // colspan -> colSpan, rowspan -> rowSpan
  jsx = jsx.replace(/\bcolspan=/g, "colSpan=");
  jsx = jsx.replace(/\browspan=/g, "rowSpan=");

  // autocomplete -> autoComplete
  jsx = jsx.replace(/\bautocomplete=/g, "autoComplete=");

  // autofocus -> autoFocus
  jsx = jsx.replace(/\bautofocus\b/g, "autoFocus");

  // enctype -> encType
  jsx = jsx.replace(/\benctype=/g, "encType=");

  // crossorigin -> crossOrigin
  jsx = jsx.replace(/\bcrossorigin=/g, "crossOrigin=");

  // Self-close void elements
  const voidElements = ["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"];
  for (const tag of voidElements) {
    // Match tags that aren't already self-closed
    const regex = new RegExp(`<(${tag})(\\s[^>]*)?>(?!\\s*<\\/${tag}>)`, "gi");
    jsx = jsx.replace(regex, (match, tagName, attrs) => {
      const attributes = (attrs || "").replace(/\/$/, "").trim();
      return `<${tagName}${attributes ? " " + attributes : ""} />`;
    });
  }

  // Convert inline style strings to objects
  jsx = jsx.replace(/style="([^"]*)"/g, (_, styleStr) => {
    const properties = styleStr
      .split(";")
      .filter((s: string) => s.trim())
      .map((prop: string) => {
        const [key, ...valueParts] = prop.split(":");
        const value = valueParts.join(":").trim();
        const camelKey = key.trim().replace(/-([a-z])/g, (_: string, c: string) => c.toUpperCase());
        // Check if value is a number (without units)
        const numVal = parseFloat(value);
        if (!isNaN(numVal) && String(numVal) === value) {
          return `${camelKey}: ${numVal}`;
        }
        return `${camelKey}: "${value}"`;
      });
    return `style={{${properties.join(", ")}}}`;
  });

  // Convert HTML comments to JSX comments
  jsx = jsx.replace(/<!--([\s\S]*?)-->/g, "{/* $1 */}");

  // onclick -> onClick, onchange -> onChange, etc.
  jsx = jsx.replace(/\bon(click|change|submit|focus|blur|keydown|keyup|keypress|mousedown|mouseup|mouseover|mouseout|input|load|error)=/gi, (match) => {
    const event = match.slice(2, -1);
    return `on${event.charAt(0).toUpperCase()}${event.slice(1).toLowerCase()}=`;
  });

  return jsx;
}

export default function HtmlToJsx() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleConvert = () => {
    setError("");
    try {
      setOutput(htmlToJsx(input));
    } catch (e: any) { setError(e.message); setOutput(""); }
  };

  const handleCopy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  const handleClear = () => { setInput(""); setOutput(""); setError(""); };
  const handleSwap = () => { setInput(output); setOutput(""); setError(""); };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={handleConvert} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100">Convert</button>
        <button onClick={handleCopy} disabled={!output} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? "Copied" : "Copy"}
        </button>
        <button onClick={handleSwap} disabled={!output} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50">
          <ArrowLeftRight className="h-4 w-4" /> Swap
        </button>
        <button onClick={handleClear} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
          <Trash2 className="h-4 w-4" /> Clear
        </button>
      </div>
      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">HTML Input</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full h-80 rounded-xl border border-gray-200 bg-white p-4 font-mono text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none resize-none" placeholder='<div class="container" style="color: red;">&#10;  <input type="text" readonly>&#10;  <br>&#10;</div>' spellCheck={false} />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">JSX Output</label>
          <textarea value={output} readOnly className="w-full h-80 rounded-xl border border-gray-200 bg-gray-50 p-4 font-mono text-sm resize-none" placeholder="JSX output will appear here..." />
        </div>
      </div>
    </div>
  );
}
