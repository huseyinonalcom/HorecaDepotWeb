import React, { useContext } from "react";
import Image from "next/image";
import { CartContext } from "../../api/providers/cartProvider";
import Link from "next/link";
import { X } from "react-feather";
import useTranslation from "next-translate/useTranslation";
import ButtonShadow1 from "../buttons/shadow_1";
import { AutoTextSize } from "auto-text-size";

const CartDrawer = () => {
  const { t, lang } = useTranslation("common");
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    isDrawerOpen,
    closeDrawer,
    calculateTotal,
  } = useContext(CartContext);

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
        className={`${drawerClass} top-0 z-50 h-screen min-w-[250px] max-w-[290px] overflow-y-auto bg-gray-100 p-5 duration-500`}
      >
        <button onClick={closeDrawer} className="mb-2 w-full duration-700">
          <div className="group flex w-full flex-row justify-between border-b border-gray-300 py-1 pl-2 pr-1">
            <p className="font-bold">{t("Cart")}</p>
            <X className="-rotate-180 duration-700 group-hover:rotate-180" />
          </div>
        </button>

        {cart.map((product) => (
          <div key={product.id} className="my-1 mb-2 border-b pb-2">
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
              <div className="flex w-full flex-col items-center justify-start">
                <h3 className="h-[25px] w-full justify-center overflow-hidden text-base font-bold duration-700">
                  <AutoTextSize maxFontSizePx={14}>{product.name}</AutoTextSize>
                </h3>
                <h4 className="h-[20px] w-full justify-center overflow-hidden text-base duration-700">
                  <AutoTextSize maxFontSizePx={12}>
                    {product.internalCode}
                  </AutoTextSize>
                </h4>
                <div className="mb-2 flex w-full flex-row items-end justify-center">
                  <h5 className="mr-1 text-sm text-gray-400 line-through">
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
                <div className="flex flex-row items-end justify-center">
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="mr-2.5"
                  >
                    🗑
                  </button>
                  <ButtonShadow1 onClick={() => decreaseQuantity(product.id)}>
                    <p className="aspect-[1/1] h-6 w-6 font-bold">-</p>
                  </ButtonShadow1>
                  <p className="mx-1.25 w-[40px] text-center">
                    {product.amount}
                  </p>
                  <ButtonShadow1 onClick={() => increaseQuantity(product.id)}>
                    <p className="aspect-[1/1] h-6 w-6 font-bold">+</p>
                  </ButtonShadow1>
                </div>
              </div>
            </div>
          </div>
        ))}
        {cart.length === 0 && (
          <div className="text-center text-black">{t("Cart Empty")}</div>
        )}
        <div>
          <div className="flex flex-col">
            {calculateTotal().totalBeforeDiscount !=
              calculateTotal().totalAfterDiscount && (
              <div className="flex flex-row items-center justify-between">
                <h3 className="text-lg font-extrabold">{`${t(
                  "Subtotal",
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
                <h3 className="text-lg font-extrabold">{`${t("Discount")}:`}</h3>
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
              <h3 className="text-lg font-extrabold">{`${t("Total")}:`}</h3>
              <h3 className="text-lg font-extrabold">
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
              className="mt-1 flex w-full flex-row justify-center bg-green-700 py-1 font-medium text-white shadow-xl duration-500 hover:bg-orange-400"
            >
              {t("Order")}
            </Link>
          )}
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
