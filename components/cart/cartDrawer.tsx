import { formatCurrency } from "../../api/utils/formatters/formatcurrency";
import { getCoverImageUrl } from "../../api/utils/getprodcoverimage";
import { CartContext } from "../../api/providers/cartProvider";
import useTranslation from "next-translate/useTranslation";
import { FiX, FiMinus, FiPlus } from "react-icons/fi";
import { AutoTextSize } from "auto-text-size";
import CustomTheme from "../componentThemes";
import ImageWithURL from "../common/image";
import { useContext } from "react";
import Link from "next/link";

const CartDrawer = () => {
  const { t } = useTranslation("common");
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    isDrawerOpen,
    closeDrawer,
    calculateTotal,
  } = useContext(CartContext);

  return (
    <>
      <div
        className={`${
          isDrawerOpen
            ? "bg-opacity-50 fixed inset-0 z-50 bg-black"
            : "fixed right-[-100%]"
        } duration-700`}
        onClick={closeDrawer}
      ></div>
      <div
        className={`${isDrawerOpen ? "fixed right-0" : "fixed right-[-100%]"} top-0 z-50 h-screen max-w-[290px] min-w-[250px] overflow-y-auto bg-gray-100 p-5 duration-500`}
      >
        <button
          name="closeCartDrawer"
          aria-label="Close Cart Drawer"
          onClick={closeDrawer}
          className="mb-2 w-full duration-700"
        >
          <div className="group flex w-full flex-row justify-between border-b border-gray-300 py-1 pr-1 pl-2">
            <p className="font-bold">{t("Cart")}</p>
            <FiX className="-rotate-180 duration-700 group-hover:rotate-180" />
          </div>
        </button>

        {cart.map((product) => (
          <div key={product.id} className="my-1 mb-2 border-b pb-2">
            <div className="flex flex-row items-center">
              <ImageWithURL
                src={
                  product.images != null
                    ? getCoverImageUrl(product)
                    : "/uploads/placeholder_9db455d1f1.webp"
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
                <div className="mb-1 flex w-full flex-row items-center justify-center">
                  <h5 className="mr-1 text-sm text-gray-400 line-through">
                    {product.priceBeforeDiscount &&
                    product.priceBeforeDiscount > product.value
                      ? formatCurrency(
                          product.priceBeforeDiscount * product.amount,
                        )
                      : ""}
                  </h5>
                  {product.priceBeforeDiscount > product.value ? (
                    <h4 className="text-green-500">
                      {formatCurrency(product.value * product.amount)}
                    </h4>
                  ) : (
                    <h4>{formatCurrency(product.value * product.amount)}</h4>
                  )}
                </div>
                <div className="flex flex-row items-center justify-center">
                  <button
                    name="removeFromCart"
                    aria-label="Remove from Cart"
                    onClick={() => removeFromCart(product.id)}
                    className="mr-2.5"
                  >
                    <FiX color="red" />
                  </button>
                  <div className="mr-2 flex h-fit flex-row items-center justify-center rounded-md border-2 border-black bg-black p-0.5 duration-300">
                    <FiMinus
                      name="decreaseQuantity"
                      aria-label="Decrease Quantity"
                      className="h-6 w-6 cursor-pointer rounded-md bg-white px-1 duration-300 hover:text-red-500"
                      onClick={() => decreaseQuantity(product.id)}
                    />
                    <p className="mx-1.25 w-[40px] text-center text-white">
                      {product.amount}
                    </p>
                    <FiPlus
                      name="increaseQuantity"
                      aria-label="Increase Quantity"
                      className="h-6 w-6 cursor-pointer rounded-md bg-white px-1 duration-300 hover:text-green-500"
                      onClick={() => increaseQuantity(product.id)}
                    />
                  </div>
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
                  {formatCurrency(calculateTotal().totalBeforeDiscount)}
                </h3>
              </div>
            )}
            {calculateTotal().totalBeforeDiscount !=
              calculateTotal().totalAfterDiscount && (
              <div className="flex flex-row items-center justify-between">
                <h3 className="text-lg font-extrabold">{`${t("Discount")}:`}</h3>
                <h3 className="font-extrabold text-green-500">
                  {formatCurrency(
                    calculateTotal().totalBeforeDiscount -
                      calculateTotal().totalAfterDiscount,
                  )}
                </h3>
              </div>
            )}
            <div className="flex flex-row items-center justify-between">
              <h3 className="text-lg font-extrabold">{`${t("shipping")}:`}</h3>
              <h3 className="text-lg font-extrabold">{"€ ??"}</h3>
            </div>
            <div className="flex flex-row items-center justify-between">
              <h3 className="text-lg font-extrabold">{`${t("Total")}:`}</h3>
              <h3 className="text-lg font-extrabold">
                {formatCurrency(calculateTotal().totalAfterDiscount / 1.21)}
              </h3>
            </div>
            <div className="flex flex-row items-center justify-between">
              <h3 className="text-lg font-extrabold">{`${t("Total")} ${t("vat-incl")}:`}</h3>
              <h3 className="text-lg font-extrabold">
                {formatCurrency(calculateTotal().totalAfterDiscount)}
              </h3>
            </div>
          </div>
          {cart.length > 0 && (
            <Link
              href="/checkout"
              onClick={closeDrawer}
              className={
                CustomTheme.outlinedButton +
                " mt-1 flex w-full flex-row justify-center py-1 font-medium shadow-xl duration-500"
              }
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
