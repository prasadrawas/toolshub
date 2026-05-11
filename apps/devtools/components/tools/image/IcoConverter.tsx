"use client";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Upload, Download, Trash2, Image } from "lucide-react";

const SIZES = [16, 32, 48];

export default function IcoConverter() {
  const [imageSrc, setImageSrc] = useState("");
  const [previews, setPreviews] = useState<{ size: number; dataUrl: string }[]>([]);
  const [fileName, setFileName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setFileName(file.name.replace(/\.\w+$/, ""));
    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;
      setImageSrc(src);
      generatePreviews(src);
    };
    reader.readAsDataURL(file);
  };

  const generatePreviews = (src: string) => {
    const img = new window.Image();
    img.onload = () => {
      const results: { size: number; dataUrl: string }[] = [];
      for (const size of SIZES) {
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, size, size);
        results.push({ size, dataUrl: canvas.toDataURL("image/png") });
      }
      setPreviews(results);
    };
    img.src = src;
  };

  const downloadSize = (preview: { size: number; dataUrl: string }) => {
    const link = document.createElement("a");
    link.download = `${fileName}-${preview.size}x${preview.size}.png`;
    link.href = preview.dataUrl;
    link.click();
  };

  const downloadAll = () => {
    previews.forEach((p) => downloadSize(p));
  };

  const clear = () => {
    setImageSrc("");
    setPreviews([]);
    setFileName("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100"
        >
          <Upload className="h-4 w-4" /> Upload PNG
        </button>
        <button
          onClick={downloadAll}
          disabled={previews.length === 0}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
        >
          <Download className="h-4 w-4" /> Download All
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
          accept="image/png"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {previews.map((preview) => (
            <div key={preview.size} className="rounded-xl border border-gray-200 bg-white p-4 text-center space-y-3">
              <label className="text-sm font-medium text-gray-700 block">
                {preview.size} x {preview.size}
              </label>
              <div className="flex justify-center">
                <div
                  className="bg-gray-50 rounded-lg flex items-center justify-center"
                  style={{ width: 80, height: 80 }}
                >
                  <img
                    src={preview.dataUrl}
                    alt={`${preview.size}x${preview.size}`}
                    style={{ width: preview.size, height: preview.size, imageRendering: "pixelated" }}
                  />
                </div>
              </div>
              <button
                onClick={() => downloadSize(preview)}
                className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200"
              >
                <Download className="h-3 w-3" /> Download
              </button>
            </div>
          ))}
        </div>
      )}

      {!imageSrc && (
        <div className="rounded-xl border-2 border-dashed border-gray-200 bg-white p-12 text-center">
          <Image className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Upload a PNG image to generate favicon sizes</p>
        </div>
      )}
    </div>
  );
}
