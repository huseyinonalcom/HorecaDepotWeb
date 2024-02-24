// react and next imports
import { useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

// translation imports
import useTranslation from "next-translate/useTranslation";
import setLanguage from "next-translate/setLanguage";

import {
  ChevronUp,
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

/// TODO: make popups dismiss when click outside of popups happens (maybe an overlay)

const CategoryItem = ({ category }) => {
  const { t, lang } = useTranslation("common");
  const [isHovered, setisHovered] = useState(false);
  const router = useRouter();
  const hasSubCategories =
    category.subCategories && category.subCategories.length > 0;

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
        {hasSubCategories && (
          <ChevronUp
            className={
              "w-4 h-4 duration-300 " + (isHovered ? "rotate-180" : "")
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
  const [cartAmount, setCartAmount] = useState(0);
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
    setCartAmount(calculateTotal().totalAfterDiscount);
    setCartItems(calculateTotal().amount);
  }, [cart]);

  // navigation
  const router = useRouter();

  // translation
  const { t, lang } = useTranslation("common");

  // search bar
  const [searchQuery, setSearchQuery] = useState<string>();

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery && searchQuery != "") {
      var url = "/products?page=1";
      url += "&search=" + searchQuery;
      router.push(url);
    } else {
      router.push(`/products?page=1`);
    }
  };

  const navLinkClass =
    "px-4 py-3 duration-300 font-bold underline-animation-white";
  const [showSearch, setShowSearch] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (showSearch) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 300);
    }
  }, [showSearch]);

  const [showMenu, setShowMenu] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);

  return (
    <div className="print:hidden bg-black z-50 sticky top-0 flex flex-col items-start justify-center h-[70px] duration-300 shadow-lg text-white px-4 sm:px-8 mb-1">
      <div className="flex flex-row w-full justify-between items-center">
        <div className="flex flex-row h-full">
          <div className="w-[130px] md:w-[300px]">
            <Image
              width={300}
              height={150}
              className="bg-transparent"
              src="/assets/header/logo.png"
              alt="Horeca Depot Logo"
              style={{ objectFit: "contain", cursor: "pointer" }}
              onClick={() => router.push(`/`)}
            />
          </div>
          <div className="hidden lg:flex flex-row items-center justify-center text-white pl-4 h-full duration-300 text-sm">
            <div className="group relative h-full">
              <Link
                href="/products?page=1"
                className="flex flex-row items-center mr-1 font-bold text-black h-full bg-orange-400 pl-3 pr-2"
              >
                {t("SHOP")}
                <ChevronUp className="ml-1 w-4 h-4 transform group-hover:rotate-180 duration-300" />
              </Link>
              <div className="absolute top-8 mt-4 py-2 -left-5 z-50 text-gray-500 w-[240px] invisible group-hover:visible opacity-0 group-hover:opacity-100 duration-300 bg-white shadow-lg">
                {allCategories.map((category) => (
                  <CategoryItem key={category.id} category={category} />
                ))}
              </div>
            </div>

            <div className="flex flex-row">
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
          </div>
        </div>
        <div className="flex flex-row">
          <div className="flex mr-2 sm:hidden flex-row items-center">
            {client ? (
              <Link
                aria-label="Link to User Account Dashboard"
                className="duration-300 underline-animation-white font-bold text-sm ml-2"
                href="/account/myorders"
              >
                <User />
              </Link>
            ) : (
              <Link
                aria-label="Link to User Login"
                className="duration-300 underline-animation-white font-bold text-sm ml-2"
                href="/login"
              >
                <User />
              </Link>
            )}
            <Link
              aria-label="Link to Wishlist"
              className="hover:text-gray-300 duration-300 relative ml-2 hover:text-red-500"
              href="/wishlist"
            >
              <Heart />
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1 py-0.5 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-orange-400 rounded-full">
                {wishlist.length}
              </span>
            </Link>
            <button
              name="Shopping cart"
              onClick={openDrawer}
              className="flex items-center flex-row hover:text-green-500 duration-300 ml-4"
            >
              <div className="relative">
                <ShoppingBag />
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1 py-0.5 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-orange-400 rounded-full">
                  {cartItems}
                </span>
              </div>
            </button>
          </div>
          <div className="relative hidden lg:flex flex-row items-center justify-center text-white pl-2 mr-2 h-full duration-300 text-sm">
            <button onClick={() => setShowLanguages(!showLanguages)}>
              <Image
                src={`/assets/header/${lang.toUpperCase()}.svg`}
                alt={t("locale")}
                width={37}
                height={24.67}
                style={{ width: "37px", height: "24.67px" }}
                className="shadow-[0_0_15px_rgba(255,255,255,0.4)]"
              />
            </button>

            <div
              onMouseLeave={() => setShowLanguages(false)}
              className={`absolute top-full -right-5 -left-3 mt-2 flex flex-col items-center bg-black duration-300 shadow-md ${
                showLanguages ? `visible opacity-100` : `invisible opacity-0`
              }`}
            >
              <button
                onClick={async () => await setLanguage("en")}
                className={`${navLinkClass} ${lang == "en" ? "hidden" : ""}`}
              >
                <Image
                  src={`/assets/header/EN.svg`}
                  alt={t("locale")}
                  width={37}
                  height={24.67}
                  style={{ width: "37px", height: "24.67px" }}
                  className="shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                />
              </button>
              <button
                onClick={async () => await setLanguage("fr")}
                className={`${navLinkClass} ${lang == "fr" ? "hidden" : ""}`}
              >
                <Image
                  src={`/assets/header/FR.svg`}
                  alt={t("locale")}
                  width={37}
                  height={24.67}
                  style={{ width: "37px", height: "24.67px" }}
                  className="shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                />
              </button>
              <button
                onClick={async () => await setLanguage("nl")}
                className={`${navLinkClass} ${lang == "nl" ? "hidden" : ""}`}
              >
                <Image
                  src={`/assets/header/NL.svg`}
                  alt={t("locale")}
                  width={37}
                  height={24.67}
                  style={{ width: "37px", height: "24.67px" }}
                  className="shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                />
              </button>
              <button
                onClick={async () => await setLanguage("DE")}
                className={`${navLinkClass} ${lang == "de" ? "hidden" : ""}`}
              >
                <Image
                  src={`/assets/header/DE.svg`}
                  alt={t("locale")}
                  width={37}
                  height={24.67}
                  style={{ width: "37px", height: "24.67px" }}
                  className="shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                />
              </button>
              <button
                onClick={async () => await setLanguage("tr")}
                className={`${navLinkClass} ${lang == "tr" ? "hidden" : ""}`}
              >
                <Image
                  src={`/assets/header/TR.svg`}
                  alt={t("locale")}
                  width={37}
                  height={24.67}
                  style={{ width: "37px", height: "24.67px" }}
                  className="shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                />
              </button>
            </div>
          </div>
          {router.pathname != "/products" && (
            <div className="group relative">
              <div
                className="cursor-pointer"
                onClick={() => setShowSearch(!showSearch)}
              >
                <Search className="h-6 w-6" />
              </div>

              <form
                name="Search"
                aria-label="Search"
                className={`absolute top-full -left-48 mt-2 w-[250px] overflow-hidden duration-300 ${
                  showSearch ? `visible opacity-100` : `invisible opacity-0`
                }`}
                onSubmit={handleSearchSubmit}
              >
                <input
                  name="Search bar input"
                  aria-label="Search bar input"
                  ref={searchInputRef}
                  type="text"
                  onChange={handleSearchChange}
                  className="w-full pl-4 pr-4 py-2 border-2 rounded-full text-black outline-none focus:border-orange-400"
                  placeholder={t("Cherchez des produits")}
                />
                <div className="absolute inset-y-0 right-0 flex">
                  <div
                    aria-label="Search bar submit button"
                    onClick={handleSearchSubmit}
                    className="bg-orange-400 h-full rounded-r-full w-[45px] cursor-pointer"
                  >
                    <Search className="h-6 w-6 mx-auto pr-1 mt-2.5" />
                  </div>
                </div>
              </form>
            </div>
          )}
          <div className="hidden sm:flex flex-row items-center">
            {client ? (
              <Link
                aria-label="Link to User Accunt   Dashboard"
                className="duration-300 underline-animation-white font-bold text-sm ml-2"
                href="/account/myorders"
              >
                <User />
              </Link>
            ) : (
              <Link
                aria-label="Link to User Login"
                className="duration-300 underline-animation-white font-bold text-sm ml-2"
                href="/login"
              >
                <User />
              </Link>
            )}
            <Link
              className="hover:text-gray-300 duration-300 relative ml-2 hover:text-red-500"
              href="/wishlist"
            >
              <Heart />
              <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1 py-0.5 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-orange-400 rounded-full">
                {wishlist.length}
              </span>
            </Link>
            <button
              onClick={openDrawer}
              className="flex items-center flex-row hover:text-green-500 duration-300 ml-4"
            >
              <div className="relative">
                <ShoppingBag />
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1 py-0.5 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-orange-400 rounded-full">
                  {cartItems}
                </span>
              </div>
              <p className="ml-2 font-bold whitespace-nowrap text-sm">
                € {cartAmount.toFixed(2).replace(".", ",")}
              </p>
            </button>
          </div>
          <div className="relative flex lg:hidden flex-row items-center justify-center text-white pl-2 h-full duration-300 text-sm">
            <button
              name="Mobile Navigation Menu"
              aria-label="Mobile Navigation Menu"
              onClick={() => setShowMenu(!showMenu)}
            >
              <Menu />
            </button>

            <div
              className={`absolute top-full -right-2 mt-2 flex flex-col bg-black duration-300 shadow-md ${
                showMenu ? `visible opacity-100` : `invisible opacity-0`
              }`}
            >
              {router.pathname != "/products" && (
                <Link
                  href="/products?page=1"
                  onClick={() => setShowMenu(false)}
                  className={`${navLinkClass} + bg-orange-400 text-black`}
                >
                  {t("SHOP")}
                </Link>
              )}

              <Link
                href="/projects"
                onClick={() => setShowMenu(false)}
                className={navLinkClass}
              >
                {t("PROJETS")}
              </Link>
              <Link
                href="/references"
                onClick={() => setShowMenu(false)}
                className={navLinkClass}
              >
                {t("RÉFÉRENCES")}
              </Link>
              <Link
                href="/contact"
                onClick={() => setShowMenu(false)}
                className={navLinkClass}
              >
                {t("CONTACT")}
              </Link>
              <Link
                href="/about"
                onClick={() => setShowMenu(false)}
                className={navLinkClass}
              >
                {t("À PROPOS DE NOUS")}
              </Link>
              {client ? (
                <Link
                  className={navLinkClass}
                  onClick={() => setShowMenu(false)}
                  href="/account/myorders"
                >
                  {t("COMPTE")}
                </Link>
              ) : (
                <Link
                  className={navLinkClass}
                  onClick={() => setShowMenu(false)}
                  href="/login"
                >
                  {t("LOGIN")}
                </Link>
              )}
              <div className="relative flex flex-row mt-2 mb-4 items-center justify-center text-white h-full duration-300 text-sm">
                <button onClick={() => setShowLanguages(!showLanguages)}>
                  <Image
                    src={`/assets/header/${lang.toUpperCase()}.svg`}
                    alt={t("locale")}
                    width={37}
                    height={24.67}
                    style={{ width: "37px", height: "24.67px" }}
                    className="shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                  />
                </button>

                <div
                  onMouseLeave={() => setShowLanguages(false)}
                  className={`absolute top-full mt-2 flex flex-col items-center bg-black duration-300 shadow-md ${
                    showLanguages
                      ? `visible opacity-100`
                      : `invisible opacity-0`
                  }`}
                >
                  <button
                    onClick={async () => await setLanguage("en")}
                    className={`${navLinkClass} ${
                      lang == "en" ? "hidden" : ""
                    }`}
                  >
                    <Image
                      src={`/assets/header/EN.svg`}
                      alt={t("locale")}
                      width={37}
                      height={24.67}
                      style={{ width: "37px", height: "24.67px" }}
                      className="shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                    />
                  </button>
                  <button
                    onClick={async () => await setLanguage("fr")}
                    className={`${navLinkClass} ${
                      lang == "fr" ? "hidden" : ""
                    }`}
                  >
                    <Image
                      src={`/assets/header/FR.svg`}
                      alt={t("locale")}
                      width={37}
                      height={24.67}
                      style={{ width: "37px", height: "24.67px" }}
                      className="shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                    />
                  </button>
                  <button
                    onClick={async () => await setLanguage("nl")}
                    className={`${navLinkClass} ${
                      lang == "nl" ? "hidden" : ""
                    }`}
                  >
                    <Image
                      src={`/assets/header/NL.svg`}
                      alt={t("locale")}
                      width={37}
                      height={24.67}
                      style={{ width: "37px", height: "24.67px" }}
                      className="shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                    />
                  </button>
                  <button
                    onClick={async () => await setLanguage("DE")}
                    className={`${navLinkClass} ${
                      lang == "de" ? "hidden" : ""
                    }`}
                  >
                    <Image
                      src={`/assets/header/DE.svg`}
                      alt={t("locale")}
                      width={37}
                      height={24.67}
                      style={{ width: "37px", height: "24.67px" }}
                      className="shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                    />
                  </button>
                  <button
                    onClick={async () => await setLanguage("tr")}
                    className={`${navLinkClass} ${
                      lang == "tr" ? "hidden" : ""
                    }`}
                  >
                    <Image
                      src={`/assets/header/TR.svg`}
                      alt={t("locale")}
                      width={37}
                      height={24.67}
                      style={{ width: "37px", height: "24.67px" }}
                      className="shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
