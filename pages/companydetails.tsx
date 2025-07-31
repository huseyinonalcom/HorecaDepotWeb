import useTranslation from "next-translate/useTranslation";
import Layout from "../components/public/layout";
import Head from "next/head";

export default function Legal() {
  const { lang } = useTranslation("common");
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
          >
            <p>Détails de L’entreprise</p>
            <p>ATK BVBA agissant sous la dénomination: HorecaDepot</p>
            <p>Adresse: Rue de Ribaucourt 154, 1080, Bruxelles</p>
            <p>TVA-BTW BE 0696.624.603</p>
            <p>info@horecadepot.be</p>
          </div>
        </div>
      </Layout>
    </>
  );
}
