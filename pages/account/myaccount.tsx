// react and next imports
import Head from "next/head";

// translation imports
import useTranslation from "next-translate/useTranslation";

import Layout from "../../components/public/layout";
import Meta from "../../components/public/meta";
import { useEffect } from "react";
import router from "next/router";
import MyAccountPagesNav from "../../components/client/myAccountPagesNav";
import MyAccountDash from "../../components/client/myAccountDash";

export default function MyAccount() {
  // translation
  const { t, lang } = useTranslation("common");

  return (
    <Layout>
      <Head>
        <Meta />
        <title>Horeca Depot</title>
        <meta name="description" content={t("main_description")} />
        <meta name="language" content={lang} />
      </Head>
      <div className="mx-auto flex w-[90vw] flex-row items-start justify-start">
        <MyAccountPagesNav />
        <MyAccountDash />
      </div>
    </Layout>
  );
}
