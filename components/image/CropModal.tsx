"use client";

import { useCallback, useEffect, useState } from "react";
import Cropper from "react-easy-crop";

type Area = { x: number; y: number; width: number; height: number };

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;

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
  const [imageSize, setImageSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!file) return setSrc(null);
    const reader = new FileReader();
    reader.onload = () => setSrc(reader.result as string);
    reader.readAsDataURL(file);
  }, [file]);

  useEffect(() => {
    if (!src) {
      setImageSize(null);
      return;
    }

    const img = new Image();
    img.onload = () => setImageSize({ width: img.width, height: img.height });
    img.onerror = () => setImageSize(null);
    img.src = src;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

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

  const handleUseOriginal = useCallback(async () => {
    if (!src || !imageSize) return;
    setBusy(true);
    try {
      const out = await cropToFile(
        src,
        { x: 0, y: 0, width: imageSize.width, height: imageSize.height },
        {
          filename,
          mime,
          quality,
        },
      );
      onDone(out);
    } finally {
      setBusy(false);
    }
  }, [src, imageSize, filename, mime, quality, onDone]);

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
              onZoomChange={(value) =>
                setZoom(Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value)))
              }
              onCropComplete={onCropComplete}
              restrictPosition={false}
              minZoom={MIN_ZOOM}
              maxZoom={MAX_ZOOM}
            />
          )}
        </div>

        <div className="flex items-center justify-between gap-4 border-t p-4">
          <label className="flex items-center gap-2">
            <span className="text-sm">Zoom</span>
            <input
              type="range"
              min={MIN_ZOOM}
              max={MAX_ZOOM}
              step={0.01}
              value={zoom}
              onChange={(e) =>
                setZoom(
                  Math.min(
                    MAX_ZOOM,
                    Math.max(MIN_ZOOM, parseFloat(e.target.value)),
                  ),
                )
              }
            />
          </label>

          <div className="flex items-center gap-2">
            <button className="rounded-lg border px-4 py-2" onClick={onClose}>
              Cancel
            </button>
            <button
              className="rounded-lg border px-4 py-2"
              disabled={!file || !imageSize || busy}
              onClick={handleUseOriginal}
            >
              Use original
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

  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, width, height);

  const offsetX = Math.max(-x, 0);
  const offsetY = Math.max(-y, 0);
  const sourceX = Math.max(x, 0);
  const sourceY = Math.max(y, 0);

  const availableWidth = width - offsetX;
  const availableHeight = height - offsetY;

  const sourceWidth = Math.max(
    0,
    Math.min(img.width - sourceX, availableWidth),
  );
  const sourceHeight = Math.max(
    0,
    Math.min(img.height - sourceY, availableHeight),
  );

  ctx.imageSmoothingQuality = "high";

  if (sourceWidth > 0 && sourceHeight > 0) {
    ctx.drawImage(
      img,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      offsetX,
      offsetY,
      sourceWidth,
      sourceHeight,
    );
  }

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
