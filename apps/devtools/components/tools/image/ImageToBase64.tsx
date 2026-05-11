"use client";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Copy, Check, Upload, Trash2, Image } from "lucide-react";

export default function ImageToBase64() {
  const [base64, setBase64] = useState("");
  const [preview, setPreview] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setFileName(file.name);
    setFileSize(file.size);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setBase64(result);
      setPreview(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(base64);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const clear = () => {
    setBase64("");
    setPreview("");
    setFileName("");
    setFileSize(0);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100"
        >
          <Upload className="h-4 w-4" /> Upload Image
        </button>
        <button
          onClick={handleCopy}
          disabled={!base64}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied" : "Copy Base64"}
        </button>
        <button
          onClick={clear}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
        >
          <Trash2 className="h-4 w-4" /> Clear
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
      </div>

      {!base64 && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="rounded-xl border-2 border-dashed border-gray-200 bg-white p-12 text-center"
        >
          <Image className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Drag and drop an image here or click Upload</p>
        </div>
      )}

      {preview && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
          <label className="text-sm font-medium text-gray-700 block">Preview</label>
          <div className="flex justify-center">
            <img src={preview} alt="Preview" className="max-h-64 rounded-lg" />
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-gray-500">
            <span>File: {fileName}</span>
            <span>Size: {(fileSize / 1024).toFixed(1)} KB</span>
            <span>Base64 length: {base64.length.toLocaleString()} chars</span>
          </div>
        </div>
      )}

      {base64 && (
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1.5 block">Base64 Data URI</label>
          <textarea
            readOnly
            value={base64}
            className="w-full h-40 rounded-xl border border-gray-200 bg-white p-4 font-mono text-xs focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none resize-none"
          />
        </div>
      )}
    </div>
  );
}
