"use client";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Upload, Download, Trash2, Image } from "lucide-react";

export default function ImageCompressor() {
  const [imageSrc, setImageSrc] = useState("");
  const [compressedSrc, setCompressedSrc] = useState("");
  const [quality, setQuality] = useState(0.7);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [fileName, setFileName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setFileName(file.name);
    setOriginalSize(file.size);
    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;
      setImageSrc(src);
      compress(src, quality);
    };
    reader.readAsDataURL(file);
  };

  const compress = (src: string, q: number) => {
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      const dataUrl = canvas.toDataURL("image/jpeg", q);
      setCompressedSrc(dataUrl);
      const base64 = dataUrl.split(",")[1];
      setCompressedSize(Math.round((base64.length * 3) / 4));
    };
    img.src = src;
  };

  const handleQualityChange = (q: number) => {
    setQuality(q);
    if (imageSrc) compress(imageSrc, q);
  };

  const download = () => {
    const link = document.createElement("a");
    link.download = `compressed-${fileName.replace(/\.\w+$/, ".jpg")}`;
    link.href = compressedSrc;
    link.click();
  };

  const clear = () => {
    setImageSrc("");
    setCompressedSrc("");
    setOriginalSize(0);
    setCompressedSize(0);
    setFileName("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const savings = originalSize > 0 ? ((1 - compressedSize / originalSize) * 100).toFixed(1) : "0";

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
          onClick={download}
          disabled={!compressedSrc}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
        >
          <Download className="h-4 w-4" /> Download
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

      {imageSrc && (
        <>
          <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-3">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-3">
              Quality: {(quality * 100).toFixed(0)}%
              <input
                type="range"
                min={0.1}
                max={1}
                step={0.05}
                value={quality}
                onChange={(e) => handleQualityChange(Number(e.target.value))}
                className="flex-1"
              />
            </label>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-gray-200 bg-white p-3 text-center">
              <div className="text-lg font-semibold text-gray-800">{(originalSize / 1024).toFixed(1)} KB</div>
              <div className="text-xs text-gray-500">Original</div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-3 text-center">
              <div className="text-lg font-semibold text-gray-800">{(compressedSize / 1024).toFixed(1)} KB</div>
              <div className="text-xs text-gray-500">Compressed</div>
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-3 text-center">
              <div className="text-lg font-semibold text-green-600">{savings}%</div>
              <div className="text-xs text-gray-500">Saved</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Original</label>
              <img src={imageSrc} alt="Original" className="max-h-48 mx-auto rounded-lg" />
            </div>
            <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
              <label className="text-sm font-medium text-gray-700 mb-2 block">Compressed</label>
              <img src={compressedSrc} alt="Compressed" className="max-h-48 mx-auto rounded-lg" />
            </div>
          </div>
        </>
      )}

      {!imageSrc && (
        <div className="rounded-xl border-2 border-dashed border-gray-200 bg-white p-12 text-center">
          <Image className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Upload an image to compress</p>
        </div>
      )}
    </div>
  );
}
