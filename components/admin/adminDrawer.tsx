import { VscPreview, VscSymbolKeyword } from "react-icons/vsc";
import { MdOutlineTextRotationNone } from "react-icons/md";
import useTranslation from "next-translate/useTranslation";
import { PiBoxArrowUpThin, PiGear } from "react-icons/pi";
import setLanguage from "next-translate/setLanguage";
import { useRouter } from "next/router";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiBookOpen,
  FiGlobe,
  FiGrid,
  FiLogOut,
  FiPackage,
  FiTable,
  FiUsers,
} from "react-icons/fi";

const AdminDrawer = ({ userTier }: { userTier: number }) => {
  const router = useRouter();
  const { t, lang } = useTranslation("common");
  const [showLanguages, setShowLanguages] = useState(false);

  const iconClass = "flex-shrink-0";
  const textClass = "ml-2 h-6 w-full font-bold text-left overflow-hidden";
  const navLinkClass =
    "px-4 py-3 duration-300 font-bold underline-animation-white";
  const navIconDivClass =
    "flex flex-row justify-center min-w-[40px] flex-shrink-0";
  const buttonClass =
    "flex items-center justify-start bg-white py-2 shadow-lg hover:bg-orange-400 overflow-hidden duration-300";

  return (
    <div
      className={`sticky top-0 z-50 h-[100dvh] w-[250px] flex-shrink-0 bg-slate-300 p-4 shadow-[inset_-4px_0_10px_1px_rgba(0,0,0,0.3)] duration-300 print:hidden`}
    >
      <div className="flex h-full flex-col gap-1">
        <nav className="flex h-full flex-col justify-between">
          <div className="flex flex-col gap-1">
            <Link className={buttonClass} href="/admin/stock/all">
              <div className={navIconDivClass}>
                <FiTable className={iconClass} />
              </div>
              <span className={textClass}>{t("Stock")}</span>
            </Link>
            <Link className={buttonClass} href="/admin/orders">
              <div className={navIconDivClass}>
                <FiPackage className={iconClass} />
              </div>
              <span className={textClass}>{t("Orders")}</span>
            </Link>
            <Link className={buttonClass} href="/admin/website/homepage">
              <div className={navIconDivClass}>
                <FiGlobe className={iconClass} />
              </div>
              <span className={textClass}>{t("Homepage")}</span>
            </Link>
            <Link className={buttonClass} href="/admin/website/categories">
              <div className={navIconDivClass}>
                <FiBookOpen className={iconClass} />
              </div>
              <span className={textClass}>{t("Categories")}</span>
            </Link>
            <Link className={buttonClass} href="/admin/website/collections">
              <div className={navIconDivClass}>
                <FiGrid className={iconClass} />
              </div>
              <span className={textClass}>{t("Collections")}</span>
            </Link>
            <Link className={buttonClass} href="/admin/website/banners">
              <div className={navIconDivClass}>
                <VscPreview className={iconClass} />
              </div>
              <span className={textClass}>{t("banners")}</span>
            </Link>
            <Link className={buttonClass} href="/admin/website/banner">
              <div className={navIconDivClass}>
                <MdOutlineTextRotationNone className={iconClass} />
              </div>
              <span className={textClass}>{t("Banner")}</span>
            </Link>
            <Link className={buttonClass} href="/admin/website/popup">
              <div className={navIconDivClass}>
                <PiBoxArrowUpThin className={iconClass} />
              </div>
              <span className={textClass}>{t("Popup")}</span>
            </Link>
            <Link
              className={buttonClass}
              href="/admin/website/bulkkeywordsetter"
            >
              <div className={navIconDivClass}>
                <VscSymbolKeyword className={iconClass} />
              </div>
              <span className={textClass}>{t("Keywords")}</span>
            </Link>
            {userTier == 9 && (
              <>
                <Link className={buttonClass} href="/admin/users">
                  <div className={navIconDivClass}>
                    <FiUsers className={iconClass} />
                  </div>
                  <span className={textClass}>{t("users")}</span>
                </Link>
                <Link className={buttonClass} href="/admin/settings">
                  <div className={navIconDivClass}>
                    <PiGear className={iconClass} />
                  </div>
                  <span className={textClass}>{t("Settings")}</span>
                </Link>
              </>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <div className="relative mr-auto flex flex-row items-center justify-center pl-1 text-sm text-white duration-300">
              <button
                name="showLanguages"
                aria-label="Show Languages"
                onClick={() => setShowLanguages(!showLanguages)}
              >
                <Image
                  src={`/assets/header/${lang.toUpperCase()}.svg`}
                  alt={t("locale")}
                  width={32}
                  height={21.34}
                  style={{ width: "32px", height: "21.34px" }}
                  className="shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                />
              </button>

              <div
                onMouseLeave={() => setShowLanguages(false)}
                className={`absolute bottom-full flex w-[70px] flex-col items-center bg-black shadow-md duration-300 ${
                  showLanguages ? `visible opacity-100` : `invisible opacity-0`
                }`}
              >
                <button
                  name="setLanguageToEN"
                  aria-label="Set Language to English"
                  onClick={async () => await setLanguage("en")}
                  className={`${navLinkClass} ${lang == "en" ? "hidden" : ""}`}
                >
                  <Image
                    src="/assets/header/EN.svg"
                    alt="Flag of the UK"
                    width={32}
                    height={21.34}
                    style={{ width: "32px", height: "21.34px" }}
                    className="shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                  />
                </button>
                <button
                  name="setLanguageToFR"
                  aria-label="Set Language to French"
                  onClick={async () => await setLanguage("fr")}
                  className={`${navLinkClass} ${lang == "fr" ? "hidden" : ""}`}
                >
                  <Image
                    src="/assets/header/FR.svg"
                    alt="Drapeau de la France"
                    width={32}
                    height={21.34}
                    style={{ width: "32px", height: "21.34px" }}
                    className="shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                  />
                </button>
                <button
                  name="setLanguageToNL"
                  aria-label="Set Language to Dutch"
                  onClick={async () => await setLanguage("nl")}
                  className={`${navLinkClass} ${lang == "nl" ? "hidden" : ""}`}
                >
                  <Image
                    src="/assets/header/NL.svg"
                    alt="Vlag van Nederland"
                    width={32}
                    height={21.34}
                    style={{ width: "32px", height: "21.34px" }}
                    className="shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                  />
                </button>
                <button
                  name="setLanguageToDE"
                  aria-label="Set Language to German"
                  onClick={async () => await setLanguage("de")}
                  className={`${navLinkClass} ${lang == "de" ? "hidden" : ""}`}
                >
                  <Image
                    src="/assets/header/DE.svg"
                    alt={"Flagge von Deutschland"}
                    width={32}
                    height={21.34}
                    style={{ width: "32px", height: "21.34px" }}
                    className="shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                  />
                </button>
              </div>
            </div>
            <button
              name="logout"
              aria-label="Logout"
              className={buttonClass + ` mt-auto`}
              onClick={async () => {
                await fetch("/api/admin/logout").then(() => {
                  router.push(`/`);
                });
              }}
            >
              <div className={navIconDivClass}>
                <FiLogOut className={iconClass} />
              </div>
              <span className={textClass}>{t("Logout")}</span>
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default AdminDrawer;
