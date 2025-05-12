import StockLayout from "../../../components/stock/StockLayout";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import Reservation from "../../admin/reservation/[id]";
import { useRouter } from "next/router";

export default function ReservationStock() {
  const { t, lang } = useTranslation("common");
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{t("reservation")}</title>
        <meta name="language" content={lang} />
      </Head>
      <Reservation id={Number(router.query.id)} backUrl="/stock/reservations" />
    </>
  );
}

ReservationStock.getLayout = function getLayout(page: React.ReactNode) {
  return <StockLayout>{page}</StockLayout>;
};
