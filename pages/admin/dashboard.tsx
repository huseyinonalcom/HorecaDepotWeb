import useTranslation from "next-translate/useTranslation";
import AdminPanelLayout from "../../components/admin/AdminPanelLayout";
import TopViewedTodayChart from "../../components/charts/topviewedtoday";
import { getTopProductsDay } from "../api/private/products/stats";

export default function Dashboard({ topProductsDay }) {
  return (
    <>
      <TopViewedTodayChart data={topProductsDay} />
      {/* <p>{JSON.stringify(topProductsDay)}</p> */}
    </>
  );
}

Dashboard.getLayout = function getLayout(page) {
  const { t } = useTranslation("common");
  return <AdminPanelLayout title={t("dashboard")}>{page}</AdminPanelLayout>;
};

export async function getServerSideProps() {
  const topProductsDay = await getTopProductsDay({});

  return {
    props: {
      topProductsDay,
    },
  };
}
