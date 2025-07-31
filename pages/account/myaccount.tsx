import MyAccountDash from "../../components/client/myAccountDash";
import useTranslation from "next-translate/useTranslation";
import Layout from "../../components/public/layout";
import Meta from "../../components/public/meta";
import Head from "next/head";

export default function MyAccount() {
  const { t, lang } = useTranslation("common");

  return (
    <Layout>
      <Head>
        <Meta />
        <title>Horeca Depot</title>
        <meta name="description" content={t("main_description")} />
        <meta name="language" content={lang} />
      </Head>
      <div className="mx-auto flex min-h-[79vh] w-full flex-row items-start justify-center">
        <MyAccountDash />
      </div>
    </Layout>
  );
}
