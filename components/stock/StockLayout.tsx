import useTranslation from "next-translate/useTranslation";
import LocaleSwitcher from "../LocaleSwitcher";
import { FiLogOut, FiMinus, FiPlus, FiX } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogTitle,
} from "../styled/dialog";
import { Button } from "../styled/button";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { PiBarcodeLight } from "react-icons/pi";
import { AutoTextSize } from "auto-text-size";
import { getCoverImageUrl } from "../../api/utils/getprodcoverimage";
import ImageWithURL from "../common/image";

type Props = {
  children: React.ReactNode;
};

export default function StockLayout({ children }: Props) {
  const [categories, setCategories] = useState<any>();
  const router = useRouter();
  const { t, lang } = useTranslation("common");
  const [showMenu, setShowMenu] = useState(false);

  const validateSession = async () => {
    const data = await fetch("/api/private/auth/checkloggedinuser");
    if (data.status != 200) {
      router.push(
        `/admin?destination=${encodeURIComponent(window.location.pathname)}`,
      );
    }
  };

  const getCart = async () => {
    const cart = localStorage.getItem("stock-cart");
    setCart(cart ? JSON.parse(cart) : []);
  };

  useEffect(() => {
    validateSession();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await fetch(
        "/api/categories/public/getallcategoriesflattened",
      );
      setCategories(await data.json());
    };
    fetchCategories();
  }, []);

  const clearCart = () => {
    localStorage.removeItem("stock-cart");
    setCart([]);
  };

  const [cart, setCart] = useState<any[]>([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    if (showCart) {
      getCart();
    }
  }, [showCart]);

  return (
    <main>
      <div className="flex flex-row">
        <div
          className={`sticky top-0 max-h-[100dvh] w-full flex-shrink-0 flex-col items-center gap-2 border-gray-300 bg-black shadow-sm lg:w-[270px] ${showMenu ? "flex" : "hidden lg:flex"} lg:border-r-0`}
        >
          <div className="flex w-full flex-row items-center justify-between px-2 py-2 text-white">
            <Image
              width={200}
              height={42.19}
              priority
              className="flex"
              src="/assets/header/logo.svg"
              alt="Horeca Depot Logo"
            />
            <div className="flex flex-row gap-2">
              <LocaleSwitcher />
              <button
                onClick={() => {
                  setShowMenu(false);
                  scrollTo({
                    top: 0,
                  });
                }}
                className="lg:hidden"
              >
                <FiX size={26} />
              </button>
            </div>
          </div>
          <div className="no-scrollbar flex h-full w-full flex-col gap-2 overflow-auto p-2">
            <Link
              onClick={() => setShowMenu(false)}
              href={`/stock/scanner`}
              className="flex w-full flex-row items-center gap-2 rounded-md border-2 border-gray-400 bg-yellow-200 px-1 py-1 shadow-md"
            >
              <PiBarcodeLight size={24} /> Scanner
            </Link>
            <button
              onClick={() => setShowCart(true)}
              type="button"
              className="flex w-full cursor-pointer flex-row items-center gap-2 rounded-md border-2 border-gray-400 bg-yellow-200 px-1 py-1 shadow-md"
            >
              <ShoppingCartIcon height={24} />
              {t("Cart")}
            </button>
            <h2 className="mr-auto text-xl font-semibold text-white">
              {t("Categories")}
            </h2>
            <div className="flex w-full flex-col gap-1">
              <Link
                onClick={() => setShowMenu(false)}
                href={`/stock/list/all?page=1`}
                className={`h-full w-full rounded-md border-2 border-gray-400 whitespace-nowrap ${router.query.category == "all" ? "bg-blue-200" : "bg-white"} p-1 shadow-sm hover:bg-blue-200`}
              >
                {t("All")}
              </Link>
              {categories
                ?.sort((a, b) => (a.priority > b.priority ? 1 : -1))
                .map((category) => (
                  <Link
                    onClick={() => setShowMenu(false)}
                    key={category.id}
                    href={`/stock/list/${category.id}?page=1`}
                    className={`h-full w-full rounded-md border-2 border-gray-400 whitespace-nowrap ${router.query.category == category.id ? "bg-blue-200" : "bg-white"} p-1 shadow-sm hover:bg-blue-200`}
                  >
                    {category.localized_name[lang]}
                  </Link>
                ))}
            </div>
            <button
              name="logout"
              aria-label="Logout"
              className={`mt-12 flex w-full flex-row items-center gap-3 rounded-md border-2 border-gray-400 p-1 whitespace-nowrap text-white shadow-sm hover:bg-blue-800`}
              onClick={async () => {
                await fetch("/api/admin/logout").then(() => {
                  router.push(`/`);
                });
              }}
            >
              <FiLogOut />
              {t("Logout")}
            </button>
          </div>
        </div>
        <div
          className={`flex w-full flex-col lg:max-w-[calc(100dvw-290px)] ${!showMenu ? "" : "hidden lg:flex"}`}
        >
          <div className="sticky top-0 left-0 flex w-full items-center justify-between bg-black px-2 py-2 text-white lg:hidden">
            <Image
              width={200}
              height={42.19}
              priority
              className="flex"
              src="/assets/header/logo.svg"
              alt="Horeca Depot Logo"
            />
            <button
              onClick={() => {
                setShowMenu(true);
                scrollTo({
                  top: 0,
                });
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={24}
                height={24}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1={3} y1={12} x2={21} y2={12} />
                <line x1={3} y1={6} x2={21} y2={6} />
                <line x1={3} y1={18} x2={21} y2={18} />
              </svg>
            </button>
          </div>
          {children}
        </div>
      </div>
      <Dialog open={showCart} onClose={setShowCart} size="xl">
        <DialogTitle>{t("Cart")}</DialogTitle>
        <DialogBody className="text-sm/6 text-zinc-900 dark:text-white">
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
                    <AutoTextSize maxFontSizePx={14}>
                      {product.name}
                    </AutoTextSize>
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
                      /*  onClick={() => removeFromCart(product.id)} */
                      className="mr-2.5"
                    >
                      <FiX color="red" />
                    </button>
                    <div className="mr-2 flex h-fit flex-row items-center justify-center rounded-md border-2 border-black bg-black p-0.5 duration-300">
                      <FiMinus
                        name="decreaseQuantity"
                        aria-label="Decrease Quantity"
                        className="h-6 w-6 cursor-pointer rounded-md bg-white px-1 duration-300 hover:text-red-500"
                        /*     onClick={() => decreaseQuantity(product.id)} */
                      />
                      <p className="mx-1.25 w-[40px] text-center text-white">
                        {product.amount}
                      </p>
                      <FiPlus
                        name="increaseQuantity"
                        aria-label="Increase Quantity"
                        className="h-6 w-6 cursor-pointer rounded-md bg-white px-1 duration-300 hover:text-green-500"
                        /*  onClick={() => increaseQuantity(product.id)} */
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </DialogBody>
        <DialogActions>
          <Button plain type="button" onClick={() => setShowCart(false)}>
            {t("close")}
          </Button>
          <Button
            plain
            type="button"
            onClick={() => {
              confirm(t("clear-cart-confirm")) ? clearCart() : null;
            }}
          >
            {t("clear-cart")}
          </Button>
          <Link className="w-full text-center" href="/stock/reserve">
            <Button plain type="button">
              {t("reserve")}
            </Button>
          </Link>
        </DialogActions>
      </Dialog>
    </main>
  );
}
