"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Search, Copy, Check } from "lucide-react";

const MIME_DB: { ext: string; mime: string; description: string }[] = [
  { ext: ".html", mime: "text/html", description: "HTML document" },
  { ext: ".htm", mime: "text/html", description: "HTML document" },
  { ext: ".css", mime: "text/css", description: "CSS stylesheet" },
  { ext: ".js", mime: "application/javascript", description: "JavaScript" },
  { ext: ".mjs", mime: "application/javascript", description: "JavaScript module" },
  { ext: ".json", mime: "application/json", description: "JSON data" },
  { ext: ".xml", mime: "application/xml", description: "XML document" },
  { ext: ".txt", mime: "text/plain", description: "Plain text" },
  { ext: ".csv", mime: "text/csv", description: "CSV data" },
  { ext: ".md", mime: "text/markdown", description: "Markdown" },
  { ext: ".yaml", mime: "application/x-yaml", description: "YAML" },
  { ext: ".yml", mime: "application/x-yaml", description: "YAML" },
  { ext: ".toml", mime: "application/toml", description: "TOML" },
  { ext: ".png", mime: "image/png", description: "PNG image" },
  { ext: ".jpg", mime: "image/jpeg", description: "JPEG image" },
  { ext: ".jpeg", mime: "image/jpeg", description: "JPEG image" },
  { ext: ".gif", mime: "image/gif", description: "GIF image" },
  { ext: ".webp", mime: "image/webp", description: "WebP image" },
  { ext: ".svg", mime: "image/svg+xml", description: "SVG image" },
  { ext: ".ico", mime: "image/x-icon", description: "Icon" },
  { ext: ".avif", mime: "image/avif", description: "AVIF image" },
  { ext: ".bmp", mime: "image/bmp", description: "BMP image" },
  { ext: ".tiff", mime: "image/tiff", description: "TIFF image" },
  { ext: ".mp3", mime: "audio/mpeg", description: "MP3 audio" },
  { ext: ".wav", mime: "audio/wav", description: "WAV audio" },
  { ext: ".ogg", mime: "audio/ogg", description: "OGG audio" },
  { ext: ".aac", mime: "audio/aac", description: "AAC audio" },
  { ext: ".flac", mime: "audio/flac", description: "FLAC audio" },
  { ext: ".mp4", mime: "video/mp4", description: "MP4 video" },
  { ext: ".webm", mime: "video/webm", description: "WebM video" },
  { ext: ".avi", mime: "video/x-msvideo", description: "AVI video" },
  { ext: ".mov", mime: "video/quicktime", description: "QuickTime video" },
  { ext: ".mkv", mime: "video/x-matroska", description: "Matroska video" },
  { ext: ".pdf", mime: "application/pdf", description: "PDF document" },
  { ext: ".doc", mime: "application/msword", description: "Word document" },
  { ext: ".docx", mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", description: "Word document (OOXML)" },
  { ext: ".xls", mime: "application/vnd.ms-excel", description: "Excel spreadsheet" },
  { ext: ".xlsx", mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", description: "Excel spreadsheet (OOXML)" },
  { ext: ".ppt", mime: "application/vnd.ms-powerpoint", description: "PowerPoint" },
  { ext: ".pptx", mime: "application/vnd.openxmlformats-officedocument.presentationml.presentation", description: "PowerPoint (OOXML)" },
  { ext: ".zip", mime: "application/zip", description: "ZIP archive" },
  { ext: ".gz", mime: "application/gzip", description: "Gzip archive" },
  { ext: ".tar", mime: "application/x-tar", description: "Tar archive" },
  { ext: ".rar", mime: "application/vnd.rar", description: "RAR archive" },
  { ext: ".7z", mime: "application/x-7z-compressed", description: "7-Zip archive" },
  { ext: ".woff", mime: "font/woff", description: "WOFF font" },
  { ext: ".woff2", mime: "font/woff2", description: "WOFF2 font" },
  { ext: ".ttf", mime: "font/ttf", description: "TrueType font" },
  { ext: ".otf", mime: "font/otf", description: "OpenType font" },
  { ext: ".eot", mime: "application/vnd.ms-fontobject", description: "EOT font" },
  { ext: ".wasm", mime: "application/wasm", description: "WebAssembly" },
  { ext: ".ts", mime: "video/mp2t", description: "MPEG transport stream" },
];

export default function MimeTypeLookup() {
  const [search, setSearch] = useState("");
  const [copied, setCopied] = useState("");

  const filtered = MIME_DB.filter(
    (m) =>
      !search ||
      m.ext.toLowerCase().includes(search.toLowerCase()) ||
      m.mime.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(""), 1500);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by extension or MIME type..."
            className="w-full rounded-lg border border-gray-200 pl-9 pr-3 py-2 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
          />
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-4 py-2 font-medium text-gray-700">Extension</th>
              <th className="text-left px-4 py-2 font-medium text-gray-700">MIME Type</th>
              <th className="text-left px-4 py-2 font-medium text-gray-700 hidden sm:table-cell">Description</th>
              <th className="px-4 py-2 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((m, i) => (
              <tr key={m.ext + m.mime} className={cn("border-b border-gray-100", i % 2 === 0 ? "bg-white" : "bg-gray-50/50")}>
                <td className="px-4 py-2 font-mono text-gray-800">{m.ext}</td>
                <td className="px-4 py-2 font-mono text-gray-600 text-xs">{m.mime}</td>
                <td className="px-4 py-2 text-gray-500 hidden sm:table-cell">{m.description}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleCopy(m.mime)}
                    className="opacity-60 hover:opacity-100"
                  >
                    {copied === m.mime ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5 text-gray-400" />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length === 0 && (
        <div className="text-center text-sm text-gray-500 py-8">No matching MIME types found</div>
      )}
    </div>
  );
}
