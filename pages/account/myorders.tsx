// react and next imports
import Head from "next/head";

// translation imports
import useTranslation from "next-translate/useTranslation";

import Layout from "../../components/public/layout";
import Meta from "../../components/public/meta";
import { useEffect, useState } from "react";
import MyAccountPagesNav from "../../components/client/myAccountPagesNav";
import LoadingIndicator from "../../components/common/loadingIndicator";
import OrderPreview from "../../components/orders/order-preview";

export default function MyOrders() {
  const { t, lang } = useTranslation("common");
  const [allOrders, setAllOrders] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const request = await fetch(`/api/documents/client/getallorders`);
      const response = await request.json();
      if (request.ok) {
        return response;
      } else {
        throw "Failed to fetch orders";
      }
    };

    fetchOrders()
      .then((orders) => {
        setAllOrders(orders);
      })
      .catch((_) => {})
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <Layout>
      <Head>
        <Meta />
        <title>Horeca Depot</title>
        <meta name="description" content={t("main_description")} />
        <meta name="language" content={lang} />
      </Head>
      <div className="flex w-[95vw] flex-row justify-start items-start mx-auto">
        <MyAccountPagesNav />
        <div className="flex flex-col items-center gap-2 w-full">
          <h1 className="text-3xl font-bold">{t("My Orders")}</h1>
          <div className="grid grid-cols grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 w-full justify-between gap-2">
            {isLoading ? (
              <LoadingIndicator />
            ) : allOrders ? (
              allOrders.map((order) => <OrderPreview order={order} key={order.id} />)
            ) : (
              <p>{t("No orders found")}</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
