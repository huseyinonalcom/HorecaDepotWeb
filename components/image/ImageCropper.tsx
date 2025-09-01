"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Cropper from "react-easy-crop";

type Area = { x: number; y: number; width: number; height: number };

export default function ImageCropper({
  aspectRatio = 1,
  onCropDone,
}: {
  aspectRatio?: number;
  onCropDone?: (file: File) => void;
}) {
  const [src, setSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState<number | undefined>(aspectRatio);
  const croppedPixelsRef = useRef<Area | null>(null);
  const [busy, setBusy] = useState(false);

  const onFile = async (file: File) => {
    const reader = new FileReader();
    reader.onload = () => setSrc(reader.result as string);
    reader.readAsDataURL(file);
  };

  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedAreaPixels: Area) => {
      croppedPixelsRef.current = croppedAreaPixels;
    },
    [],
  );

  const getCroppedFile = useCallback(async (): Promise<File> => {
    if (!src || !croppedPixelsRef.current) throw new Error("Nothing to crop");

    const image = await loadImage(src);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("No 2D context");

    const { x, y, width, height } = croppedPixelsRef.current;

    canvas.width = Math.round(width);
    canvas.height = Math.round(height);

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(image, x, y, width, height, 0, 0, width, height);

    const blob = await new Promise<Blob>((resolve) =>
      canvas.toBlob((b) => resolve(b as Blob), "image/jpeg", 0.92),
    );

    return new File([blob], "crop.jpg", { type: "image/jpeg" });
  }, [src]);

  const handleCropDone = useCallback(async () => {
    try {
      setBusy(true);
      const file = await getCroppedFile();
      onCropDone?.(file);
    } catch (e) {
      console.error(e);
      alert((e as Error).message);
    } finally {
      setBusy(false);
    }
  }, [getCroppedFile, onCropDone]);

  const hasImage = useMemo(() => Boolean(src), [src]);

  return (
    <div className="space-y-4">
      <label className="inline-flex cursor-pointer items-center gap-2">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFile(f);
          }}
        />
        <span className="rounded-2xl border px-3 py-2 shadow">
          Choose image
        </span>
      </label>

      {hasImage && (
        <div className="relative h-96 w-full overflow-hidden rounded-2xl shadow">
          <Cropper
            image={src!}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
            restrictPosition={false}
          />
        </div>
      )}

      {hasImage && (
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            Zoom
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
            />
          </label>

          <label className="flex items-center gap-2">
            Aspect
            <select
              className="rounded border px-2 py-1"
              value={aspect === undefined ? "free" : String(aspect)}
              onChange={(e) => {
                const v = e.target.value;
                setAspect(v === "free" ? undefined : parseFloat(v));
              }}
            >
              <option value={String(1)}>1:1</option>
              <option value={String(16 / 9)}>16:9</option>
              <option value={String(4 / 3)}>4:3</option>
              <option value={String(3 / 2)}>3:2</option>
              <option value="free">Free</option>
            </select>
          </label>

          <button
            className="rounded-2xl border px-4 py-2 shadow disabled:opacity-60"
            disabled={busy}
            onClick={handleCropDone}
          >
            {busy ? "Processing…" : "Crop"}
          </button>
        </div>
      )}
    </div>
  );
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", reject);
    img.crossOrigin = "anonymous";
    img.src = src;
  });
}
