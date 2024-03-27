import { useEffect, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import LoadingIndicator from "../components/common/loadingIndicator";

export default function Products() {
  const { t } = useTranslation("common");
  const router = useRouter();

  const [paymentCheckDone, setPaymentCheckDone] = useState(false);
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);
  const [paymentID, setPaymentID] = useState(null);

  useEffect(() => {
    if (router.isReady) {
      try {
        const paymentID = Number(router.query.id);
        setPaymentID(paymentID);
        const hostedCheckoutId = router.query.hostedCheckoutId;

        const verifyRequest = async () => {
          const fetchUrl = `/api/payment/verifypayment?paymentid=${paymentID}&ogoneid=${hostedCheckoutId}&test=true`;
          const request = await fetch(fetchUrl, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${process.env.API_KEY}`,
            },
          });
          if (request.ok) {
            const answer = await request.json();
            if (answer.paymentSuccess) {
              setPaymentCheckDone(true);
              setPaymentSuccessful(true);
            } else {
              setPaymentCheckDone(true);
              setPaymentSuccessful(false);
            }
          } else {
            setPaymentCheckDone(true);
          }
        };

        verifyRequest();
      } catch (_) {
        setPaymentCheckDone(true);
      }
    }
  }, [router.isReady]);

  useEffect(() => {
    if (paymentCheckDone) {
      try {
        const findOrder = async () => {
          const request = await fetch(
            `/api/payment/getrelatedorderid?paymentid=${paymentID}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${process.env.API_KEY}`,
              },
            },
          );
          if (request.ok) {
            const answer = await request.json();

            const requestNotif = await fetch(
              "/api/documents/client/sendordernotifications?orderid=" +
                answer.orderID,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Accept: "application/json",
                  Authorization: `Bearer ${process.env.API_KEY}`,
                },
              },
            );

            const notif = await requestNotif.json();

            setTimeout(() => {
              router.push(`/account/order?id=${answer.orderID}`);
            }, 300);
          } else {
            router.push("/account/myorders");
          }
        };
        findOrder();
      } catch (e) {
        router.push("/account/myorders");
      }
    }
  }, [paymentCheckDone]);

  if (!paymentCheckDone) {
    // show something to indicate something is running in the background
    return (
      <div className="flex h-[90vh] w-[90vw] flex-col items-center justify-center">
        <LoadingIndicator label={t("Payment being checked")} />
      </div>
    );
  } else if (!paymentSuccessful) {
    // give choice between re-attempting payment or going to the order page (find order by fetching order related to payment)
    return (
      <div className="flex h-[90vh] w-[90vw] flex-col items-center justify-center">
        <h2>{t("payment_fail")}</h2>
      </div>
    );
  } else {
    // show something to indicate payment succeeded and redirect to the order page (find order by fetching order related to payment)
    return (
      <div className="flex h-[90vh] w-[90vw] flex-col items-center justify-center">
        <h2>{t("payment_success")}</h2>
      </div>
    );
  }
}
