import Link from "next/link";
import Image from "next/image";
import useTranslation from "next-translate/useTranslation";
import { ShoppingCart, X } from "react-feather";
import { useContext } from "react";
import { WishlistContext } from "../../api/providers/wishlistProvider";

const WishListComponent = () => {
  const { wishlist, moveItemToCart, removeFromWishlist } = useContext(WishlistContext);
  const { t, lang } = useTranslation("common");

  return (
    <>
      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center gap-2">
          <div className="text-gray-500">{t("Votre wishlist est vide.")}</div>
          <Link href={"/products"} className="font-bold text-black bg-orange-400 py-2 px-4">
            SHOP
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 w-full">
          {wishlist.map((product) => (
            <div key={product.id} className={`flex flex-col items-center group w-full text-black pb-2 border-b-2`}>
              <div className="relative w-full aspect-square">
                <Link href={`/products/${product.id}`}>
                  <Image
                    src={product.images != null ? "https://hdapi.huseyinonalalpha.com" + product.images.at(0).url : "/assets/img/placeholder.png"}
                    fill
                    style={{ objectFit: "contain" }}
                    alt={product.name}
                  />
                </Link>
              </div>
              <div className="flex flex-col items-center `w-full h-[75px]">
                <h3 className="h-[25px] group-hover:h-[0px] text-base font-bold mt-3 overflow-hidden duration-700">{product.name}</h3>
                <Link
                  className="h-[0px] group-hover:h-[25px] text-lg overflow-hidden duration-700 text-left text-orange-400 font-bold"
                  href={"/products/" + product.id}
                >
                  {t("+ Voir details")}
                </Link>
                <div className="flex flex-row items-end justify-center">
                  <h5 className="mr-1 text-gray-400 text-sm line-through mb-0.5">
                    {product.priceBeforeDiscount > product.value ? "€ " + product.priceBeforeDiscount.toFixed(2).replaceAll(".", ",") : ""}
                  </h5>
                  <h4 className="text-lg font-bold">€ {product.value.toFixed(2).replaceAll(".", ",")}</h4>
                </div>
              </div>
              <div className="flex flex-row gap-2">
                <button className="duration-500 p-2 bg-white shadow-md hover:text-green-500" onClick={() => moveItemToCart(product)}>
                  <div className="flex flex-row justify-center w-full h-full items-center">
                    <ShoppingCart />
                  </div>
                </button>
                <button className="duration-500 p-2 bg-white shadow-md hover:text-red-500" onClick={() => removeFromWishlist(product.id)}>
                  <div className="flex flex-row justify-center w-full h-full items-center">🗑</div>
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
