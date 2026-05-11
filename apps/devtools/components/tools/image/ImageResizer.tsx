"use client";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Upload, Download, Trash2, Lock, Unlock, Image } from "lucide-react";

export default function ImageResizer() {
  const [imageSrc, setImageSrc] = useState("");
  const [origWidth, setOrigWidth] = useState(0);
  const [origHeight, setOrigHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [fileName, setFileName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const aspectRatio = origWidth / origHeight || 1;

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;
      setImageSrc(src);
      const img = new window.Image();
      img.onload = () => {
        setOrigWidth(img.width);
        setOrigHeight(img.height);
        setWidth(img.width);
        setHeight(img.height);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const handleWidthChange = (w: number) => {
    setWidth(w);
    if (maintainAspect) setHeight(Math.round(w / aspectRatio));
  };

  const handleHeightChange = (h: number) => {
    setHeight(h);
    if (maintainAspect) setWidth(Math.round(h * aspectRatio));
  };

  const download = () => {
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);
      const link = document.createElement("a");
      link.download = `resized-${fileName}`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = imageSrc;
  };

  const clear = () => {
    setImageSrc("");
    setWidth(0);
    setHeight(0);
    setOrigWidth(0);
    setOrigHeight(0);
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
          <Upload className="h-4 w-4" /> Upload Image
        </button>
        <button
          onClick={download}
          disabled={!imageSrc}
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
        <div className="rounded-xl border border-gray-200 bg-white p-4 space-y-4">
          <div className="flex flex-wrap items-center gap-4">
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              Width
              <input
                type="number"
                min={1}
                value={width}
                onChange={(e) => handleWidthChange(Number(e.target.value))}
                className="w-24 rounded-lg border border-gray-200 px-2 py-1 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
              />
            </label>
            <button
              onClick={() => setMaintainAspect(!maintainAspect)}
              className={cn(
                "inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium",
                maintainAspect ? "bg-brand-50 text-brand-700" : "bg-gray-100 text-gray-500"
              )}
            >
              {maintainAspect ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
              {maintainAspect ? "Linked" : "Unlinked"}
            </button>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              Height
              <input
                type="number"
                min={1}
                value={height}
                onChange={(e) => handleHeightChange(Number(e.target.value))}
                className="w-24 rounded-lg border border-gray-200 px-2 py-1 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none"
              />
            </label>
          </div>
          <div className="text-xs text-gray-500">
            Original: {origWidth} x {origHeight}
          </div>
          <div className="flex justify-center">
            <img src={imageSrc} alt="Preview" className="max-h-64 rounded-lg" />
          </div>
        </div>
      )}

      {!imageSrc && (
        <div className="rounded-xl border-2 border-dashed border-gray-200 bg-white p-12 text-center">
          <Image className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Upload an image to resize</p>
        </div>
      )}
    </div>
  );
}
