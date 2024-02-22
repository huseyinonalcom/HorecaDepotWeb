import { useContext } from "react";
import useTranslation from "next-translate/useTranslation";
import { CartContext } from "../../api/providers/cartProvider";
import Image from "next/image";
import { AutoTextSize } from "auto-text-size";

export default function CheckOutCart() {
  const { t, lang } = useTranslation("common");
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    setQuantity,
    calculateTotal,
  } = useContext(CartContext);

  const handleQuantityChange = (id: number, newQuantityStr: string) => {
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

  if (cart.length <= 0) {
    return (
      <div className="flex flex-col">
        <div className="flex flex-row w-full justify-center">
          <p>{t("Votre panier est vide!")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-2 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 auto-rows-min">
      {cart.map((product) => (
        <div
          key={product.id}
          className="mb-2 flex flex-col rounded
          shadow-lg bg-white p-4 w-full h-[230px]"
        >
          <div className="flex flex-col items-center w-full">
            <div className="flex flex-row justify-center">
              <Image
                src={
                  product.images != null
                    ? "https://hdapi.huseyinonalalpha.com" +
                      product.images.at(0).url
                    : "/assets/img/placeholder.png"
                }
                alt={product.name}
                width={100}
                height={100}
              />
            </div>
            <h3 className="h-[25px] text-base font-bold w-full justify-center overflow-hidden duration-700">
              <AutoTextSize maxFontSizePx={14}>{product.name}</AutoTextSize>
            </h3>
          </div>
          <div className="w-full flex flex-row items-end justify-center mb-2">
            <p className="mr-1 text-gray-400 text-sm line-through mb-1">
              {product.priceBeforeDiscount > product.value 
                ? "€ " +
                  (product.priceBeforeDiscount * product.amount)
                    .toFixed(2)
                    .replaceAll(".", ",")
                : ""}
            </p>
            <p className="text-orange-400 text-lg font-bold">
              €{" "}
              {(product.value * product.amount).toFixed(2).replaceAll(".", ",")}
            </p>
          </div>

          <div className="flex flex-row items-end justify-center">
            <button
              onClick={() => handleDecreaseQuantity(product.id, product.amount)}
              className="font-bold"
            >
              -
            </button>
            <input
              value={product.amount}
              onChange={(e) => handleQuantityChange(product.id, e.target.value)}
              className="text-center mx-1.25 w-[40px]"
              min="0"
            />
            <button
              onClick={() => increaseQuantity(product.id)}
              className="font-bold"
            >
              +
            </button>
            <button
              onClick={() => removeFromCart(product.id)}
              className="ml-2.5"
            >
              🗑
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
