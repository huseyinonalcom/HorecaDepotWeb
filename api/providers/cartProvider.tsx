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

  // Safely update cart and localStorage
  const updateCart = (newCart: CartProduct[]) => {
    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  // Load from localStorage on first mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cart");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setCart(parsed);
        }
      }
    } catch (e) {
      console.warn("Failed to parse cart from localStorage", e);
      localStorage.removeItem("cart");
    }
  }, []);

  // Validate cart items with debounce
  useEffect(() => {
    if (!needsValidation || cart.length === 0) return;

    const timeout = setTimeout(() => {
      validateCartItems();
    }, 300);

    return () => clearTimeout(timeout);
  }, [needsValidation, cart]);

  const validateCartItems = async () => {
    const validated = await checkCartItems(cart);
    updateCart(validated);
    setNeedsValidation(false);
  };

  const checkCartItems = async (
    cart: CartProduct[],
  ): Promise<CartProduct[]> => {
    const checkedCart: CartProduct[] = [];

    for (const product of cart) {
      try {
        const response = await fetch(
          `/api/public/products/getproductbyid?id=${product.id}`,
        );
        if (response.ok) {
          const prodFromAPI = (await response.json()).result as Product;
          if (prodFromAPI.active) {
            checkedCart.push({ ...prodFromAPI, amount: product.amount });
          }
        }
      } catch (e) {
        console.error("Failed to validate product", e);
      }
    }

    return checkedCart;
  };

  // ---------------------
  // Cart operations
  // ---------------------

  const addToCart = (newItem: CartProduct) => {
    const existingIndex = cart.findIndex((item) => item.id === newItem.id);
    const updatedCart = [...cart];

    if (existingIndex !== -1) {
      updatedCart[existingIndex] = {
        ...updatedCart[existingIndex],
        amount: updatedCart[existingIndex].amount + newItem.amount,
      };
    } else {
      updatedCart.push({ ...newItem });
    }

    updateCart(updatedCart);
    setNeedsValidation(true);
    openDrawer();
  };

  const increaseQuantity = (itemId: number) => {
    const updatedCart = cart.map((item) =>
      item.id === itemId ? { ...item, amount: item.amount + 1 } : item,
    );
    updateCart(updatedCart);
    setNeedsValidation(true);
  };

  const decreaseQuantity = (itemId: number) => {
    const updatedCart = cart.map((item) =>
      item.id === itemId
        ? { ...item, amount: Math.max(1, item.amount - 1) }
        : item,
    );
    updateCart(updatedCart);
    setNeedsValidation(true);
  };

  const removeFromCart = (itemId: number) => {
    const updatedCart = cart.filter((item) => item.id !== itemId);
    updateCart(updatedCart);
    setNeedsValidation(true);
  };

  const setQuantity = (itemId: number, quantity: number) => {
    const updatedCart = cart.map((item) =>
      item.id === itemId ? { ...item, amount: quantity } : item,
    );
    updateCart(updatedCart);
    setNeedsValidation(true);
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
    const amount = cart.reduce((acc, item) => acc + item.amount, 0);

    return { totalAfterDiscount, totalBeforeDiscount, amount };
  };

  const openDrawer = () => setDrawerOpen(true);
  const closeDrawer = () => setDrawerOpen(false);
  const clearCart = () => updateCart([]);

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
