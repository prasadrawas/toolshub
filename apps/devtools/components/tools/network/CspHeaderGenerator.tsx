"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Trash2 } from "lucide-react";

const DIRECTIVES = [
  { key: "default-src", label: "default-src", placeholder: "'self'" },
  { key: "script-src", label: "script-src", placeholder: "'self' 'unsafe-inline'" },
  { key: "style-src", label: "style-src", placeholder: "'self' 'unsafe-inline'" },
  { key: "img-src", label: "img-src", placeholder: "'self' data: https:" },
  { key: "font-src", label: "font-src", placeholder: "'self' https://fonts.gstatic.com" },
  { key: "connect-src", label: "connect-src", placeholder: "'self' https://api.example.com" },
  { key: "media-src", label: "media-src", placeholder: "'self'" },
  { key: "object-src", label: "object-src", placeholder: "'none'" },
  { key: "frame-src", label: "frame-src", placeholder: "'self'" },
  { key: "child-src", label: "child-src", placeholder: "'self'" },
  { key: "worker-src", label: "worker-src", placeholder: "'self' blob:" },
  { key: "frame-ancestors", label: "frame-ancestors", placeholder: "'self'" },
  { key: "form-action", label: "form-action", placeholder: "'self'" },
  { key: "base-uri", label: "base-uri", placeholder: "'self'" },
  { key: "manifest-src", label: "manifest-src", placeholder: "'self'" },
];

export default function CspHeaderGenerator() {
  const [values, setValues] = useState<Record<string, string>>({
    "default-src": "'self'",
    "script-src": "'self'",
    "style-src": "'self' 'unsafe-inline'",
    "img-src": "'self' data: https:",
    "font-src": "'self'",
    "connect-src": "'self'",
    "object-src": "'none'",
  });
  const [copied, setCopied] = useState(false);

  const update = (key: string, value: string) => {
    setValues((prev) => {
      const next = { ...prev };
      if (value) next[key] = value;
      else delete next[key];
      return next;
    });
  };

  const csp = Object.entries(values)
    .filter(([, v]) => v.trim())
    .map(([k, v]) => `${k} ${v}`)
    .join("; ");

  const headerLine = `Content-Security-Policy: ${csp}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(headerLine);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleClear = () => {
    setValues({});
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={handleCopy}
          disabled={!csp}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100 disabled:opacity-50"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy Header"}
        </button>
        <button
          onClick={handleClear}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
        >
          <Trash2 className="h-4 w-4" /> Clear All
        </button>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
        {DIRECTIVES.map((d) => (
          <div key={d.key} className="flex flex-col sm:flex-row sm:items-center gap-2">
            <label className="text-sm font-medium text-gray-700 font-mono w-40 shrink-0">{d.label}</label>
            <input
              type="text"
              value={values[d.key] || ""}
              onChange={(e) => update(d.key, e.target.value)}
              placeholder={d.placeholder}
              className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
            />
          </div>
        ))}
      </div>

      {csp && (
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Generated Header</label>
          <pre className="rounded-xl border border-gray-200 bg-white p-4 font-mono text-xs text-gray-800 overflow-x-auto whitespace-pre-wrap break-all">
            {headerLine}
          </pre>
        </div>
      )}
    </div>
  );
}
