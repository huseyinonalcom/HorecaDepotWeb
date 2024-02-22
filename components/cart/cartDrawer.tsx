import React, { useContext } from "react";
import Image from "next/image";
import { CartContext } from "../../api/providers/cartProvider";
import Link from "next/link";
import { Minus, Plus, X } from "react-feather";
import useTranslation from "next-translate/useTranslation";

const CartDrawer = () => {
  const { t, lang } = useTranslation("common");
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    isDrawerOpen,
    closeDrawer,
    setQuantity,
    calculateTotal,
  } = useContext(CartContext);

  const handleQuantityChange = (id, newQuantityStr) => {
    const newQuantity = parseInt(newQuantityStr, 10);
    if (newQuantity > 0) {
      setQuantity(id, newQuantity);
    } else {
      removeFromCart(id);
    }
  };

  const handleDecreaseQuantity = (id, currentAmount) => {
    if (currentAmount <= 1) {
      removeFromCart(id);
    } else {
      decreaseQuantity(id);
    }
  };

  const drawerClass = isDrawerOpen ? "fixed right-0" : "fixed right-[-100%]";
  const overlayClass = isDrawerOpen
    ? "fixed inset-0 bg-black bg-opacity-50 z-50"
    : "fixed right-[-100%]";

  return (
    <>
      <div
        className={`${overlayClass} duration-700`}
        onClick={closeDrawer}
      ></div>
      <div
        className={`${drawerClass} top-0 min-w-[250px] max-w-[290px] h-screen bg-gray-100 p-5 z-50 overflow-y-auto duration-500`}
      >
        <button onClick={closeDrawer} className="w-full mb-2 duration-700">
          <div className="group flex w-full flex-row justify-between py-1 pl-2 pr-1 border-b border-gray-300">
            <p className="font-bold">{t("Panier")}</p>
            <X className="-rotate-180 group-hover:rotate-180 duration-700" />
          </div>
        </button>

        {cart.map((product) => (
          <div key={product.id} className="mb-2 my-1 pb-2 border-b">
            <div className="flex flex-row items-center">
              <Image
                src={
                  product.images != null
                    ? "https://hdapi.huseyinonalalpha.com" +
                      product.images.at(0).url
                    : "/assets/img/placeholder.png"
                }
                alt={product.name}
                width={90}
                height={90}
              />
              <div className="flex flex-col w-full items-center justify-start">
                <p className="pl-3 font-bold">{product.name}</p>
                <div className="w-full flex flex-row items-end justify-center mb-2">
                  <h5 className="mr-1 text-gray-400 text-sm line-through">
                    {product.priceBeforeDiscount &&
                    product.priceBeforeDiscount > product.value
                      ? `€ ${(product.priceBeforeDiscount * product.amount)
                          .toFixed(2)
                          .replaceAll(".", ",")}`
                      : ""}
                  </h5>
                  {product.priceBeforeDiscount > product.value ? (
                    <h4 className="text-green-500">
                      €{" "}
                      {(product.value * product.amount)
                        .toFixed(2)
                        .replaceAll(".", ",")}
                    </h4>
                  ) : (
                    <h4>
                      €{" "}
                      {(product.value * product.amount)
                        .toFixed(2)
                        .replaceAll(".", ",")}
                    </h4>
                  )}
                </div>
                <div className="flex flex-row items-center justify-center">
                  <button
                    onClick={() =>
                      handleDecreaseQuantity(product.id, product.amount)
                    }
                    className="font-bold"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <input
                    type="text"
                    value={product.amount}
                    onChange={(e) =>
                      handleQuantityChange(product.id, e.target.value)
                    }
                    className="text-center bg-transparent mx-1 w-[40px]"
                    min="0"
                  />
                  <button
                    onClick={() => increaseQuantity(product.id)}
                    className="font-bold"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="ml-4"
                  >
                    🗑
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {cart.length === 0 && (
          <div className="text-center text-black">{t("Panier Vide")}</div>
        )}
        <div>
          <div className="flex flex-col">
            {calculateTotal().totalBeforeDiscount !=
              calculateTotal().totalAfterDiscount && (
              <div className="flex flex-row items-center justify-between">
                <h3 className="font-extrabold text-lg">{`${t(
                  "Subtotal"
                )}:`}</h3>
                <h3 className="font-extrabold text-red-600 line-through">
                  €{" "}
                  {calculateTotal()
                    .totalBeforeDiscount.toFixed(2)
                    .replace(".", ",")}
                </h3>
              </div>
            )}
            {calculateTotal().totalBeforeDiscount !=
              calculateTotal().totalAfterDiscount && (
              <div className="flex flex-row items-center justify-between">
                <h3 className="font-extrabold text-lg">{`${t("Remise")}:`}</h3>
                <h3 className="font-extrabold text-green-500">
                  €{" "}
                  {(
                    calculateTotal().totalBeforeDiscount -
                    calculateTotal().totalAfterDiscount
                  )
                    .toFixed(2)
                    .replace(".", ",")}
                </h3>
              </div>
            )}
            <div className="flex flex-row items-center justify-between">
              <h3 className="font-extrabold text-lg">{`${t("Total")}:`}</h3>
              <h3 className="font-extrabold text-lg">
                €{" "}
                {calculateTotal()
                  .totalAfterDiscount.toFixed(2)
                  .replace(".", ",")}
              </h3>
            </div>
          </div>
          {cart.length > 0 && (
            <Link
              href="/checkout"
              className="flex flex-row justify-center w-full shadow-xl bg-green-700 hover:bg-orange-400 text-white mt-1 py-1 font-medium duration-500"
            >
              {t("Commander")}
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
