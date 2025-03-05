import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AdminDrawer from "./adminDrawer";
import Head from "next/head";

export default function AdminLayout({ children }) {
  const [userTier, setUserTier] = useState(8);
  const { lang } = useTranslation("common");
  const router = useRouter();

  useEffect(() => {
    validateSession();
  }, [router.pathname]);

  const validateSession = async () => {
    const data = await fetch("/api/private/auth/checkloggedinuser");
    const answer = await data.json();
    if (data.status == 200) {
      if (answer.role != "Tier 9" && answer.role != "Tier 8") {
        router.push("/stock/list/all");
      } else {
        setUserTier(Number(answer.role.replaceAll("Tier ", "")));
      }
    } else {
      router.push("/admin");
    }
  };

  return (
    <>
      <Head>
        <meta name="language" content={lang} />
      </Head>
      <main>
        <div className="flex flex-row">
          <AdminDrawer userTier={userTier} />
          <div className="flex-shrink-1 w-full overflow-x-hidden px-2">
            {children}
          </div>
        </div>
      </main>
    </>
  );
}
