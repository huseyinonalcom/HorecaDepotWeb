import Head from "next/head";
import useTranslation from "next-translate/useTranslation";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AdminLayout from "../../../components/admin/adminLayout";
import LoadingIndicator from "../../../components/common/loadingIndicator";

export default function Order() {
  const { t, lang } = useTranslation("common");
  const router = useRouter();
  const [currentCollection, setCurrentCollection] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (router.isReady && router.query.id) {
      const idParam = router.query.id;
      let collectionID = Number(idParam);
      if (!Number.isInteger(collectionID) || collectionID <= 0) {
        collectionID = null;
      }

      const fetchOrder = async (orderID: number) => {
        const request = await fetch(
          `/api/collections/public/getcollections?id=${orderID}`
        );
        const response = await request.json();
        if (request.ok) {
          return response;
        } else {
          throw "Failed to fetch collection";
        }
      };

      if (collectionID) {
        fetchOrder(collectionID)
          .then((order) => {
            setCurrentCollection(order);
          })
          .catch((_) => {})
          .finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    }
  }, [router.isReady, router.query.id]);

  if (isLoading) {
    return (
      <>
        <AdminLayout>
          <Head>
            <title>horecadepot</title>
            <meta name="description" content="horecadepot" />
            <meta name="language" content={lang} />
          </Head>
          <div className="w-[95vw] flex flex-row justify-start items-start mx-auto">
            <div className=" mx-auto py-2">
              <LoadingIndicator />
            </div>
          </div>
        </AdminLayout>
      </>
    );
  } else if (!currentCollection) {
    return (
      <>
        <AdminLayout>
          <Head>
            <title>horecadepot</title>
            <meta name="description" content="horecadepot" />
            <meta name="language" content={lang} />
          </Head>
          <div className="w-[95vw] flex flex-row justify-start items-start mx-auto">
            <div className="mx-auto py-2">
              {t("Une erreur s'est produite.")}
            </div>
          </div>
        </AdminLayout>
      </>
    );
  } else {
    const putCollection = async () => {
      const request = await fetch(`/api/payment/createpaymentlink?test=false`, {
        method: "POST",
        body: JSON.stringify(currentCollection),
      });
      if (request.ok) {
        const response = await request.json();
        if (response.url != 0) {
          window.location.href = response.url;
        } else {
        }
      } else {
        throw "Failed to create payment link";
      }
    };

    return (
      <>
        <AdminLayout>
          <Head>
            <title>horecadepot</title>
            <meta name="description" content="horecadepot" />
            <meta name="language" content={lang} />
          </Head>
          <div className="w-[95vw] flex flex-row justify-start items-start mx-auto">
            OK
            {JSON.stringify(currentCollection)}
          </div>
        </AdminLayout>
      </>
    );
  }
}
