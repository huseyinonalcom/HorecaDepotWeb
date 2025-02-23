import Head from "next/head";
import useTranslation from "next-translate/useTranslation";
import Layout from "../components/public/layout";
import ClientLogin from "../components/client/clientLogin";
import { ReactElement } from "react";

export default function Login() {
  const { lang } = useTranslation("common");

  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="language" content={lang} />
      </Head>
      <div className="flex h-[50svh] w-full min-w-[350px] flex-col items-center justify-center">
        <ClientLogin />
      </div>
    </>
  );
}
Login.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
