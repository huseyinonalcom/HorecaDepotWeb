import StockLayout from "../../../components/stock/StockLayout";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";

export default function ReservationStock() {
  const { t, lang } = useTranslation("common");

  return (
    <>
      <Head>
        <title>{t("reservation")}</title>
        <meta name="language" content={lang} />
      </Head>
    </>
  );
}

ReservationStock.getLayout = function getLayout(page: React.ReactNode) {
  return <StockLayout>{page}</StockLayout>;
};
