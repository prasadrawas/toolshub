"use client";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Upload, Download, Trash2, Crop, Image } from "lucide-react";

export default function ImageCropper() {
  const [imageSrc, setImageSrc] = useState("");
  const [origWidth, setOrigWidth] = useState(0);
  const [origHeight, setOrigHeight] = useState(0);
  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [cropW, setCropW] = useState(100);
  const [cropH, setCropH] = useState(100);
  const [croppedSrc, setCroppedSrc] = useState("");
  const [fileName, setFileName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setFileName(file.name);
    setCroppedSrc("");
    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;
      setImageSrc(src);
      const img = new window.Image();
      img.onload = () => {
        setOrigWidth(img.width);
        setOrigHeight(img.height);
        setCropX(0);
        setCropY(0);
        setCropW(img.width);
        setCropH(img.height);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  };

  const handleCrop = () => {
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = cropW;
      canvas.height = cropH;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
      setCroppedSrc(canvas.toDataURL("image/png"));
    };
    img.src = imageSrc;
  };

  const download = () => {
    const link = document.createElement("a");
    link.download = `cropped-${fileName}`;
    link.href = croppedSrc;
    link.click();
  };

  const clear = () => {
    setImageSrc("");
    setCroppedSrc("");
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
          onClick={handleCrop}
          disabled={!imageSrc}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-brand-50 text-brand-700 hover:bg-brand-100 disabled:opacity-50"
        >
          <Crop className="h-4 w-4" /> Crop
        </button>
        <button
          onClick={download}
          disabled={!croppedSrc}
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
              X
              <input type="number" min={0} max={origWidth} value={cropX} onChange={(e) => setCropX(Number(e.target.value))} className="w-20 rounded-lg border border-gray-200 px-2 py-1 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none" />
            </label>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              Y
              <input type="number" min={0} max={origHeight} value={cropY} onChange={(e) => setCropY(Number(e.target.value))} className="w-20 rounded-lg border border-gray-200 px-2 py-1 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none" />
            </label>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              Width
              <input type="number" min={1} max={origWidth} value={cropW} onChange={(e) => setCropW(Number(e.target.value))} className="w-20 rounded-lg border border-gray-200 px-2 py-1 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none" />
            </label>
            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              Height
              <input type="number" min={1} max={origHeight} value={cropH} onChange={(e) => setCropH(Number(e.target.value))} className="w-20 rounded-lg border border-gray-200 px-2 py-1 text-sm focus:border-brand-400 focus:ring-2 focus:ring-brand-100 focus:outline-none" />
            </label>
          </div>
          <div className="text-xs text-gray-500">Original: {origWidth} x {origHeight}</div>
          <div className="flex justify-center">
            <img src={imageSrc} alt="Original" className="max-h-48 rounded-lg" />
          </div>
        </div>
      )}

      {croppedSrc && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Cropped Result</label>
          <img src={croppedSrc} alt="Cropped" className="max-h-48 mx-auto rounded-lg" />
        </div>
      )}

      {!imageSrc && (
        <div className="rounded-xl border-2 border-dashed border-gray-200 bg-white p-12 text-center">
          <Image className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Upload an image to crop</p>
        </div>
      )}
    </div>
  );
}
