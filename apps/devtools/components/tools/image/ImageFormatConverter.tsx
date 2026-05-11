"use client";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Upload, Download, Trash2, Image } from "lucide-react";

const FORMATS = [
  { label: "PNG", mime: "image/png", ext: "png" },
  { label: "JPEG", mime: "image/jpeg", ext: "jpg" },
  { label: "WebP", mime: "image/webp", ext: "webp" },
];

export default function ImageFormatConverter() {
  const [imageSrc, setImageSrc] = useState("");
  const [convertedSrc, setConvertedSrc] = useState("");
  const [format, setFormat] = useState(FORMATS[0]);
  const [fileName, setFileName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setFileName(file.name.replace(/\.\w+$/, ""));
    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;
      setImageSrc(src);
      convert(src, format);
    };
    reader.readAsDataURL(file);
  };

  const convert = (src: string, fmt: typeof FORMATS[number]) => {
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0);
      setConvertedSrc(canvas.toDataURL(fmt.mime));
    };
    img.src = src;
  };

  const handleFormatChange = (fmt: typeof FORMATS[number]) => {
    setFormat(fmt);
    if (imageSrc) convert(imageSrc, fmt);
  };

  const download = () => {
    const link = document.createElement("a");
    link.download = `${fileName}.${format.ext}`;
    link.href = convertedSrc;
    link.click();
  };

  const clear = () => {
    setImageSrc("");
    setConvertedSrc("");
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
          disabled={!convertedSrc}
          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
        >
          <Download className="h-4 w-4" /> Download {format.label}
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

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <label className="text-sm font-medium text-gray-700 mb-2 block">Output Format</label>
        <div className="flex gap-2">
          {FORMATS.map((fmt) => (
            <button
              key={fmt.ext}
              onClick={() => handleFormatChange(fmt)}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium",
                format.ext === fmt.ext
                  ? "bg-brand-50 text-brand-700 ring-2 ring-brand-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {fmt.label}
            </button>
          ))}
        </div>
      </div>

      {imageSrc && (
        <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Preview</label>
          <img src={convertedSrc || imageSrc} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
        </div>
      )}

      {!imageSrc && (
        <div className="rounded-xl border-2 border-dashed border-gray-200 bg-white p-12 text-center">
          <Image className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Upload an image to convert</p>
        </div>
      )}
    </div>
  );
}
