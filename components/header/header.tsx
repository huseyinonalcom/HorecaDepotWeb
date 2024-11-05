import { useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import useTranslation from "next-translate/useTranslation";
import setLanguage from "next-translate/setLanguage";
import {
  ChevronLeft,
  Globe,
  Heart,
  Info,
  MapPin,
  Menu,
  Phone,
  Search,
  ShoppingBag,
  ShoppingCart,
  User,
  Clipboard,
  X,
  Compass,
} from "react-feather";
import { CategoryContext } from "../../api/providers/categoryProvider";
import { CartContext } from "../../api/providers/cartProvider";
import { ClientContext } from "../../api/providers/clientProvider";
import { WishlistContext } from "../../api/providers/wishlistProvider";
import ProductPreview3 from "../products/product-preview3";
import { BannerContext } from "../../api/providers/bannerProdiver";
import { GiCarWheel } from "react-icons/gi";

const CategoryItem = ({ category, onClick }) => {
  const { t, lang } = useTranslation("common");
  const [isHovered, setisHovered] = useState(false);
  const hasSubCategories =
    category.subCategories && category.subCategories.length > 0;

  return (
    <div
      key={category.Name}
      className="relative cursor-pointer hover:bg-gray-200"
      onClick={() => onClick()}
      onMouseEnter={() => {
        setisHovered(true);
      }}
      onMouseLeave={() => {
        setisHovered(false);
      }}
    >
      <Link
        onClick={() => onClick()}
        href={`/${lang}/shop/${encodeURIComponent(t(category.Name))}?page=1`}
        className="flex w-full flex-row items-center justify-between px-3 py-2 text-left"
      >
        {t(category.Name)}
        {hasSubCategories && (
          <ChevronLeft
            className={
              "h-4 w-4 duration-300 " + (isHovered ? "rotate-180" : "")
            }
          />
        )}
      </Link>
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
            <CategoryItem
              key={subCategory.id}
              category={subCategory}
              onClick={() => onClick()}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const DesktopSearch = () => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const [searchQuery, setSearchQuery] = useState<string>();
  const [searchResults, setSearchResults] = useState([]);
  const debounceTimeout = useRef(null);

  const handleSearchChange = async (e) => {
    const value = e.target.value;

    setSearchQuery(value);

    if (value == "" && router.pathname == "/shop") {
      router.push(`/shop/tous?page=1`);
    }

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(async () => {
      const answer = await fetch(`/api/search/public/search?search=${value}`);
      const data = await answer.json();
      setSearchResults(data);
    }, 300);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery && searchQuery != "") {
      var url = "/shop/tous?page=1";
      url += "&search=" + searchQuery;
      router.push(url);
    } else {
      router.push(`/shop/tous?page=1`);
    }
  };

  return (
    <form
      name="Search"
      aria-label="Search"
      className="relative ml-auto mr-12 hidden w-full max-w-[500px] duration-300 md:flex"
      onSubmit={handleSearchSubmit}
    >
      <input
        name="Search bar input"
        aria-label="Search bar input"
        type="text"
        onChange={handleSearchChange}
        className="w-full rounded-2xl border-2 py-2 pl-4 pr-4 text-black outline-none focus:border-black focus:ring-transparent"
        placeholder={t("Search Products")}
      />
      <div className="absolute inset-y-0 right-0 flex">
        <button
          aria-label="Search bar submit button"
          type="submit"
          className="h-full w-[45px] cursor-pointer text-black"
        >
          <Search className="mx-auto my-auto h-6 w-6 pr-1" />
        </button>
      </div>
      {searchResults.length > 0 && (
        <div className="absolute left-0 right-0 z-10 mx-auto mt-12 max-w-screen-2xl rounded-xl border border-gray-300 bg-white text-black shadow-lg">
          <ul>
            {searchResults
              .filter((results) => !results.category && results.Name)
              .map((result, index) => (
                <li
                  key={index}
                  className="cursor-pointer rounded-xl px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    if (result.Name) {
                      router.push(
                        `/shop/${encodeURIComponent(t(result.Name))}?page=1`,
                      );
                    }
                  }}
                >
                  {result.title || t(result.Name)}
                </li>
              ))}
          </ul>
          <div className="grid grid-cols-4 gap-1">
            {searchResults
              .filter((results) => results.categories && results.name)
              .map((result, index) => (
                <ProductPreview3 key={index} product={result} />
              ))}
          </div>
        </div>
      )}
    </form>
  );
};

