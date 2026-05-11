"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Eye } from "lucide-react";

export default function OpenGraphPreview() {
  const [title, setTitle] = useState("My Awesome Page");
  const [description, setDescription] = useState("This is a great description for social sharing.");
  const [imageUrl, setImageUrl] = useState("https://placehold.co/1200x630/3b82f6/white?text=OG+Image");
  const [url, setUrl] = useState("https://example.com/page");
  const [type, setType] = useState("website");
  const [preview, setPreview] = useState<"facebook" | "twitter" | "linkedin">("facebook");
  const [copied, setCopied] = useState(false);

  const metaTags = `<meta property="og:title" content="${title}" />
<meta property="og:description" content="${description}" />
<meta property="og:image" content="${imageUrl}" />
<meta property="og:url" content="${url}" />
<meta property="og:type" content="${type}" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="${title}" />
<meta name="twitter:description" content="${description}" />
<meta name="twitter:image" content="${imageUrl}" />`;

  const handleCopy = () => {
    navigator.clipboard.writeText(metaTags);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const domain = (() => { try { return new URL(url).hostname; } catch { return "example.com"; } })();

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">URL</label>
            <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none" />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none resize-none" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Image URL</label>
            <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none">
              <option value="website">website</option>
              <option value="article">article</option>
              <option value="product">product</option>
              <option value="profile">profile</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {(["facebook", "twitter", "linkedin"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPreview(p)}
            className={cn(
              "rounded-lg px-4 py-2 text-sm font-medium capitalize",
              preview === p ? "bg-brand-50 text-brand-700 ring-2 ring-brand-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            {p}
          </button>
        ))}
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 ml-auto"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy Meta Tags"}
        </button>
      </div>

      <div className="flex justify-center">
        {preview === "facebook" && (
          <div className="w-full max-w-lg rounded-lg border border-gray-300 bg-white overflow-hidden shadow-sm">
            {imageUrl && <img src={imageUrl} alt="" className="w-full h-52 object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />}
            <div className="p-3 bg-gray-50 border-t border-gray-200">
              <div className="text-xs text-gray-500 uppercase">{domain}</div>
              <div className="text-base font-semibold text-gray-900 leading-snug mt-0.5">{title}</div>
              <div className="text-sm text-gray-500 mt-0.5 line-clamp-2">{description}</div>
            </div>
          </div>
        )}

        {preview === "twitter" && (
          <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
            {imageUrl && <img src={imageUrl} alt="" className="w-full h-52 object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />}
            <div className="p-3">
              <div className="text-base font-bold text-gray-900">{title}</div>
              <div className="text-sm text-gray-500 mt-0.5 line-clamp-2">{description}</div>
              <div className="text-xs text-gray-400 mt-1">{domain}</div>
            </div>
          </div>
        )}

        {preview === "linkedin" && (
          <div className="w-full max-w-lg rounded-lg border border-gray-300 bg-white overflow-hidden shadow-sm">
            {imageUrl && <img src={imageUrl} alt="" className="w-full h-52 object-cover" onError={(e) => (e.currentTarget.style.display = "none")} />}
            <div className="p-3">
              <div className="text-base font-semibold text-gray-900">{title}</div>
              <div className="text-xs text-gray-500 mt-1">{domain}</div>
            </div>
          </div>
        )}
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-1.5 block">Generated Meta Tags</label>
        <pre className="rounded-xl border border-gray-200 bg-white p-4 font-mono text-xs text-gray-800 overflow-x-auto whitespace-pre-wrap">{metaTags}</pre>
      </div>
    </div>
  );
}
