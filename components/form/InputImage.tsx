import {
  TrashIcon,
  PhotoIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import useTranslation from "next-translate/useTranslation";
import { ChangeEvent, useRef, useState } from "react";
import ImageWithURL, { imageUrl } from "../common/image";
import CropModal from "../image/CropModal";

export const InputImage = ({
  url,
  id,
  onChange,
  onDelete,
  height,
  width,
  children,
  aspect = 1, // allow caller to control aspect ratio
}: {
  url?: string;
  id?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onDelete: () => void | Promise<void>;
  height?: number;
  width?: number;
  children?: React.ReactNode;
  aspect?: number | undefined; // undefined = freeform crop
}) => {
  const { t } = useTranslation("common");
  const [overlayVisible, setOverlayVisible] = useState(false);

  const [cropOpen, setCropOpen] = useState(false);
  const [pickedFile, setPickedFile] = useState<File | null>(null);

  const inputRef = useRef<HTMLInputElement | null>(null);

  // Track crop session state
  const cropSourceRef = useRef<File | null>(null); // the file we started cropping from
  const cropEmitRef = useRef(false); // ensure we emit once per session
  const replaceModeRef = useRef(false); // if true, delete AFTER successful crop

  // Base click:
  // - no image => open file picker
  // - has image => show overlay
  const handleBaseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!url) {
      inputRef.current?.click();
      return;
    }
    if (!overlayVisible) setOverlayVisible(true);
  };

  const closeOverlay = () => setOverlayVisible(false);

  const handleDeleteClick = async (e?: React.SyntheticEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    await Promise.resolve(onDelete());
    closeOverlay();
  };

  // User-picked file -> open cropper
  const handlePick: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    replaceModeRef.current = false; // plain add/replace from picker; no prior image delete
    cropSourceRef.current = file;
    cropEmitRef.current = false;
    setPickedFile(file);
    setCropOpen(true);
  };

  // Edit (no delete yet). If you want "replace", call handleReplaceClick instead.
  const handleEditClick = async (e?: React.SyntheticEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    replaceModeRef.current = false; // edit without deletion

    const currentFile = inputRef.current?.files?.[0];
    if (currentFile) {
      cropSourceRef.current = currentFile;
      cropEmitRef.current = false;
      setPickedFile(currentFile);
      setCropOpen(true);
      closeOverlay();
      return;
    }

    if (url) {
      try {
        const f = await urlToFile(
          imageUrl(url),
          inferFilenameFromUrl(url) ?? "image.jpg",
        );
        cropSourceRef.current = f;
        cropEmitRef.current = false;
        setPickedFile(f);
        setCropOpen(true);
        closeOverlay();
      } catch (err) {
        console.error(err);
        alert(
          "Could not access the image for cropping (CORS or network issue).",
        );
      }
    }
  };

  // Replace flow (your preferred UX): delete AFTER a successful crop, not before.
  const handleReplaceClick = async (e?: React.SyntheticEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    replaceModeRef.current = true; // mark that we intend to delete after crop completes

    const currentFile = inputRef.current?.files?.[0];

    if (currentFile) {
      cropSourceRef.current = currentFile;
      cropEmitRef.current = false;
      setPickedFile(currentFile);
      setCropOpen(true);
      closeOverlay();
      return;
    }

    if (url) {
      try {
        const f = await urlToFile(
          imageUrl(url),
          inferFilenameFromUrl(url) ?? "image.jpg",
        );
        cropSourceRef.current = f;
        cropEmitRef.current = false;
        setPickedFile(f);
        setCropOpen(true);
        closeOverlay();
      } catch (err) {
        console.error(err);
        alert(
          "Could not access the image for cropping (CORS or network issue).",
        );
      }
    } else {
      // No existing image; just open picker
      inputRef.current?.click();
    }
  };

  // Helper: is returned "cropped" actually identical to source?
  const isSameAsSource = (blob: File | Blob) => {
    const src = cropSourceRef.current;
    if (!src) return false;
    const sameSize = blob.size === src.size;
    const sameType = (blob as File).type === src.type;
    return sameSize && sameType;
  };

  // After cropping, emit ONE onChange with the cropped file
  // If replaceModeRef=true, delete the old image first; if user cancels, do nothing.
  const handleCroppedFile = async (cropped: File | Blob) => {
    // Ignore pre-crop echo
    if (isSameAsSource(cropped)) return;
    // Only once per session
    if (cropEmitRef.current) return;
    cropEmitRef.current = true;

    // If this was a replace, delete the old AFTER a successful crop
    if (replaceModeRef.current) {
      try {
        await Promise.resolve(onDelete());
      } catch (err) {
        console.error("Delete before replace failed:", err);
        // You can choose to bail out here. For now, we proceed to upload the new one.
      }
    }

    // Timestamped rename + MIME hardening
    const originalName =
      (cropped as File).name || cropSourceRef.current?.name || "image";
    const { filename, mime } = buildTimestampedNameAndMime(
      originalName,
      (cropped as File).type,
    );
    const renamed = new File([cropped], filename, {
      type: mime,
      lastModified: Date.now(),
    });

    // Dispatch a single synthetic onChange without touching the real input
    const temp = document.createElement("input");
    temp.type = "file";
    const dt = new DataTransfer();
    dt.items.add(renamed);
    Object.defineProperty(temp, "files", { value: dt.files, writable: false });

    const synthetic = {
      target: temp,
      currentTarget: temp,
      preventDefault() {},
      stopPropagation() {},
      nativeEvent: new Event("change"),
    } as unknown as ChangeEvent<HTMLInputElement>;

    onChange(synthetic);

    // End session
    setCropOpen(false);
    setPickedFile(null);
    cropSourceRef.current = null;
    replaceModeRef.current = false;
  };

  // Cancel crop: do NOT delete, do NOT emit — just reset.
  const handleCropClose = () => {
    setCropOpen(false);
    setPickedFile(null);
    cropSourceRef.current = null;
    cropEmitRef.current = false;
    replaceModeRef.current = false; // important: cancel any pending replace
  };

  // Prevent backdrop/base from swallowing pointer/click
  const stopAll = (e: React.SyntheticEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="col-span-full">
      <div
        role="button"
        aria-label={
          url
            ? (t("edit") ?? "Edit image")
            : (t("upload-file") ?? "Upload file")
        }
        className="relative mt-2 flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-gray-900/25 bg-white px-6 py-10"
        onClick={handleBaseClick}
      >
        {url ? (
          <>
            {/* Image layer: non-interactive */}
            <div className="pointer-events-none h-full w-full select-none">
              <ImageWithURL
                src={url}
                alt=""
                height={height ?? 1000}
                width={width ?? 1000}
              />
            </div>

            {overlayVisible && (
              <>
                {/* Backdrop: click to close */}
                <div
                  className="absolute inset-0 z-10 rounded-lg bg-gray-400/50"
                  onClick={() => setOverlayVisible(false)}
                />
                {/* Controls */}
                <div
                  className="absolute inset-0 z-20 flex items-center justify-center gap-6"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* REPLACE (delete AFTER crop) */}
                  <button
                    type="button"
                    onPointerDown={stopAll}
                    onClick={(e) => {
                      stopAll(e);
                      handleReplaceClick(e);
                    }}
                    className="cursor-pointer"
                    aria-label="Replace (delete after crop)"
                    title={t("edit") ?? "Crop"}
                  >
                    <PencilSquareIcon className="h-10 w-10 rounded-lg bg-black p-2 text-white hover:bg-gray-800" />
                  </button>

                  {/* DELETE only (immediate) */}
                  <button
                    type="button"
                    onPointerDown={stopAll}
                    onClick={(e) => {
                      stopAll(e);
                      handleDeleteClick(e);
                    }}
                    className="cursor-pointer"
                    aria-label="Delete"
                    title="Delete"
                  >
                    <TrashIcon className="h-10 w-10 rounded-lg bg-black p-2 text-red-500 hover:bg-gray-800" />
                  </button>
                </div>
              </>
            )}
          </>
        ) : (
          <div className="text-center">
            <PhotoIcon
              aria-hidden="true"
              className="mx-auto size-12 text-gray-300"
            />
            <div className="mt-4 flex text-sm/6 text-gray-600">
              <span>{t("upload-file")}</span>
            </div>
          </div>
        )}

        {children}
      </div>

      {/* Hidden input (no label) — used only for user-initiated picks */}
      <input
        ref={inputRef}
        id={id}
        name="img"
        type="file"
        className="sr-only"
        onChange={handlePick}
        accept="image/*"
      />

      {/* Cropper */}
      <CropModal
        open={cropOpen}
        file={pickedFile}
        aspect={aspect} // you can pass undefined for freeform
        onClose={handleCropClose} // <- cancel path: do nothing
        onDone={handleCroppedFile} // <- success path: delete (if replace) then emit
      />
    </div>
  );
};

