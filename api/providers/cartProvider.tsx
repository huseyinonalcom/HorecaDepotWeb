import { createContext, useState, ReactNode, useEffect } from "react";
import { CartProduct } from "../interfaces/cartProduct";
import { Product } from "../interfaces/product";

type CartContextType = {
  cart: CartProduct[];
  addToCart: (item: CartProduct) => void;
  removeFromCart: (itemId: number) => void;
  increaseQuantity: (itemId: number) => void;
  decreaseQuantity: (itemId: number) => void;
  setQuantity: (itemId: number, quantity: number) => void;
  calculateTotal: () => {
    totalAfterDiscount: number;
    totalBeforeDiscount: number;
    amount: number;
  };
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  clearCart: () => void;
};

export const CartContext = createContext<CartContextType>({
  cart: [],
  addToCart: () => {},
  removeFromCart: () => {},
  increaseQuantity: () => {},
  decreaseQuantity: () => {},
  setQuantity: () => {},
  calculateTotal: () => ({
    totalAfterDiscount: 0,
    totalBeforeDiscount: 0,
    amount: 0,
  }),
  isDrawerOpen: false,
  openDrawer: () => {},
  closeDrawer: () => {},
  clearCart: () => {},
});

type CartProviderProps = {
  children: ReactNode;
};

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<CartProduct[]>([]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const [needsValidation, setNeedsValidation] = useState(false);

  const updateCart = (newCart: CartProduct[]) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    let pulledCart: CartProduct[] = [];
    if (
      savedCart != "undefined" &&
      savedCart != undefined &&
      savedCart != "[]"
    ) {
      JSON.parse(savedCart).forEach((element) => {
        pulledCart.push(element as CartProduct);
      });
      if (pulledCart) {
        setCart(pulledCart);
      }
    }
  }, []);

  useEffect(() => {
    const validateCartItems = async () => {
      await checkCartItems(cart).then((vc) => updateCart(vc));
      setNeedsValidation(false);
    };

    if (needsValidation && cart.length > 0) {
      validateCartItems();
    }
  }, [needsValidation]);

  const checkCartItems = async (
    cart: CartProduct[],
  ): Promise<CartProduct[]> => {
    let checkedCart: CartProduct[] = [];
    for (const product of cart) {
      try {
        const response = await fetch(
          "/api/public/products/getproductbyid?id=" + product.id,
        );
        if (response.ok) {
          const answer = await response.json();
          const prodFromAPI = answer as Product;
          if (prodFromAPI.active) {
            checkedCart.push({ ...prodFromAPI, amount: product.amount });
          }
        }
      } catch (e) {}
    }

    return checkedCart;
  };

  const addToCart = (newItem: CartProduct) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => item.id === newItem.id,
      );
      let updatedCart = [...prevCart];
      if (existingItemIndex !== -1) {
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          amount: updatedCart[existingItemIndex].amount + newItem.amount,
        };
      } else {
        updatedCart = [...updatedCart, { ...newItem, amount: newItem.amount }];
      }
      updateCart(updatedCart);
      setNeedsValidation(true);
      openDrawer();
      return updatedCart;
    });
  };

  const increaseQuantity = (itemId: number) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item.id === itemId ? { ...item, amount: item.amount + 1 } : item,
      );
      updateCart(updatedCart);
      setNeedsValidation(true);
      return updatedCart;
    });
  };

  const decreaseQuantity = (itemId: number) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item.id === itemId
          ? { ...item, amount: Math.max(1, item.amount - 1) }
          : item,
      );
      updateCart(updatedCart);
      setNeedsValidation(true);
      return updatedCart;
    });
  };

  const removeFromCart = (itemId: number) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.filter((item) => item.id !== itemId);
      updateCart(updatedCart);
      setNeedsValidation(true);
      return updatedCart;
    });
  };

  const setQuantity = (itemId: number, quantity: number) => {
    setCart((prevCart) => {
      const updatedCart = prevCart.map((item) =>
        item.id === itemId ? { ...item, amount: quantity } : item,
      );
      updateCart(updatedCart);
      setNeedsValidation(true);
      return updatedCart;
    });
  };

  const calculateTotal = () => {
    const totalAfterDiscount = cart.reduce(
      (total, item) => total + item.amount * item.value,
      0,
    );
    const totalBeforeDiscount = cart.reduce((total, item) => {
      const effectivePrice = Math.max(item.priceBeforeDiscount, item.value);
      return total + item.amount * effectivePrice;
    }, 0);

    let amount = 0;
    cart.forEach((product) => (amount += product.amount));
    return { totalAfterDiscount, totalBeforeDiscount, amount };
  };

  const openDrawer = () => {
    setDrawerOpen(true);
    setNeedsValidation(true);
  };
  const closeDrawer = () => setDrawerOpen(false);

  const clearCart = () => {
    updateCart([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        setQuantity,
        calculateTotal,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
