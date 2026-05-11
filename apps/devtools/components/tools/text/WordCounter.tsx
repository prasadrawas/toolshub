"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Trash2, FileText } from "lucide-react";

function countStats(text: string) {
  const characters = text.length;
  const charactersNoSpaces = text.replace(/\s/g, "").length;
  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const sentences = text.trim() === "" ? 0 : text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
  const paragraphs = text.trim() === "" ? 0 : text.split(/\n\s*\n/).filter((p) => p.trim().length > 0).length;
  const lines = text === "" ? 0 : text.split("\n").length;
  const readingTime = Math.max(1, Math.ceil(words / 200));

  return { characters, charactersNoSpaces, words, sentences, paragraphs, lines, readingTime };
}

export default function WordCounter() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const stats = countStats(text);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={handleCopy}
          disabled={!text}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy"}
        </button>
        <button
          onClick={() => setText("")}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
        >
          <Trash2 className="h-4 w-4" /> Clear
        </button>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1.5 block">Text</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-64 rounded-xl border border-gray-200 bg-white p-4 font-mono text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none resize-none"
          placeholder="Start typing or paste text..."
          spellCheck={false}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {[
          { label: "Characters", value: stats.characters },
          { label: "No Spaces", value: stats.charactersNoSpaces },
          { label: "Words", value: stats.words },
          { label: "Sentences", value: stats.sentences },
          { label: "Paragraphs", value: stats.paragraphs },
          { label: "Lines", value: stats.lines },
          { label: "Reading Time", value: `${stats.readingTime} min` },
        ].map((item) => (
          <div key={item.label} className="rounded-xl border border-gray-200 bg-white p-3 text-center">
            <div className="text-lg font-semibold text-gray-800">{item.value}</div>
            <div className="text-xs text-gray-500">{item.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
