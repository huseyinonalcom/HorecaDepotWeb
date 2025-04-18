import StockLayout from "../../components/stock/StockLayout";
import { getCoverImageUrl } from "../../api/utils/getprodcoverimage";
import { AutoTextSize } from "auto-text-size";
import { FiMinus, FiPlus, FiX } from "react-icons/fi";
import { useEffect, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import ImageWithURL from "../../components/common/image";

export default function Reserve() {
  const [cart, setCart] = useState<any[]>([]);

  const getCart = async () => {
    const cart = localStorage.getItem("stock-cart");
    setCart(cart ? JSON.parse(cart) : []);
  };

  const removeFromCart = (productId: number) => {
    const cart = JSON.parse(localStorage.getItem("stock-cart") ?? "[]");
    const itemToDelete = cart.find((p) => p.id === productId);
    if (!itemToDelete) return;
    const index = cart.indexOf(itemToDelete);
    cart.splice(index, 1);
    localStorage.setItem("stock-cart", JSON.stringify(cart));
    setCart(cart);
  };

  const setAmount = (productId: number, amount: number) => {
    const cart = JSON.parse(localStorage.getItem("stock-cart") ?? "[]");
    const itemToUpdate = cart.find((p) => p.id === productId);
    if (!itemToUpdate) return;
    if (amount < 1) return;
    itemToUpdate.amount = amount;
    localStorage.setItem("stock-cart", JSON.stringify(cart));
    setCart(cart);
  };

  useEffect(() => {
    getCart();
  }, []);

  return (
    <div>
      {cart.map((product) => (
        <div key={product.id} className="my-1 mb-2 w-full border-b pb-2">
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
                    onClick={() => setAmount(product.id, product.amount - 1)}
                  />
                  <p className="mx-1.25 w-[40px] text-center text-white">
                    {product.amount}
                  </p>
                  <FiPlus
                    name="increaseQuantity"
                    aria-label="Increase Quantity"
                    className="h-6 w-6 cursor-pointer rounded-md bg-white px-1 duration-300 hover:text-green-500"
                    onClick={() => setAmount(product.id, product.amount + 1)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

Reserve.getLayout = function getLayout(page: React.ReactNode) {
  return <StockLayout>{page}</StockLayout>;
};
