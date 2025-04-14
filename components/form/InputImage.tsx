import { TrashIcon, PhotoIcon } from "@heroicons/react/24/outline";
import useTranslation from "next-translate/useTranslation";
import ImageWithURL from "../common/image";
import { ChangeEvent } from "react";
import { useState } from "react";

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
                    <TrashIcon className="translate-[-50%] absolute left-1/2 top-1/2 h-10 w-10 rounded-lg bg-black p-2 text-red-500" />
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
                  id={id}
                  name="img"
                  type="file"
                  className="sr-only"
                  onChange={onChange}
                />
              </div>
            </div>
          )}
          {children}
        </div>
      </label>
    </div>
  );
};
