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
      <div className="flex h-[50px] flex-col justify-around bg-black shadow-lg">
        <div className="text-md flex flex-row items-center justify-center font-bold text-gray-300">
          <Link href="/products" className="duration-700 hover:text-white">
            {t("SHOP")}
          </Link>
          <p className="mx-2 font-bold">/</p>
          <p className="text-white underline decoration-orange-400 decoration-4 underline-offset-8">
            {t("CHECKOUT")}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div className="order-2 my-2 p-4 shadow-lg sm:order-1">
          <CheckOutInfo />
        </div>
        <div className="order-1 my-2 p-4 shadow-lg sm:order-2">
          <CheckOutCart />
        </div>
      </div>
    </Layout>
  );
}