const MobileSearch = () => {
  const router = useRouter();
  const { t } = useTranslation("common");
  const [searchQuery, setSearchQuery] = useState<string>();
  const [searchResults, setSearchResults] = useState([]);
  const debounceTimeout = useRef(null);

  const handleSearchChange = async (e) => {
    const value = e.target.value;

    setSearchQuery(value);

    if (value == "" && router.pathname == "/shop") {
      router.push(`/shop/tous?page=1`);
    }

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(async () => {
      const answer = await fetch(`/api/search/public/search?search=${value}`);
      const data = await answer.json();
      setSearchResults(data);
    }, 300);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery && searchQuery != "") {
      var url = "/shop/tous?page=1";
      url += "&search=" + searchQuery;
      router.push(url);
    } else {
      router.push(`/shop/tous?page=1`);
    }
  };
  return (
    <form
      name="Search"
      aria-label="Search"
      className="relative flex w-full duration-300 md:hidden"
      onSubmit={handleSearchSubmit}
    >
      <input
        name="Search bar input"
        aria-label="Search bar input"
        type="text"
        onChange={handleSearchChange}
        className="w-full rounded-2xl border-2 py-2 pl-4 pr-4 text-black outline-none focus:border-black focus:ring-transparent"
        placeholder={t("Search Products")}
      />
      <div className="absolute inset-y-0 right-0 flex">
        <button
          aria-label="Search bar submit button"
          type="submit"
          className="h-full w-[45px] cursor-pointer text-black"
        >
          <Search className="mx-auto my-auto h-6 w-6 pr-1" />
        </button>
      </div>
      {searchResults.length > 0 && (
        <div className="absolute left-0 right-0 z-10 mx-auto mt-12 max-w-screen-2xl rounded-xl border border-gray-300 bg-white text-black shadow-lg">
          <ul>
            {searchResults
              .filter((results) => !results.categories && results.Name)
              .slice(0, 4)
              .map((result, index) => (
                <li
                  key={index}
                  className="cursor-pointer rounded-xl px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    if (result.Name) {
                      router.push(
                        `/shop/${encodeURIComponent(t(result.Name))}?page=1`,
                      );
                    }
                  }}
                >
                  {result.title || t(result.Name)}
                </li>
              ))}
          </ul>
          <div className="grid grid-cols-4 gap-1">
            {searchResults
              .filter((results) => results.categories && results.name)
              .slice(0, 4)
              .map((result, index) => (
                <ProductPreview3 key={index} product={result} />
              ))}
          </div>
        </div>
      )}
    </form>
  );
};

