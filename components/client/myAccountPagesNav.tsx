import { useContext, useEffect } from "react";
import router, { useRouter } from "next/router";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import { ClientContext } from "../../api/providers/clientProvider";

export default function MyAccountPagesNav() {
  const { t, lang } = useTranslation("common");
  const { pathname } = useRouter(); // Get the current pathname
  const { clearClient } = useContext(ClientContext);

  const getNavLinkClass = (href) => {
    const baseClass =
      "font-bold py-1 pl-1 duration-300 w-full hover:bg-gray-200";
    return href === pathname ? `${baseClass} bg-gray-200` : baseClass;
  };

  useEffect(() => {
    setTimeout(async () => {
      const data = await fetch("/api/client/client/checkloggedinuser");
      if (data.status != 200) {
        clearClient();
        router.push("/login");
      }
    }, 300);
  }, []);

  return (
    <div className="flex flex-col items-left w-[200px] justify-start pr-2 border-r border-gray-400 flex-shrink-0 print:hidden">
      <h2 className="font-bold text-2xl pb-2 border-gray-400 border-b mb-4">
        {t("Ma Compte")}
      </h2>
      {/* <Link href={"/account/myaccount"} className={getNavLinkClass("/account/myaccount")}>
        {t("Tableau du bord")}
      </Link> */}
      <Link
        href={"/account/myorders"}
        className={getNavLinkClass("/account/myorders")}
      >
        {t("Mes Commandes")}
      </Link>
      {/* <Link href={"/account/mydetails"} className={getNavLinkClass("/account/mydetails")}>
        {t("Mes Details")}
      </Link> */}
    </div>
  );
}
