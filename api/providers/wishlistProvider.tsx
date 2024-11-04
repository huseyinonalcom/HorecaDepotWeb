import  { createContext, useState, ReactNode, useContext, useEffect } from "react";
import { WishlistProduct } from "../interfaces/wishlistProduct";
import { CartContext } from "./cartProvider";

type WishlistContextType = {
  wishlist: WishlistProduct[];
  addToWishlist: (item: WishlistProduct) => void;
  removeFromWishlist: (itemId: number) => void;
  moveItemToCart: (item: WishlistProduct) => void;
};

export const WishlistContext = createContext<WishlistContextType>({
  wishlist: [],
  addToWishlist: () => {},
  removeFromWishlist: () => {},
  moveItemToCart: () => {},
});

type WishlistProviderProps = {
  children: ReactNode;
};

export const WishlistProvider = ({ children }: WishlistProviderProps) => {
  const [wishlist, setWishlist] = useState<WishlistProduct[]>([]);
  const { addToCart } = useContext(CartContext);

  const updateWishlist = (newWishlist: WishlistProduct[]) => {
    setWishlist(newWishlist);
    localStorage.setItem("wishlist", JSON.stringify(newWishlist));
  };

  useEffect(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    let pulledWishlist: WishlistProduct[] = [];
    if (savedWishlist != "undefined" && savedWishlist != undefined && savedWishlist != "[]") {
      JSON.parse(savedWishlist).forEach((element) => {
        pulledWishlist.push(element as WishlistProduct);
      });
      if (pulledWishlist) {
        setWishlist(pulledWishlist);
      }
    }
  }, []);

  const addToWishlist = (newItem: WishlistProduct) => {
    const existingItem = wishlist.find((item) => item.id === newItem.id);
    if (!existingItem) {
      const newWishlist = [...wishlist, newItem];
      updateWishlist(newWishlist);
    }
  };

  const removeFromWishlist = (itemId: number) => {
    let newWishlist = wishlist.filter((item) => item.id !== itemId);
    updateWishlist(newWishlist);
  };

  const moveItemToCart = (item: WishlistProduct) => {
    const cartItem = { ...item, amount: 1 };
    addToCart(cartItem);
    removeFromWishlist(item.id);
  };

  return <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, moveItemToCart }}>{children}</WishlistContext.Provider>;
};
