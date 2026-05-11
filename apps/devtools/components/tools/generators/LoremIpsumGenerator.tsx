"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, RefreshCw, Trash2 } from "lucide-react";

const LOREM_WORDS = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud",
  "exercitation", "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo",
  "consequat", "duis", "aute", "irure", "in", "reprehenderit", "voluptate",
  "velit", "esse", "cillum", "fugiat", "nulla", "pariatur", "excepteur", "sint",
  "occaecat", "cupidatat", "non", "proident", "sunt", "culpa", "qui", "officia",
  "deserunt", "mollit", "anim", "id", "est", "laborum", "at", "vero", "eos",
  "accusamus", "iusto", "odio", "dignissimos", "ducimus", "blanditiis",
  "praesentium", "voluptatum", "deleniti", "atque", "corrupti", "quos", "dolores",
  "quas", "molestias", "excepturi", "obcaecati", "cupiditate", "provident",
  "similique", "mollitia", "animi", "perspiciatis", "unde", "omnis", "iste",
  "natus", "error", "voluptatem", "accusantium", "doloremque", "laudantium",
  "totam", "rem", "aperiam", "eaque", "ipsa", "quae", "ab", "illo", "inventore",
  "veritatis", "quasi", "architecto", "beatae", "vitae", "dicta", "explicabo",
];

const LOREM_START = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";

function randomWord(): string {
  return LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];
}

function generateSentence(): string {
  const len = 8 + Math.floor(Math.random() * 12);
  const words = [];
  for (let i = 0; i < len; i++) words.push(randomWord());
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(" ") + ".";
}

function generateParagraph(): string {
  const count = 3 + Math.floor(Math.random() * 5);
  const sentences = [];
  for (let i = 0; i < count; i++) sentences.push(generateSentence());
  return sentences.join(" ");
}

export default function LoremIpsumGenerator() {
  const [mode, setMode] = useState<"paragraphs" | "sentences" | "words">("paragraphs");
  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = () => {
    let result = "";
    if (mode === "paragraphs") {
      const paragraphs: string[] = [];
      for (let i = 0; i < count; i++) {
        paragraphs.push(generateParagraph());
      }
      if (startWithLorem && paragraphs.length > 0) {
        paragraphs[0] = LOREM_START + " " + paragraphs[0];
      }
      result = paragraphs.join("\n\n");
    } else if (mode === "sentences") {
      const sentences: string[] = [];
      for (let i = 0; i < count; i++) {
        sentences.push(generateSentence());
      }
      if (startWithLorem && sentences.length > 0) {
        sentences[0] = LOREM_START;
      }
      result = sentences.join(" ");
    } else {
      const words: string[] = [];
      for (let i = 0; i < count; i++) {
        words.push(randomWord());
      }
      if (startWithLorem && words.length >= 2) {
        words[0] = "lorem";
        words[1] = "ipsum";
      }
      result = words.join(" ");
    }
    setOutput(result);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
        <div className="flex flex-wrap items-center gap-4">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Type
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as any)}
              className="rounded-lg border border-gray-200 px-2 py-1 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
            >
              <option value="paragraphs">Paragraphs</option>
              <option value="sentences">Sentences</option>
              <option value="words">Words</option>
            </select>
          </label>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            Count
            <input
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(e) => setCount(Math.min(100, Math.max(1, Number(e.target.value))))}
              className="w-20 rounded-lg border border-gray-200 px-2 py-1 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
            />
          </label>
          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
            <input
              type="checkbox"
              checked={startWithLorem}
              onChange={(e) => setStartWithLorem(e.target.checked)}
              className="rounded border-gray-300"
            />
            Start with &quot;Lorem ipsum...&quot;
          </label>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={generate}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100"
          >
            <RefreshCw className="h-4 w-4" /> Generate
          </button>
          <button
            onClick={handleCopy}
            disabled={!output}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
          </button>
          <button
            onClick={() => setOutput("")}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            <Trash2 className="h-4 w-4" /> Clear
          </button>
        </div>
      </div>

      {output && (
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Generated Text</label>
          <div className="text-sm text-gray-800 bg-gray-50 rounded-lg p-4 whitespace-pre-wrap leading-relaxed">
            {output}
          </div>
        </div>
      )}
    </div>
  );
}
