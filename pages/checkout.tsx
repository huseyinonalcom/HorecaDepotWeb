import CheckOutInfo from "../components/checkout/checkoutInfo";
import CheckOutCart from "../components/checkout/checkoutCart";
import useTranslation from "next-translate/useTranslation";
import Layout from "../components/public/layout";
import Link from "next/link";
import Head from "next/head";

export default function Checkout() {
  const { t, lang } = useTranslation("common");

  return (
    <Layout>
      <Head>
        <title>Horeca Depot</title>
        <meta name="description" content={t("main_description")} />
        <meta name="language" content={lang} />
      </Head>
      <div className="h-[70px] bg-black shadow-lg flex flex-col justify-around">
        <div className="flex flex-row text-md font-bold items-center justify-center text-gray-300">
          <Link href="/products" className="hover:text-white duration-700">
            {t("SHOP")}
          </Link>
          <p className="font-bold mx-2">/</p>
          <p className="underline decoration-solid decoration-orange-400 decoration-4 underline-offset-8 text-white">
            {t("CHECKOUT")}
          </p>
        </div>
      </div>
      <div className="flex flex-row">
        <div className="w-1/2 shadow-lg my-2 mx-2 rounded p-4">
          <CheckOutInfo />
        </div>
        <div className="w-1/2 shadow-lg my-2 mx-2 rounded p-4">
          <CheckOutCart />
        </div>
      </div>
    </Layout>
  );
}
