import { formatDateAPIToBe } from "../../api/utils/formatters/formatdateapibe";
import { formatCurrency } from "../../api/utils/formatters/formatcurrency";
import LoadingIndicator from "../../components/common/loadingIndicator";
import AdminPanelLayout from "../../components/admin/AdminPanelLayout";
import componentThemes from "../../components/componentThemes";
import { PDFInvoice } from "../../components/pdf/pdfinvoice";
import TypeWriter from "../../components/common/typewriter";
import useTranslation from "next-translate/useTranslation";
import CustomTheme from "../../components/componentThemes";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from "../../components/styled/table";
import Card from "../../components/universal/Card";

export default function Order({ id }: { id?: number }) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [currentOrder, setCurrentOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if ((router.isReady && router.query.id) || id) {
      const idParam = router.query.id || id;
      let orderID = Number(idParam);
      if (!Number.isInteger(orderID) || orderID <= 0) {
        orderID = null;
      }

      const fetchOrder = async (orderID: number) => {
        const request = await fetch(
          `/api/private/documents/universal?id=${orderID}`,
        );
        const response = await request.json();
        if (request.ok) {
          return response.data;
        } else {
          throw "Failed to fetch order";
        }
      };

      if (orderID) {
        fetchOrder(orderID)
          .then((order) => {
            if (!order.docAddress) {
              order.docAddress = order.delAddress;
            }
            setCurrentOrder(order);
          })
          .catch((_) => {})
          .finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    }
  }, [router.isReady, router.query.id]);

  const [verificationRunning, setVerificationRunning] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState(null);

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

  if (isLoading) {
    return (
      <>
        <Head>
          <title>{t("order")}</title>
        </Head>
        <div className="mx-auto py-2">
          <LoadingIndicator />
        </div>
      </>
    );
  } else if (!currentOrder) {
    return (
      <>
        <Head>
          <title>{t("order")}</title>
        </Head>
        <div className="mx-auto py-2">{t("An error has occurred.")}</div>
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
    return (
      <>
        <Head>
          <title>{t("order")}</title>
        </Head>
        <Card>
          <div className="flex flex-row justify-between">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold">{currentOrder.type}</h1>
              <h2 className="text-xl font-bold">
                {currentOrder.prefix + currentOrder.number}
              </h2>
              <h3 className="text-lg font-bold">
                {formatDateAPIToBe(currentOrder.date)}
              </h3>
            </div>
            <div className="flex flex-shrink-0 flex-row items-center gap-2">
              {balance > 0 && (
                <>
                  {!!verificationMessage && verificationMessage}

                  {verificationRunning ? (
                    <button
                      className={`${CustomTheme.outlinedButton} text-xl whitespace-nowrap`}
                    >
                      <div className="flex w-[100px] flex-row justify-start">
                        <TypeWriter textTypeWriter={["...."]} />
                      </div>
                    </button>
                  ) : (
                    <button
                      className={`${CustomTheme.outlinedButton} text-xl whitespace-nowrap`}
                      onClick={submitCheckPayment}
                    >
                      {t("Verify payment")}
                    </button>
                  )}
                </>
              )}

              {currentOrder && (
                <PDFDownloadLink
                  fileName={currentOrder.prefix + currentOrder.number}
                  document={<PDFInvoice invoiceDocument={currentOrder} />}
                  className={`${componentThemes.outlinedButton} flex flex-row items-center text-xl whitespace-nowrap`}
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
                  <h4 className="font-bold">Facturé à:</h4>
                  <p className="">{currentOrder.client.company}</p>
                  <p className="">{currentOrder.client.taxID}</p>
                  <p className="">{`${currentOrder.client.firstName} ${currentOrder.client.lastName}`}</p>
                  <p className="">{currentOrder.client.phone}</p>
                </>
              ) : (
                <>
                  <h4 className="font-bold">Facturé à:</h4>
                  <p className="">{`${currentOrder.client.firstName} ${currentOrder.client.lastName}`}</p>
                  <p className="">{currentOrder.client.phone}</p>
                </>
              )}
            </div>
            <div className="flex flex-col">
              <h4 className="font-bold">Addresse Facture:</h4>
              <p className="">{`${currentOrder.docAddress.street} ${currentOrder.docAddress.doorNumber}`}</p>
              <p className="">{`${currentOrder.docAddress.zipCode} ${currentOrder.docAddress.city}`}</p>
              <p className="">{`${currentOrder.docAddress.province ?? ""} ${
                currentOrder.docAddress.country
              }`}</p>
              {currentOrder.docAddress.floor ? (
                <p className="">Étage: {currentOrder.docAddress.floor}</p>
              ) : (
                <></>
              )}
            </div>
            <div className="flex flex-col">
              <h4 className="font-bold">Livraison:</h4>
              <p className="">{`${currentOrder.delAddress.street} ${currentOrder.delAddress.doorNumber}`}</p>
              <p className="">{`${currentOrder.delAddress.zipCode} ${currentOrder.delAddress.city}`}</p>
              <p className="">{`${currentOrder.delAddress.province ?? ""} ${
                currentOrder.delAddress.country
              }`}</p>
              {currentOrder.delAddress.floor ? (
                <p className="">Étage: {currentOrder.delAddress.floor}</p>
              ) : (
                <></>
              )}
            </div>
          </div>
          <Table striped>
            <TableHead>
              <TableRow>
                <TableHeader>{t("Internal Code")}</TableHeader>
                <TableHeader>{t("Name")}</TableHeader>
                <TableHeader>{t("Color")}</TableHeader>
                <TableHeader>{t("Quantity")}</TableHeader>
                <TableHeader>{t("Price")}</TableHeader>
                <TableHeader>{t("Discount")}</TableHeader>
                <TableHeader>{t("Subtotal")}</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {currentOrder.document_products.map((documentProduct) => (
                <TableRow key={documentProduct.id}>
                  <TableCell>
                    {documentProduct.product?.internalCode ?? ""}
                  </TableCell>
                  <TableCell>{documentProduct.name}</TableCell>
                  <TableCell>{documentProduct.product?.color ?? ""}</TableCell>
                  <TableCell align="center">{documentProduct.amount}</TableCell>
                  <TableCell align="right">
                    {formatCurrency(documentProduct.value)}
                  </TableCell>
                  <TableCell align="right">
                    {formatCurrency(documentProduct.discount)}
                  </TableCell>
                  <TableCell align="right">
                    {formatCurrency(documentProduct.subTotal)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Table className="ml-auto w-fit">
            <TableBody>
              <TableRow>
                <TableCell>
                  <b>{t("Total")}</b>
                </TableCell>
                <TableCell>
                  <b>
                    {formatCurrency(
                      currentOrder.document_products.reduce(
                        (accumulator, currentItem) => {
                          return accumulator + currentItem.subTotal;
                        },
                        0,
                      ),
                    )}
                  </b>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <b>{t("To pay")}</b>
                </TableCell>
                <TableCell>
                  <b>
                    {formatCurrency(
                      currentOrder.document_products.reduce(
                        (accumulator, currentItem) => {
                          return accumulator + currentItem.subTotal;
                        },
                        0,
                      ) -
                        currentOrder.payments
                          .filter((pay) => !pay.deleted && pay.verified)
                          .reduce((accumulator, currentItem) => {
                            return accumulator + currentItem.value;
                          }, 0),
                    )}
                  </b>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Card>
      </>
    );
  }
}

Order.getLayout = function getLayout(children) {
  const { t } = useTranslation("common");
  return <AdminPanelLayout title={t("orders")}>{children}</AdminPanelLayout>;
};
