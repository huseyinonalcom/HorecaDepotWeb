// react and next imports
import Head from "next/head";

// translation imports
import useTranslation from "next-translate/useTranslation";

import Layout from "../../components/public/layout";
import Meta from "../../components/public/meta";
import { useEffect, useState } from "react";
import LoadingIndicator from "../../components/common/loadingIndicator";

export default function MyDetails() {
  // translation
  const { t, lang } = useTranslation("common");
  const [clientDetails, setClientDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const request = await fetch(`/api/client/client/getclientdetails`);
      const response = await request.json();
      if (request.ok) {
        return response;
      } else {
        throw "Failed to fetch client details.";
      }
    };

    fetchOrders()
      .then((details) => {
        setClientDetails(details);
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
        <div className="ml-4 flex w-full flex-col gap-4">
          {isLoading ? (
            <LoadingIndicator />
          ) : clientDetails ? (
            <>
              <h2>
                {clientDetails.client_info.firstName}{" "}
                {clientDetails.client_info.lastName}
              </h2>
              {/* <p>Date: {formatDateAPIToBe(order.date)}</p>
              <p>
                Total: €{" "}
                {order.document_products
                  .reduce((total, product) => total + product.subTotal, 0)
                  .toFixed(2)
                  .replaceAll(".", ",")}
              </p>
              <p>
                À payer: €{" "}
                {(
                  order.document_products.reduce((total, product) => total + product.subTotal, 0) -
                  order.payments.reduce((total, payment) => total + (payment.deleted || !payment.verified ? 0 : payment.value), 0)
                )
                  .toFixed(2)
                  .replaceAll(".", ",")}
              </p> */}
            </>
          ) : (
            <p>{t(`An error has occurred.`)}</p>
          )}
        </div>
      </div>
    </Layout>
  );
}
