"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Trash2, Wand2, Minimize2 } from "lucide-react";

function formatToml(toml: string): string {
  const lines = toml.split("\n");
  const formatted: string[] = [];
  let lastWasSection = false;

  for (const line of lines) {
    const trimmed = line.trim();

    // Skip empty lines but track them
    if (!trimmed) continue;

    // Skip comments but keep them
    if (trimmed.startsWith("#")) {
      formatted.push(trimmed);
      continue;
    }

    // Section headers [section] or [[array]]
    if (trimmed.startsWith("[")) {
      if (formatted.length > 0) {
        formatted.push("");
      }
      formatted.push(trimmed);
      lastWasSection = true;
      continue;
    }

    // Key-value pairs
    const kvMatch = trimmed.match(/^([^=]+?)\s*=\s*(.*)/);
    if (kvMatch) {
      const key = kvMatch[1].trim();
      const value = kvMatch[2].trim();
      formatted.push(`${key} = ${value}`);
      lastWasSection = false;
    } else {
      formatted.push(trimmed);
    }
  }

  return formatted.join("\n").trimEnd();
}

function minifyToml(toml: string): string {
  return toml
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"))
    .map((l) => {
      const m = l.match(/^([^=]+?)\s*=\s*(.*)/);
      if (m) return `${m[1].trim()}=${m[2].trim()}`;
      return l;
    })
    .join("\n");
}

function validateToml(toml: string): string[] {
  const errors: string[] = [];
  const lines = toml.split("\n");

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    if (trimmed.startsWith("[")) {
      if (!trimmed.endsWith("]")) {
        errors.push(`Line ${i + 1}: Unclosed section header`);
      }
      continue;
    }

    if (!trimmed.includes("=")) {
      errors.push(`Line ${i + 1}: Missing '=' in key-value pair`);
    }
  }

  return errors;
}

export default function TomlFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  const handleFormat = () => {
    if (!input.trim()) return;
    const validationErrors = validateToml(input);
    setErrors(validationErrors);
    setOutput(formatToml(input));
  };

  const handleMinify = () => {
    if (!input.trim()) return;
    setErrors([]);
    setOutput(minifyToml(input));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setErrors([]);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={handleFormat}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors bg-brand-50 text-brand-700 hover:bg-brand-100"
        >
          <Wand2 className="h-4 w-4" />
          Format
        </button>
        <button
          onClick={handleMinify}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors bg-brand-50 text-brand-700 hover:bg-brand-100"
        >
          <Minimize2 className="h-4 w-4" />
          Minify
        </button>
        <button
          onClick={handleCopy}
          disabled={!output}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy"}
        </button>
        <button
          onClick={handleClear}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors bg-gray-100 text-gray-600 hover:bg-gray-200"
        >
          <Trash2 className="h-4 w-4" />
          Clear
        </button>
      </div>

      {errors.length > 0 && (
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-700">
          <p className="font-medium mb-1">Validation warnings:</p>
          <ul className="list-disc list-inside space-y-0.5">
            {errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-80 rounded-xl border border-gray-200 bg-white p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-300 resize-none"
            placeholder="Paste your TOML here..."
            spellCheck={false}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Output</label>
          <textarea
            value={output}
            readOnly
            className="w-full h-80 rounded-xl border border-gray-200 bg-gray-50 p-4 font-mono text-sm resize-none"
            placeholder="Formatted output will appear here..."
          />
        </div>
      </div>
    </div>
  );
}
