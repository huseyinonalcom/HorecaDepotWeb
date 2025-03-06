import AdminPanelLayout from "../../components/admin/AdminPanelLayout";
import Head from "next/head";

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
    </>
  );
}

Dashboard.getLayout = function getLayout(page) {
  return <AdminPanelLayout title="Dashboard">{page}</AdminPanelLayout>;
};
