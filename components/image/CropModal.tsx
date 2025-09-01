"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Cropper from "react-easy-crop";

type Area = { x: number; y: number; width: number; height: number };

export default function CropModal({
  file,
  aspect = 1,
  open,
  onClose,
  onDone,
  filename = "crop.jpg",
  mime = "image/jpeg",
  quality = 0.92,
}: {
  file: File | null;
  aspect?: number | undefined;
  open: boolean;
  onClose: () => void;
  onDone: (file: File) => void;
  filename?: string;
  mime?: "image/jpeg" | "image/png" | string;
  quality?: number;
}) {
  const [src, setSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedPixels, setCroppedPixels] = useState<Area | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!file) return setSrc(null);
    const reader = new FileReader();
    reader.onload = () => setSrc(reader.result as string);
    reader.readAsDataURL(file);
  }, [file]);

  const onCropComplete = useCallback((_area: Area, px: Area) => {
    setCroppedPixels(px);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!src || !croppedPixels) return;
    setBusy(true);
    try {
      const out = await cropToFile(src, croppedPixels, {
        filename,
        mime,
        quality,
      });
      onDone(out);
    } finally {
      setBusy(false);
    }
  }, [src, croppedPixels, filename, mime, quality, onDone]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000]">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden
      />
      <div className="absolute inset-0 m-auto flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold">Crop image</h2>
          <button
            className="rounded px-2 py-1 text-sm hover:bg-gray-100"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        <div className="relative h-[60vh] w-full">
          {src && (
            <Cropper
              image={src}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
              restrictPosition={false}
            />
          )}
        </div>

        <div className="flex items-center justify-between gap-4 border-t p-4">
          <label className="flex items-center gap-2">
            <span className="text-sm">Zoom</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
            />
          </label>

          <div className="flex items-center gap-2">
            <button className="rounded-lg border px-4 py-2" onClick={onClose}>
              Cancel
            </button>
            <button
              className="rounded-lg border px-4 py-2 disabled:opacity-60"
              disabled={!src || !croppedPixels || busy}
              onClick={handleConfirm}
            >
              {busy ? "Processing…" : "Use crop"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

async function cropToFile(
  src: string,
  area: Area,
  {
    filename,
    mime,
    quality,
  }: { filename: string; mime: string; quality: number },
): Promise<File> {
  const img = await loadImage(src);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No 2D context");

  const { x, y, width, height } = area;

  canvas.width = Math.round(width);
  canvas.height = Math.round(height);

  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, x, y, width, height, 0, 0, width, height);

  const blob = await new Promise<Blob>((resolve) =>
    canvas.toBlob((b) => resolve(b as Blob), mime, quality),
  );

  return new File([blob], filename, { type: mime });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.crossOrigin = "anonymous";
    img.src = src;
  });
}
