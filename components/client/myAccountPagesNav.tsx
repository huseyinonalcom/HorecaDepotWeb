import { useContext, useEffect } from "react";
import router, { useRouter } from "next/router";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import { ClientContext } from "../../api/providers/clientProvider";
import { AutoTextSize } from "auto-text-size";

export default function MyAccountPagesNav() {
  const { t } = useTranslation("common");
  const { pathname } = useRouter(); // Get the current pathname
  const router = useRouter();
  const { client, clearClient } = useContext(ClientContext);

  const getNavLinkClass = (href) => {
    const baseClass =
      "font-bold py-1 pl-1 duration-300 w-full hover:bg-gray-200";
    return href === pathname ? `${baseClass} bg-gray-200` : baseClass;
  };

  const handleLogOut = async (event) => {
    event.preventDefault();
    clearClient();
    await fetch("/api/client/client/logout").then(() => {});
    router.push("/");
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
    <div className="items-left flex w-[200px] flex-shrink-0 flex-col justify-start border-r border-gray-400 pr-2 print:hidden">
      <h2 className="mb-2 border-b border-gray-400 pb-2 text-2xl font-bold">
        {t("My Account")}
      </h2>
      {client && (
        <>
          <h2 className="w-full py-1 pl-1 font-bold">
            <AutoTextSize maxFontSizePx={12}>
              {client.client_info.firstName + " " + client.client_info.lastName}
            </AutoTextSize>
          </h2>
          <Link
            href={"/"}
            as={"/"}
            onClick={handleLogOut}
            className="w-full py-1 pl-1 font-bold duration-300 hover:bg-gray-200"
          >
            <AutoTextSize maxFontSizePx={12}>
              {t("wrong_user", {
                userName: `${client.client_info.firstName} ${client.client_info.lastName}`,
              })}
            </AutoTextSize>
          </Link>
        </>
      )}
      <Link href={"/"} onClick={handleLogOut}></Link>
      {/* <Link href={"/account/myaccount"} className={getNavLinkClass("/account/myaccount")}>
        {t("Dashboard")}
      </Link> */}
      <Link
        href={"/account/myorders"}
        className={getNavLinkClass("/account/myorders")}
      >
        {t("My Orders")}
      </Link>
      {/* <Link href={"/account/mydetails"} className={getNavLinkClass("/account/mydetails")}>
        {t("My Details")}
      </Link> */}
    </div>
  );
}
