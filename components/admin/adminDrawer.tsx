import React, { useContext, useState } from "react";
import { AdminDrawerContext } from "../../api/providers/adminDrawerProvider";
import {
  ChevronLeft,
  DollarSign,
  Globe,
  Home,
  Lock,
  LogOut,
  Package,
  Settings,
  Table,
} from "react-feather";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import setLanguage from "next-translate/setLanguage";
import { useRouter } from "next/navigation";
import Image from "next/image";

const AdminDrawer = () => {
  const router = useRouter();
  const { t, lang } = useTranslation("common");
  const [showLanguages, setShowLanguages] = useState(false);
  const { isAdminDrawerOpen, closeAdminDrawer, openAdminDrawer } =
    useContext(AdminDrawerContext);

  const iconClass = "flex-shrink-0";
  const textClass = "ml-2 h-6 w-full font-bold text-left overflow-hidden";
  const drawerClass = isAdminDrawerOpen ? `w-[250px]` : `w-[73px] min-w-[73px]`;
  const navLinkClass =
    "px-4 py-3 duration-300 font-bold underline-animation-white";
  const navIconDivClass =
    "flex flex-row justify-center min-w-[40px] flex-shrink-0";
  const buttonClass =
    "flex items-center justify-start bg-white py-2 shadow-lg hover:bg-orange-400 overflow-hidden duration-500";
  return (
    <div
      className={`${drawerClass} z-50 h-[100dvh] flex-shrink-0 bg-slate-300 p-4 shadow-[inset_-4px_0_10px_1px_rgba(0,0,0,0.3)] duration-700 print:hidden`}
    >
      <div className="flex h-full flex-col gap-1">
        <nav className="flex h-full flex-col justify-between">
          <div className="flex flex-col gap-1">
            <button
              className="mb-2 ml-auto flex w-[30px] flex-row justify-center bg-black text-white shadow-lg  duration-500 hover:bg-orange-400"
              onClick={isAdminDrawerOpen ? closeAdminDrawer : openAdminDrawer}
            >
              <ChevronLeft
                className={`duration-700 ${isAdminDrawerOpen ? "rotate-360" : "rotate-180"}`}
              />
            </button>
            {/* <Link className={buttonClass} href="/admin/dashboard">
            <div className={navIconDivClass}>
              <Home className={iconClass} />
            </div>
            <span className={textClass}>{t("Dashboard")}</span>
          </Link> */}
            <Link className={buttonClass} href="/admin/products">
              <div className={navIconDivClass}>
                <Table className={iconClass} />
              </div>
              <span className={textClass}>{t("Stock")}</span>
            </Link>
            <Link className={buttonClass} href="/admin/orders">
              <div className={navIconDivClass}>
                <Package className={iconClass} />
              </div>
              <span className={textClass}>{t("Orders")}</span>
            </Link>
            <Link className={buttonClass} href="/admin/documents/reservations">
              <div className={navIconDivClass}>
                <Lock className={iconClass} />
              </div>
              <span className={textClass}>{t("Reservations")}</span>
            </Link>
            <Link className={buttonClass} href="/admin/website">
              <div className={navIconDivClass}>
                <Globe className={iconClass} />
              </div>
              <span className={textClass}>{t("Website")}</span>
            </Link>

            {/* <Link className={buttonClass} href="/admin/payments">
            <div className={navIconDivClass}>
              <DollarSign className={iconClass} />
            </div>
            <span className={textClass}>{t("Payments")}</span>
          </Link> */}
          </div>
          <div className="flex flex-col gap-1">
            <div className="relative mr-auto flex flex-row items-center justify-center pl-1 text-sm text-white duration-300">
              <button onClick={() => setShowLanguages(!showLanguages)}>
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
                  onClick={async () => await setLanguage("en")}
                  className={`${navLinkClass} ${lang == "en" ? "hidden" : ""}`}
                >
                  <Image
                    src={`/assets/header/EN.svg`}
                    alt={"Flag of the UK"}
                    width={32}
                    height={21.34}
                    style={{ width: "32px", height: "21.34px" }}
                    className="shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                  />
                </button>
                <button
                  onClick={async () => await setLanguage("fr")}
                  className={`${navLinkClass} ${lang == "fr" ? "hidden" : ""}`}
                >
                  <Image
                    src={`/assets/header/FR.svg`}
                    alt={"Drapeau de la France"}
                    width={32}
                    height={21.34}
                    style={{ width: "32px", height: "21.34px" }}
                    className="shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                  />
                </button>
                <button
                  onClick={async () => await setLanguage("nl")}
                  className={`${navLinkClass} ${lang == "nl" ? "hidden" : ""}`}
                >
                  <Image
                    src={`/assets/header/NL.svg`}
                    alt={"Vlag van Nederland"}
                    width={32}
                    height={21.34}
                    style={{ width: "32px", height: "21.34px" }}
                    className="shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                  />
                </button>
                <button
                  onClick={async () => await setLanguage("DE")}
                  className={`${navLinkClass} ${lang == "de" ? "hidden" : ""}`}
                >
                  <Image
                    src={`/assets/header/DE.svg`}
                    alt={"Flagge von Deutschland"}
                    width={32}
                    height={21.34}
                    style={{ width: "32px", height: "21.34px" }}
                    className="shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                  />
                </button>
                <button
                  onClick={async () => await setLanguage("tr")}
                  className={`${navLinkClass} ${lang == "tr" ? "hidden" : ""}`}
                >
                  <Image
                    src={`/assets/header/TR.svg`}
                    alt={"Türk bayrağı"}
                    width={32}
                    height={21.34}
                    style={{ width: "32px", height: "21.34px" }}
                    className="shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                  />
                </button>
              </div>
            </div>
            <button
              className={buttonClass + ` mt-auto`}
              onClick={async () => {
                await fetch("/api/admin/logout").then(() => {
                  router.push(`/`);
                });
              }}
            >
              <div className={navIconDivClass}>
                <LogOut className={iconClass} />
              </div>
              <span className={textClass}>{t("Logout")}</span>
            </button>
            {/* <Link className={`${buttonClass}`} href="/admin/settings">
            <div className={navIconDivClass}>
              <Settings className={iconClass} />
            </div>
            <span className={textClass}>{t("Configuration")}</span>
          </Link> */}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default AdminDrawer;
<div className="ml-auto cursor-pointer bg-black p-[5px] text-white duration-500 hover:bg-orange-400"></div>;
