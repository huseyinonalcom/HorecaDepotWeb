import { getCoverImageUrl } from "../../api/utils/getprodcoverimage";
import useTranslation from "next-translate/useTranslation";
import { Product } from "../../api/interfaces/product";
import ImageWithURL from "../common/image";

type Props = {
  product: Product;
  onClick: (product: Product) => void;
};

function calculatePercentageDifference(originalPrice, currentPrice) {
  if (originalPrice <= 0) return 0;

  const difference = originalPrice - currentPrice;
  const percentageDifference = (difference / originalPrice) * 100;
  return percentageDifference.toFixed(0);
}

const ProductPreviewCustom = ({ product, onClick }: Props) => {
  const { t, lang } = useTranslation("common");

  const discountPercentage = calculatePercentageDifference(
    product.priceBeforeDiscount,
    product.value,
  );

  return (
    <button
      type="button"
      onClick={() => onClick(product)}
      draggable={false}
      id={`${product.id}-preview`}
      className={`border-1 group flex w-full flex-col items-center rounded-xl border border-black/30 p-2 text-black`}
    >
      <div
        draggable={false}
        id={`${product.id}-image`}
        className={`relative aspect-square w-full`}
      >
        <ImageWithURL
          draggable={false}
          sizes="(max-width: 768px) 190px, 290px"
          src={
            product.images != null
              ? getCoverImageUrl(product)
              : "/uploads/placeholder_9db455d1f1.webp"
          }
          fill
          style={{ objectFit: "contain", cursor: "pointer" }}
          alt={product.name}
        />
      </div>
      <div
        draggable={false}
        id={`${product.id}-content`}
        className={"mt-2 flex w-full flex-col items-start"}
      >
        <div draggable={false} className="flex flex-col items-start">
          <p className="font-bold">{product.name}</p>
          <p>{t(product.categories[0]?.localized_name[lang]) ?? ""}</p>
          {product.internalCode && (
            <p className="text-sm">
              {product.internalCode != "0" ? product.internalCode : ""}
            </p>
          )}
          <div draggable={false} className="flex flex-row items-end gap-1">
            <p draggable={false} className="font-bold">
              {"€ " + product.value.toFixed(2).replaceAll(".", ",")}
            </p>
            {product.priceBeforeDiscount > product.value && (
              <p
                draggable={false}
                className="mb-0.5 text-sm text-gray-700 line-through"
              >
                {"€ " +
                  product.priceBeforeDiscount.toFixed(2).replaceAll(".", ",")}
              </p>
            )}
            {product.priceBeforeDiscount > product.value ? (
              <p
                draggable={false}
                className="mb-0.5 flex w-fit flex-row items-center justify-center overflow-hidden border-t-0 bg-gray-200 px-1.5 py-1 text-xs"
              >
                -{discountPercentage}%
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </button>
  );
};

export default ProductPreviewCustom;
