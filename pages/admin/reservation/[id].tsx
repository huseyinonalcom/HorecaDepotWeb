import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import LoadingIndicator from "../../../components/common/loadingIndicator";
import { formatDateAPIToBe } from "../../../api/utils/formatters/formatdateapibe";
import { formatCurrency } from "../../../api/utils/formatters/formatcurrency";
import AdminPanelLayout from "../../../components/admin/AdminPanelLayout";
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from "../../../components/styled/table";
import { Button } from "../../../components/styled/button";
import { TrashIcon } from "@heroicons/react/24/outline";

export default function Reservation({ id, backUrl }: { id?: number, backUrl?: string }) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [currentReservation, setCurrentReservation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if ((router.isReady && router.query.id) || id) {
      const idParam = router.query.id || id;
      let reservationId = Number(idParam);
      if (!Number.isInteger(reservationId) || reservationId <= 0) {
        reservationId = null;
      }

      const fetchReservation = async (orderID: number) => {
        const request = await fetch(
          `/api/private/documents/universal?id=${orderID}`,
        );
        const response = await request.json();
        if (request.ok) {
          console.log(response);
          return response;
        } else {
          throw "Failed to fetch reservation";
        }
      };

      if (reservationId) {
        fetchReservation(reservationId)
          .then((reservation) => {
            setCurrentReservation(reservation.data);
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
        <Head>
          <title>{t("reservation")}</title>
        </Head>
        <div className="mx-auto w-[90vw] py-2">
          <LoadingIndicator />
        </div>
      </>
    );
  } else if (!currentReservation) {
    return (
      <>
        <Head>
          <title>{t("reservation")}</title>
        </Head>
        <div className="mx-auto w-[90vw] py-2">
          {t("An error has occurred.")}
        </div>
      </>
    );
  } else {
    return (
      <>
        <Head>
          <title>{t("reservation")}</title>
        </Head>
        <div className="w-full px-2 py-2">
          <div className="w-full rounded-md bg-white p-4 shadow-lg">
            <div className="flex flex-row justify-between">
              <div className="flex w-full flex-col">
                <div className="flex w-full flex-row justify-between">
                  <h1 className="text-2xl font-bold">
                    {currentReservation.type}
                  </h1>
                  <Button
                    onClick={() => {
                      fetch(
                        `/api/private/documents/universal?id=${currentReservation.id}`,
                        {
                          method: "DELETE",
                          headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json",
                            Authorization: `Bearer ${process.env.API_KEY}`,
                          },
                        },
                      ).then((res) => {
                        router.push(backUrl ?? "/admin/reservations");
                      });
                    }}
                  >
                    <TrashIcon style={{ color: "red" }} />
                  </Button>
                </div>
                <h2 className="text-xl font-bold">
                  {currentReservation.prefix + currentReservation.number}
                </h2>
                <h3 className="text-lg font-bold">
                  {formatDateAPIToBe(currentReservation.date)}
                </h3>
              </div>
            </div>
            <div className="flex flex-row gap-6 pt-2">
              <div className="flex flex-col">
                {currentReservation.client.category == "Entreprise" ? (
                  <>
                    <h4 className="font-bold">Facturé à:</h4>
                    <p className="">{currentReservation.client.company}</p>
                    <p className="">{currentReservation.client.taxID}</p>
                    <p className="">{`${currentReservation.client.firstName} ${currentReservation.client.lastName}`}</p>
                    <p className="">{currentReservation.client.phone}</p>
                  </>
                ) : (
                  <>
                    <h4 className="font-bold">Facturé à:</h4>
                    <p className="">{`${currentReservation.client.firstName} ${currentReservation.client.lastName}`}</p>
                    <p className="">{currentReservation.client.phone}</p>
                  </>
                )}
              </div>
              {/*  <div className="flex flex-col">
                <h4 className="font-bold">Addresse Facture:</h4>
                <p className="">{`${currentReservation.docAddress.street} ${currentReservation.docAddress.doorNumber}`}</p>
                <p className="">{`${currentReservation.docAddress.zipCode} ${currentReservation.docAddress.city}`}</p>
                <p className="">{`${currentReservation.docAddress.province ?? ""} ${
                  currentReservation.docAddress.country
                }`}</p>
                {currentReservation.docAddress.floor ? (
                  <p className="">
                    Étage: {currentReservation.docAddress.floor}
                  </p>
                ) : (
                  <></>
                )}
              </div>
              <div className="flex flex-col">
                <h4 className="font-bold">Livraison:</h4>
                <p className="">{`${currentReservation.delAddress.street} ${currentReservation.delAddress.doorNumber}`}</p>
                <p className="">{`${currentReservation.delAddress.zipCode} ${currentReservation.delAddress.city}`}</p>
                <p className="">{`${currentReservation.delAddress.province ?? ""} ${
                  currentReservation.delAddress.country
                }`}</p>
                {currentReservation.delAddress.floor ? (
                  <p className="">
                    Étage: {currentReservation.delAddress.floor}
                  </p>
                ) : (
                  <></>
                )}
              </div> */}
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
                {currentReservation.document_products.map((documentProduct) => (
                  <TableRow key={documentProduct.id}>
                    <TableCell>
                      {documentProduct.product?.internalCode ?? ""}
                    </TableCell>
                    <TableCell>{documentProduct.name}</TableCell>
                    <TableCell>
                      {documentProduct.product?.color ?? ""}
                    </TableCell>
                    <TableCell align="center">
                      {documentProduct.amount}
                    </TableCell>
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
                        currentReservation.document_products.reduce(
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
                        currentReservation.document_products.reduce(
                          (accumulator, currentItem) => {
                            return accumulator + currentItem.subTotal;
                          },
                          0,
                        ) -
                          currentReservation.payments
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
          </div>
        </div>
      </>
    );
  }
}

Reservation.getLayout = function getLayout(children) {
  const { t } = useTranslation("common");
  return (
    <AdminPanelLayout title={t("reservations")}>{children}</AdminPanelLayout>
  );
};
