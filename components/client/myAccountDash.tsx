import { useContext, useEffect, useState } from "react";
import { ClientContext } from "../../api/providers/clientProvider";
import useTranslation from "next-translate/useTranslation";
import { Heart, Package, User } from "react-feather";
import Link from "next/link";
import { useRouter } from "next/router";

export default function MyAccountDash() {
  const { t } = useTranslation("common");
  const [greeting, setGreeting] = useState("");
  const { client, clearClient } = useContext(ClientContext);
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
    await fetch("/api/client/client/logout").then(() => {});
    router.push("/");
  };

  useEffect(() => {
    if (!client) {
      router.push("/login");
    }
  }, [client, router]);

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
          <Package
            className="duration-100 ease-in-out group-hover:-translate-y-2"
            size={42}
          />
        </Link>
        <Link
          href={"/wishlist"}
          className="group flex flex-col items-center gap-2 rounded-xl border-2 border-black p-6"
        >
          <p className="text-2xl font-semibold">{t("My Wishlist")}</p>
          <Heart
            className="duration-100 ease-in-out group-hover:-translate-y-2"
            size={42}
          />
        </Link>
        <Link
          href={"/account/mydetails"}
          className="group flex flex-col items-center gap-2 rounded-xl border-2 border-black p-6"
        >
          <p className="text-2xl font-semibold">{t("My Personal Details")}</p>
          <User
            className="duration-100 ease-in-out group-hover:-translate-y-2"
            size={42}
          />
        </Link>
      </div>
      <Link
        href={"/"}
        as={"/"}
        onClick={handleLogOut}
        className="py-1 font-bold duration-300"
      >
        <p className="text-sm">
          {t("wrong_user", {
            userName: `${client.client_info.firstName} ${client.client_info.lastName}`,
          })}
        </p>
      </Link>
    </div>
  );
}
