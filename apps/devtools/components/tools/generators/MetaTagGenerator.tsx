"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Trash2, Code } from "lucide-react";

export default function MetaTagGenerator() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [author, setAuthor] = useState("");
  const [ogImage, setOgImage] = useState("");
  const [twitterCard, setTwitterCard] = useState<"summary" | "summary_large_image" | "app" | "player">("summary_large_image");
  const [canonicalUrl, setCanonicalUrl] = useState("");
  const [copied, setCopied] = useState(false);

  const generateTags = (): string => {
    const lines: string[] = [];
    lines.push('<meta charset="UTF-8" />');
    lines.push('<meta name="viewport" content="width=device-width, initial-scale=1.0" />');

    if (title) {
      lines.push(`<title>${title}</title>`);
      lines.push(`<meta property="og:title" content="${title}" />`);
      lines.push(`<meta name="twitter:title" content="${title}" />`);
    }

    if (description) {
      lines.push(`<meta name="description" content="${description}" />`);
      lines.push(`<meta property="og:description" content="${description}" />`);
      lines.push(`<meta name="twitter:description" content="${description}" />`);
    }

    if (keywords) {
      lines.push(`<meta name="keywords" content="${keywords}" />`);
    }

    if (author) {
      lines.push(`<meta name="author" content="${author}" />`);
    }

    if (canonicalUrl) {
      lines.push(`<link rel="canonical" href="${canonicalUrl}" />`);
      lines.push(`<meta property="og:url" content="${canonicalUrl}" />`);
    }

    lines.push(`<meta property="og:type" content="website" />`);

    if (ogImage) {
      lines.push(`<meta property="og:image" content="${ogImage}" />`);
      lines.push(`<meta name="twitter:image" content="${ogImage}" />`);
    }

    lines.push(`<meta name="twitter:card" content="${twitterCard}" />`);

    return lines.join("\n");
  };

  const output = generateTags();

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleClear = () => {
    setTitle("");
    setDescription("");
    setKeywords("");
    setAuthor("");
    setOgImage("");
    setCanonicalUrl("");
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Page Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
              placeholder="My Awesome Page"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Author</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
              placeholder="John Doe"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full h-20 rounded-xl border border-gray-200 bg-white p-3 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none resize-none"
            placeholder="A brief description of the page..."
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Keywords</label>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
            placeholder="keyword1, keyword2, keyword3"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">OG Image URL</label>
            <input
              type="text"
              value={ogImage}
              onChange={(e) => setOgImage(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
              placeholder="https://example.com/image.png"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Canonical URL</label>
            <input
              type="text"
              value={canonicalUrl}
              onChange={(e) => setCanonicalUrl(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
              placeholder="https://example.com/page"
            />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Twitter Card Type</label>
          <select
            value={twitterCard}
            onChange={(e) => setTwitterCard(e.target.value as any)}
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
          >
            <option value="summary">Summary</option>
            <option value="summary_large_image">Summary Large Image</option>
            <option value="app">App</option>
            <option value="player">Player</option>
          </select>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy Tags"}
          </button>
          <button
            onClick={handleClear}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
          >
            <Trash2 className="h-4 w-4" /> Clear
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <label className="text-sm font-medium text-gray-700 mb-2 block flex items-center gap-2">
          <Code className="h-4 w-4" /> Generated Meta Tags
        </label>
        <pre className="text-sm font-mono text-gray-800 bg-gray-50 rounded-lg p-4 overflow-x-auto whitespace-pre-wrap">
          {output}
        </pre>
      </div>
    </div>
  );
}
