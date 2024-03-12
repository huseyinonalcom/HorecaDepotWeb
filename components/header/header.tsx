import { useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

import useTranslation from "next-translate/useTranslation";
import setLanguage from "next-translate/setLanguage";

import { ChevronLeft, Heart, Menu, Search, ShoppingBag, User } from "react-feather";
import { CategoryContext } from "../../api/providers/categoryProvider";
import { CartContext } from "../../api/providers/cartProvider";
import { ClientContext } from "../../api/providers/clientProvider";
import { WishlistContext } from "../../api/providers/wishlistProvider";
import HeaderDrawer from "./headerDrawer";

const CategoryItem = ({ category }) => {
  const { t } = useTranslation("common");
  const [isHovered, setisHovered] = useState(false);
  const router = useRouter();
  const hasSubCategories = category.subCategories && category.subCategories.length > 0;

  return (
    <div
      key={category.Name}
      className="relative hover:bg-gray-200 cursor-pointer"
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
        className="py-2 w-full px-4 w-full text-left flex justify-between items-center"
      >
        {t(category.Name)}
        {hasSubCategories && <ChevronLeft className={"w-4 h-4 duration-300 " + (isHovered ? "rotate-180" : "")} />}
      </p>
      {hasSubCategories && isHovered && (
        <div
          onMouseEnter={() => {
            setisHovered(true);
          }}
          onMouseLeave={() => {
            setisHovered(false);
          }}
          className="absolute left-full top-0 min-w-[200px] shadow-lg bg-white"
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

  const flagButtonClass = "px-4 py-1 duration-300 font-bold underline-animation-white whitespace-nowrap";
  const navLinkClass = "duration-300 font-bold underline-animation-white whitespace-nowrap";

  const [isHeaderDrawerOpen, setIsHeaderDrawerOpen] = useState(false);

  function onClickOutsideDrawer() {
    setIsHeaderDrawerOpen(false);
  }

  const navButtonsClass =
    "relative flex flex-col justify-center items-center p-1 bg-white duration-300 font-bold text-sm text-black hover:bg-orange-400 aspect-[1/1]";

  return (
    <div className="flex flex-col items-center print:hidden bg-black z-50 sticky top-0 w-full p-3 duration-300 shadow-lg text-white">
      <div className="flex flex-col w-full gap-2 px-3">
        <HeaderDrawer isOpen={isHeaderDrawerOpen} onClickOutside={onClickOutsideDrawer} />

        <div className="flex flex-row gap-4 w-full items-center justify-between">
          <Link
            href={"/"}
            className="flex-shrink-0"
            style={{
              WebkitTapHighlightColor: "transparent",
            }}
          >
            <Image width={170} height={45} src="/assets/header/logo.png" alt="Horeca Depot Logo" />
          </Link>
          <form name="Search" aria-label="Search" className="duration-300 w-full max-w-[700px] mx-auto hidden md:flex relative" onSubmit={handleSearchSubmit}>
            <input
              name="Search bar input"
              aria-label="Search bar input"
              ref={searchInputRef}
              type="text"
              onChange={handleSearchChange}
              className="w-full pl-4 pr-4 py-2 border-2 text-black outline-none focus:border-orange-400"
              placeholder={t("Search Products")}
            />
            <div className="absolute inset-y-0 right-0 flex">
              <button aria-label="Search bar submit button" type="submit" className="bg-orange-400 h-full w-[45px] cursor-pointer">
                <Search className="h-6 w-6 mx-auto my-auto pr-1" />
              </button>
            </div>
          </form>
          <div className="flex flex-shrink-0 flex-row gap-2 h-[45px]">
            {client ? (
              <Link aria-label="Link to User Account Dashboard" className={navButtonsClass} href="/account/myorders">
                <User />
              </Link>
            ) : (
              <Link aria-label="Link to User Login" className={navButtonsClass} href="/login">
                <User />
              </Link>
            )}
            <Link aria-label="Link to Wishlist" className={`${navButtonsClass} hidden lg:flex`} href="/wishlist">
              <Heart />
              <span className="absolute top-3 right-3 inline-flex items-center justify-center px-1 py-0.5 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-orange-400 -full">
                {wishlist.length}
              </span>
            </Link>
            <button name="Shopping cart" className={navButtonsClass} onClick={openDrawer}>
              <ShoppingBag />
              <span className="absolute top-3 right-3 inline-flex items-center justify-center px-1 py-0.5 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-orange-400 -full">
                {cartItems}
              </span>
            </button>
            <button
              name="Mobile Navigation Menu"
              className="lg:hidden relative flex flex-col justify-center items-center p-1 duration-300 font-bold text-sm text-white focus:outline-transparent hover:text-orange-400"
              style={{ WebkitTapHighlightColor: "transparent" }}
              aria-label="Mobile Navigation Menu"
              onClick={() => setIsHeaderDrawerOpen(!isHeaderDrawerOpen)}
            >
              <Menu />
            </button>
          </div>
        </div>

        <div className="flex flex-row w-full md:hidden">
          <div className="relative w-full">
            <form name="Search" aria-label="Search" className="w-full duration-300" onSubmit={handleSearchSubmit}>
              <input
                name="Search bar input"
                aria-label="Search bar input"
                ref={searchInputRef}
                type="text"
                onChange={handleSearchChange}
                className="w-full pl-4 pr-4 py-2 border-2 text-black outline-none focus:border-orange-400"
                placeholder={t("Search Products")}
              />
              <div className="absolute inset-y-0 right-0 flex">
                <button aria-label="Search bar submit button" type="submit" className="bg-orange-400 h-full w-[45px] cursor-pointer">
                  <Search className="h-6 w-6 mx-auto my-auto pr-1" />
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="flex flex-row w-full justify-between hidden lg:flex">
          <div className="hidden lg:flex w-[90px] flex-row items-center">
            <div className="group relative h-full flex-shrink-0">
              <Link href="/products?page=1" className="hidden lg:flex flex-row px-2 py-2 items-center font-bold text-black h-full bg-orange-400">
                {t("SHOP")}
                <ChevronLeft className="ml-1 w-4 h-4 transform rotate-90 group-hover:rotate-270 duration-300" />
              </Link>
              <div className="absolute pt-2 -left-5 z-50 text-gray-500 w-[240px] invisible group-hover:visible opacity-0 group-hover:opacity-100 duration-300">
                <div className="bg-white shadow-lg">
                  {allCategories.map((category) => (
                    <CategoryItem key={category.id} category={category} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="hidden lg:flex flex-row items-center justify-between gap-4 text-white w-full max-w-[700px] h-[40px] duration-300 text-sm">
            <Link className={navLinkClass} href="/projects">
              {t("PROJETS")}
            </Link>
            <Link className={navLinkClass} href="/references">
              {t("RÉFÉRENCES")}
            </Link>
            <Link className={navLinkClass} href="/contact">
              {t("CONTACT")}
            </Link>
            <Link className={navLinkClass} href="/about">
              {t("À PROPOS DE NOUS")}
            </Link>
          </div>
          <div className="group hidden lg:inline-block w-[70px] flex-shrink-0 relative">
            <Image
              src={`/assets/header/${lang.toUpperCase()}.svg`}
              alt={t("locale")}
              width={54}
              height={36}
              style={{ width: "54px", height: "36px" }}
              className="shadow-[0_0_15px_rgba(255,255,255,0.4)]"
            />

            <ul className="absolute shadow-md items-center invisible text-gray-700 pt-1 right-[5px] block group-hover:visible w-max mx-auto duration-300 opacity-0 group-hover:opacity-100">
              <li className="pb-1 bg-black">
                <button onClick={async () => await setLanguage("en")} className={`${flagButtonClass} ${lang == "en" ? "hidden" : ""}`}>
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
              <li className="pb-1 bg-black">
                <button onClick={async () => await setLanguage("fr")} className={`${flagButtonClass} ${lang == "fr" ? "hidden" : ""}`}>
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
              <li className="pb-1 bg-black">
                <button onClick={async () => await setLanguage("nl")} className={`${flagButtonClass} ${lang == "nl" ? "hidden" : ""}`}>
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
              <li className="pb-1 bg-black">
                <button onClick={async () => await setLanguage("de")} className={`${flagButtonClass} ${lang == "de" ? "hidden" : ""}`}>
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
              <li className="pb-1 bg-black">
                <button onClick={async () => await setLanguage("tr")} className={`${flagButtonClass} ${lang == "tr" ? "hidden" : ""}`}>
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
    </div>
  );
};

export default Header;
