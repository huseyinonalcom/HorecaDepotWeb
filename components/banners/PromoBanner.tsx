import Link from "next/link";
import ImageWithURL from "../common/image";
import useTranslation from "next-translate/useTranslation";
import { X } from "react-feather";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CSSProperties } from "react";

export const PromoBanner = ({
  homePage,
  banner,
  disabled,
  onEdit,
}: {
  homePage;
  banner;
  disabled?: boolean;
  onEdit?: (homePage) => void;
}) => {
  const { lang } = useTranslation("common");
  const image = banner.images.find((img) => img.locale == lang);

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: banner.id,
      animateLayoutChanges: () => false,
      disabled: disabled,
    });

  const style: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: 99,
    position: "relative",
  };

  const Wrapper = ({ children }) =>
    onEdit || disabled ? (
      <div className="w-full cursor-grab px-3">{children}</div>
    ) : (
      <Link href={image.linked_url} className="px-3 2xl:w-1/3">
        {children}
      </Link>
    );
  return (
    <div
      role="button"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="snap-start px-3 2xl:w-1/3"
    >
      <Wrapper>
        {onEdit && (
          <div className="flex flex-row items-center justify-between">
            <button
              onClick={() => {
                onEdit({
                  ...homePage,
                  layout: {
                    ...homePage.layout,
                    "1": {
                      ...homePage.layout["1"],
                      content: homePage.layout["1"].content.filter(
                        (b) => b !== banner.id,
                      ),
                    },
                  },
                });
              }}
              type="button"
            >
              <X size={18} color="red" />
            </button>
          </div>
        )}
        <div className="border-1 flex h-min flex-shrink-0 flex-col overflow-hidden rounded-xl border border-black/30 bg-white">
          <div className="relative z-20 aspect-[320/171] w-[85vw] bg-orange-400 md:w-[42vw] 2xl:w-full">
            <ImageWithURL
              src={image.image.url}
              alt={banner.localized_title[lang]}
              sizes="90vw, md:42vw, 2xl:30vw"
              fill
              priority
              className="z-20"
              style={{ objectFit: "cover" }}
            />
          </div>
          <div className="flex h-[150px] w-full flex-col gap-2 p-4">
            <p className="text-xl font-semibold">
              {banner.localized_title[lang]}
            </p>
            <p>{banner.localized_description[lang]}</p>
          </div>
        </div>
      </Wrapper>
    </div>
  );
};
