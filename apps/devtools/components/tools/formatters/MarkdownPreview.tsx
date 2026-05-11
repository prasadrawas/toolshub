"use client";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Trash2, Eye } from "lucide-react";

function parseMarkdown(md: string): string {
  let html = md;

  // Code blocks (fenced)
  html = html.replace(
    /```(\w*)\n([\s\S]*?)```/g,
    '<pre class="bg-gray-100 rounded-lg p-3 my-2 overflow-x-auto"><code>$2</code></pre>'
  );

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 rounded px-1 py-0.5 text-sm">$1</code>');

  // Headers
  html = html.replace(/^######\s+(.+)$/gm, '<h6 class="text-sm font-bold mt-4 mb-1">$1</h6>');
  html = html.replace(/^#####\s+(.+)$/gm, '<h5 class="text-sm font-bold mt-4 mb-1">$1</h5>');
  html = html.replace(/^####\s+(.+)$/gm, '<h4 class="text-base font-bold mt-4 mb-1">$1</h4>');
  html = html.replace(/^###\s+(.+)$/gm, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>');
  html = html.replace(/^##\s+(.+)$/gm, '<h2 class="text-xl font-bold mt-5 mb-2">$1</h2>');
  html = html.replace(/^#\s+(.+)$/gm, '<h1 class="text-2xl font-bold mt-6 mb-3">$1</h1>');

  // Horizontal rule
  html = html.replace(/^---+$/gm, '<hr class="my-4 border-gray-300" />');

  // Bold & Italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  html = html.replace(/___(.+?)___/g, "<strong><em>$1</em></strong>");
  html = html.replace(/__(.+?)__/g, "<strong>$1</strong>");
  html = html.replace(/_(.+?)_/g, "<em>$1</em>");

  // Strikethrough
  html = html.replace(/~~(.+?)~~/g, "<del>$1</del>");

  // Images
  html = html.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    '<img src="$2" alt="$1" class="max-w-full rounded my-2" />'
  );

  // Links
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" class="text-brand-600 underline hover:text-brand-800" target="_blank" rel="noopener">$1</a>'
  );

  // Blockquote
  html = html.replace(
    /^>\s+(.+)$/gm,
    '<blockquote class="border-l-4 border-gray-300 pl-4 py-1 my-2 text-gray-600 italic">$1</blockquote>'
  );

  // Unordered lists
  html = html.replace(/^[-*+]\s+(.+)$/gm, '<li class="ml-4 list-disc">$1</li>');

  // Ordered lists
  html = html.replace(/^\d+\.\s+(.+)$/gm, '<li class="ml-4 list-decimal">$1</li>');

  // Wrap consecutive <li> in <ul> or <ol>
  html = html.replace(
    /(<li class="ml-4 list-disc">[\s\S]*?<\/li>\n?)+/g,
    '<ul class="my-2">$&</ul>'
  );
  html = html.replace(
    /(<li class="ml-4 list-decimal">[\s\S]*?<\/li>\n?)+/g,
    '<ol class="my-2">$&</ol>'
  );

  // Paragraphs - wrap remaining lines
  html = html.replace(/^(?!<[a-z/])((?!^\s*$).+)$/gm, '<p class="my-1">$1</p>');

  // Line breaks
  html = html.replace(/\n\n+/g, "\n");

  return html;
}

export default function MarkdownPreview() {
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const renderedHtml = useMemo(() => {
    if (!input.trim()) return "";
    return parseMarkdown(input);
  }, [input]);

  const handleCopy = () => {
    navigator.clipboard.writeText(renderedHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleClear = () => {
    setInput("");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700">
          <Eye className="h-4 w-4" />
          Live Preview
        </div>
        <button
          onClick={handleCopy}
          disabled={!renderedHtml}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied HTML" : "Copy HTML"}
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
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Markdown Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full h-80 rounded-xl border border-gray-200 bg-white p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-300 resize-none"
            placeholder="Type your markdown here..."
            spellCheck={false}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Preview</label>
          <div
            className="w-full h-80 rounded-xl border border-gray-200 bg-white p-4 text-sm overflow-auto prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: renderedHtml || '<p class="text-gray-400">Preview will appear here...</p>' }}
          />
        </div>
      </div>
    </div>
  );
}
