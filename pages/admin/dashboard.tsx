import AdminPanelLayout from "../../components/admin/AdminPanelLayout";
import { getTopProductsDay } from "../api/private/products/stats";

export default function Dashboard({ topProductsDay }) {
  return (
    <>
      <p>{JSON.stringify(topProductsDay)}</p>
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
