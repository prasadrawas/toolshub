"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, ArrowLeftRight, Trash2 } from "lucide-react";

function envToJson(env: string): string {
  const result: Record<string, string> = {};
  const lines = env.split("\n");
  let i = 0;

  while (i < lines.length) {
    let line = lines[i].trim();
    i++;

    // Skip comments and empty lines
    if (!line || line.startsWith("#")) continue;

    // Handle backslash continuation
    while (line.endsWith("\\") && i < lines.length) {
      line = line.slice(0, -1) + lines[i].trim();
      i++;
    }

    const eqIdx = line.indexOf("=");
    if (eqIdx === -1) continue;

    const key = line.slice(0, eqIdx).trim();
    let value = line.slice(eqIdx + 1).trim();

    // Strip surrounding quotes
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    // Handle escape sequences in double-quoted values
    value = value.replace(/\\n/g, "\n").replace(/\\t/g, "\t").replace(/\\"/g, '"');

    if (key) result[key] = value;
  }

  return JSON.stringify(result, null, 2);
}

function jsonToEnv(json: string): string {
  const obj = JSON.parse(json);
  if (typeof obj !== "object" || obj === null || Array.isArray(obj)) {
    throw new Error("JSON must be a flat object with string values.");
  }
  const lines: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const strVal = String(value);
    // Quote values that contain spaces, special chars, or are empty
    const needsQuotes = strVal === "" || /[\s#"'$\\]/.test(strVal) || strVal.includes("=");
    if (needsQuotes) {
      const escaped = strVal.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n");
      lines.push(`${key}="${escaped}"`);
    } else {
      lines.push(`${key}=${strVal}`);
    }
  }
  return lines.join("\n");
}

const EXAMPLE_ENV = `# Database configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=myapp
DB_USER=admin
DB_PASSWORD="s3cr3t p@ss"

# App settings
NODE_ENV=production
API_KEY='abc-123-def-456'
DESCRIPTION="A multi-word \\
description value"
EMPTY_VALUE=
SPECIAL_CHARS="hello \\"world\\""`;

const EXAMPLE_JSON = `{
  "DB_HOST": "localhost",
  "DB_PORT": "5432",
  "DB_NAME": "myapp",
  "NODE_ENV": "production",
  "API_KEY": "abc-123-def-456"
}`;

export default function EnvToJson() {
  const [mode, setMode] = useState<"envToJson" | "jsonToEnv">("envToJson");
  const [input, setInput] = useState(EXAMPLE_ENV);
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const convert = () => {
    setError("");
    try {
      if (mode === "envToJson") {
        setOutput(envToJson(input));
      } else {
        setOutput(jsonToEnv(input));
      }
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSwap = () => {
    if (output) {
      const newMode = mode === "envToJson" ? "jsonToEnv" : "envToJson";
      setMode(newMode as typeof mode);
      setInput(output);
      setOutput("");
      setError("");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => { setMode("envToJson"); setInput(EXAMPLE_ENV); setOutput(""); setError(""); }}
          className={cn("rounded-lg px-3 py-1.5 text-sm font-medium", mode === "envToJson" ? "bg-brand-50 text-brand-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}
        >
          .env to JSON
        </button>
        <button
          onClick={() => { setMode("jsonToEnv"); setInput(EXAMPLE_JSON); setOutput(""); setError(""); }}
          className={cn("rounded-lg px-3 py-1.5 text-sm font-medium", mode === "jsonToEnv" ? "bg-brand-50 text-brand-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200")}
        >
          JSON to .env
        </button>
        <button onClick={convert} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100">
          Convert
        </button>
        <button onClick={handleCopy} disabled={!output} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? "Copied" : "Copy"}
        </button>
        <button onClick={handleSwap} disabled={!output} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50">
          <ArrowLeftRight className="h-4 w-4" /> Swap
        </button>
        <button onClick={() => { setInput(""); setOutput(""); setError(""); }} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
          <Trash2 className="h-4 w-4" /> Clear
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">
            {mode === "envToJson" ? "Input (.env)" : "Input (JSON)"}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-80 rounded-xl border border-gray-200 bg-white p-4 font-mono text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none resize-none"
            placeholder={mode === "envToJson" ? "KEY=VALUE\n# comment" : '{ "KEY": "VALUE" }'}
            spellCheck={false}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">
            {mode === "envToJson" ? "Output (JSON)" : "Output (.env)"}
          </label>
          <textarea
            value={output}
            readOnly
            className="w-full h-80 rounded-xl border border-gray-200 bg-gray-50 p-4 font-mono text-sm resize-none"
            placeholder="Result will appear here..."
          />
        </div>
      </div>
    </div>
  );
}
