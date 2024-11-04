import Head from "next/head";
import useTranslation from "next-translate/useTranslation";
import Layout from "../../components/public/layout";
import { useEffect, useState } from "react";
import LoadingIndicator from "../../components/common/loadingIndicator";
import { useRouter } from "next/router";
import CustomTheme from "../../components/componentThemes";
import { formatDateAPIToBe } from "../../api/utils/formatters/formatdateapibe";
import componentThemes from "../../components/componentThemes";
import Image from "next/image";
import TypeWriter from "../../components/common/typewriter";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { PDFInvoice } from "../../components/pdf/pdfinvoice";
import ClientLogin from "../../components/client/clientLogin";

export default function Order() {
  const { t, lang } = useTranslation("common");
  const router = useRouter();
  const [currentOrder, setCurrentOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [verificationRunning, setVerificationRunning] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState(null);

  useEffect(() => {
    if (router.isReady && router.query.id) {
      const idParam = router.query.id;
      let orderID = Number(idParam);
      if (!Number.isInteger(orderID) || orderID <= 0) {
        orderID = null;
      }

      const fetchOrder = async (orderID: number) => {
        const request = await fetch(
          `/api/checkout/client/orderdetails?order=${orderID}`,
        );
        const response = await request.json();
        if (request.ok) {
          return response;
        } else {
          throw "Failed to fetch order";
        }
      };

      if (orderID) {
        fetchOrder(orderID)
          .then((order) => {
            setCurrentOrder(order);
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
        <Layout>
          <Head>
            <title>horecadepot</title>
            <meta name="description" content="horecadepot" />
            <meta name="language" content={lang} />
          </Head>
          <div className="mx-auto flex w-full flex-row items-start justify-start">
            <div className=" mx-auto py-2">
              <LoadingIndicator />
            </div>
          </div>
        </Layout>
      </>
    );
  } else if (!currentOrder) {
    return (
      <>
        <Layout>
          <Head>
            <title>horecadepot</title>
            <meta name="description" content="horecadepot" />
            <meta name="language" content={lang} />
          </Head>
          <div className="mx-auto flex w-full flex-row items-center justify-center">
            <ClientLogin onLogin={() => window.location.reload()} />
          </div>
        </Layout>
      </>
    );
  } else {
    let totalSubTotal = currentOrder.document_products.reduce(
      (accumulator, currentItem) => {
        return accumulator + currentItem.subTotal;
      },
      0,
    );

    let totalPayments = currentOrder.payments
      .filter((pay) => pay.verified && !pay.deleted)
      .reduce((accumulator, currentItem) => {
        return accumulator + currentItem.value;
      }, 0);

    let balance = totalSubTotal - totalPayments;

    const submitPayment = async () => {
      const request = await fetch(
        `/api/payment/createpaymentlink?test=false&provider=mollie`,
        {
          method: "POST",
          body: JSON.stringify(currentOrder),
        },
      );
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

    const submitCheckPayment = async () => {
      setVerificationRunning(true);
      setVerificationMessage(null);
      await fetch(`/api/payment/verifypayment?id=${currentOrder.id}`, {
        method: "POST",
        body: JSON.stringify(currentOrder),
      }).then(() => {
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      });
    };

    return (
      <>
        <Layout>
          <Head>
            <title>Horeca Depot</title>
          </Head>
          <div className="mx-auto flex w-full flex-row items-start justify-start">
            <div className="w-full bg-white p-2 shadow-lg">
              <div className="flex flex-col justify-between">
                <div className={`relative mt-2 hidden h-[64px] w-[358px]`}>
                  <Image
                    src={"/assets/header/logo.png"}
                    style={{ objectFit: "contain" }}
                    fill
                    alt="HorecaDepot Logo"
                  />
                </div>
                <div className="flex flex-col">
                  <h1 className="text-2xl font-bold">{currentOrder.type}</h1>
                  <h2 className="text-xl font-bold">
                    {currentOrder.prefix + currentOrder.number}
                  </h2>
                  <h3 className="text-lg font-bold">
                    {formatDateAPIToBe(currentOrder.date)}
                  </h3>
                </div>
                <div className="flex flex-shrink-0 flex-col items-center gap-2">
                  {balance > 0 && (
                    <>
                      {verificationMessage && verificationMessage}

                      {verificationRunning ? (
                        <button
                          className={`${CustomTheme.greenSubmitButton} whitespace-nowrap text-xl`}
                        >
                          <div className="flex w-[100px] flex-row justify-start">
                            <TypeWriter textTypeWriter={["...."]} />
                          </div>
                        </button>
                      ) : (
                        <button
                          className={`${CustomTheme.greenSubmitButton} whitespace-nowrap text-xl`}
                          onClick={submitCheckPayment}
                        >
                          {t("Verify payment")}
                        </button>
                      )}
                      <button
                        className={`${CustomTheme.greenSubmitButton} whitespace-nowrap text-xl`}
                        onClick={submitPayment}
                      >
                        {t("Proceed to payment")}
                      </button>
                    </>
                  )}
                  {currentOrder && (
                    <PDFDownloadLink
                      fileName={currentOrder.prefix + currentOrder.number}
                      document={<PDFInvoice invoiceDocument={currentOrder} />}
                      className={`${componentThemes.greenSubmitButton} flex flex-row items-center justify-center whitespace-nowrap text-xl`}
                    >
                      📄 <p className="ml-1">{t("Download PDF")}</p>
                    </PDFDownloadLink>
                  )}
                </div>
              </div>
              <div className="flex flex-row gap-6 pt-2">
                <div className="flex flex-col">
                  {currentOrder.client.category == "Entreprise" ? (
                    <>
                      <h4 className=" font-bold">{t("invoiced_to")}:</h4>
                      <p className="">{currentOrder.client.company}</p>
                      <p className="">{currentOrder.client.taxID}</p>
                      <p className="">{`${currentOrder.client.firstName} ${currentOrder.client.lastName}`}</p>
                      <p className="">{currentOrder.client.phone}</p>
                    </>
                  ) : (
                    <>
                      <h4 className=" font-bold">{t("invoiced_to")}:</h4>
                      <p className="">{`${currentOrder.client.firstName} ${currentOrder.client.lastName}`}</p>
                      <p className="">{currentOrder.client.phone}</p>
                    </>
                  )}
                </div>
                <div className="flex flex-col">
                  <h4 className=" font-bold">{t("invoiced_address")}:</h4>
                  <p className="">{`${currentOrder.docAddress.street} ${currentOrder.docAddress.doorNumber}`}</p>
                  <p className="">{`${currentOrder.docAddress.zipCode} ${currentOrder.docAddress.city}`}</p>
                  <p className="">{`${currentOrder.docAddress.province ?? ""} ${
                    currentOrder.docAddress.country
                  }`}</p>
                  {currentOrder.docAddress.floor ? (
                    <p className="">
                      {t("floor")}: {currentOrder.docAddress.floor}
                    </p>
                  ) : (
                    <></>
                  )}
                </div>
                <div className="flex flex-col">
                  <h4 className=" font-bold">{t("delivery")}:</h4>
                  <p className="">{`${currentOrder.delAddress.street} ${currentOrder.delAddress.doorNumber}`}</p>
                  <p className="">{`${currentOrder.delAddress.zipCode} ${currentOrder.delAddress.city}`}</p>
                  <p className="">{`${currentOrder.delAddress.province ?? ""} ${
                    currentOrder.delAddress.country
                  }`}</p>
                  {currentOrder.delAddress.floor ? (
                    <p className="">
                      {t("floor")}: {currentOrder.delAddress.floor}
                    </p>
                  ) : (
                    <></>
                  )}
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="mt-3 bg-gray-100 shadow-lg">
                  <thead className="border-b-2 border-black">
                    <tr>
                      <th>{t("Name")}</th>
                      <th>{t("Quantity")}</th>
                      <th>{t("Price")}</th>
                      <th>{t("Discount")}</th>
                      <th>{t("Subtotal")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentOrder.document_products.map(
                      (documentProduct, index) => (
                        <tr
                          key={index}
                          className={`${index % 2 === 0 ? "bg-slate-300" : ""}`}
                        >
                          <td>{documentProduct.name}</td>
                          <td align="center">{documentProduct.amount}</td>
                          <td align="right">
                            €{" "}
                            {documentProduct.value
                              .toFixed(2)
                              .replaceAll(".", ",")}
                          </td>
                          <td align="right">
                            €{" "}
                            {documentProduct.discount
                              .toFixed(2)
                              .replaceAll(".", ",")}
                          </td>
                          <td align="right">
                            €{" "}
                            {documentProduct.subTotal
                              .toFixed(2)
                              .replaceAll(".", ",")}
                          </td>
                        </tr>
                      ),
                    )}
                    <tr>
                      <td></td>
                      <td>
                        <b>{t("Total")}</b>
                      </td>
                      <td align="right">
                        <b>
                          €{" "}
                          {currentOrder.document_products
                            .reduce((accumulator, currentItem) => {
                              return accumulator + currentItem.subTotal;
                            }, 0)
                            .toFixed(2)
                            .replaceAll(".", ",")}
                        </b>
                      </td>
                      <td>
                        <b>{t("To pay")}</b>
                      </td>
                      <td align="right">
                        <b>
                          €{" "}
                          {(
                            currentOrder.document_products.reduce(
                              (accumulatedSubTotal, currentDocProd) => {
                                return (
                                  accumulatedSubTotal + currentDocProd.subTotal
                                );
                              },
                              0,
                            ) -
                            currentOrder.payments
                              .filter(
                                (payment) =>
                                  !payment.deleted && payment.verified,
                              )
                              .reduce((accumulatedPayments, currentPayment) => {
                                return (
                                  accumulatedPayments + currentPayment.value
                                );
                              }, 0)
                          )
                            .toFixed(2)
                            .replaceAll(".", ",")}
                        </b>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {balance > 0 && (
                <div className="flex flex-row">
                  <div className="ml-auto">
                    <button
                      className={`${CustomTheme.greenSubmitButton} whitespace-nowrap text-xl`}
                      onClick={submitPayment}
                    >
                      {t("Proceed to payment")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Layout>
      </>
    );
  }
}
