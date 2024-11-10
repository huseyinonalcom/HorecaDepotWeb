import Head from "next/head";
import useTranslation from "next-translate/useTranslation";
import Layout from "../../components/public/layout";
import Meta from "../../components/public/meta";
import { useEffect, useState } from "react";
import LoadingIndicator from "../../components/common/loadingIndicator";
import OrderPreview from "../../components/orders/order-preview";
import Link from "next/link";
import { ChevronLeft } from "react-feather";

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
      <div className="mx-auto flex w-full flex-row items-start justify-start">
        <div className="flex w-full flex-col items-center gap-2 pt-2">
          <div className="mb-3 flex w-full flex-row items-center justify-start gap-4">
            <Link href="/account/myaccount" className="group flex text-black">
              <ChevronLeft className="group-hover:animate-bounceHorizontal" />
              <p>{t("Back to Account")}</p>
            </Link>
            <h2 className="text-xl font-semibold">{t("My Orders")}</h2>
          </div>
          <div className="grid-cols grid w-full grid-cols-1 justify-between gap-2 xl:grid-cols-2 2xl:grid-cols-3">
            {isLoading ? (
              <LoadingIndicator />
            ) : allOrders ? (
              allOrders.map((order) => (
                <OrderPreview order={order} key={order.id} />
              ))
            ) : (
              <p>{t("No orders found")}</p>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
