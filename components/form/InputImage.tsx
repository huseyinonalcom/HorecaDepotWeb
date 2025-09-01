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
  aspect = 1, // NEW: allow caller to control aspect ratio
}: {
  url?: string;
  id?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onDelete: () => void;
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

  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOverlayVisible((prev) => !prev);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete();
    setOverlayVisible(false);
  };

  // Intercept native choose -> open cropper instead of calling parent's onChange
  const handlePick: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPickedFile(file);
    setCropOpen(true);
  };

  // NEW: Crop the already-present image (from inputRef or fetched from URL)
  const handleEditClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // 1) Prefer whatever file is currently in the input (preserves EXIF/name when possible)
    const currentFile = inputRef.current?.files?.[0];
    if (currentFile) {
      setPickedFile(currentFile);
      setCropOpen(true);
      setOverlayVisible(false);
      return;
    }

    // 2) Fallback: fetch the URL and convert to a File (requires CORS permission on that URL)
    if (url) {
      try {
        const f = await urlToFile(
          imageUrl(url),
          inferFilenameFromUrl(url) ?? "image.jpg",
        );
        setPickedFile(f);
        setCropOpen(true);
        setOverlayVisible(false);
      } catch (err) {
        console.error(err);
        alert(
          "Could not access the image for cropping (CORS or network issue).",
        );
      }
    }
  };

  // After cropping, synthesize a ChangeEvent<HTMLInputElement> with the new File
  const handleCroppedFile = (cropped: File) => {
    if (!inputRef.current) return;

    const dt = new DataTransfer();
    dt.items.add(cropped);
    inputRef.current.files = dt.files;

    const synthetic = {
      target: inputRef.current,
      currentTarget: inputRef.current,
      preventDefault() {},
      stopPropagation() {},
      nativeEvent: new Event("change"),
    } as unknown as ChangeEvent<HTMLInputElement>;

    onChange(synthetic);

    setCropOpen(false);
    setPickedFile(null);
  };

  return (
    <div className="col-span-full">
      <label
        htmlFor={id}
        className="relative cursor-pointer rounded-md bg-white font-semibold"
      >
        <div
          className="relative mt-2 flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10"
          onClick={url ? handleImageClick : undefined}
        >
          {url ? (
            <>
              <ImageWithURL
                src={url}
                alt=""
                height={height ?? 1000}
                width={width ?? 1000}
              />
              {overlayVisible && (
                <div className="absolute inset-0 flex items-center justify-center gap-6 rounded-lg bg-gray-400/50">
                  {/* CROP button */}
                  <button
                    type="button"
                    onClick={handleEditClick}
                    className="cursor-pointer"
                    aria-label="Crop"
                    title={t("edit") ?? "Crop"}
                  >
                    <PencilSquareIcon className="h-10 w-10 rounded-lg bg-black p-2 text-white hover:bg-gray-800" />
                  </button>

                  {/* DELETE button */}
                  <button
                    type="button"
                    onClick={handleDeleteClick}
                    className="cursor-pointer"
                    aria-label="Delete"
                    title="Delete"
                  >
                    <TrashIcon className="h-10 w-10 rounded-lg bg-black p-2 text-red-500 hover:bg-gray-800" />
                  </button>
                </div>
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
                <input
                  ref={inputRef}
                  id={id}
                  name="img"
                  type="file"
                  className="sr-only"
                  onChange={handlePick}
                  accept="image/*"
                />
              </div>
            </div>
          )}
          {children}
        </div>
      </label>

      {/* Modal cropper */}
      <CropModal
        open={cropOpen}
        file={pickedFile}
        aspect={aspect} // you can pass undefined for freeform
        onClose={() => {
          setCropOpen(false);
          setPickedFile(null);
        }}
        onDone={handleCroppedFile}
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
