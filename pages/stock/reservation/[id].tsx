import { getDocuments } from "../../api/private/documents/universal";
import StockLayout from "../../../components/stock/StockLayout";
import useTranslation from "next-translate/useTranslation";
import Reservation from "../../admin/reservation/[id]";
import { useRouter } from "next/router";
import Head from "next/head";

export default function ReservationStock({
  reservation,
}: {
  reservation?: any;
}) {
  const { t, lang } = useTranslation("common");
  const router = useRouter();

  return (
    <>
      <Head>
        <title>{t("reservation")}</title>
        <meta name="language" content={lang} />
      </Head>
      <Reservation
        id={Number(router.query.id)}
        backUrl="/stock/reservations"
        reservation={reservation}
      />
    </>
  );
}

ReservationStock.getLayout = function getLayout(page: React.ReactNode) {
  return <StockLayout>{page}</StockLayout>;
};

export async function getServerSideProps(context) {
  const req = context.req;
  const query = context.query;
  let reservation = {
    id: 0,
    prefix: "",
    number: "",
    date: "",
    type: "Reservation",
    client: {
      id: 0,
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      company: "",
      taxID: "",
    },
    document_products: [],
  };
  if (query.id && query.id != "0") {
    reservation = await getDocuments({
      authToken: req.cookies.j,
      id: query.id,
    });
  }

  return {
    props: {
      reservation,
    },
  };
}
