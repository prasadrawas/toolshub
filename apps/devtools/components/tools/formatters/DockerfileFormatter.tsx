"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Trash2, Wand2, Minimize2 } from "lucide-react";

const DOCKERFILE_INSTRUCTIONS = [
  "FROM", "RUN", "CMD", "LABEL", "MAINTAINER", "EXPOSE", "ENV",
  "ADD", "COPY", "ENTRYPOINT", "VOLUME", "USER", "WORKDIR",
  "ARG", "ONBUILD", "STOPSIGNAL", "HEALTHCHECK", "SHELL",
];

function formatDockerfile(content: string): string {
  const lines = content.split("\n");
  const formatted: string[] = [];
  let lastInstruction = "";

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    const trimmed = line.trim();

    // Skip empty lines but preserve spacing between instruction groups
    if (!trimmed) {
      if (formatted.length > 0 && formatted[formatted.length - 1] !== "") {
        formatted.push("");
      }
      continue;
    }

    // Comments - keep as-is
    if (trimmed.startsWith("#")) {
      formatted.push(trimmed);
      continue;
    }

    // Uppercase instruction keywords
    let processedLine = trimmed;
    for (const instruction of DOCKERFILE_INSTRUCTIONS) {
      const regex = new RegExp(`^${instruction}\\b`, "i");
      if (regex.test(processedLine)) {
        processedLine = instruction + processedLine.substring(instruction.length);

        // Add blank line between different instruction types
        const currentInstruction = instruction;
        if (
          lastInstruction &&
          lastInstruction !== currentInstruction &&
          formatted.length > 0 &&
          formatted[formatted.length - 1] !== ""
        ) {
          // Add space before FROM (multi-stage)
          if (currentInstruction === "FROM" && formatted.length > 1) {
            formatted.push("");
          }
        }
        lastInstruction = currentInstruction;
        break;
      }
    }

    // Align continuation lines (lines ending with \)
    if (processedLine.endsWith("\\")) {
      formatted.push(processedLine);
    } else if (
      formatted.length > 0 &&
      formatted[formatted.length - 1].endsWith("\\")
    ) {
      // This is a continuation line - indent it
      formatted.push("    " + processedLine);
    } else {
      formatted.push(processedLine);
    }
  }

  return formatted.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd();
}

function minifyDockerfile(content: string): string {
  return content
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"))
    .join("\n");
}

export default function DockerfileFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const handleFormat = () => {
    if (!input.trim()) return;
    setOutput(formatDockerfile(input));
  };

  const handleMinify = () => {
    if (!input.trim()) return;
    setOutput(minifyDockerfile(input));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
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
          Compact
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-80 rounded-xl border border-gray-200 bg-white p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-300 resize-none"
            placeholder="Paste your Dockerfile here..."
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
