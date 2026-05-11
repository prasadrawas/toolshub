"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Trash2 } from "lucide-react";

const METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD"];
const COMMON_HEADERS = ["Content-Type", "Authorization", "Accept", "X-Requested-With", "X-Custom-Header", "Cache-Control"];

export default function CorsHeaderBuilder() {
  const [origins, setOrigins] = useState("*");
  const [methods, setMethods] = useState<string[]>(["GET", "POST"]);
  const [headers, setHeaders] = useState<string[]>(["Content-Type"]);
  const [credentials, setCredentials] = useState(false);
  const [maxAge, setMaxAge] = useState(86400);
  const [copied, setCopied] = useState(false);

  const toggleMethod = (m: string) => {
    setMethods((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  };

  const toggleHeader = (h: string) => {
    setHeaders((prev) => (prev.includes(h) ? prev.filter((x) => x !== h) : [...prev, h]));
  };

  const output = [
    `Access-Control-Allow-Origin: ${origins}`,
    `Access-Control-Allow-Methods: ${methods.join(", ")}`,
    `Access-Control-Allow-Headers: ${headers.join(", ")}`,
    `Access-Control-Allow-Credentials: ${credentials}`,
    `Access-Control-Max-Age: ${maxAge}`,
  ].join("\n");

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Allowed Origins</label>
          <input
            type="text"
            value={origins}
            onChange={(e) => setOrigins(e.target.value)}
            placeholder="* or https://example.com"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Allowed Methods</label>
          <div className="flex flex-wrap gap-2">
            {METHODS.map((m) => (
              <button
                key={m}
                onClick={() => toggleMethod(m)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-medium",
                  methods.includes(m)
                    ? "bg-brand-50 text-brand-700 ring-2 ring-brand-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Allowed Headers</label>
          <div className="flex flex-wrap gap-2">
            {COMMON_HEADERS.map((h) => (
              <button
                key={h}
                onClick={() => toggleHeader(h)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-xs font-medium",
                  headers.includes(h)
                    ? "bg-brand-50 text-brand-700 ring-2 ring-brand-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                {h}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <input
              type="checkbox"
              checked={credentials}
              onChange={(e) => setCredentials(e.target.checked)}
              className="rounded border-gray-300"
            />
            Allow Credentials
          </label>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Max Age (seconds)
            <input
              type="number"
              min={0}
              value={maxAge}
              onChange={(e) => setMaxAge(Number(e.target.value))}
              className="w-24 rounded-lg border border-gray-200 px-2 py-1 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
            />
          </label>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy Headers"}
        </button>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1.5 block">Generated Headers</label>
        <pre className="rounded-xl border border-gray-200 bg-white p-4 font-mono text-sm text-gray-800 overflow-x-auto whitespace-pre-wrap">
          {output}
        </pre>
      </div>
    </div>
  );
}
