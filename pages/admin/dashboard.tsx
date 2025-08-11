import AdminPanelLayout from "../../components/admin/AdminPanelLayout";
import TopViewedTodayChart from "../../components/charts/topviewedtoday";
import { getTopProductsDay } from "../api/private/products/stats";

export default function Dashboard({ topProductsDay }) {
  return (
    <>
      <TopViewedTodayChart data={topProductsDay} />
    </>
  );
}

Dashboard.getLayout = function getLayout(page) {
  return <AdminPanelLayout title="Dashboard">{page}</AdminPanelLayout>;
};

export async function getServerSideProps() {
  const topProductsDay = await getTopProductsDay({});

  return {
    props: {
      topProductsDay,
    },
  };
}
