import LoadingIndicator from "../components/common/loadingIndicator";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function PaymentVerification() {
  const { t } = useTranslation("common");
  const router = useRouter();

  const [paymentSuccessful, setPaymentSuccessful] = useState(false);
  const [paymentCheckDone, setPaymentCheckDone] = useState(false);
  const [paymentID, setPaymentID] = useState(null);

  useEffect(() => {
    if (router.isReady) {
      try {
        const docID = Number(router.query.id);
        setPaymentID(paymentID);

        const verifyRequest = async () => {
          const request = await fetch(
            `/api/payment/verifypayment?id=${docID}`,
            {
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
              },
            },
          );
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
          setTimeout(() => {
            router.push(`/account/order?id=${docID}`);
          }, 300);
        };

        verifyRequest();
      } catch (_) {
        setPaymentCheckDone(true);
      }
    }
  }, [router.isReady]);

  if (!paymentCheckDone) {
    return (
      <div className="flex h-[90vh] w-[90vw] flex-col items-center justify-center">
        <LoadingIndicator label={t("Payment being checked")} />
      </div>
    );
  } else if (!paymentSuccessful) {
    return (
      <div className="flex h-[90vh] w-[90vw] flex-col items-center justify-center">
        <h2>{t("payment_fail")}</h2>
      </div>
    );
  } else {
    localStorage.removeItem("cart");
    return (
      <div className="flex h-[90vh] w-[90vw] flex-col items-center justify-center">
        <h2>{t("payment_success")}</h2>
      </div>
    );
  }
}
