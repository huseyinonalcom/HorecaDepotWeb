import { getCoverImageUrl } from "../../api/utils/getprodcoverimage";
import useTranslation from "next-translate/useTranslation";
import { Product } from "../../api/interfaces/product";
import ImageWithURL from "../common/image";
import Link from "next/link";

type Props = {
  product: Product;
};

const ProductPreview3 = ({ product }: Props) => {
  const { t, lang } = useTranslation();
  try {
    return (
      <Link
        href={`/products/${product.categories.at(0).localized_name[lang]}/${product.name}/${product.id}`}
        draggable={false}
        id={`${product.id}-preview`}
        className={`border-1 group flex w-full flex-col items-center rounded-xl border-black/30 p-2 text-black`}
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
          <div
            draggable={false}
            className="absolute right-2 top-2 flex flex-col gap-2 opacity-100 duration-500 group-hover:top-2 group-hover:opacity-100 lg:top-6 lg:opacity-0"
          ></div>
        </div>
        <div
          draggable={false}
          id={`${product.id}-content`}
          className={"mt-2 flex w-full flex-col items-start"}
        >
          <div draggable={false} className="flex flex-col items-start">
            <p>{product.name}</p>
            {/* {product.internalCode && (
              <p className="text-sm">
                {product.internalCode != "0" ? product.internalCode : ""}
              </p>
            )} */}
            <div draggable={false} className="flex flex-row items-end gap-1">
              <p draggable={false} className="font-bold">
                {"€ " + (product.value / 1.21).toFixed(2).replaceAll(".", ",")}
              </p>
            </div>
          </div>
        </div>
      </Link>
    );
  } catch (error) {
    return <div></div>;
  }
};

export default ProductPreview3;
