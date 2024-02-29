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
import { useRouter } from "next/router";
import { AutoTextSize } from "auto-text-size";

type Props = {
  product: Product;
  width: number | "full";
};

function convertToCartProduct(
  product: Product,
  amount: number = 1
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
  const router = useRouter();

  const discountPercentage = calculatePercentageDifference(
    product.priceBeforeDiscount,
    product.value
  );

  var widthString: string;

  if (width == "full") {
    widthString = "w-full";
  } else {
    widthString = `w-[${width}px]`;
  }

  const imgDimensions = `${widthString} aspect-square`;
  const contentDimensions = ` ${widthString} h-[75px]`;

  return (
    <div
      id={`${product.id}-preview`}
      className={`flex flex-col items-center group w-full text-black`}
    >
      <div id={`${product.id}-image`} className={`relative ${imgDimensions}`}>
        <Image
          sizes="(max-width: 768px) 95vw, (max-width: 1024px) 48vw, 20vw"
          onClick={() => router.push(`/products/${product.id}`)}
          src={
            product.images != null
              ? "https://hdapi.huseyinonalalpha.com" + product.images.at(0).url
              : "/assets/img/placeholder.png"
          }
          fill
          style={{ objectFit: "contain", cursor: "pointer" }}
          alt={product.name}
        />
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {product.priceBeforeDiscount ? (
            <button
              className="flex items-center justify-center bg-green-700 h-12 w-12 font-bold rounded-full text-sm text-white overflow-hidden"
              style={{ padding: "1em", borderRadius: "50%" }}
              onClick={() => router.push(`/products/${product.id}`)}
            >
              <div className="flex flex-row justify-center items-center">{`-${discountPercentage}%`}</div>
            </button>
          ) : null}
        </div>
        <div className="absolute top-6 group-hover:top-2 opacity-100 lg:opacity-0 group-hover:opacity-100 duration-500 right-2 flex flex-col gap-2">
          <button
            name={`Add ${product.name} to Cart`}
            aria-label={`Add ${product.name} to Cart`}
            className="duration-500 p-2 bg-white shadow-md hover:text-green-500"
            onClick={() => addToCart(convertToCartProduct(product))}
          >
            <div className="flex flex-row justify-center w-full h-full items-center">
              <ShoppingCart />
            </div>
          </button>
          <button
            name={`Add ${product.name} to Wishlist`}
            aria-label={`Add ${product.name} to Wishlist`}
            className="duration-500 p-2 bg-white shadow-md hover:text-red-500"
            onClick={() => addToWishlist(convertToWishlistProduct(product))}
          >
            <div className="flex flex-row justify-center w-full h-full items-center">
              <Heart />
            </div>
          </button>
        </div>
      </div>
      <div
        id={`${product.id}-content`}
        className={"flex flex-col items-center " + contentDimensions}
      >
        <h3 className="h-[25px] group-hover:h-[0px] text-base font-bold mt-3 w-full justify-center overflow-hidden duration-700 px-2">
          <AutoTextSize mode="oneline" maxFontSizePx={16}>
            {`${product.name}`}
          </AutoTextSize>
        </h3>
        <h4 className="h-[19px] group-hover:h-[0px] text-sm font-semibold w-full justify-center overflow-hidden duration-700 px-2">
          <AutoTextSize mode="oneline" maxFontSizePx={13}>
            {`${product.internalCode != "0" ? product.internalCode : ""}`}
          </AutoTextSize>
        </h4>
        <Link
          className="h-[0px] group-hover:h-[44px] text-lg overflow-hidden duration-700 text-left text-orange-400 font-bold"
          href={"/products/" + product.id}
        >
          {t("+ Voir details")}
        </Link>
        <div className="w-full flex flex-row items-end justify-center">
          <p className="mr-1 text-gray-700 text-sm line-through justify-end mb-0.5">
            {product.priceBeforeDiscount > product.value
              ? "€ " +
                product.priceBeforeDiscount.toFixed(2).replaceAll(".", ",")
              : ""}
          </p>
          <h4 className="text-lg font-bold">
            € {product.value.toFixed(2).replaceAll(".", ",")}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default ProductPreview;
