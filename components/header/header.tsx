import { hierarchizeCategories } from "../../pages/admin/website/categories";
import { WishlistContext } from "../../api/providers/wishlistProvider";
import { useContext, useEffect, useRef, useState } from "react";
import { CartContext } from "../../api/providers/cartProvider";
import ProductPreview3 from "../products/product-preview3";
import useTranslation from "next-translate/useTranslation";
import setLanguage from "next-translate/setLanguage";
import { Rating } from "react-simple-star-rating";
import LocaleSwitcher from "../LocaleSwitcher";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import {
  FiChevronLeft,
  FiSearch,
  FiMapPin,
  FiPhone,
  FiX,
  FiShoppingCart,
  FiUser,
  FiHeart,
  FiClipboard,
  FiGlobe,
  FiInfo,
  FiCompass,
  FiShoppingBag,
  FiMenu,
} from "react-icons/fi";

const CategoryItem = ({ category, onClick }) => {
  const { lang } = useTranslation("common");
  const [isHovered, setisHovered] = useState(false);
  const hasSubCategories =
    category.subCategories && category.subCategories.length > 0;

  return (
    <div
      key={category.localized_name[lang]}
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
        href={`/${lang}/shop/${encodeURIComponent(category.localized_name[lang])}?page=1`}
        className="flex w-full flex-row items-center justify-between px-3 py-2 text-left"
      >
        {category.localized_name[lang]}
        {hasSubCategories && (
          <FiChevronLeft
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
          className="absolute top-0 left-full z-50 min-w-[200px] bg-white shadow-lg"
        >
          {category.subCategories
            .filter(
              (subCategory) =>
                subCategory.products_multi_categories.filter(
                  (prod) => prod.active,
                ).length > 0,
            )
            .map((subCategory) => (
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
  const { t, lang } = useTranslation("common");
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
      const answer = await fetch(`/api/public/search?search=${value}`);
      const data = await answer.json();
      setSearchResults(data.result);
    }, 300);
  };

  const handleSearchSubmit = (e) => {
    setSearchResults([]);
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
      className="relative mr-12 ml-auto hidden w-full max-w-[500px] duration-300 md:flex"
      onSubmit={handleSearchSubmit}
    >
      <input
        name="Search bar input"
        aria-label="Search bar input"
        type="text"
        onChange={handleSearchChange}
        className="w-full rounded-2xl border-2 bg-white py-2 pr-4 pl-4 text-black outline-none focus:border-black focus:ring-transparent"
        placeholder={t("Search Products")}
      />
      <div className="absolute inset-y-0 right-0 flex">
        <button
          aria-label="Search bar submit button"
          type="submit"
          className="h-full w-[45px] cursor-pointer text-black"
        >
          <FiSearch className="mx-auto my-auto h-6 w-6 pr-1" />
        </button>
      </div>
      {searchResults.length > 0 && (
        <>
          <div
            onClick={() => setSearchResults([])}
            className="fixed inset-0 z-0 cursor-default"
          />

          <div className="absolute right-0 left-0 z-10 mx-auto mt-12 max-w-screen-2xl rounded-xl border border-gray-300 bg-white text-black shadow-lg">
            <ul>
              {searchResults
                .filter(
                  (results) =>
                    !results.categories && results.localized_name[lang],
                )
                .map((result, index) => (
                  <li
                    key={index}
                    className="cursor-pointer rounded-xl px-4 py-2 hover:bg-gray-100"
                    onClick={() => {
                      if (result.localized_name[lang]) {
                        router.push(
                          `/shop/${encodeURIComponent(result.localized_name[lang])}?page=1`,
                        );
                        setSearchResults([]);
                      }
                    }}
                  >
                    {result.title || result.localized_name[lang]}
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
        </>
      )}
    </form>
  );
};

const MobileSearch = () => {
  const router = useRouter();
  const { t, lang } = useTranslation("common");
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
      const answer = await fetch(`/api/public/search?search=${value}`);
      const data = await answer.json();
      setSearchResults(data.result);
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
        className="w-full rounded-2xl border-2 bg-white py-2 pr-4 pl-4 text-black outline-none focus:border-black focus:ring-transparent"
        placeholder={t("Search Products")}
      />
      <div className="absolute inset-y-0 right-0 flex">
        <button
          aria-label="Search bar submit button"
          type="submit"
          className="h-full w-[45px] cursor-pointer text-black"
        >
          <FiSearch className="mx-auto my-auto h-6 w-6 pr-1" />
        </button>
      </div>
      {searchResults.length > 0 && (
        <div className="absolute right-0 left-0 z-10 mx-auto mt-12 max-w-screen-2xl rounded-xl border border-gray-300 bg-white text-black shadow-lg">
          <ul>
            {searchResults
              .filter(
                (results) =>
                  !results.categories && results.localized_name[lang],
              )
              .slice(0, 4)
              .map((result, index) => (
                <li
                  key={index}
                  className="cursor-pointer rounded-xl px-4 py-2 hover:bg-gray-100"
                  onClick={() => {
                    if (result.localized_name[lang]) {
                      router.push(
                        `/shop/${encodeURIComponent(result.localized_name[lang])}?page=1`,
                      );
                    }
                  }}
                >
                  {result.title || result.localized_name[lang]}
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
  const navLinkClass =
    "duration-500 font-semibold hover:decoration-white decoration-transparent underline underline-offset-2 decoration-2 whitespace-nowrap";

  const [rating, setRating] = useState(null);

  useEffect(() => {
    if (rating == null) {
      fetch("/api/public/external/googlerating").then((res) => {
        res.json().then((res) => {
          setRating(res);
        });
      });
    }
  }, []);

  return (
    <div className="hidden w-full flex-row items-center justify-between gap-4 border-b border-gray-500 px-5 pb-2 md:flex">
      <div className="flex flex-row items-center gap-4">
        <Link className="flex flex-row items-center gap-4" href="/contact">
          <FiMapPin className="h-4 w-4" />
          <p className={navLinkClass}>{t("location")}</p>
        </Link>
        <p className="text-gray-500">|</p>
        <a href="tel:+32499738373" className="flex flex-row items-center gap-4">
          <FiPhone className="h-4 w-4" />
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

      <div className="flex flex-row items-start gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={272 * 0.3}
          height={92 * 0.3}
          viewBox="0 0 272 92"
        >
          <path
            fill="#EA4335"
            d="M115.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18C71.25 34.32 81.24 25 93.5 25s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44S80.99 39.2 80.99 47.18c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"
          />
          <path
            fill="#FBBC05"
            d="M163.75 47.18c0 12.77-9.99 22.18-22.25 22.18s-22.25-9.41-22.25-22.18c0-12.85 9.99-22.18 22.25-22.18s22.25 9.32 22.25 22.18zm-9.74 0c0-7.98-5.79-13.44-12.51-13.44s-12.51 5.46-12.51 13.44c0 7.9 5.79 13.44 12.51 13.44s12.51-5.55 12.51-13.44z"
          />
          <path
            fill="#4285F4"
            d="M209.75 26.34v39.82c0 16.38-9.66 23.07-21.08 23.07-10.75 0-17.22-7.19-19.66-13.07l8.48-3.53c1.51 3.61 5.21 7.87 11.17 7.87 7.31 0 11.84-4.51 11.84-13v-3.19h-.34c-2.18 2.69-6.38 5.04-11.68 5.04-11.09 0-21.25-9.66-21.25-22.09 0-12.52 10.16-22.26 21.25-22.26 5.29 0 9.49 2.35 11.68 4.96h.34v-3.61h9.25zm-8.56 20.92c0-7.81-5.21-13.52-11.84-13.52-6.72 0-12.35 5.71-12.35 13.52 0 7.73 5.63 13.36 12.35 13.36 6.63 0 11.84-5.63 11.84-13.36z"
          />
          <path fill="#34A853" d="M225 3v65h-9.5V3h9.5z" />
          <path
            fill="#EA4335"
            d="m262.02 54.48 7.56 5.04c-2.44 3.61-8.32 9.83-18.48 9.83-12.6 0-22.01-9.74-22.01-22.18 0-13.19 9.49-22.18 20.92-22.18 11.51 0 17.14 9.16 18.98 14.11l1.01 2.52-29.65 12.28c2.27 4.45 5.8 6.72 10.75 6.72 4.96 0 8.4-2.44 10.92-6.14zm-23.27-7.98 19.82-8.23c-1.09-2.77-4.37-4.7-8.23-4.7-4.95 0-11.84 4.37-11.59 12.93z"
          />
          <path
            fill="#4285F4"
            d="M35.29 41.41V32H67c.31 1.64.47 3.58.47 5.68 0 7.06-1.93 15.79-8.15 22.01-6.05 6.3-13.78 9.66-24.02 9.66C16.32 69.35.36 53.89.36 34.91.36 15.93 16.32.47 35.3.47c10.5 0 17.98 4.12 23.6 9.49l-6.64 6.64c-4.03-3.78-9.49-6.72-16.97-6.72-13.86 0-24.7 11.17-24.7 25.03 0 13.86 10.84 25.03 24.7 25.03 8.99 0 14.11-3.61 17.39-6.89 2.66-2.66 4.41-6.46 5.1-11.65l-22.49.01z"
          />
        </svg>
        <p className="mt-0.5">
          {rating?.userRatingCount} {t("reviews")}
        </p>
        <Rating
          allowFraction
          readonly
          SVGclassName="inline-block"
          iconsCount={5}
          size={20}
          initialValue={rating?.rating ?? 5}
        />
      </div>
      <LocaleSwitcher />
    </div>
  );
};

const HeaderDrawer = ({ onClickOutside, isOpen, allCategories }) => {
  const { t, lang } = useTranslation("common");
  const [showLanguages, setShowLanguages] = useState(false);
  const drawerClass = isOpen ? "fixed z-50 right-0" : "fixed right-[-100%]";
  const overlayClass = isOpen
    ? "fixed inset-0 bg-black bg-opacity-50 z-40"
    : "fixed right-[-100%]";
  const navButtonsClass = "flex flex-row gap-2 py-3 font-bold items-center";
  const flagButtonsClass = "flex flex-row gap-2 py-2 font-bold items-center";

  const [showCategories, setShowCategories] = useState(false);

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
                href={`/${lang}/shop/${encodeURIComponent(category.localized_name[lang])}?page=1`}
                className="h-full px-4 py-2 whitespace-nowrap"
              >
                {category.localized_name[lang]}
              </a>
              <div
                className="w-full py-3 pr-4"
                onClick={() => {
                  setisHovered(!isHovered);
                }}
              >
                <FiChevronLeft
                  className={
                    "ml-auto h-4 w-4 duration-300 " +
                    (isHovered ? "rotate-270" : "rotate-90")
                  }
                />
              </div>
            </>
          ) : (
            <a
              href={`/${lang}/shop/${encodeURIComponent(category.localized_name[lang])}?page=1`}
              className="h-full w-full px-4 py-2 whitespace-nowrap"
            >
              {category.localized_name[lang]}
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
            {category.subCategories
              .filter(
                (sc) =>
                  sc.products_multi_categories.filter((prod) => prod.active)
                    .length > 0 || sc.subCategories.length > 0,
              )
              .map((subCategory) => (
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
            <FiX className="h-8 w-8 -rotate-180 duration-700 hover:rotate-180" />
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
              className={`absolute top-full -right-[6px] mt-2 flex w-[78px] flex-col items-center bg-black shadow-md duration-300 ${
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
            <FiShoppingCart /> {t("Shop")}
          </Link>
          <button
            name="showCategories"
            aria-label="Show Categories"
            className={navButtonsClass}
            onClick={() => setShowCategories(!showCategories)}
          >
            <FiChevronLeft
              className={
                "duration-300 " + (showCategories ? "rotate-270" : "rotate-90")
              }
            />
            {t("Categories")}
          </button>
          <div
            className={`fixed right-0 flex min-h-[80vh] flex-col bg-gray-100 py-2 text-gray-500 duration-300 ${showCategories ? `w-[310px]` : `w-0`}`}
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
            <FiUser /> {t("Account")}
          </Link>
          <Link
            aria-label="Link to Wishlist"
            className={navButtonsClass}
            href="/wishlist"
          >
            <FiHeart /> {t("Wishlist")}
          </Link>
          <Link
            aria-label="Link to Projects"
            className={navButtonsClass}
            href="/projects"
          >
            <FiClipboard /> {t("Projects")}
          </Link>
          <Link
            aria-label="Link to References"
            className={navButtonsClass}
            href="/references"
          >
            <FiGlobe /> {t("References")}
          </Link>
          <Link
            aria-label="Link to Contact us"
            className={navButtonsClass}
            href="/contact"
          >
            <FiMapPin /> {t("Contact")}
          </Link>
          <Link
            aria-label="Link to About us"
            className={navButtonsClass}
            href="/about"
          >
            <FiInfo />
            {t("About us")}
          </Link>
          <Link
            aria-label="Link to Parking"
            className={navButtonsClass}
            href="/parking"
          >
            <FiCompass />
            {t("Parking")}
          </Link>
        </div>
      </div>
    </>
  );
};

const HeaderButtons = ({ cartItems }) => {
  const { openDrawer } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);
  const navButtonsClass =
    "relative flex flex-col justify-center items-center p-1 duration-300 font-bold text-sm text-white hover:bg-black aspect-[1/1]";

  return (
    <>
      <Link
        aria-label="Link to User Account Dashboard"
        className={`${navButtonsClass} hidden lg:flex`}
        href="/account/myaccount"
      >
        <FiUser size={24} />
      </Link>
      <Link
        aria-label="Link to Wishlist"
        className={`${navButtonsClass} hidden lg:flex`}
        href="/wishlist"
      >
        <FiHeart size={24} />
        <span className="absolute top-3 right-3 inline-flex translate-x-1/2 -translate-y-1/2 transform items-center justify-center bg-red-600 px-1 py-0.5 text-xs leading-none font-bold text-white">
          {wishlist.length}
        </span>
      </Link>
      <button
        name="Shopping cart"
        aria-label="Shopping cart"
        className={navButtonsClass}
        onClick={openDrawer}
      >
        <FiShoppingBag size={24} />
        <span className="absolute top-3 right-3 inline-flex translate-x-1/2 -translate-y-1/2 transform items-center justify-center bg-red-600 px-1 py-0.5 text-xs leading-none font-bold">
          {cartItems}
        </span>
      </button>
    </>
  );
};

const CategoryDrawerMobile = ({ isOpen, categoriesToShow, closeDrawer }) => {
  const { t } = useTranslation("common");

  return (
    <div
      className={`fixed inset-0 z-[99] flex h-screen w-full overflow-hidden text-black duration-300 ease-in-out ${isOpen ? "left-0" : "-left-[110%]"} flex flex-row`}
    >
      <div className="flex-shrink-0 flex-col rounded-r-xl bg-white p-4">
        <div className="flex w-full min-w-[300px] flex-row items-center justify-between">
          <h3 className="pr-6 pl-2 text-xl font-semibold">{t("Categories")}</h3>
          <button
            name="closeCategories"
            aria-label="Close Categoires"
            onClick={closeDrawer}
          >
            <FiX />
          </button>
        </div>
        <div className="my-4 flex w-full flex-col border-t border-b bg-white py-2 text-gray-500 duration-300">
          {categoriesToShow.map((category) => (
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
          <h3 className="pr-6 pl-2 text-xl font-semibold">{t("Categories")}</h3>
          <button
            name="closeCategories"
            aria-label="Close Categoires"
            onClick={closeDrawer}
          >
            <FiX />
          </button>
        </div>
        <div className="my-4 grid grid-cols-4 gap-4 border-t bg-white py-2 duration-300">
          {categories
            .filter((cat) => cat.subCategories.length > 0)
            .map((category) => (
              <div key={category.id + "-column"}>
                <Link
                  href={`/${lang}/shop/${encodeURIComponent(category.localized_name[lang])}?page=1`}
                  onClick={() => closeDrawer()}
                  className="font-semibold"
                >
                  {category.localized_name[lang]}
                </Link>
                {category.subCategories
                  .filter(
                    (subCategory) =>
                      subCategory.products_multi_categories.filter(
                        (prod) => prod.active,
                      ).length > 0 || subCategory.subCategories.length > 0,
                  )
                  .map((subCategory) => (
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
                      href={`/${lang}/shop/${encodeURIComponent(category.localized_name[lang])}?page=1`}
                      className="font-semibold"
                    >
                      {category.localized_name[lang]}
                    </Link>
                    <Link
                      onClick={() => closeDrawer()}
                      href={`/${lang}/shop/${encodeURIComponent(category.localized_name[lang])}?page=1`}
                      className="flex w-full items-center justify-between px-3 py-2 text-left hover:bg-gray-200"
                    >
                      {category.localized_name[lang]}
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
  const [allCategories, setAllCategories] = useState([]);
  const { cart, calculateTotal } = useContext(CartContext);
  const [showCategories, setShowCategories] = useState(false);
  const [banners, setBanners] = useState([]);

  const { t, lang } = useTranslation("common");

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/private/categories");
      const categories = await response.json();
      setAllCategories(hierarchizeCategories(categories));
    } catch (error) {}
  };

  const fetchBanners = async () => {
    const banners = await fetch("/api/private/top-banners");
    const answer = await banners.json();
    setBanners(answer.result);
  };

  useEffect(() => {
    fetchCategories();
    fetchBanners();
  }, []);

  useEffect(() => {
    setCartItems(calculateTotal().amount);
  }, [cart]);

  const [isHeaderDrawerOpen, setIsHeaderDrawerOpen] = useState(false);

  return (
    <div className="sticky top-0 z-40 mx-auto flex w-[90vw] flex-col items-center pt-2 text-white duration-300 print:hidden">
      <div className="flex lg:hidden">
        <CategoryDrawerMobile
          isOpen={showCategories}
          categoriesToShow={allCategories}
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
          allCategories={allCategories}
          isOpen={isHeaderDrawerOpen}
          onClickOutside={() => setIsHeaderDrawerOpen(false)}
        />
        <TopBar />
        <div className="w-full px-5">
          <div className="flex w-full flex-row items-center justify-between gap-4">
            <button
              name="Mobile Navigation Menu"
              className="relative flex flex-col items-center justify-center p-1 text-sm font-bold text-white duration-300 hover:bg-black focus:outline-transparent lg:hidden"
              style={{ WebkitTapHighlightColor: "transparent" }}
              aria-label="Mobile Navigation Menu"
              onClick={() => setIsHeaderDrawerOpen(true)}
            >
              <FiMenu />
            </button>
            <div className="flex flex-row items-center gap-8 text-sm text-white">
              <Link
                href="/"
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
                className="hidden flex-row items-center gap-2 rounded-lg border-2 py-2 pr-5 pl-3.5 lg:flex"
                onClick={() => setShowCategories(true)}
              >
                <FiMenu size={20} className="mb-[1px]" />
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
          <div key={banner.id} className="flex h-12 w-full flex-col gap-2 py-3">
            <Link href={banner.url} className="w-full">
              {banner.content[lang]}
            </Link>
          </div>
        ))}
    </div>
  );
};

export default Header;
