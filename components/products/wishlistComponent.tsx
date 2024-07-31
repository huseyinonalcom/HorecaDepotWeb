import Link from "next/link";
import Image from "next/image";
import useTranslation from "next-translate/useTranslation";
import { ShoppingCart, X } from "react-feather";
import { useContext } from "react";
import { WishlistContext } from "../../api/providers/wishlistProvider";
import ImageWithURL from "../common/image";
import { getCoverImageUrl } from "../../api/utils/getprodcoverimage";

const WishListComponent = () => {
  const { wishlist, moveItemToCart, removeFromWishlist } =
    useContext(WishlistContext);
  const { t, lang } = useTranslation("common");

  return (
    <>
      {wishlist.length === 0 ? (
        <div className="mb-2 flex flex-col items-center gap-2">
          <div className="text-gray-500">{t("Your wishlist is empty.")}</div>
          <Link
            href={"/shop/tous?page=1"}
            className="bg-black px-4 py-2 font-bold text-white"
          >
            SHOP
          </Link>
        </div>
      ) : (
        <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {wishlist.map((product) => (
            <div
              key={product.id}
              className={`group flex w-full flex-col items-center border-b-2 pb-2 text-black`}
            >
              <div className="relative aspect-square w-full">
                <Link
                  href={`/products/${product.categories.at(0).Name}/${product.name}/${product.id}`}
                >
                  <ImageWithURL
                    src={
                      product.images != null
                        ? getCoverImageUrl(product)
                        : "/uploads/placeholder_9db455d1f1.webp"
                    }
                    fill
                    style={{ objectFit: "contain" }}
                    alt={product.name}
                  />
                </Link>
              </div>
              <div className="`w-full flex h-[75px] flex-col items-center">
                <h3 className="mt-3 h-[25px] overflow-hidden text-base font-bold duration-700 group-hover:h-[0px]">
                  {product.name}
                </h3>
                <Link
                  className="h-[0px] overflow-hidden text-left text-lg font-bold text-black duration-700 group-hover:h-[25px]"
                  href={
                    "/products/" +
                    `${product.categories.at(0).Name}/${product.name}/${product.id}`
                  }
                >
                  {t("+ View Details")}
                </Link>
                <div className="flex flex-row items-end justify-center">
                  <h5 className="mb-0.5 mr-1 text-sm text-gray-400 line-through">
                    {product.priceBeforeDiscount > product.value
                      ? "€ " +
                        product.priceBeforeDiscount
                          .toFixed(2)
                          .replaceAll(".", ",")
                      : ""}
                  </h5>
                  <h4 className="text-lg font-bold">
                    € {product.value.toFixed(2).replaceAll(".", ",")}
                  </h4>
                </div>
              </div>
              <div className="flex flex-row gap-2">
                <button
                  name="moveToCart"
                  aria-label="Move to Cart"
                  className="bg-white p-2 shadow-md duration-500 hover:text-green-500"
                  onClick={() => moveItemToCart(product)}
                >
                  <div className="flex h-full w-full flex-row items-center justify-center">
                    <ShoppingCart />
                  </div>
                </button>
                <button
                  name="removeFromWishlist"
                  aria-label="Remove from Wishlist"
                  className="bg-white p-2 shadow-md duration-500 hover:text-red-500"
                  onClick={() => removeFromWishlist(product.id)}
                >
                  <div className="flex h-full w-full flex-row items-center justify-center">
                    <X color="red" />
                  </div>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default WishListComponent;
