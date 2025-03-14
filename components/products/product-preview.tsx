import { formatCurrency } from "../../api/utils/formatters/formatcurrency";
import { WishlistContext } from "../../api/providers/wishlistProvider";
import { WishlistProduct } from "../../api/interfaces/wishlistProduct";
import { getCoverImageUrl } from "../../api/utils/getprodcoverimage";
import { CartContext } from "../../api/providers/cartProvider";
import { CartProduct } from "../../api/interfaces/cartProduct";
import useTranslation from "next-translate/useTranslation";
import { FiShoppingCart, FiHeart } from "react-icons/fi";
import { Product } from "../../api/interfaces/product";
import ImageWithURL from "../common/image";
import { TiTick } from "react-icons/ti";
import { useContext } from "react";
import Link from "next/link";

type Props = {
  product: Product;
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

const ProductPreview = ({ product }: Props) => {
  const { addToCart } = useContext(CartContext);
  const { addToWishlist } = useContext(WishlistContext);
  const { t, lang } = useTranslation("common");

  const discountPercentage = calculatePercentageDifference(
    product.priceBeforeDiscount,
    product.value,
  );

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
          className="absolute right-2 top-2 hidden flex-col gap-2 opacity-100 duration-500 group-hover:top-2 group-hover:opacity-100 md:flex lg:top-6 lg:opacity-0"
        >
          <button
            draggable={false}
            name={`Add ${product.name} to Cart`}
            aria-label={`Add ${product.name} to Cart`}
            className="h-8 w-8 bg-white p-1.5 shadow-md duration-500 hover:text-green-500 md:h-12 md:w-12 md:p-2"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(convertToCartProduct(product));
            }}
          >
            <FiShoppingCart className="mx-auto" />
          </button>
          <button
            draggable={false}
            name={`Add ${product.name} to Wishlist`}
            aria-label={`Add ${product.name} to Wishlist`}
            className="h-8 w-8 bg-white p-1.5 shadow-md duration-500 hover:text-red-500 md:h-12 md:w-12 md:p-2"
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              addToWishlist(convertToWishlistProduct(product));
            }}
          >
            <FiHeart className="mx-auto" />
          </button>
        </div>
      </div>
      <div
        draggable={false}
        id={`${product.id}-content`}
        className={"mt-2 flex w-full flex-col items-start"}
      >
        <div draggable={false} className="flex flex-col items-start">
          <p className="font-bold">{product.name}</p>
          <p>{product.categories[0]?.localized_name[lang] ?? ""}</p>
          {product.internalCode && (
            <p className="text-sm">
              {product.internalCode != "0" ? product.internalCode : ""}
            </p>
          )}
          <div
            draggable={false}
            className="flex flex-row items-end gap-1 text-lg"
          >
            <p draggable={false} className="font-bold">
              {formatCurrency(product.value / 1.21)}
            </p>
            {product.priceBeforeDiscount > product.value && (
              <p
                draggable={false}
                className="mb-0.5 text-base text-gray-700 line-through"
              >
                {formatCurrency(product.priceBeforeDiscount / 1.21)}
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
          <p className="text-[10px]">{t("vat-excl")}</p>
          {product.shelves && product.shelves.length > 0 && (
            <div draggable={false} className="text-sm font-semibold">
              {product.shelves?.reduce((acc, shelf) => acc + shelf.stock, 0) >
                10 && (
                <div className="flex flex-row gap-0.5">
                  <p>{t("in_stock")}</p>
                  <TiTick size={16} color="green" />
                </div>
              )}
              {product.shelves?.reduce((acc, shelf) => acc + shelf.stock, 0) <=
                10 &&
                product.shelves?.reduce((acc, shelf) => acc + shelf.stock, 0) >
                  0 && <p className="text-orange-700">{t("low_stock")}</p>}
              {product.shelves?.reduce((acc, shelf) => acc + shelf.stock, 0) <
                1 && <p className="text-red-700">{t("no_stock")}</p>}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductPreview;
