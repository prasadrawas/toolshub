"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, RefreshCw, Trash2, Monitor } from "lucide-react";

interface UAResult {
  browser: string;
  browserVersion: string;
  os: string;
  osVersion: string;
  device: string;
  engine: string;
  engineVersion: string;
}

function parseUA(ua: string): UAResult {
  const result: UAResult = {
    browser: "Unknown",
    browserVersion: "",
    os: "Unknown",
    osVersion: "",
    device: "Desktop",
    engine: "Unknown",
    engineVersion: "",
  };

  // Browser detection
  if (/Edg\//i.test(ua)) {
    result.browser = "Microsoft Edge";
    result.browserVersion = ua.match(/Edg\/([\d.]+)/)?.[1] || "";
  } else if (/OPR\//i.test(ua) || /Opera/i.test(ua)) {
    result.browser = "Opera";
    result.browserVersion = ua.match(/(?:OPR|Opera)\/([\d.]+)/)?.[1] || "";
  } else if (/Chrome\//i.test(ua) && !/Chromium/i.test(ua)) {
    result.browser = "Google Chrome";
    result.browserVersion = ua.match(/Chrome\/([\d.]+)/)?.[1] || "";
  } else if (/Safari\//i.test(ua) && !/Chrome/i.test(ua)) {
    result.browser = "Safari";
    result.browserVersion = ua.match(/Version\/([\d.]+)/)?.[1] || "";
  } else if (/Firefox\//i.test(ua)) {
    result.browser = "Mozilla Firefox";
    result.browserVersion = ua.match(/Firefox\/([\d.]+)/)?.[1] || "";
  } else if (/MSIE|Trident/i.test(ua)) {
    result.browser = "Internet Explorer";
    result.browserVersion = ua.match(/(?:MSIE |rv:)([\d.]+)/)?.[1] || "";
  }

  // OS detection
  if (/Windows NT 10/i.test(ua)) { result.os = "Windows"; result.osVersion = "10/11"; }
  else if (/Windows NT 6\.3/i.test(ua)) { result.os = "Windows"; result.osVersion = "8.1"; }
  else if (/Windows NT 6\.2/i.test(ua)) { result.os = "Windows"; result.osVersion = "8"; }
  else if (/Windows NT 6\.1/i.test(ua)) { result.os = "Windows"; result.osVersion = "7"; }
  else if (/Windows/i.test(ua)) { result.os = "Windows"; }
  else if (/Mac OS X ([\d_]+)/i.test(ua)) {
    result.os = "macOS";
    result.osVersion = ua.match(/Mac OS X ([\d_.]+)/)?.[1]?.replace(/_/g, ".") || "";
  } else if (/Android ([\d.]+)/i.test(ua)) {
    result.os = "Android";
    result.osVersion = ua.match(/Android ([\d.]+)/)?.[1] || "";
  } else if (/iPhone OS ([\d_]+)/i.test(ua) || /iPad/i.test(ua)) {
    result.os = "iOS";
    result.osVersion = ua.match(/(?:iPhone OS|CPU OS) ([\d_]+)/)?.[1]?.replace(/_/g, ".") || "";
  } else if (/Linux/i.test(ua)) { result.os = "Linux"; }
  else if (/CrOS/i.test(ua)) { result.os = "Chrome OS"; }

  // Device
  if (/Mobile|Android.*Mobile|iPhone/i.test(ua)) result.device = "Mobile";
  else if (/Tablet|iPad/i.test(ua)) result.device = "Tablet";
  else if (/Bot|Crawler|Spider|Googlebot|Bingbot/i.test(ua)) result.device = "Bot";

  // Engine
  if (/AppleWebKit\/([\d.]+)/i.test(ua)) {
    result.engine = "WebKit";
    result.engineVersion = ua.match(/AppleWebKit\/([\d.]+)/)?.[1] || "";
    if (/Chrome/i.test(ua)) result.engine = "Blink";
  } else if (/Gecko\/([\d.]+)/i.test(ua)) {
    result.engine = "Gecko";
    result.engineVersion = ua.match(/Gecko\/([\d.]+)/)?.[1] || "";
  } else if (/Trident\/([\d.]+)/i.test(ua)) {
    result.engine = "Trident";
    result.engineVersion = ua.match(/Trident\/([\d.]+)/)?.[1] || "";
  }

  return result;
}

export default function UserAgentParser() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<UAResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleParse = () => {
    if (!input.trim()) return;
    setResult(parseUA(input));
  };

  const useCurrentUA = () => {
    const ua = navigator.userAgent;
    setInput(ua);
    setResult(parseUA(ua));
  };

  const handleCopy = () => {
    if (!result) return;
    const text = Object.entries(result).map(([k, v]) => `${k}: ${v}`).join("\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">User Agent String</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-gray-200 bg-white p-4 font-mono text-xs focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none resize-none"
            placeholder="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36..."
            spellCheck={false}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleParse} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100">
            <RefreshCw className="h-4 w-4" /> Parse
          </button>
          <button onClick={useCurrentUA} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
            <Monitor className="h-4 w-4" /> Use Current
          </button>
          <button onClick={handleCopy} disabled={!result} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button onClick={() => { setInput(""); setResult(null); }} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
            <Trash2 className="h-4 w-4" /> Clear
          </button>
        </div>
      </div>

      {result && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Browser", value: result.browser + (result.browserVersion ? ` ${result.browserVersion}` : "") },
            { label: "OS", value: result.os + (result.osVersion ? ` ${result.osVersion}` : "") },
            { label: "Device", value: result.device },
            { label: "Engine", value: result.engine + (result.engineVersion ? ` ${result.engineVersion}` : "") },
          ].map((item) => (
            <div key={item.label} className="rounded-xl border border-gray-200 bg-white p-3 text-center">
              <div className="text-sm font-semibold text-gray-800">{item.value}</div>
              <div className="text-xs text-gray-500">{item.label}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
