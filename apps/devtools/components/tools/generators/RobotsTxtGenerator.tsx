"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Trash2, Plus, X, Download } from "lucide-react";

interface Rule {
  id: number;
  type: "allow" | "disallow";
  path: string;
}

export default function RobotsTxtGenerator() {
  const [userAgent, setUserAgent] = useState("*");
  const [rules, setRules] = useState<Rule[]>([
    { id: 1, type: "disallow", path: "/admin/" },
    { id: 2, type: "disallow", path: "/private/" },
    { id: 3, type: "allow", path: "/" },
  ]);
  const [sitemapUrl, setSitemapUrl] = useState("");
  const [crawlDelay, setCrawlDelay] = useState("");
  const [copied, setCopied] = useState(false);
  let nextId = Math.max(0, ...rules.map((r) => r.id)) + 1;

  const addRule = () => {
    setRules([...rules, { id: nextId++, type: "disallow", path: "/" }]);
  };

  const removeRule = (id: number) => {
    setRules(rules.filter((r) => r.id !== id));
  };

  const updateRule = (id: number, field: "type" | "path", value: string) => {
    setRules(rules.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const generateOutput = (): string => {
    const lines: string[] = [];
    lines.push(`User-agent: ${userAgent}`);

    if (crawlDelay) {
      lines.push(`Crawl-delay: ${crawlDelay}`);
    }

    for (const rule of rules) {
      lines.push(`${rule.type === "allow" ? "Allow" : "Disallow"}: ${rule.path}`);
    }

    if (sitemapUrl) {
      lines.push("");
      lines.push(`Sitemap: ${sitemapUrl}`);
    }

    return lines.join("\n");
  };

  const output = generateOutput();

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownload = () => {
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = "robots.txt";
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">User-Agent</label>
            <input
              type="text"
              value={userAgent}
              onChange={(e) => setUserAgent(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
              placeholder="* (all bots)"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Crawl Delay (seconds)</label>
            <input
              type="number"
              value={crawlDelay}
              onChange={(e) => setCrawlDelay(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
              placeholder="Optional"
              min={0}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Sitemap URL</label>
          <input
            type="text"
            value={sitemapUrl}
            onChange={(e) => setSitemapUrl(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
            placeholder="https://example.com/sitemap.xml"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Rules</label>
            <button
              onClick={addRule}
              className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium bg-brand-50 text-brand-700 hover:bg-brand-100"
            >
              <Plus className="h-3 w-3" /> Add Rule
            </button>
          </div>
          <div className="space-y-2">
            {rules.map((rule) => (
              <div key={rule.id} className="flex items-center gap-2">
                <select
                  value={rule.type}
                  onChange={(e) => updateRule(rule.id, "type", e.target.value)}
                  className="rounded-lg border border-gray-200 px-2 py-1.5 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
                >
                  <option value="allow">Allow</option>
                  <option value="disallow">Disallow</option>
                </select>
                <input
                  type="text"
                  value={rule.path}
                  onChange={(e) => updateRule(rule.id, "path", e.target.value)}
                  className="flex-1 rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-mono focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
                  placeholder="/path/"
                />
                <button
                  onClick={() => removeRule(rule.id)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            <Download className="h-4 w-4" /> Download robots.txt
          </button>
          <button
            onClick={() => { setRules([]); setSitemapUrl(""); setCrawlDelay(""); setUserAgent("*"); }}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            <Trash2 className="h-4 w-4" /> Clear
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <label className="text-sm font-medium text-gray-700 mb-2 block">Generated robots.txt</label>
        <pre className="text-sm font-mono text-gray-800 bg-gray-50 rounded-lg p-4 whitespace-pre-wrap">
          {output}
        </pre>
      </div>
    </div>
  );
}
