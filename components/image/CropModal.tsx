"use client";

import useTranslation from "next-translate/useTranslation";
import { useCallback, useEffect, useMemo, useState } from "react";
import Cropper from "react-easy-crop";
import {
  ArrowPathIcon,
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  ArrowsRightLeftIcon,
  ArrowsUpDownIcon,
} from "@heroicons/react/24/outline";

type Area = { x: number; y: number; width: number; height: number };
type FlipState = { horizontal: boolean; vertical: boolean };
type Point = { x: number; y: number };

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
  const { t } = useTranslation("common");
  const [src, setSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedPixels, setCroppedPixels] = useState<Area | null>(null);
  const [imageSize, setImageSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [busy, setBusy] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [flip, setFlip] = useState<FlipState>({
    horizontal: false,
    vertical: false,
  });

  useEffect(() => {
    if (!file) return setSrc(null);
    const reader = new FileReader();
    reader.onload = () => setSrc(reader.result as string);
    reader.readAsDataURL(file);
  }, [file]);

  useEffect(() => {
    setRotation(0);
    setFlip({ horizontal: false, vertical: false });
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  }, [src]);

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

  const rotateLeft = useCallback(() => {
    setRotation((value) => (value - 90 + 360) % 360);
  }, []);

  const rotateRight = useCallback(() => {
    setRotation((value) => (value + 90) % 360);
  }, []);

  const toggleHorizontalFlip = useCallback(() => {
    setFlip((state) => ({
      ...state,
      horizontal: !state.horizontal,
    }));
  }, []);

  const toggleVerticalFlip = useCallback(() => {
    setFlip((state) => ({
      ...state,
      vertical: !state.vertical,
    }));
  }, []);

  const resetAdjustments = useCallback(() => {
    setRotation(0);
    setFlip({ horizontal: false, vertical: false });
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!src || !croppedPixels) return;
    setBusy(true);
    try {
      const out = await cropToFile(src, croppedPixels, {
        filename,
        mime,
        quality,
        rotation,
        flip,
      });
      onDone(out);
    } finally {
      setBusy(false);
    }
  }, [src, croppedPixels, filename, mime, quality, onDone, rotation, flip]);

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
          rotation,
          flip,
        },
      );
      onDone(out);
    } finally {
      setBusy(false);
    }
  }, [src, imageSize, filename, mime, quality, onDone, rotation, flip]);

  const mediaTransform = useMemo(
    () => getMediaTransform(crop, rotation, zoom, flip),
    [crop, rotation, zoom, flip],
  );

  if (!open) return null;

  const isAdjusted =
    rotation !== 0 || flip.horizontal || flip.vertical || zoom !== 1;

  return (
    <div className="fixed inset-0 z-[1000]">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden
      />
      <div className="absolute inset-0 m-auto flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold">{t("Crop image")}</h2>
          <button
            className="rounded px-2 py-1 text-sm hover:bg-gray-100"
            onClick={onClose}
          >
            {t("Close")}
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
              rotation={rotation}
              onRotationChange={setRotation}
              transform={mediaTransform}
              restrictPosition={false}
              minZoom={MIN_ZOOM}
              maxZoom={MAX_ZOOM}
            />
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t p-4">
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2">
              <span className="text-sm">{t("Zoom")}</span>
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

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-100"
                onClick={rotateLeft}
              >
                <ArrowUturnLeftIcon className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-100"
                onClick={rotateRight}
              >
                <ArrowUturnRightIcon className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-100"
                onClick={toggleHorizontalFlip}
              >
                <ArrowsRightLeftIcon className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-100"
                onClick={toggleVerticalFlip}
              >
                <ArrowsUpDownIcon className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm hover:bg-gray-100 disabled:opacity-60"
                onClick={resetAdjustments}
                disabled={!isAdjusted}
              >
                <ArrowPathIcon className="h-4 w-4" aria-hidden="true" />
                {t("Reset")}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="rounded-lg border px-4 py-2" onClick={onClose}>
              {t("Cancel")}
            </button>
            <button
              className="rounded-lg border px-4 py-2"
              disabled={!file || !imageSize || busy}
              onClick={handleUseOriginal}
            >
              {t("Use original")}
            </button>
            <button
              className="rounded-lg border px-4 py-2 disabled:opacity-60"
              disabled={!src || !croppedPixels || busy}
              onClick={handleConfirm}
            >
              {busy ? t("Processing") : t("Use crop")}
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
    rotation = 0,
    flip = { horizontal: false, vertical: false },
  }: {
    filename: string;
    mime: string;
    quality: number;
    rotation?: number;
    flip?: FlipState;
  },
): Promise<File> {
  const img = await loadImage(src);
  const rotRad = getRadianAngle(rotation);
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    img.width,
    img.height,
    rotation,
  );

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No 2D context");

  canvas.width = Math.max(1, Math.round(bBoxWidth));
  canvas.height = Math.max(1, Math.round(bBoxHeight));

  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate(rotRad);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-img.width / 2, -img.height / 2);
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0);

  const cropCanvas = document.createElement("canvas");
  const cropCtx = cropCanvas.getContext("2d");
  if (!cropCtx) throw new Error("No 2D context");

  const dpr = window.devicePixelRatio || 1;
  const outputWidth = Math.max(1, Math.round(area.width * dpr));
  const outputHeight = Math.max(1, Math.round(area.height * dpr));

  cropCanvas.width = outputWidth;
  cropCanvas.height = outputHeight;

  cropCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  cropCtx.imageSmoothingQuality = "high";
  cropCtx.fillStyle = "#fff";
  cropCtx.fillRect(0, 0, area.width, area.height);

  cropCtx.drawImage(
    canvas,
    area.x,
    area.y,
    area.width,
    area.height,
    0,
    0,
    area.width,
    area.height,
  );

  const blob = await new Promise<Blob>((resolve) =>
    cropCanvas.toBlob((b) => resolve(b as Blob), mime, quality),
  );

  return new File([blob], filename, { type: mime });
}

function getMediaTransform(
  crop: Point,
  rotation: number,
  zoom: number,
  flip: FlipState,
): string {
  const scaleX = (flip.horizontal ? -1 : 1) * zoom;
  const scaleY = (flip.vertical ? -1 : 1) * zoom;
  return `translate(${crop.x}px, ${crop.y}px) rotate(${rotation}deg) scale(${scaleX}, ${scaleY})`;
}

function getRadianAngle(degree: number): number {
  return (degree * Math.PI) / 180;
}

function rotateSize(width: number, height: number, rotation: number) {
  const rotRad = getRadianAngle(rotation);
  return {
    width:
      Math.abs(Math.cos(rotRad)) * width + Math.abs(Math.sin(rotRad)) * height,
    height:
      Math.abs(Math.sin(rotRad)) * width + Math.abs(Math.cos(rotRad)) * height,
  };
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
