import useTranslation from "next-translate/useTranslation";
import { Product } from "../../api/interfaces/product";
import { Heart, Minus, Plus, ShoppingCart } from "react-feather";
import { CartContext } from "../../api/providers/cartProvider";
import { useContext, useEffect, useState } from "react";
import { CartProduct } from "../../api/interfaces/cartProduct";
import { WishlistContext } from "../../api/providers/wishlistProvider";
import { WishlistProduct } from "../../api/interfaces/wishlistProduct";

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
    <div className="flex flex-row gap-2 text-white">
      <div className="flex h-fit flex-row items-center justify-center border-2 border-black bg-black px-1 duration-300">
        <Minus
          className="h-6 w-6 cursor-pointer duration-300 hover:text-red-500"
          onClick={() => setCartAmount((a) => a - 1)}
        />
        <input
          type="text"
          value={cartAmount}
          name="Amount to put in cart"
          aria-label="Amount to put in cart"
          onChange={(e) => {
            if (Number(e.target.value) > 0) {
              setCartAmount(Number(e.target.value));
            } else setCartAmount(1);
          }}
          className="my-2 w-[36px] bg-black text-center"
          min="1"
        />
        <Plus
          className="h-6 w-6 cursor-pointer duration-300 hover:text-green-500"
          onClick={() => setCartAmount((a) => ++a)}
        />
      </div>
      <button
        className="border-2 border-black bg-black p-1 duration-300 hover:border-green-500 hover:text-green-500"
        onClick={() => addToCart(convertToCartProduct(product, cartAmount))}
      >
        <div className="flex h-full w-full flex-row items-center justify-center gap-2 px-1">
          <ShoppingCart />
          <p className="text-lg font-bold">{t("Add to cart")}</p>
        </div>
      </button>
      <button
        className="border-2 border-black bg-black p-1 duration-300 hover:border-red-500 hover:text-red-500"
        onClick={() => addToWishlist(convertToWishlistProduct(product))}
      >
        <div className="flex flex-row items-center justify-center px-1">
          <Heart />
        </div>
      </button>
    </div>
  );
};

export default ProductButtons;