/** Helpers */
async function urlToFile(
  url: string,
  filename: string,
  mime?: string,
): Promise<File> {
  const res = await fetch(url, { mode: "cors" });
  if (!res.ok) throw new Error(`Failed to fetch image: ${res.status}`);
  const blob = await res.blob();
  return new File([blob], filename, {
    type: mime || blob.type || "image/jpeg",
  });
}

function inferFilenameFromUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const base = u.pathname.split("/").pop() || "";
    return base || null;
  } catch {
    return null;
  }
}

function mimeFromExt(ext: string): string {
  const e = ext.toLowerCase();
  if (e === "jpg" || e === "jpeg") return "image/jpeg";
  if (e === "png") return "image/png";
  if (e === "webp") return "image/webp";
  if (e === "gif") return "image/gif";
  if (e === "bmp") return "image/bmp";
  if (e === "tif" || e === "tiff") return "image/tiff";
  return "application/octet-stream";
}

function buildTimestampedNameAndMime(
  originalName: string,
  incomingType?: string,
) {
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  const hasExt = /\.[^/.]+$/.test(originalName);
  const base = originalName.replace(/\.[^/.]+$/, "") || "image";
  const ext = hasExt ? originalName.split(".").pop()! : "jpg";
  const filename = `${base}-${ts}.${ext}`;
  const mime =
    incomingType && incomingType.length > 0 ? incomingType : mimeFromExt(ext);
  return { filename, mime };
}
