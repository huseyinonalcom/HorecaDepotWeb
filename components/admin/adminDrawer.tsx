import React, { useContext, useState } from "react";
import { AdminDrawerContext } from "../../api/providers/adminDrawerProvider";
import {
  ChevronRight,
  DollarSign,
  Globe,
  Home,
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
  const { isAdminDrawerOpen, closeAdminDrawer, openAdminDrawer } =
    useContext(AdminDrawerContext);
  const [showLanguages, setShowLanguages] = useState(false);
  const navLinkClass =
    "px-4 py-3 duration-300 font-bold underline-animation-white";

  const drawerClass = isAdminDrawerOpen ? `w-[250px]` : `w-[73px] min-w-[73px]`;
  const buttonClass =
    "flex items-center justify-start bg-white py-2 rounded shadow-lg hover:bg-orange-400 overflow-hidden duration-500";
  const iconClass = "flex-shrink-0";
  const navIconDivClass =
    "flex flex-row justify-center min-w-[40px] flex-shrink-0";
  const textClass = "ml-2 h-6 w-full font-bold text-left overflow-hidden";
  return (
    <div
      className={`${drawerClass} print:hidden duration-700 shadow-[inset_-4px_0_10px_1px_rgba(0,0,0,0.3)] flex-shrink-0 h-[100dvh] bg-slate-300 p-4 z-50`}
    >
      <div className="flex flex-col h-full gap-1">
        <nav className="flex flex-col h-full justify-between">
          <div className="flex flex-col gap-1">
            <button
              className="ml-auto w-[30px] rounded flex flex-row justify-center mb-2 bg-black text-white shadow-lg  hover:bg-orange-400 duration-500"
              onClick={isAdminDrawerOpen ? closeAdminDrawer : openAdminDrawer}
            >
              <ChevronRight
                className={`duration-700 ${
                  isAdminDrawerOpen ? "rotate-180" : ""
                }`}
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
              <span className={textClass}>{t("Commandes")}</span>
            </Link>
            <Link className={buttonClass} href="/admin/website">
              <div className={navIconDivClass}>
                <Globe className={iconClass} />
              </div>
              <span className={textClass}>{t("Site Web")}</span>
            </Link>
            {/* <Link className={buttonClass} href="/admin/payments">
            <div className={navIconDivClass}>
              <DollarSign className={iconClass} />
            </div>
            <span className={textClass}>{t("Paiements")}</span>
          </Link> */}
          </div>
          <div className="flex flex-col gap-1">
            <div className="relative flex flex-row pl-1 mr-auto items-center justify-center text-white duration-300 text-sm">
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
                className={`absolute w-[70px] bottom-full flex flex-col items-center bg-black duration-300 shadow-md ${
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
              <span className={textClass}>{t("Déconnecter")}</span>
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
<div className="p-[5px] duration-500 ml-auto rounded bg-black text-white hover:bg-orange-400 cursor-pointer"></div>;
