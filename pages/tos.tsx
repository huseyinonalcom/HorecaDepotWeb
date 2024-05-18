import Layout from "../components/public/layout";
import Head from "next/head";
import useTranslation from "next-translate/useTranslation";

export default function Legal() {
  const { t, lang } = useTranslation("common");
  return (
    <>
      <Layout>
        <Head>
          <title>horecadepot</title>
          <meta name="description" content="horecadepot" />
          <meta name="language" content={lang} />
        </Head>

        <div className="mx-auto w-full py-2">
          <div
            className={`flex flex-col gap-3 overflow-hidden bg-gray-100 p-4 shadow-lg`}
          ></div>
        </div>
      </Layout>
    </>
  );
}
