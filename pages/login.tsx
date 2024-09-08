import Head from "next/head";
import useTranslation from "next-translate/useTranslation";
import Layout from "../components/public/layout";
import ClientLogin from "../components/client/clientLogin";

export default function Login() {
  const { t, lang } = useTranslation("common");

  return (
    <Layout>
      <Head>
        <title>Login</title>
        <meta name="language" content={lang} />
      </Head>
      <div className="flex h-[50svh] w-full min-w-[350px] flex-col items-center justify-center">
        <p className="text-2xl font-bold">
          {t("Login to your HorecaDepot account")}
        </p>
        <ClientLogin />
      </div>
    </Layout>
  );
}
