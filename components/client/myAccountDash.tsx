import { ClientContext } from "../../api/providers/clientProvider";
import { FiPackage, FiHeart, FiUser } from "react-icons/fi";
import useTranslation from "next-translate/useTranslation";
import { useContext, useEffect, useState } from "react";
import CustomTheme from "../componentThemes";
import { useRouter } from "next/router";
import Link from "next/link";

export default function MyAccountDash() {
  const { t } = useTranslation("common");
  const [greeting, setGreeting] = useState("");
  const { client, clearClient, isLoading } = useContext(ClientContext);

  const router = useRouter();

  useEffect(() => {
    const localTime = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      hour12: false,
    });
    const hour = parseInt(localTime, 10);

    let greetingMessage = "";
    if (hour >= 5 && hour < 12) {
      greetingMessage = t("Good Morning");
    } else if (hour >= 12 && hour < 18) {
      greetingMessage = t("Good Afternoon");
    } else {
      greetingMessage = t("Good Evening");
    }

    setGreeting(greetingMessage);
  }, [t]);

  const handleLogOut = async (event) => {
    event.preventDefault();
    clearClient();
    await fetch("/api/public/auth/logout").then(() => {});
    router.push("/");
  };

  useEffect(() => {
    if (!isLoading && !client) {
      router.push("/login");
    }
  }, [client, isLoading]);

  if (!client) {
    return (
      <Link className="mt-4" href="/login">
        {t("not_logged_in")}
      </Link>
    );
  }

  return (
    <div className="flex min-h-[50vh] w-full max-w-screen-2xl flex-col items-center justify-start px-4">
      <div className="my-6 flex flex-col gap-4">
        <h2 className="text-3xl">{greeting}</h2>
        <p className="text-3xl font-semibold">{client.client_info.firstName}</p>
        <p className="text-sm">{t("dashboard_intro")}</p>
      </div>
      <div className="mb-3 grid w-fit grid-cols-1 gap-4 lg:grid-cols-3">
        <Link
          href={"/account/myorders"}
          className="group flex flex-col items-center gap-2 rounded-xl border-2 border-black p-6"
        >
          <p className="text-2xl font-semibold">{t("My Orders")}</p>
          <FiPackage
            className="duration-100 ease-in-out group-hover:-translate-y-2"
            size={42}
          />
        </Link>
        <Link
          href={"/wishlist"}
          className="group flex flex-col items-center gap-2 rounded-xl border-2 border-black p-6"
        >
          <p className="text-2xl font-semibold">{t("My Wishlist")}</p>
          <FiHeart
            className="duration-100 ease-in-out group-hover:-translate-y-2"
            size={42}
          />
        </Link>
        <Link
          href={"/account/mydetails"}
          className="group flex flex-col items-center gap-2 rounded-xl border-2 border-black p-6"
        >
          <p className="text-2xl font-semibold">{t("My Personal Details")}</p>
          <FiUser
            className="duration-100 ease-in-out group-hover:-translate-y-2"
            size={42}
          />
        </Link>
      </div>
      <div>
        <p className="">
          {t("wrong_user", {
            userName: `${client.client_info.firstName} ${client.client_info.lastName}`,
          })}
        </p>
        <button
          name="logOut"
          aria-label="Log Out"
          onClick={handleLogOut}
          className={CustomTheme.outlinedButton}
        >
          {t("Log Out")}
        </button>
      </div>
    </div>
  );
}
