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
        className={`relative ${imgDimensions}`}
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
        <div className="absolute left-2 top-2 flex flex-col gap-2">
          {product.priceBeforeDiscount ? (
            <Link
            draggable={false}
              className="flex h-8 w-12 items-center justify-center overflow-hidden rounded-full border-t-0 bg-green-700 text-sm font-bold text-white"
              href={`/products/${product.id}`}
            >
              <div className="flex flex-row items-center justify-center">{`-${discountPercentage}%`}</div>
            </Link>
          ) : null}
        </div>
        <div className="absolute right-2 top-2 hidden flex-col gap-2 opacity-100 duration-500 group-hover:top-2 group-hover:opacity-100 lg:top-6 lg:flex lg:opacity-0">
          <button
                draggable={false}
            name={`Add ${product.name} to Cart`}
            aria-label={`Add ${product.name} to Cart`}
            className="bg-white p-2 shadow-md duration-500 hover:text-green-500"
            onClick={() => addToCart(convertToCartProduct(product))}
          >
            <div className="flex h-full w-full flex-row items-center justify-center">
              <ShoppingCart />
            </div>
          </button>
          <button
                draggable={false}
            name={`Add ${product.name} to Wishlist`}
            aria-label={`Add ${product.name} to Wishlist`}
            className="bg-white p-2 shadow-md duration-500 hover:text-red-500"
            onClick={() => addToWishlist(convertToWishlistProduct(product))}
          >
            <div className="flex h-full w-full flex-row items-center justify-center">
              <Heart />
            </div>
          </button>
        </div>
      </div>
      <div
        id={`${product.id}-content`}
        className={"flex flex-col items-center " + contentDimensions}
      >
        <div className="hidden flex-col items-center lg:flex">
          <h3 className="h-[25px] w-full justify-center overflow-hidden px-2 text-base font-bold duration-700">
            <AutoTextSize mode="oneline" maxFontSizePx={16}>
              {`${product.name}`}
            </AutoTextSize>
          </h3>
          <h4 className="h-[19px] w-full justify-center overflow-hidden px-2 text-sm font-semibold duration-700 group-hover:h-[0px]">
            <AutoTextSize mode="oneline" maxFontSizePx={13}>
              {`${product.internalCode != "0" ? product.internalCode : ""}`}
            </AutoTextSize>
          </h4>
          <Link
            className="h-[0px] overflow-hidden text-left text-sm font-bold text-orange-400 duration-700 group-hover:h-[19px]"
            href={"/products/" + product.id}
          >
            {t("+ View Details")}
          </Link>
        </div>
        <div className="flex flex-col items-center lg:hidden">
          <h3 className="h-[25px] w-full justify-center px-2 text-base font-bold">
            <AutoTextSize mode="oneline" maxFontSizePx={16}>
              {`${product.name}`}
            </AutoTextSize>
          </h3>
          <h4 className="h-[19px] w-full justify-center px-2 text-sm font-semibold">
            <AutoTextSize mode="oneline" maxFontSizePx={13}>
              {`${product.internalCode != "0" ? product.internalCode : ""}`}
            </AutoTextSize>
          </h4>
        </div>

        <div className="flex w-full flex-row items-end justify-center">
          <p className="mb-0.5 mr-1 justify-end text-sm text-gray-700 line-through">
            {product.priceBeforeDiscount > product.value
              ? "€ " +
                product.priceBeforeDiscount.toFixed(2).replaceAll(".", ",")
              : ""}
          </p>
          <h4 className="text-lg font-bold">
            € {product.value.toFixed(2).replaceAll(".", ",")}
          </h4>
        </div>

        <div className="flex w-full flex-row-reverse justify-center gap-2 lg:hidden">
          <button
            name={`Add ${product.name} to Cart`}
            aria-label={`Add ${product.name} to Cart`}
            className="bg-white p-2 shadow-md duration-500 hover:text-green-500"
            onClick={() => addToCart(convertToCartProduct(product))}
          >
            <div className="flex h-full w-full flex-row items-center justify-center">
              <ShoppingCart />
            </div>
          </button>
          <button
            name={`Add ${product.name} to Wishlist`}
            aria-label={`Add ${product.name} to Wishlist`}
            className="bg-white p-2 shadow-md duration-500 hover:text-red-500"
            onClick={() => addToWishlist(convertToWishlistProduct(product))}
          >
            <div className="flex h-full w-full flex-row items-center justify-center">
              <Heart />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductPreview;
