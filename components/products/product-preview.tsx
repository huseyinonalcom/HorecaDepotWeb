import Link from "next/link";
import Image from "next/image";
import useTranslation from "next-translate/useTranslation";
import { Product } from "../../api/interfaces/product";
import { Heart, ShoppingCart } from "react-feather";
import { CartContext } from "../../api/providers/cartProvider";
import { useContext, useEffect, useState } from "react";
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

  const [prodBg, setProdBG] = useState(false);

  const handleKeyPress = (event) => {
    if (event.key === "g") {
      setProdBG(true);
    } else if (event.key === "h") {
      setProdBG(false);
    }
  };

  useEffect(() => {
    // Add event listener when component mounts
    window.addEventListener("keydown", handleKeyPress);

    // Remove event listener on cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

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
        className={`relative ${prodBg && "bg-stone-200"} ${imgDimensions}`}
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
        {/* <div
          draggable={false}
          className="absolute left-2 top-2 flex flex-col gap-2"
        >
          {product.priceBeforeDiscount ? (
            <p
              draggable={false}
              className="flex h-8 w-12 items-center justify-center overflow-hidden rounded-full border-t-0 bg-green-700 text-sm font-bold text-white"
            >
              <div className="flex flex-row items-center justify-center">{`-${discountPercentage}%`}</div>
            </p>
          ) : null}
        </div> */}
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
        className={"flex flex-col items-start " + contentDimensions}
      >
        <div draggable={false} className="hidden flex-col items-start lg:flex">
          <h3 className="h-[25px] text-base font-bold duration-700">
            <AutoTextSize draggable={false} mode="oneline" maxFontSizePx={16}>
              {`${product.name}`}
            </AutoTextSize>
          </h3>
          <h4
            draggable={false}
            className="h-[19px] text-sm font-semibold duration-700 "
          >
            <AutoTextSize draggable={false} mode="oneline" maxFontSizePx={13}>
              {`${product.internalCode != "0" ? product.internalCode : ""}`}
            </AutoTextSize>
          </h4>
        </div>
        <div draggable={false} className="flex flex-col items-center lg:hidden">
          <h3
            draggable={false}
            className="h-[25px] w-full justify-center px-2 text-base font-bold"
          >
            <AutoTextSize draggable={false} mode="oneline" maxFontSizePx={16}>
              {`${product.name}`}
            </AutoTextSize>
          </h3>
          <h4
            draggable={false}
            className="h-[19px] w-full justify-center px-2 text-sm font-semibold"
          >
            <AutoTextSize draggable={false} mode="oneline" maxFontSizePx={13}>
              {`${product.internalCode != "0" ? product.internalCode : ""}`}
            </AutoTextSize>
          </h4>
        </div>

        <div
          draggable={false}
          className="flex flex-row items-end justify-center"
        >
          <p
            draggable={false}
            className="mb-0.5 mr-1 justify-end text-sm text-gray-700 line-through"
          >
            {product.priceBeforeDiscount > product.value
              ? "€ " +
                product.priceBeforeDiscount.toFixed(2).replaceAll(".", ",")
              : ""}
          </p>
          <h4 draggable={false} className="text-lg font-bold">
            € {product.value.toFixed(2).replaceAll(".", ",")}
          </h4>
        </div>

        {/* <div
          draggable={false}
          className="flex w-full flex-row-reverse justify-center gap-2 lg:hidden"
        >
          <button
            draggable={false}
            name={`Add ${product.name} to Cart`}
            aria-label={`Add ${product.name} to Cart`}
            className="bg-white p-2 shadow-sm duration-500 hover:text-green-500"
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
            className="bg-white p-2 shadow-sm duration-500 hover:text-red-500"
            onClick={() => addToWishlist(convertToWishlistProduct(product))}
          >
            <div
              draggable={false}
              className="flex h-full w-full flex-row items-center justify-center"
            >
              <Heart />
            </div>
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default ProductPreview;
