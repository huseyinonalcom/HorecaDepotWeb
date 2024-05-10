import Link from "next/link";
import Image from "next/image";
import useTranslation from "next-translate/useTranslation";
import { Product } from "../../api/interfaces/product";
import { Heart, ShoppingCart } from "react-feather";
import { CartContext } from "../../api/providers/cartProvider";
import { useContext } from "react";
import { CartProduct } from "../../api/interfaces/cartProduct";
import { WishlistContext } from "../../api/providers/wishlistProvider";
import { WishlistProduct } from "../../api/interfaces/wishlistProduct";
import { AutoTextSize } from "auto-text-size";

type Props = {
  product: Product;
  width: number | "full";
};

function convertToCartProduct(
  product: Product,
  amount: number = 1,
): CartProduct {
  return {
    ...product,
    amount: amount,
  };
}

function convertToWishlistProduct(product: Product): WishlistProduct {
  return {
    ...product,
  };
}

function calculatePercentageDifference(originalPrice, currentPrice) {
  if (originalPrice <= 0) return 0;

  const difference = originalPrice - currentPrice;
  const percentageDifference = (difference / originalPrice) * 100;
  return percentageDifference.toFixed(0);
}

const ProductPreview = ({ product, width }: Props) => {
  const { addToCart } = useContext(CartContext);
  const { addToWishlist } = useContext(WishlistContext);
  const { t } = useTranslation("common");

  const discountPercentage = calculatePercentageDifference(
    product.priceBeforeDiscount,
    product.value,
  );

  var widthString: string;

  if (width == "full") {
    widthString = "w-full";
  } else {
    widthString = `w-[${width}px]`;
  }

  const imgDimensions = `${widthString} aspect-square`;
  const contentDimensions = ` ${widthString}`;

  return (
    <div
      draggable={false}
      id={`${product.id}-preview`}
      className={`group flex w-full flex-col items-center text-black`}
    >
      <div
        draggable={false}
        id={`${product.id}-image`}
        className={`relative bg-stone-200 ${imgDimensions}`}
      >
        <Link draggable={false} href={`/products/${product.id}`}>
          <Image
            draggable={false}
            sizes="(max-width: 768px) 95vw, (max-width: 1024px) 48vw, 20vw"
            src={
              product.images != null
                ? "https://hdapi.huseyinonalalpha.com" +
                  product.images.at(0).url
                : "/assets/img/placeholder.png"
            }
            fill
            style={{ objectFit: "contain", cursor: "pointer" }}
            alt={product.name}
          />
        </Link>
        <div
          draggable={false}
          className="absolute right-2 top-2 flex flex-col gap-2 opacity-100 duration-500 group-hover:top-2 group-hover:opacity-100 lg:top-6 lg:opacity-0"
        >
          <button
            draggable={false}
            name={`Add ${product.name} to Cart`}
            aria-label={`Add ${product.name} to Cart`}
            className="h-8 w-8 bg-white p-1.5 shadow-md duration-500 hover:text-green-500 md:h-12 md:w-12 md:p-2"
            onClick={() => addToCart(convertToCartProduct(product))}
          >
            <div
              draggable={false}
              className="flex h-full w-full flex-row items-center justify-center"
            >
              <ShoppingCart />
            </div>
          </button>
          <button
            draggable={false}
            name={`Add ${product.name} to Wishlist`}
            aria-label={`Add ${product.name} to Wishlist`}
            className="h-8 w-8 bg-white p-1.5 shadow-md duration-500 hover:text-red-500 md:h-12 md:w-12 md:p-2"
            onClick={() => addToWishlist(convertToWishlistProduct(product))}
          >
            <div
              draggable={false}
              className="flex h-full w-full flex-row items-center justify-center"
            >
              <Heart />
            </div>
          </button>
        </div>
      </div>
      <div
        draggable={false}
        id={`${product.id}-content`}
        className={"mt-2 flex flex-col items-start " + contentDimensions}
      >
        <div draggable={false} className="flex flex-col items-start">
          <div className="duration-700">
            <AutoTextSize draggable={false} mode="oneline" maxFontSizePx={16}>
              {product.name}
            </AutoTextSize>
          </div>
          <div className="duration-700">
            <AutoTextSize draggable={false} mode="oneline" maxFontSizePx={14}>
              {product.category?.Name ?? ''}
            </AutoTextSize>
          </div>
          {product.internalCode && (
            <div draggable={false} className="text-sm duration-700 ">
              <AutoTextSize draggable={false} mode="oneline" maxFontSizePx={13}>
                {product.internalCode != "0" ? product.internalCode : ""}
              </AutoTextSize>
            </div>
          )}
          <div draggable={false} className="flex flex-row items-end gap-1">
            <div draggable={false} className="text-lg font-bold">
              <AutoTextSize draggable={false} mode="oneline" maxFontSizePx={15}>
                {"€ " + product.value.toFixed(2).replaceAll(".", ",")}
              </AutoTextSize>
            </div>
            {product.priceBeforeDiscount > product.value && (
              <div
                draggable={false}
                className="mb-0.5 text-sm text-gray-700 line-through"
              >
                <AutoTextSize
                  draggable={false}
                  mode="oneline"
                  maxFontSizePx={12}
                >
                  {"€ " +
                    product.priceBeforeDiscount.toFixed(2).replaceAll(".", ",")}
                </AutoTextSize>
              </div>
            )}
            {product.priceBeforeDiscount ? (
              <p
                draggable={false}
                className="mb-0.5 flex w-fit flex-row items-center justify-center overflow-hidden border-t-0 bg-gray-200 px-2 py-1 text-xs"
              >
                -{discountPercentage}%
              </p>
            ) : null}
          </div>
          {product.shelves && product.shelves.length > 0 && (
            <div draggable={false} className="text-sm font-semibold">
              {product.shelves?.reduce((acc, shelf) => acc + shelf.stock, 0) >
                10 && (
                <AutoTextSize
                  draggable={false}
                  mode="oneline"
                  maxFontSizePx={13}
                >
                  {t("in_stock")}
                </AutoTextSize>
              )}
              {product.shelves?.reduce((acc, shelf) => acc + shelf.stock, 0) <=
                10 &&
                product.shelves?.reduce((acc, shelf) => acc + shelf.stock, 0) >
                  0 && (
                  <AutoTextSize
                    draggable={false}
                    mode="oneline"
                    maxFontSizePx={13}
                    className="text-orange-500"
                  >
                    {t("low_stock")}
                  </AutoTextSize>
                )}

              {product.shelves?.reduce((acc, shelf) => acc + shelf.stock, 0) <
                1 && (
                <AutoTextSize
                  draggable={false}
                  mode="oneline"
                  maxFontSizePx={13}
                  className="text-red-500"
                >
                  {t("no_stock")}
                </AutoTextSize>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductPreview;
