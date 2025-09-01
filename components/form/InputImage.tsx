import { TrashIcon, PhotoIcon } from "@heroicons/react/24/outline";
import useTranslation from "next-translate/useTranslation";
import { ChangeEvent, useRef, useState } from "react";
import ImageWithURL from "../common/image";
import CropModal from "../image/CropModal";

export const InputImage = ({
  url,
  id,
  onChange,
  onDelete,
  height,
  width,
  children,
}: {
  url?: string;
  id?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onDelete: () => void;
  height?: number;
  width?: number;
  children?: React.ReactNode;
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

  const handlePick: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPickedFile(file);
    setCropOpen(true);
  };

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
                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-gray-400/50">
                  <button
                    type="button"
                    onClick={handleDeleteClick}
                    className="cursor-pointer"
                  >
                    <TrashIcon className="absolute top-1/2 left-1/2 h-10 w-10 translate-[-50%] rounded-lg bg-black p-2 text-red-500" />
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

      <CropModal
        open={cropOpen}
        file={pickedFile}
        aspect={1}
        onClose={() => {
          setCropOpen(false);
          setPickedFile(null);
        }}
        onDone={handleCroppedFile}
      />
    </div>
  );
};
