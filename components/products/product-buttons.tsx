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
    <div className="flex flex-col">
      <div className="flex flex-row">
        <div className="flex flex-row justify-center h-fit items-center duration-300 bg-black text-white border-black mr-2 border-2">
          <Minus className="cursor-pointer h-6 w-6 pl-1 hover:text-red-500 duration-300" onClick={() => setCartAmount((a) => a - 1)} />
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
            className="text-center bg-black w-[36px] my-2"
            min="1"
          />
          <Plus className="cursor-pointer h-6 w-6 pr-1 hover:text-green-500 duration-300" onClick={() => setCartAmount((a) => ++a)} />
        </div>
        <button
          className="duration-300 bg-black text-white hover:text-green-500 border-black hover:border-green-500 p-1 border-2"
          onClick={() => addToCart(convertToCartProduct(product, cartAmount))}
        >
          <div className="flex flex-row justify-center gap-2 w-full h-full items-center px-1">
            <ShoppingCart />
            <p className="font-bold text-lg">{t("Add to cart")}</p>
          </div>
        </button>
      </div>
      <div className="mt-1">
        <button
          className="duration-300 bg-black text-white border-black hover:text-red-500 hover:border-red-500 p-1 border-2"
          onClick={() => addToWishlist(convertToWishlistProduct(product))}
        >
          <div className="flex flex-row justify-center gap-2 w-full h-full items-center">
            <Heart /> <p className="font-bold text-lg">{t("Add to wishlist")}</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ProductButtons;