const TopBar = () => {
  const { t, lang } = useTranslation("common");
  const flagButtonClass =
    "px-4 duration-300 font-bold underline-animation-white whitespace-nowrap";
  const navLinkClass =
    "duration-500 font-semibold hover:decoration-white decoration-transparent underline underline-offset-2 decoration-2 whitespace-nowrap";
  return (
    <div className="hidden w-full flex-row items-center justify-between gap-4 border-b border-gray-500 px-5 pb-2 md:flex">
      <div className="flex flex-row items-center gap-4">
        <Link className="flex flex-row items-center gap-4" href="/contact">
          <MapPin className="h-4 w-4" />
          <p className={navLinkClass}>{t("location")}</p>
        </Link>
        <p className="text-gray-500">|</p>
        <a href="tel:+32499738373" className="flex flex-row items-center gap-4">
          <Phone className="h-4 w-4" />
          <p className={navLinkClass}>+32 499 73 83 73</p>
        </a>
        <p className="text-gray-500">|</p>
        <Link className={navLinkClass} href="/projects">
          {t("Projects")}
        </Link>
        <p className="text-gray-500">|</p>
        <Link className={navLinkClass} href="/references">
          {t("References")}
        </Link>
        <p className="text-gray-500">|</p>
        <Link className={navLinkClass} href="/contact">
          {t("Contact")}
        </Link>
        <p className="text-gray-500">|</p>
        <Link className={navLinkClass} href="/about">
          {t("About Us")}
        </Link>
        <p className="text-gray-500">|</p>
        <Link className={navLinkClass} href="/parking">
          {t("Parking")}
        </Link>
      </div>
      <div className="group relative z-50 hidden w-[55px] flex-shrink-0 lg:inline-block">
        <Image
          src={`/assets/header/${lang.toUpperCase()}.svg`}
          alt={t("locale")}
          width={43}
          height={28}
          style={{ width: "43px", height: "28px" }}
          className="shadow-[0_0_15px_rgba(255,255,255,0.4)]"
        />

        <ul className="invisible absolute right-0 mx-auto block w-max items-center pt-1 text-gray-700 opacity-0 shadow-md duration-300 group-hover:visible group-hover:opacity-100">
          <li className="bg-black pb-1">
            <button
              name="setLanguageToEN"
              aria-label="Set Language to English"
              onClick={async () => await setLanguage("en")}
              className={`${flagButtonClass} ${lang == "en" ? "hidden" : ""}`}
            >
              <Image
                src={`/assets/header/EN.svg`}
                alt={t("locale")}
                width={35}
                height={23}
                style={{ width: "35px", height: "23px" }}
                className="shadow-[0_0_15px_rgba(255,255,255,0.4)]"
              />
            </button>
          </li>
          <li className="bg-black pb-1">
            <button
              name="setLanguageToFR"
              aria-label="Set Language to French"
              onClick={async () => await setLanguage("fr")}
              className={`${flagButtonClass} ${lang == "fr" ? "hidden" : ""}`}
            >
              <Image
                src={`/assets/header/FR.svg`}
                alt={t("locale")}
                width={35}
                height={23}
                style={{ width: "35px", height: "23px" }}
                className="shadow-[0_0_15px_rgba(255,255,255,0.4)]"
              />
            </button>
          </li>
          <li className="bg-black pb-1">
            <button
              name="setLanguageToNL"
              aria-label="Set Language to Dutch"
              onClick={async () => await setLanguage("nl")}
              className={`${flagButtonClass} ${lang == "nl" ? "hidden" : ""}`}
            >
              <Image
                src={`/assets/header/NL.svg`}
                alt={t("locale")}
                width={35}
                height={23}
                style={{ width: "35px", height: "23px" }}
                className="shadow-[0_0_15px_rgba(255,255,255,0.4)]"
              />
            </button>
          </li>
          <li className="bg-black pb-1">
            <button
              name="setLanguageToDE"
              aria-label="Set Language to German"
              onClick={async () => await setLanguage("de")}
              className={`${flagButtonClass} ${lang == "de" ? "hidden" : ""}`}
            >
              <Image
                src={`/assets/header/DE.svg`}
                alt={t("locale")}
                width={35}
                height={23}
                style={{ width: "35px", height: "23px" }}
                className="shadow-[0_0_15px_rgba(255,255,255,0.4)]"
              />
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

const HeaderDrawer = ({ onClickOutside, isOpen }) => {
  const { t, lang } = useTranslation("common");
  const [showLanguages, setShowLanguages] = useState(false);
  const drawerClass = isOpen ? "fixed z-50 right-0" : "fixed right-[-100%]";
  const overlayClass = isOpen
    ? "fixed inset-0 bg-black bg-opacity-50 z-40"
    : "fixed right-[-100%]";
  const navButtonsClass = "flex flex-row gap-2 py-3 font-bold items-center";
  const flagButtonsClass = "flex flex-row gap-2 py-2 font-bold items-center";

  const { categories } = useContext(CategoryContext);
  const [allCategories, setCategories] = useState([]);
  const [showCategories, setShowCategories] = useState(false);

  useEffect(() => {
    setCategories(categories);
  }, [categories]);

  const CategoryItem = ({ category, onClick }) => {
    const [isHovered, setisHovered] = useState(false);
    const hasSubCategories =
      category.subCategories && category.subCategories.length > 0;

    return (
      <div
        className={`relative cursor-pointer ${category.headCategory ? "z-[60]" : "z-40"}`}
      >
        <div className="focus:overlay-none flex w-full items-center justify-between text-left hover:bg-gray-200">
          {hasSubCategories ? (
            <>
              <a
                href={`/${lang}/shop/${encodeURIComponent(t(category.Name))}?page=1`}
                className="h-full whitespace-nowrap px-4 py-2"
              >
                {t(category.Name)}
              </a>
              <div
                className="w-full py-3 pr-4"
                onClick={() => {
                  setisHovered(!isHovered);
                }}
              >
                <ChevronLeft
                  className={
                    "ml-auto h-4 w-4 duration-300 " +
                    (isHovered ? "rotate-270" : "rotate-90")
                  }
                />
              </div>
            </>
          ) : (
            <a
              href={`/${lang}/shop/${encodeURIComponent(t(category.Name))}?page=1`}
              className="h-full w-full whitespace-nowrap px-4 py-2"
            >
              {t(category.Name)}
            </a>
          )}
        </div>
        {hasSubCategories && (
          <div
            className={
              "transition-max-height overflow-hidden pl-4 duration-300 ease-in-out " +
              (isHovered ? "max-h-96" : "max-h-0")
            }
          >
            {category.subCategories.map((subCategory) => (
              <CategoryItem
                key={subCategory.id}
                category={subCategory}
                onClick={() => onClick()}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <div
        className={`${overlayClass} h-screen duration-700`}
        onClick={() => {
          showCategories ? setShowCategories(false) : onClickOutside();
        }}
      ></div>
      <div
        className={`${drawerClass} top-0 z-50 h-screen min-w-[310px] overflow-y-auto bg-gray-100 p-5 text-black duration-500`}
      >
        <div
          onClick={() => {
            setShowCategories(false);
          }}
          className="flex w-full flex-row justify-between py-1"
        >
          <button
            aria-label="Mobile navigation menu closing button"
            name="Mobile navigation menu closing button"
            onClick={onClickOutside}
          >
            <X className="h-8 w-8 -rotate-180 duration-700 hover:rotate-180" />
          </button>
          <div className="relative">
            <button
              aria-label="Language switching menu opening button"
              name="Language switching menu opening button"
              onClick={() => setShowLanguages(!showLanguages)}
            >
              <Image
                src={`/assets/header/${lang.toUpperCase()}.svg`}
                alt={t("locale")}
                width={66}
                height={44}
                style={{ width: "66px", height: "44px" }}
                className="shadow-[0_0_15px_rgba(255,255,255,0.4)]"
              />
            </button>

            <div
              onMouseLeave={() => setShowLanguages(false)}
              className={`absolute -right-[6px] top-full mt-2 flex w-[78px] flex-col items-center bg-black shadow-md duration-300 ${
                showLanguages ? `visible opacity-100` : `invisible opacity-0`
              }`}
            >
              <button
                name="setLanguageToEN"
                aria-label="Set Language to English"
                onClick={async () => await setLanguage("en")}
                className={`${flagButtonsClass} ${
                  lang == "en" ? "hidden" : ""
                }`}
              >
                <Image
                  src="/assets/header/EN.svg"
                  alt={t("locale")}
                  width={66}
                  height={44}
                  style={{ width: "66px", height: "44px" }}
                  className="shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                />
              </button>
              <button
                name="setLanguageToFR"
                aria-label="Set Language to French"
                onClick={async () => await setLanguage("fr")}
                className={`${flagButtonsClass} ${
                  lang == "fr" ? "hidden" : ""
                }`}
              >
                <Image
                  src="/assets/header/FR.svg"
                  alt={t("locale")}
                  width={66}
                  height={44}
                  style={{ width: "66px", height: "44px" }}
                  className="shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                />
              </button>
              <button
                name="setLanguageToNL"
                aria-label="Set Language to Dutch"
                onClick={async () => await setLanguage("nl")}
                className={`${flagButtonsClass} ${
                  lang == "nl" ? "hidden" : ""
                }`}
              >
                <Image
                  src="/assets/header/NL.svg"
                  alt={t("locale")}
                  width={66}
                  height={44}
                  style={{ width: "66px", height: "44px" }}
                  className="shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                />
              </button>
              <button
                name="setLanguageToDE"
                aria-label="Set Language to German"
                onClick={async () => await setLanguage("de")}
                className={`${flagButtonsClass} ${
                  lang == "de" ? "hidden" : ""
                }`}
              >
                <Image
                  src="/assets/header/DE.svg"
                  alt={t("locale")}
                  width={66}
                  height={44}
                  style={{ width: "66px", height: "44px" }}
                  className="shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                />
              </button>
            </div>
          </div>
        </div>
        <div className="flex w-full flex-col">
          <Link
            aria-label="Link to Shop"
            className={navButtonsClass}
            href="/shop/tous?page=1"
          >
            <ShoppingCart /> {t("Shop")}
          </Link>
          <button
            name="showCategories"
            aria-label="Show Categories"
            className={navButtonsClass}
            onClick={() => setShowCategories(!showCategories)}
          >
            <ChevronLeft
              className={
                "duration-300 " + (showCategories ? "rotate-270" : "rotate-90")
              }
            />
            {t("Categories")}
          </button>
          <div
            className={`fixed right-0 flex flex-col bg-gray-100 py-2 text-gray-500 duration-300 ${showCategories ? `w-[310px]` : `w-0`}`}
          >
            {allCategories.map((category) => (
              <CategoryItem
                key={category.id}
                category={category}
                onClick={() => onClickOutside()}
              />
            ))}
          </div>

          <Link
            aria-label="Link to Account"
            className={navButtonsClass}
            href="/account/myaccount"
          >
            <User /> {t("Account")}
          </Link>
          <Link
            aria-label="Link to Wishlist"
            className={navButtonsClass}
            href="/wishlist"
          >
            <Heart /> {t("Wishlist")}
          </Link>
          <Link
            aria-label="Link to Projects"
            className={navButtonsClass}
            href="/projects"
          >
            <Clipboard /> {t("Projects")}
          </Link>
          <Link
            aria-label="Link to References"
            className={navButtonsClass}
            href="/references"
          >
            <Globe /> {t("References")}
          </Link>
          <Link
            aria-label="Link to Contact us"
            className={navButtonsClass}
            href="/contact"
          >
            <MapPin /> {t("Contact")}
          </Link>
          <Link
            aria-label="Link to About us"
            className={navButtonsClass}
            href="/about"
          >
            <Info />
            {t("About us")}
          </Link>
          <Link
            aria-label="Link to Parking"
            className={navButtonsClass}
            href="/parking"
          >
            <Compass />
            {t("Parking")}
          </Link>
        </div>
      </div>
    </>
  );
};

const HeaderButtons = ({ cartItems }) => {
  const { client } = useContext(ClientContext);
  const { openDrawer } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);
  const navButtonsClass =
    "relative flex flex-col justify-center items-center p-1 duration-300 font-bold text-sm text-white hover:bg-black aspect-[1/1]";

  return (
    <>
      {client ? (
        <Link
          aria-label="Link to User Account Dashboard"
          className={`${navButtonsClass} hidden lg:flex`}
          href="/account/myaccount"
        >
          <User />
        </Link>
      ) : (
        <Link
          aria-label="Link to User Login"
          className={`${navButtonsClass} hidden lg:flex`}
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
        <span className="absolute right-3 top-3 inline-flex -translate-y-1/2 translate-x-1/2 transform items-center justify-center bg-red-600 px-1 py-0.5 text-xs font-bold leading-none text-white">
          {wishlist.length}
        </span>
      </Link>
      <button
        name="Shopping cart"
        aria-label="Shopping cart"
        className={navButtonsClass}
        onClick={openDrawer}
      >
        <ShoppingBag />
        <span className="absolute right-3 top-3 inline-flex -translate-y-1/2 translate-x-1/2 transform items-center justify-center bg-red-600 px-1 py-0.5 text-xs font-bold leading-none">
          {cartItems}
        </span>
      </button>
    </>
  );
};

const CategoryDrawerMobile = ({ isOpen, categories, closeDrawer }) => {
  const { t } = useTranslation("common");

  return (
    <div
      className={`fixed inset-0 z-[99] flex h-screen w-full overflow-hidden text-black duration-300 ease-in-out ${isOpen ? "left-0" : "-left-[110%]"} flex flex-row`}
    >
      <div className="flex-shrink-0 flex-col rounded-r-xl bg-white p-4">
        <div className="flex w-full min-w-[300px] flex-row items-center justify-between">
          <h3 className="pl-2 pr-6 text-xl font-semibold">{t("Categories")}</h3>
          <button
            name="closeCategories"
            aria-label="Close Categoires"
            onClick={closeDrawer}
          >
            <X />
          </button>
        </div>
        <div className="my-4 flex w-full flex-col border-b border-t bg-white py-2 text-gray-500 duration-300">
          {categories.map((category) => (
            <CategoryItem
              key={category.id}
              category={category}
              onClick={() => closeDrawer()}
            />
          ))}
        </div>
      </div>
      <div
        className={`w-full bg-black/50 ${isOpen ? "opacity-100 duration-[1500ms] ease-in-out" : "opacity-0"}`}
        onClick={closeDrawer}
      ></div>
    </div>
  );
};

const CategoryDrawerDesktop = ({ isOpen, categories, closeDrawer }) => {
  const { t, lang } = useTranslation("common");

  return (
    <div
      className={`fixed inset-0 z-[99] mx-auto flex h-fit max-w-screen-2xl items-center justify-center overflow-hidden text-black duration-300 ease-in-out ${isOpen ? "top-[140px] opacity-100" : "-top-[150%] opacity-40"} flex-col`}
    >
      <div className="z-[98] mx-auto w-full max-w-[1000px] flex-shrink-0 rounded-xl bg-white p-4">
        <div className="flex w-full flex-row items-center justify-between">
          <h3 className="pl-2 pr-6 text-xl font-semibold">{t("Categories")}</h3>
          <button
            name="closeCategories"
            aria-label="Close Categoires"
            onClick={closeDrawer}
          >
            <X />
          </button>
        </div>
        <div className="my-4 grid grid-cols-4 gap-4 border-t bg-white py-2 text-gray-500 duration-300">
          {categories
            .filter((cat) => cat.subCategories.length > 0)
            .map((category) => (
              <div key={category.id + "-column"}>
                <Link
                  href={`/${lang}/shop/${encodeURIComponent(t(category.Name))}?page=1`}
                  onClick={() => closeDrawer()}
                  className="font-semibold"
                >
                  {t(category.Name)}
                </Link>
                {/* <a
                  href={`/${lang}/shop/${encodeURIComponent(t(category.Name))}?page=1`}
                  className="flex w-full items-center justify-between px-3 py-2 text-left hover:bg-gray-200"
                >
                  {t("All")} {t(category.Name)}
                </a> */}
                {category.subCategories.map((subCategory) => (
                  <CategoryItem
                    key={subCategory.id}
                    category={subCategory}
                    onClick={() => closeDrawer()}
                  />
                ))}
              </div>
            ))}
          {categories.filter((cat) => cat.subCategories.length == 0) && (
            <div key={99999} className="grid grid-cols-1">
              {categories
                .filter((cat) => cat.subCategories.length == 0)
                .map((category) => (
                  <div key={category.id + "-column"}>
                    <Link
                      onClick={() => closeDrawer()}
                      href={`/${lang}/shop/${encodeURIComponent(t(category.Name))}?page=1`}
                      className="font-semibold"
                    >
                      {t(category.Name)}
                    </Link>
                    <Link
                      onClick={() => closeDrawer()}
                      href={`/${lang}/shop/${encodeURIComponent(t(category.Name))}?page=1`}
                      className="flex w-full items-center justify-between px-3 py-2 text-left hover:bg-gray-200"
                    >
                      {t(category.Name)}
                    </Link>
                    {category.subCategories.map((subCategory) => (
                      <CategoryItem
                        key={subCategory.id}
                        category={subCategory}
                        onClick={() => closeDrawer()}
                      />
                    ))}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
      <div
        className={`fixed inset-0 z-[95] h-screen w-screen bg-black/50 ${isOpen ? "opacity-100 duration-300 ease-in-out" : "hidden opacity-0"}`}
        onClick={closeDrawer}
      ></div>
    </div>
  );
};

const Header = () => {
  const [cartItems, setCartItems] = useState(0);
  const { categories } = useContext(CategoryContext);
  const [allCategories, setAllCategories] = useState([]);
  const { cart, calculateTotal } = useContext(CartContext);
  const [showCategories, setShowCategories] = useState(false);
  const { banners } = useContext(BannerContext);

  const { t, lang } = useTranslation("common");

  useEffect(() => {
    if (allCategories.length === 0 && categories.length > 0) {
      setAllCategories(categories);
    }
  }, [categories]);

  useEffect(() => {
    setCartItems(calculateTotal().amount);
  }, [cart]);

  const [isHeaderDrawerOpen, setIsHeaderDrawerOpen] = useState(false);

  return (
    <div
      className={`sticky top-0 z-40 mx-auto flex w-[90vw] flex-col items-center pt-2 text-white duration-300 print:hidden`}
    >
      <div className="flex lg:hidden">
        <CategoryDrawerMobile
          isOpen={showCategories}
          categories={allCategories}
          closeDrawer={() => setShowCategories(false)}
        />
      </div>
      <div className="hidden lg:flex">
        <CategoryDrawerDesktop
          isOpen={showCategories}
          categories={allCategories}
          closeDrawer={() => setShowCategories(false)}
        />
      </div>
      <div className="flex w-full flex-col gap-2 pb-3">
        <HeaderDrawer
          isOpen={isHeaderDrawerOpen}
          onClickOutside={() => setIsHeaderDrawerOpen(false)}
        />

        <TopBar />

        <div className="w-full   px-5">
          <div className="flex w-full flex-row items-center justify-between gap-4">
            <button
              name="Mobile Navigation Menu"
              className="relative flex flex-col items-center justify-center p-1 text-sm font-bold text-white duration-300 hover:bg-black focus:outline-transparent lg:hidden"
              style={{ WebkitTapHighlightColor: "transparent" }}
              aria-label="Mobile Navigation Menu"
              onClick={() => setIsHeaderDrawerOpen(true)}
            >
              <Menu />
            </button>
            <div className="flex flex-row items-center gap-8 text-sm text-white">
              <Link
                href={"/"}
                className="flex-shrink-0"
                onClick={() => setIsHeaderDrawerOpen(false)}
                style={{
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                <Image
                  width={200}
                  height={42.19}
                  priority
                  className="flex md:hidden"
                  src="/assets/header/logo.svg"
                  alt="Horeca Depot Logo"
                />

                <Image
                  width={300}
                  height={63.28}
                  priority
                  className="hidden md:flex"
                  src="/assets/header/logo.svg"
                  alt="Horeca Depot Logo"
                />
              </Link>
              <button
                name="Show Categories"
                aria-label="Show Categories"
                className="hidden flex-row items-center gap-2 rounded-lg border-2 py-2 pl-3.5 pr-5 lg:flex"
                onClick={() => setShowCategories(true)}
              >
                <Menu className="mb-[1px]" />
                <p className="font-semibold">{t("CATEGORIES")}</p>
              </button>
            </div>
            <div className="flex h-[45px] flex-row gap-2 md:ml-48 md:w-full">
              <DesktopSearch />
              <HeaderButtons cartItems={cartItems} />
            </div>
          </div>

          <div className="flex w-full flex-row md:hidden">
            <div className="relative mt-3 w-full">
              <MobileSearch />
            </div>
          </div>
        </div>
      </div>
      {banners?.at(0)?.content[lang] &&
        banners.map((banner) => (
          <div className="flex h-12 w-full flex-col gap-2 py-3">
            <Link href={banner.url} key={banner.id} className="w-full">
              {banner.content[lang]}
            </Link>
          </div>
        ))}
    </div>
  );
};

export default Header;
