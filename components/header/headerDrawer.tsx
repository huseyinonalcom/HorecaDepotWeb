import React, { useContext, useState } from "react";
import {
  ChevronUp,
  Globe,
  Clipboard,
  Heart,
  Info,
  MapPin,
  ShoppingCart,
  X,
} from "react-feather";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { WishlistContext } from "../../api/providers/wishlistProvider";
import Image from "next/image";
import setLanguage from "next-translate/setLanguage";

const HeaderDrawer = ({ onClickOutside, isOpen }) => {
  const { t, lang } = useTranslation("common");
  const [showLanguages, setShowLanguages] = useState(false);
  const { wishlist } = useContext(WishlistContext);
  const drawerClass = isOpen ? "fixed z-50 right-0" : "fixed right-[-100%]";
  const overlayClass = isOpen
    ? "fixed inset-0 bg-black bg-opacity-50 z-40"
    : "fixed right-[-100%]";
  const navButtonsClass = "flex flex-row gap-2 py-3 font-bold items-center";
  const flagButtonsClass = "flex flex-row gap-2 py-2 font-bold items-center";

  return (
    <>
      <div
        className={`${overlayClass} h-screen duration-700`}
        onClick={onClickOutside}
      ></div>
      <div
        className={`${drawerClass} top-0 z-50 h-screen min-w-[310px] overflow-y-auto bg-gray-100 p-5 text-black duration-500`}
      >
        <div className="flex w-full flex-row justify-between py-1">
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
                onClick={async () => await setLanguage("en")}
                className={`${flagButtonsClass} ${
                  lang == "en" ? "hidden" : ""
                }`}
              >
                <Image
                  src={`/assets/header/EN.svg`}
                  alt={t("locale")}
                  width={66}
                  height={44}
                  style={{ width: "66px", height: "44px" }}
                  className="shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                />
              </button>
              <button
                onClick={async () => await setLanguage("fr")}
                className={`${flagButtonsClass} ${
                  lang == "fr" ? "hidden" : ""
                }`}
              >
                <Image
                  src={`/assets/header/FR.svg`}
                  alt={t("locale")}
                  width={66}
                  height={44}
                  style={{ width: "66px", height: "44px" }}
                  className="shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                />
              </button>
              <button
                onClick={async () => await setLanguage("nl")}
                className={`${flagButtonsClass} ${
                  lang == "nl" ? "hidden" : ""
                }`}
              >
                <Image
                  src={`/assets/header/NL.svg`}
                  alt={t("locale")}
                  width={66}
                  height={44}
                  style={{ width: "66px", height: "44px" }}
                  className="shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                />
              </button>
              <button
                onClick={async () => await setLanguage("de")}
                className={`${flagButtonsClass} ${
                  lang == "de" ? "hidden" : ""
                }`}
              >
                <Image
                  src={`/assets/header/DE.svg`}
                  alt={t("locale")}
                  width={66}
                  height={44}
                  style={{ width: "66px", height: "44px" }}
                  className="shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                />
              </button>
              <button
                onClick={async () => await setLanguage("tr")}
                className={`${flagButtonsClass} ${
                  lang == "tr" ? "hidden" : ""
                }`}
              >
                <Image
                  src={`/assets/header/TR.svg`}
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
            href="/products?page=1"
          >
            <ShoppingCart /> {t("Shop")}
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
        </div>
      </div>
    </>
  );
};

export default HeaderDrawer;
