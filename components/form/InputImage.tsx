import { TrashIcon, PhotoIcon } from "@heroicons/react/24/outline";
import useTranslation from "next-translate/useTranslation";
import ImageWithURL from "../common/image";
import { ChangeEvent } from "react";

export const InputImage = ({
  url,
  onChange,
  onDelete,
}: {
  url?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onDelete: (e: ChangeEvent<HTMLInputElement>) => void;
}) => {
  const { t } = useTranslation();
  return (
    <div className="col-span-full">
      <label
        htmlFor="img"
        className="relative cursor-pointer rounded-md bg-white font-semibold"
      >
        <div className="group relative mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 hover:border-indigo-600">
          {url ? (
            <>
              <ImageWithURL src={url} alt={""} height={1000} width={1000} />
              <div className="invisible absolute inset-0 flex cursor-default items-center justify-center bg-gray-400/50 group-hover:visible">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDelete(e);
                  }}
                >
                  <TrashIcon className="translate-[-50%] absolute left-1/2 top-1/2 h-10 w-10 cursor-pointer rounded-lg bg-black p-2 text-red-500" />
                </button>
              </div>
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
                  id="img"
                  name="img"
                  type="file"
                  className="sr-only"
                  onChange={(e) => onChange(e)}
                />
              </div>
            </div>
          )}
        </div>
      </label>
    </div>
  );
};
