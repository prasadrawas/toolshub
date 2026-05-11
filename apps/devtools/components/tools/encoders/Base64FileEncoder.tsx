"use client";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Trash2, Upload, Download, Lock, Unlock } from "lucide-react";

export default function Base64FileEncoder() {
  const [base64, setBase64] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setFileType(file.type || "application/octet-stream");
    const reader = new FileReader();
    reader.onload = () => {
      const dataUri = reader.result as string;
      const b64 = dataUri.split(",")[1] || dataUri;
      setBase64(b64);
    };
    reader.onerror = () => setError("Failed to read file.");
    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    setError("");
    try {
      const raw = base64.trim();
      const byteChars = atob(raw);
      const bytes = new Uint8Array(byteChars.length);
      for (let i = 0; i < byteChars.length; i++) {
        bytes[i] = byteChars.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: fileType || "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName || "decoded-file";
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      setError("Invalid Base64: " + e.message);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(base64);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleClear = () => {
    setBase64("");
    setFileName("");
    setFileType("");
    setError("");
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100">
          <Upload className="h-4 w-4" /> Upload File
        </button>
        <button onClick={handleDownload} disabled={!base64} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100 disabled:opacity-50">
          <Download className="h-4 w-4" /> Download Decoded
        </button>
        <button onClick={handleCopy} disabled={!base64} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? "Copied" : "Copy"}
        </button>
        <button onClick={handleClear} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
          <Trash2 className="h-4 w-4" /> Clear
        </button>
        <input ref={fileRef} type="file" onChange={handleFile} className="hidden" />
      </div>
      {fileName && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-gray-600">
          File: <span className="font-medium">{fileName}</span> ({fileType || "unknown type"})
        </div>
      )}
      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Base64 Output / Input</label>
          <textarea value={base64} onChange={(e) => setBase64(e.target.value)} className="w-full h-80 rounded-xl border border-gray-200 bg-white p-4 font-mono text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none resize-none" placeholder="Upload a file to encode, or paste Base64 to decode..." spellCheck={false} />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">File Info</label>
          <div className="w-full h-80 rounded-xl border border-gray-200 bg-gray-50 p-4 font-mono text-sm overflow-auto">
            {base64 ? (
              <div className="space-y-2">
                <p><span className="text-gray-500">Characters:</span> {base64.length.toLocaleString()}</p>
                <p><span className="text-gray-500">Estimated size:</span> {(Math.ceil(base64.length * 0.75) / 1024).toFixed(2)} KB</p>
                <p><span className="text-gray-500">File name:</span> {fileName || "N/A"}</p>
                <p><span className="text-gray-500">MIME type:</span> {fileType || "N/A"}</p>
              </div>
            ) : (
              <span className="text-gray-400">File details will appear here...</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
