import { useContext } from "react";
import useTranslation from "next-translate/useTranslation";
import { CartContext } from "../../api/providers/cartProvider";
import Image from "next/image";
import { AutoTextSize } from "auto-text-size";
import ButtonShadow1 from "../buttons/shadow_1";

export default function CheckOutCart() {
  const { t, lang } = useTranslation("common");
  const { cart, increaseQuantity, decreaseQuantity, removeFromCart } =
    useContext(CartContext);

  if (cart.length <= 0) {
    return (
      <div className="flex flex-col">
        <div className="flex w-full flex-row justify-center">
          <p>{t("Your cart is empty")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid auto-rows-min grid-cols-2 gap-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {cart.map((product) => (
        <div
          key={product.id}
          className="mb-2 flex w-full 
          flex-col bg-white pb-3 pt-2 shadow-lg"
        >
          <div className="flex w-full flex-col items-center">
            <div className="flex flex-row justify-center">
              <Image
                src={
                  product.images != null
                    ? "https://hdapi.huseyinonalalpha.com" +
                      product.images.at(0).url
                    : "/assets/img/placeholder.png"
                }
                alt={product.name}
                width={150}
                height={150}
              />
            </div>
            <h3 className="h-[25px] w-full justify-center overflow-hidden text-base font-bold duration-700">
              <AutoTextSize maxFontSizePx={14}>{product.name}</AutoTextSize>
            </h3>
            <h4 className="h-[20px] w-full justify-center overflow-hidden text-base duration-700">
              <AutoTextSize maxFontSizePx={12}>
                {product.internalCode}
              </AutoTextSize>
            </h4>
          </div>
          <div className="mb-2 flex w-full flex-row items-end justify-center">
            <p className="mb-1 mr-1 text-sm text-gray-400 line-through">
              {product.priceBeforeDiscount > product.value
                ? "€ " +
                  (product.priceBeforeDiscount * product.amount)
                    .toFixed(2)
                    .replaceAll(".", ",")
                : ""}
            </p>
            <p className="text-lg font-bold text-orange-400">
              €{" "}
              {(product.value * product.amount).toFixed(2).replaceAll(".", ",")}
            </p>
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
            <p className="mx-1.25 w-[40px] text-center">{product.amount}</p>
            <ButtonShadow1 onClick={() => increaseQuantity(product.id)}>
              <p className="aspect-[1/1] h-6 w-6 font-bold">+</p>
            </ButtonShadow1>
          </div>
        </div>
      ))}
    </div>
  );
}
