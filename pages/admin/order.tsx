import Head from "next/head";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";
import LoadingIndicator from "../../components/common/loadingIndicator";
import { useRouter } from "next/router";
import formatDateAPIToBe from "../../api/utils/formatdateapibe";
import AdminLayout from "../../components/admin/adminLayout";
import Image from "next/image";
import componentThemes from "../../components/componentThemes";
import { PDFDownloadLink } from "@react-pdf/renderer";
import PDFInvoice from "../../components/pdf/pdfinvoice";

export default function Order() {
  const { t, lang } = useTranslation("common");
  const router = useRouter();
  const [currentOrder, setCurrentOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (router.isReady && router.query.id) {
      const idParam = router.query.id;
      let orderID = Number(idParam);
      if (!Number.isInteger(orderID) || orderID <= 0) {
        orderID = null;
      }

      const fetchOrder = async (orderID: number) => {
        const request = await fetch(
          `/api/documents/admin/getorderdetails?order=${orderID}`
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
        <AdminLayout>
          <Head>
            <title>horecadepot</title>
            <meta name="description" content="horecadepot" />
            <meta name="language" content={lang} />
          </Head>
          <div className="w-[90vw] mx-auto py-2">
            <LoadingIndicator />
          </div>
        </AdminLayout>
      </>
    );
  } else if (!currentOrder) {
    return (
      <>
        <AdminLayout>
          <Head>
            <title>horecadepot</title>
            <meta name="description" content="horecadepot" />
            <meta name="language" content={lang} />
          </Head>
          <div className="w-[90vw] mx-auto py-2">
            {t("Une erreur s'est produite.")}
          </div>
        </AdminLayout>
      </>
    );
  } else {
    return (
      <>
        <AdminLayout>
          <Head>
            <title>horecadepot</title>
            <meta name="description" content="horecadepot" />
            <meta name="language" content={lang} />
          </Head>

          <div className="w-full px-2 py-2">
            <div className="shadow-lg p-4 print:shadow-none print:ml-0 print:p-0 w-full">
              <div className="flex flex-row justify-between">
                <div
                  className={`hidden print:block relative w-[358px] h-[64px] mt-2`}
                >
                  <Image
                    src={"/assets/header/logo.png"}
                    style={{ objectFit: "contain" }}
                    fill
                    alt="HorecaDepot Logo"
                  />
                </div>
                <div className="hidden print:flex flex-col pt-1">
                  <h4 className="font-bold">Horeca Depot</h4>
                  <p className="">Rue de Ribaucourt 154</p>
                  <p className="">1080 Bruxelles, Belgique</p>
                </div>
                <div className="flex flex-col print:items-end">
                  <h1 className="text-2xl font-bold">{currentOrder.type}</h1>
                  <h2 className="text-xl font-bold">
                    {currentOrder.prefix + currentOrder.number}
                  </h2>
                  <h3 className="text-lg font-bold">
                    {formatDateAPIToBe(currentOrder.date)}
                  </h3>
                </div>
                <div className="flex flex-row items-center gap-2 flex-shrink-0 print:hidden">
                  {/* {balance > 0 && (
                    <>
                      {verificationMessage && verificationMessage}

                      {verificationRunning ? (
                        <button
                          className={`${CustomTheme.greenSubmitButton} text-xl whitespace-nowrap`}
                        >
                          <div className="w-[100px] flex flex-row justify-center">
                            <TypeWriter textTypeWriter={["...."]} />
                          </div>
                        </button>
                      ) : (
                        <button
                          className={`${CustomTheme.greenSubmitButton} text-xl whitespace-nowrap`}
                          onClick={submitCheckPayment}
                        >
                          {t("Verifier payment")}
                        </button>
                      )}
                      <button
                        className={`${CustomTheme.greenSubmitButton} text-xl whitespace-nowrap`}
                        onClick={submitPayment}
                      >
                        {t("Proceder au payment")}
                      </button>
                    </>
                  )} */}

                  {currentOrder && (
                    <PDFDownloadLink
                      fileName={currentOrder.prefix + currentOrder.number}
                      document={<PDFInvoice invoiceDocument={currentOrder} />}
                      className={`${componentThemes.greenSubmitButton} flex flex-row text-xl items-center whitespace-nowrap`}
                    >
                      📄 <p className="ml-1">{t("Télécharger PDF")}</p>
                    </PDFDownloadLink>
                  )}
                  <button
                    onClick={() => {
                      print();
                    }}
                    className={`${componentThemes.greenSubmitButton} flex flex-row text-xl items-center whitespace-nowrap`}
                  >
                    🖨️
                    <p className="ml-1">{t("Imprimer")}</p>
                  </button>
                </div>
              </div>
              <div className="flex flex-row gap-6 pt-2 print:justify-between">
                <div className="flex flex-col">
                  {currentOrder.client.category == "Entreprise" ? (
                    <>
                      <h4 className=" font-bold">Facturé à:</h4>
                      <p className="">{currentOrder.client.company}</p>
                      <p className="">{currentOrder.client.taxID}</p>
                      <p className="">{`${currentOrder.client.firstName} ${currentOrder.client.lastName}`}</p>
                      <p className="">{currentOrder.client.phone}</p>
                    </>
                  ) : (
                    <>
                      <h4 className=" font-bold">Facturé à:</h4>
                      <p className="">{`${currentOrder.client.firstName} ${currentOrder.client.lastName}`}</p>
                      <p className="">{currentOrder.client.phone}</p>
                    </>
                  )}
                </div>
                <div className="flex flex-col">
                  <h4 className=" font-bold">Addresse Facture:</h4>
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
                  <h4 className=" font-bold">Livraison:</h4>
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
              <table className="rounded overflow-x-auto shadow-lg bg-gray-100 p-2 mt-3 print:shadow-none print:border-2 print:border-black print:bg-transparent">
                <thead className="border-b-2 border-black">
                  <tr>
                    <th>{t("Nom")}</th>
                    <th>{t("Quantite")}</th>
                    <th>{t("Prix")}</th>
                    <th>{t("Remise")}</th>
                    <th>{t("Subtotal")}</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrder.document_products.map(
                    (documentProduct, index) => (
                      <tr
                        key={index}
                        className={`${
                          index % 2 === 0
                            ? "bg-slate-300 print:bg-transparent"
                            : ""
                        }`}
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
                    )
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
                      <b>{t("A payer")}</b>
                    </td>
                    <td align="right">
                      <b>
                        €{" "}
                        {(
                          currentOrder.document_products.reduce(
                            (accumulator, currentItem) => {
                              return accumulator + currentItem.subTotal;
                            },
                            0
                          ) -
                          currentOrder.payments.reduce(
                            (accumulator, currentItem) => {
                              return accumulator + currentItem.value;
                            },
                            0
                          )
                        )
                          .toFixed(2)
                          .replaceAll(".", ",")}
                      </b>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* {balance > 0 && (
                <div className="flex flex-row print:hidden">
                  <div className="ml-auto">
                    <button
                      className={`${CustomTheme.greenSubmitButton} text-xl whitespace-nowrap`}
                      onClick={submitPayment}
                    >
                      {t("Proceder au payment")}
                    </button>
                  </div>
                </div>
              )} */}
            </div>
            {/* <div className="shadow-lg my-2 mx-2 rounded p-4">
              <h1 className="text-2xl font-bold">{currentOrder.type}</h1>
              <h2 className="text-xl font-bold">{currentOrder.prefix + currentOrder.number}</h2>
              <h3 className="text-lg font-bold">{formatDateAPIToBe(currentOrder.date)}</h3>
              <div className="flex flex-row gap-6">
                <div className="flex flex-col mt-2">
                  {currentOrder.client.category == "Entreprise" ? (
                    <>
                      <h4 className="text-lg font-bold">Facturé à:</h4>
                      <p className="text-lg">{currentOrder.client.company}</p>
                      <p className="text-lg">{currentOrder.client.taxID}</p>
                      <p className="text-lg">{`${currentOrder.client.firstName} ${currentOrder.client.lastName}`}</p>
                      <p className="text-lg">{currentOrder.client.phone}</p>
                    </>
                  ) : (
                    <>
                      <h4 className="text-lg font-bold">Facturé à:</h4>
                      <p className="text-lg">{`${currentOrder.client.firstName} ${currentOrder.client.lastName}`}</p>
                      <p className="text-lg">{currentOrder.client.phone}</p>
                    </>
                  )}
                </div>
                <div className="flex flex-col mt-7">
                  <p className="text-lg mt-2">{`${currentOrder.docAddress.street} ${currentOrder.docAddress.doorNumber}`}</p>
                  <p className="text-lg">{`${currentOrder.docAddress.zipCode} ${currentOrder.docAddress.city}`}</p>
                  <p className="text-lg">{`${currentOrder.docAddress.province ?? ""} ${currentOrder.docAddress.country}`}</p>
                  {currentOrder.docAddress.floor ? <p className="text-lg">Étage: {currentOrder.docAddress.floor}</p> : <></>}
                </div>
                <div className="flex flex-col mt-2">
                  <h4 className="text-lg font-bold">Livraison:</h4>
                  <p className="text-lg">{`${currentOrder.docAddress.street} ${currentOrder.docAddress.doorNumber}`}</p>
                  <p className="text-lg">{`${currentOrder.docAddress.zipCode} ${currentOrder.docAddress.city}`}</p>
                  <p className="text-lg">{`${currentOrder.docAddress.province ?? ""} ${currentOrder.docAddress.country}`}</p>
                  {currentOrder.docAddress.floor ? <p className="text-lg">Étage: {currentOrder.docAddress.floor}</p> : <></>}
                </div>
              </div>
              <table className="rounded overflow-x-auto shadow-lg bg-gray-100 p-2 mt-2">
                <thead>
                  <tr>
                    <th>{t("Nom")}</th>
                    <th>{t("Quantite")}</th>
                    <th>{t("Prix")}</th>
                    <th>{t("Remise")}</th>
                    <th>{t("Subtotal")}</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrder.document_products.map((documentProduct, index) => (
                    <tr key={index} className={`${index % 2 === 0 ? "bg-slate-300" : ""}`}>
                      <td>{documentProduct.name}</td>
                      <td>{documentProduct.amount}</td>
                      <td>€ {documentProduct.value.toFixed(2).replaceAll(".", ",")}</td>
                      <td>€ {documentProduct.discount.toFixed(2).replaceAll(".", ",")}</td>
                      <td>€ {documentProduct.subTotal.toFixed(2).replaceAll(".", ",")}</td>
                    </tr>
                  ))}
                  <tr>
                    <td></td>
                    <td>
                      <b>Total</b>
                    </td>
                    <td>
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
                    <td>{t("A payer")}</td>
                    <td>
                      <b>
                        €{" "}
                        {(
                          currentOrder.document_products.reduce((accumulator, currentItem) => {
                            return accumulator + currentItem.subTotal;
                          }, 0) -
                          currentOrder.payments.reduce((accumulator, currentItem) => {
                            return accumulator + currentItem.value;
                          }, 0)
                        )
                          .toFixed(2)
                          .replaceAll(".", ",")}
                      </b>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table className="rounded overflow-x-auto shadow-lg bg-gray-100 p-2 mt-2">
                <thead>
                  <tr>
                    <th>{t("Date")}</th>
                    <th>{t("Methode")}</th>
                    <th>{t("Valeur")}</th>
                  </tr>
                </thead>
                <tbody>
                  {currentOrder.payments.map((payment, index) => (
                    <tr key={index} className={`${index % 2 === 0 ? "bg-slate-300" : ""}`}>
                      <td>{formatDateAPIToBe(payment.date)}</td>
                      <td>{payment.method}</td>
                      <td>€ {payment.value.toFixed(2).replaceAll(".", ",")}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-black">
                    <td></td>
                    <td>
                      <b>Total</b>
                    </td>
                    <td>
                      <b>
                        €{" "}
                        {currentOrder.payments
                          .reduce((accumulator, currentItem) => {
                            return accumulator + currentItem.value;
                          }, 0)
                          .toFixed(2)
                          .replaceAll(".", ",")}
                      </b>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div> */}
          </div>
        </AdminLayout>
      </>
    );
  }
}
