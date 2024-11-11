import useTranslation from "next-translate/useTranslation";
import { Category } from "../../api/interfaces/category";
import ImageWithURL from "../common/image";
import { X } from "react-feather";
import Link from "next/link";

export const CategoryBanner = ({
  category,
  onRemoveCategory,
}: {
  category: Category;
  onRemoveCategory?: (category: Category) => void;
}) => {
  const { lang } = useTranslation("common");

  const content = (
    <>
      <div className="relative aspect-[15/14] w-full overflow-hidden rounded-xl">
        <ImageWithURL
          fill
          style={{ objectFit: "contain" }}
          sizes="42vw, (max-width: 640px) 28vw, (max-width: 1024px) 13vw, (nax-width: 1536px) 236px"
          src={category.image?.url}
          alt={category.localized_name?.[lang] + " image"}
        />
      </div>
      <p className="font-semibold">
        {category.localized_name?.[lang] ?? category.Name}
      </p>
    </>
  );

  return (
    <div>
      {onRemoveCategory && (
        <button
          onClick={() => {
            onRemoveCategory(category);
          }}
          type="button"
        >
          <X size={18} color="red" />
        </button>
      )}
      {onRemoveCategory ? (
        <div className="flex flex-col items-center gap-2">{content}</div>
      ) : (
        <Link
          href={`/shop/${category.localized_name?.[lang] ?? category.Name}`}
          className="flex flex-col items-center gap-2"
        >
          {content}
        </Link>
      )}
    </div>
  );
};
