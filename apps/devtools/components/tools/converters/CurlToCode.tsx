"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Trash2 } from "lucide-react";

interface ParsedCurl {
  method: string;
  url: string;
  headers: Record<string, string>;
  data: string | null;
}

function parseCurl(curl: string): ParsedCurl {
  const result: ParsedCurl = { method: "GET", url: "", headers: {}, data: null };

  // Normalize: remove line continuations and collapse whitespace
  let normalized = curl.replace(/\\\n/g, " ").replace(/\\\r\n/g, " ").trim();

  // Remove leading "curl" keyword
  if (normalized.startsWith("curl ")) {
    normalized = normalized.slice(5).trim();
  }

  const tokens: string[] = [];
  let current = "";
  let inSingle = false;
  let inDouble = false;

  for (let i = 0; i < normalized.length; i++) {
    const ch = normalized[i];
    if (ch === "'" && !inDouble) { inSingle = !inSingle; continue; }
    if (ch === '"' && !inSingle) {
      if (inDouble) { inDouble = false; continue; }
      inDouble = true; continue;
    }
    if (ch === "\\" && inDouble && i + 1 < normalized.length) { current += normalized[++i]; continue; }
    if (ch === " " && !inSingle && !inDouble) {
      if (current) { tokens.push(current); current = ""; }
      continue;
    }
    current += ch;
  }
  if (current) tokens.push(current);

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token === "-X" || token === "--request") {
      result.method = tokens[++i]?.toUpperCase() || "GET";
    } else if (token === "-H" || token === "--header") {
      const header = tokens[++i] || "";
      const colonIdx = header.indexOf(":");
      if (colonIdx !== -1) {
        result.headers[header.slice(0, colonIdx).trim()] = header.slice(colonIdx + 1).trim();
      }
    } else if (token === "-d" || token === "--data" || token === "--data-raw" || token === "--data-binary") {
      result.data = tokens[++i] || "";
      if (result.method === "GET") result.method = "POST";
    } else if (!token.startsWith("-") && !result.url) {
      result.url = token;
    }
  }

  if (!result.url) throw new Error("No URL found in cURL command");
  return result;
}

function toJavaScript(parsed: ParsedCurl): string {
  const lines: string[] = [];
  const options: string[] = [];

  options.push(`  method: "${parsed.method}"`);

  if (Object.keys(parsed.headers).length > 0) {
    const headerLines = Object.entries(parsed.headers)
      .map(([k, v]) => `    "${k}": "${v}"`)
      .join(",\n");
    options.push(`  headers: {\n${headerLines}\n  }`);
  }

  if (parsed.data) {
    options.push(`  body: ${JSON.stringify(parsed.data)}`);
  }

  lines.push(`const response = await fetch("${parsed.url}", {`);
  lines.push(options.join(",\n"));
  lines.push("});");
  lines.push("");
  lines.push("const data = await response.json();");
  lines.push("console.log(data);");

  return lines.join("\n");
}

function toPython(parsed: ParsedCurl): string {
  const lines: string[] = [];
  lines.push("import requests");
  lines.push("");

  const hasHeaders = Object.keys(parsed.headers).length > 0;

  if (hasHeaders) {
    const headerLines = Object.entries(parsed.headers)
      .map(([k, v]) => `    "${k}": "${v}"`)
      .join(",\n");
    lines.push(`headers = {\n${headerLines}\n}`);
    lines.push("");
  }

  const args: string[] = [`"${parsed.url}"`];
  if (hasHeaders) args.push("headers=headers");
  if (parsed.data) args.push(`data=${JSON.stringify(parsed.data)}`);

  const method = parsed.method.toLowerCase();
  const methodFn = ["get", "post", "put", "patch", "delete"].includes(method) ? method : "request";

  if (methodFn === "request") {
    args.unshift(`"${parsed.method}"`);
  }

  lines.push(`response = requests.${methodFn}(${args.join(", ")})`);
  lines.push("print(response.json())");

  return lines.join("\n");
}

function toGo(parsed: ParsedCurl): string {
  const lines: string[] = [];
  lines.push("package main");
  lines.push("");
  lines.push('import (');
  lines.push('	"fmt"');
  lines.push('	"io"');
  lines.push('	"net/http"');
  if (parsed.data) lines.push('	"strings"');
  lines.push(')');
  lines.push("");
  lines.push("func main() {");

  if (parsed.data) {
    lines.push(`	body := strings.NewReader(${JSON.stringify(parsed.data)})`);
    lines.push(`	req, err := http.NewRequest("${parsed.method}", "${parsed.url}", body)`);
  } else {
    lines.push(`	req, err := http.NewRequest("${parsed.method}", "${parsed.url}", nil)`);
  }

  lines.push('	if err != nil {');
  lines.push('		panic(err)');
  lines.push('	}');

  for (const [k, v] of Object.entries(parsed.headers)) {
    lines.push(`	req.Header.Set("${k}", "${v}")`);
  }

  lines.push("");
  lines.push("	resp, err := http.DefaultClient.Do(req)");
  lines.push("	if err != nil {");
  lines.push("		panic(err)");
  lines.push("	}");
  lines.push("	defer resp.Body.Close()");
  lines.push("");
  lines.push("	respBody, _ := io.ReadAll(resp.Body)");
  lines.push('	fmt.Println(string(respBody))');
  lines.push("}");

  return lines.join("\n");
}

export default function CurlToCode() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [language, setLanguage] = useState<"javascript" | "python" | "go">("javascript");

  const handleConvert = () => {
    setError("");
    try {
      const parsed = parseCurl(input);
      switch (language) {
        case "javascript": setOutput(toJavaScript(parsed)); break;
        case "python": setOutput(toPython(parsed)); break;
        case "go": setOutput(toGo(parsed)); break;
      }
    } catch (e: any) { setError(e.message); setOutput(""); }
  };

  const handleCopy = () => { navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); };
  const handleClear = () => { setInput(""); setOutput(""); setError(""); };

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
        <div className="ml-auto flex items-center gap-2">
          <label className="text-sm text-gray-500">Language:</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as any)}
            className="rounded-lg border border-gray-200 bg-white px-2 py-1 text-sm"
          >
            <option value="javascript">JavaScript (fetch)</option>
            <option value="python">Python (requests)</option>
            <option value="go">Go (net/http)</option>
          </select>
        </div>
      </div>
      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">cURL Input</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} className="w-full h-80 rounded-xl border border-gray-200 bg-white p-4 font-mono text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none resize-none" placeholder={'curl -X POST https://api.example.com/data \\\n  -H "Content-Type: application/json" \\\n  -d \'{"key": "value"}\''} spellCheck={false} />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Code Output</label>
          <textarea value={output} readOnly className="w-full h-80 rounded-xl border border-gray-200 bg-gray-50 p-4 font-mono text-sm resize-none" placeholder="Generated code will appear here..." />
        </div>
      </div>
    </div>
  );
}
