"use client";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Trash2, Upload, Image } from "lucide-react";

export default function Base64ImageEncoder() {
  const [base64, setBase64] = useState("");
  const [preview, setPreview] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUri = reader.result as string;
      setBase64(dataUri);
      setPreview(dataUri);
    };
    reader.onerror = () => setError("Failed to read file.");
    reader.readAsDataURL(file);
  };

  const handleBase64Input = (value: string) => {
    setBase64(value);
    setError("");
    if (!value.trim()) {
      setPreview("");
      return;
    }
    try {
      let src = value.trim();
      if (!src.startsWith("data:")) {
        src = `data:image/png;base64,${src}`;
      }
      setPreview(src);
    } catch {
      setPreview("");
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(base64);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleClear = () => {
    setBase64("");
    setPreview("");
    setError("");
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100">
          <Upload className="h-4 w-4" /> Upload Image
        </button>
        <button onClick={handleCopy} disabled={!base64} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />} {copied ? "Copied" : "Copy"}
        </button>
        <button onClick={handleClear} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200">
          <Trash2 className="h-4 w-4" /> Clear
        </button>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
      </div>
      {error && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Base64 String</label>
          <textarea value={base64} onChange={(e) => handleBase64Input(e.target.value)} className="w-full h-80 rounded-xl border border-gray-200 bg-white p-4 font-mono text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none resize-none" placeholder="Upload an image or paste Base64 string here..." spellCheck={false} />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Image Preview</label>
          <div className="w-full h-80 rounded-xl border border-gray-200 bg-gray-50 p-4 flex items-center justify-center overflow-auto">
            {preview ? (
              <img src={preview} alt="Preview" className="max-w-full max-h-full object-contain" />
            ) : (
              <div className="text-gray-400 flex flex-col items-center gap-2">
                <Image className="h-10 w-10" />
                <span className="text-sm">Image preview will appear here</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
