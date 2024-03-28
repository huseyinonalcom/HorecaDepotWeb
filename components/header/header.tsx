import { useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

import useTranslation from "next-translate/useTranslation";
import setLanguage from "next-translate/setLanguage";

import {
  ChevronLeft,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
} from "react-feather";
import { CategoryContext } from "../../api/providers/categoryProvider";
import { CartContext } from "../../api/providers/cartProvider";
import { ClientContext } from "../../api/providers/clientProvider";
import { WishlistContext } from "../../api/providers/wishlistProvider";
import HeaderDrawer from "./headerDrawer";

const CategoryItem = ({ category }) => {
  const { t } = useTranslation("common");
  const [isHovered, setisHovered] = useState(false);
  const router = useRouter();
  const hasSubCategories =
    category.subCategories && category.subCategories.length > 0;

  return (
    <div
      key={category.Name}
      className="relative cursor-pointer hover:bg-gray-200"
      onMouseEnter={() => {
        setisHovered(true);
      }}
      onMouseLeave={() => {
        setisHovered(false);
      }}
    >
      <p
        onClick={() => {
          router.push(`/products?page=1&category=${category.id}`);
        }}
        className="flex w-full items-center justify-between px-4 py-2 text-left"
      >
        {t(category.Name)}
        {hasSubCategories && (
          <ChevronLeft
            className={
              "h-4 w-4 duration-300 " + (isHovered ? "rotate-180" : "")
            }
          />
        )}
      </p>
      {hasSubCategories && isHovered && (
        <div
          onMouseEnter={() => {
            setisHovered(true);
          }}
          onMouseLeave={() => {
            setisHovered(false);
          }}
          className="absolute left-full top-0 min-w-[200px] bg-white shadow-lg"
        >
          {category.subCategories.map((subCategory) => (
            <CategoryItem key={subCategory.id} category={subCategory} />
          ))}
        </div>
      )}
    </div>
  );
};

const Header = () => {
  const [cartItems, setCartItems] = useState(0);
  const { categories } = useContext(CategoryContext);
  const { client } = useContext(ClientContext);
  const [allCategories, setAllCategories] = useState([]);
  const { cart, openDrawer, calculateTotal } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);

  useEffect(() => {
    if (allCategories.length === 0 && categories.length > 0) {
      setAllCategories(categories);
    }
  }, [categories]);

  useEffect(() => {
    setCartItems(calculateTotal().amount);
  }, [cart]);

  // navigation
  const router = useRouter();

  // translation
  const { t, lang } = useTranslation("common");

  // search bar
  const [searchQuery, setSearchQuery] = useState<string>();
  const searchInputRef = useRef(null);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value == "" && router.pathname == "/products") {
      router.push(`/products?page=1`);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    searchInputRef.current.blur();
    if (searchQuery && searchQuery != "") {
      var url = "/products?page=1";
      url += "&search=" + searchQuery;
      router.push(url);
    } else {
      router.push(`/products?page=1`);
    }
  };

  const flagButtonClass =
    "px-4 py-1 duration-300 font-bold underline-animation-white whitespace-nowrap";
  const navLinkClass =
    "duration-300 font-bold underline-animation-white whitespace-nowrap";

  const [isHeaderDrawerOpen, setIsHeaderDrawerOpen] = useState(false);

  function onClickOutsideDrawer() {
    setIsHeaderDrawerOpen(false);
  }

  const navButtonsClass =
    "relative flex flex-col justify-center items-center p-1 bg-white duration-300 font-bold text-sm text-black hover:bg-orange-400 aspect-[1/1]";

  return (
    <div className="sticky top-0 z-50 flex w-full flex-col items-center bg-black pt-3 text-white shadow-lg duration-300 print:hidden">
      <div className="flex w-full flex-col gap-2 px-5 pb-4">
        <HeaderDrawer
          isOpen={isHeaderDrawerOpen}
          onClickOutside={onClickOutsideDrawer}
        />

        <div className="flex w-full flex-row items-center justify-between gap-4">
          <Link
            href={"/"}
            className="flex-shrink-0"
            style={{
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <Image
              width={170}
              height={45}
              src="/assets/header/logo.png"
              alt="Horeca Depot Logo"
            />
          </Link>
          <form
            name="Search"
            aria-label="Search"
            className="relative mx-auto hidden w-full max-w-[700px] duration-300 md:flex"
            onSubmit={handleSearchSubmit}
          >
            <input
              name="Search bar input"
              aria-label="Search bar input"
              ref={searchInputRef}
              type="text"
              onChange={handleSearchChange}
              className="w-full border-2 py-2 pl-4 pr-4 text-black outline-none focus:border-orange-400"
              placeholder={t("Search Products")}
            />
            <div className="absolute inset-y-0 right-0 flex">
              <button
                aria-label="Search bar submit button"
                type="submit"
                className="h-full w-[45px] cursor-pointer bg-orange-400"
              >
                <Search className="mx-auto my-auto h-6 w-6 pr-1" />
              </button>
            </div>
          </form>
          <div className="flex h-[45px] flex-shrink-0 flex-row gap-2">
            {client ? (
              <Link
                aria-label="Link to User Account Dashboard"
                className={navButtonsClass}
                href="/account/myorders"
              >
                <User />
              </Link>
            ) : (
              <Link
                aria-label="Link to User Login"
                className={navButtonsClass}
                href="/login"
              >
                <User />
              </Link>
            )}
            <Link
              aria-label="Link to Wishlist"
              className={`${navButtonsClass} hidden lg:flex`}
              href="/wishlist"
            >
              <Heart />
              <span className="-full absolute right-3 top-3 inline-flex -translate-y-1/2 translate-x-1/2 transform items-center justify-center bg-orange-400 px-1 py-0.5 text-xs font-bold leading-none text-red-100">
                {wishlist.length}
              </span>
            </Link>
            <button
              name="Shopping cart"
              className={navButtonsClass}
              onClick={openDrawer}
            >
              <ShoppingBag />
              <span className="-full absolute right-3 top-3 inline-flex -translate-y-1/2 translate-x-1/2 transform items-center justify-center bg-orange-400 px-1 py-0.5 text-xs font-bold leading-none text-red-100">
                {cartItems}
              </span>
            </button>
            <button
              name="Mobile Navigation Menu"
              className="relative flex flex-col items-center justify-center p-1 text-sm font-bold text-white duration-300 hover:text-orange-400 focus:outline-transparent lg:hidden"
              style={{ WebkitTapHighlightColor: "transparent" }}
              aria-label="Mobile Navigation Menu"
              onClick={() => setIsHeaderDrawerOpen(!isHeaderDrawerOpen)}
            >
              <Menu />
            </button>
          </div>
        </div>

        <div className="flex w-full flex-row md:hidden">
          <div className="relative w-full">
            <form
              name="Search"
              aria-label="Search"
              className="w-full duration-300"
              onSubmit={handleSearchSubmit}
            >
              <input
                name="Search bar input"
                aria-label="Search bar input"
                ref={searchInputRef}
                type="text"
                onChange={handleSearchChange}
                className="w-full border-2 py-2 pl-4 pr-4 text-black outline-none focus:border-orange-400"
                placeholder={t("Search Products")}
              />
              <div className="absolute inset-y-0 right-0 flex">
                <button
                  aria-label="Search bar submit button"
                  type="submit"
                  className="h-full w-[45px] cursor-pointer bg-orange-400"
                >
                  <Search className="mx-auto my-auto h-6 w-6 pr-1" />
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="flex hidden w-full flex-row justify-between lg:flex">
          <div className="hidden w-[90px] flex-row items-center lg:flex">
            <div className="group relative h-full flex-shrink-0">
              <Link
                href="/products?page=1"
                className="hidden h-full flex-row items-center bg-orange-400 px-2 py-2 font-bold text-black lg:flex"
              >
                {t("SHOP")}
                <ChevronLeft className="ml-1 h-4 w-4 rotate-90 transform duration-300 group-hover:rotate-270" />
              </Link>
              <div className="invisible absolute -left-5 z-50 w-[240px] pt-2 text-gray-500 opacity-0 duration-300 group-hover:visible group-hover:opacity-100">
                <div className="bg-white shadow-lg">
                  {allCategories.map((category) => (
                    <CategoryItem key={category.id} category={category} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="hidden h-[40px] w-full max-w-[700px] flex-row items-center justify-between gap-4 text-sm text-white duration-300 lg:flex">
            <Link className={navLinkClass} href="/projects">
              {t("PROJECTS")}
            </Link>
            <Link className={navLinkClass} href="/references">
              {t("References")}
            </Link>
            <Link className={navLinkClass} href="/contact">
              {t("CONTACT")}
            </Link>
            <Link className={navLinkClass} href="/about">
              {t("ABOUT US")}
            </Link>
          </div>
          <div className="group relative hidden w-[70px] flex-shrink-0 lg:inline-block">
            <Image
              src={`/assets/header/${lang.toUpperCase()}.svg`}
              alt={t("locale")}
              width={54}
              height={36}
              style={{ width: "54px", height: "36px" }}
              className="shadow-[0_0_15px_rgba(255,255,255,0.4)]"
            />

            <ul className="invisible absolute right-[5px] mx-auto block w-max items-center pt-1 text-gray-700 opacity-0 shadow-md duration-300 group-hover:visible group-hover:opacity-100">
              <li className="bg-black pb-1">
                <button
                  onClick={async () => await setLanguage("en")}
                  className={`${flagButtonClass} ${lang == "en" ? "hidden" : ""}`}
                >
                  <Image
                    src={`/assets/header/EN.svg`}
                    alt={t("locale")}
                    width={44}
                    height={29.34}
                    style={{ width: "44px", height: "29.34px" }}
                    className="shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                  />
                </button>
              </li>
              <li className="bg-black pb-1">
                <button
                  onClick={async () => await setLanguage("fr")}
                  className={`${flagButtonClass} ${lang == "fr" ? "hidden" : ""}`}
                >
                  <Image
                    src={`/assets/header/FR.svg`}
                    alt={t("locale")}
                    width={44}
                    height={29.34}
                    style={{ width: "44px", height: "29.34px" }}
                    className="shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                  />
                </button>
              </li>
              <li className="bg-black pb-1">
                <button
                  onClick={async () => await setLanguage("nl")}
                  className={`${flagButtonClass} ${lang == "nl" ? "hidden" : ""}`}
                >
                  <Image
                    src={`/assets/header/NL.svg`}
                    alt={t("locale")}
                    width={44}
                    height={29.34}
                    style={{ width: "44px", height: "29.34px" }}
                    className="shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                  />
                </button>
              </li>
              <li className="bg-black pb-1">
                <button
                  onClick={async () => await setLanguage("de")}
                  className={`${flagButtonClass} ${lang == "de" ? "hidden" : ""}`}
                >
                  <Image
                    src={`/assets/header/DE.svg`}
                    alt={t("locale")}
                    width={44}
                    height={29.34}
                    style={{ width: "44px", height: "29.34px" }}
                    className="shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                  />
                </button>
              </li>
              <li className="bg-black pb-1">
                <button
                  onClick={async () => await setLanguage("tr")}
                  className={`${flagButtonClass} ${lang == "tr" ? "hidden" : ""}`}
                >
                  <Image
                    src={`/assets/header/TR.svg`}
                    alt={t("locale")}
                    width={44}
                    height={29.34}
                    style={{ width: "44px", height: "29.34px" }}
                    className="shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                  />
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-row justify-between">
        <div className="inverted-border-radius-tl"></div>
        <div className="inverted-border-radius-tr"></div>
      </div>
    </div>
  );
};

export default Header;
