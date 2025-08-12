import AdminPanelLayout from "../../components/admin/AdminPanelLayout";
import TopViewedChart from "../../components/charts/topviewedtoday";
import useTranslation from "next-translate/useTranslation";
import {
  getTopProductsWeek,
  getTopProductsDay,
} from "../api/private/products/stats";

export default function Dashboard({ topProductsDay, topProductsWeek }) {
  const { t } = useTranslation("common");
  return (
    <div className="flex flex-col gap-4">
      <TopViewedChart data={topProductsDay} />
      <TopViewedChart data={topProductsWeek} title={t("most-viewed-week")} />
      {/* <p>{JSON.stringify(topProductsDay)}</p> */}
    </div>
  );
}

Dashboard.getLayout = function getLayout(page) {
  const { t } = useTranslation("common");
  return <AdminPanelLayout title={t("dashboard")}>{page}</AdminPanelLayout>;
};

export async function getServerSideProps() {
  const topProductsDay = await getTopProductsDay({});
  const topProductsWeek = await getTopProductsWeek({});

  return {
    props: {
      topProductsDay,
      topProductsWeek,
    },
  };
}
