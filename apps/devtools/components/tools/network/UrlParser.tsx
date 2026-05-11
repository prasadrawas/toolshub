"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, RefreshCw, Trash2 } from "lucide-react";

interface ParsedUrl {
  protocol: string;
  host: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  origin: string;
  params: [string, string][];
}

function parseUrl(input: string): ParsedUrl | null {
  try {
    const url = new URL(input);
    const params: [string, string][] = [];
    url.searchParams.forEach((value, key) => params.push([key, value]));
    return {
      protocol: url.protocol,
      host: url.host,
      hostname: url.hostname,
      port: url.port || "(default)",
      pathname: url.pathname,
      search: url.search,
      hash: url.hash,
      origin: url.origin,
      params,
    };
  } catch {
    return null;
  }
}

export default function UrlParser() {
  const [input, setInput] = useState("https://example.com:8080/path/to/page?name=John&age=30&city=NYC#section-1");
  const [parsed, setParsed] = useState<ParsedUrl | null>(null);
  const [copied, setCopied] = useState("");

  const handleParse = () => {
    setParsed(parseUrl(input));
  };

  const copyValue = (val: string) => {
    navigator.clipboard.writeText(val);
    setCopied(val);
    setTimeout(() => setCopied(""), 1500);
  };

  const reconstruct = () => {
    if (!parsed) return;
    try {
      const url = new URL(parsed.origin);
      url.protocol = parsed.protocol;
      url.hostname = parsed.hostname;
      if (parsed.port !== "(default)") url.port = parsed.port;
      url.pathname = parsed.pathname;
      url.hash = parsed.hash;
      parsed.params.forEach(([k, v]) => url.searchParams.set(k, v));
      setInput(url.toString());
    } catch {}
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">URL</label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleParse()}
            placeholder="https://example.com/path?key=value#hash"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          <button onClick={handleParse} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100">
            <RefreshCw className="h-4 w-4" /> Parse
          </button>
          <button onClick={() => { setInput(""); setParsed(null); }} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
            <Trash2 className="h-4 w-4" /> Clear
          </button>
        </div>
      </div>

      {parsed && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: "Protocol", value: parsed.protocol },
              { label: "Host", value: parsed.host },
              { label: "Hostname", value: parsed.hostname },
              { label: "Port", value: parsed.port },
              { label: "Path", value: parsed.pathname },
              { label: "Hash", value: parsed.hash || "(none)" },
              { label: "Origin", value: parsed.origin },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-gray-200 bg-white p-3 flex items-center justify-between group">
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-gray-500">{item.label}</div>
                  <code className="text-sm font-mono text-gray-800 break-all">{item.value}</code>
                </div>
                <button onClick={() => copyValue(item.value)} className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 shrink-0">
                  {copied === item.value ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5 text-gray-400" />}
                </button>
              </div>
            ))}
          </div>

          {parsed.params.length > 0 && (
            <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
              <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
                <label className="text-sm font-medium text-gray-700">Query Parameters ({parsed.params.length})</label>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left px-4 py-2 font-medium text-gray-600">Key</th>
                    <th className="text-left px-4 py-2 font-medium text-gray-600">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {parsed.params.map(([key, value], i) => (
                    <tr key={i} className="border-b border-gray-50">
                      <td className="px-4 py-2 font-mono text-gray-800">{key}</td>
                      <td className="px-4 py-2 font-mono text-gray-600">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
