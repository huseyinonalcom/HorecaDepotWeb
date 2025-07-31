import { FiMinus, FiPlus, FiShoppingCart, FiHeart } from "react-icons/fi";
import { WishlistContext } from "../../api/providers/wishlistProvider";
import { WishlistProduct } from "../../api/interfaces/wishlistProduct";
import { CartContext } from "../../api/providers/cartProvider";
import { CartProduct } from "../../api/interfaces/cartProduct";
import useTranslation from "next-translate/useTranslation";
import { useContext, useEffect, useState } from "react";
import { Product } from "../../api/interfaces/product";

type Props = {
  product: Product;
  amount: number;
  onChange: (amount: number) => void;
};

function convertToCartProduct(product: Product, amount: number): CartProduct {
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

const ProductButtons = ({ product, amount, onChange }: Props) => {
  const { addToCart } = useContext(CartContext);
  const { addToWishlist } = useContext(WishlistContext);
  const { t } = useTranslation("common");
  const [cartAmount, setCartAmount] = useState(amount);

  useEffect(() => setCartAmount(1), [product]);

  useEffect(() => {
    if (cartAmount > 0) {
      onChange(cartAmount);
    } else {
      setCartAmount(1);
    }
  }, [cartAmount, onChange]);

  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex h-12 flex-row items-center gap-2">
        <div className="hover:bg-gray- flex h-full flex-row items-center justify-center rounded-md border-0 border-black bg-black px-1 duration-300">
          <FiMinus
            className="h-7 w-7 cursor-pointer rounded-md bg-white duration-300 hover:text-red-500"
            onClick={() => setCartAmount((a) => a - 1)}
          />
          <p className="mx-1.25 my-2 w-[40px] text-center text-white">
            {cartAmount}
          </p>
          <FiPlus
            className="h-7 w-7 cursor-pointer rounded-md bg-white duration-300 hover:text-green-500"
            onClick={() => setCartAmount((a) => ++a)}
          />
        </div>
        <h3 className="text-md font-bold text-black">
          {"€ " +
            ((cartAmount * product.value) / 1.21)
              .toFixed(2)
              .replaceAll(".", ",")}
        </h3>
      </div>
      <div className="flex h-12 flex-row items-center gap-2 pr-2 text-white">
        <button
          name="addToCart"
          aria-label="Add to Cart"
          className="h-full w-full rounded-md border-0 border-black bg-black p-1 duration-300 hover:border-green-500 hover:bg-gray-700"
          onClick={() => addToCart(convertToCartProduct(product, cartAmount))}
        >
          <div className="flex h-full w-full flex-row items-center justify-center gap-2 px-1">
            <FiShoppingCart />
            <p className="text-lg font-bold">{t("Add to cart")}</p>
          </div>
        </button>
        <button
          name="addToWishlist"
          aria-label="Add to Wishlist"
          className="h-full flex-shrink-0 rounded-md border-0 border-black bg-black p-1 duration-300 hover:bg-gray-700"
          onClick={() => addToWishlist(convertToWishlistProduct(product))}
        >
          <div className="flex flex-row items-center justify-center px-1">
            <FiHeart />
          </div>
        </button>
      </div>
    </div>
  );
};

export default ProductButtons;
