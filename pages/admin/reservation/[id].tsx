import { formatDateAPIToBe } from "../../../api/utils/formatters/formatdateapibe";
import { CheckIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { formatCurrency } from "../../../api/utils/formatters/formatcurrency";
import AdminPanelLayout from "../../../components/admin/AdminPanelLayout";
import { getDocuments } from "../../api/private/documents/universal";
import { Button } from "../../../components/styled/button";
import useTranslation from "next-translate/useTranslation";
import { Input } from "../../../components/styled/input";
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from "../../../components/styled/table";
import { useRouter } from "next/router";
import { useState } from "react";
import Head from "next/head";

export default function Reservation({
  id,
  backUrl,
  reservation,
}: {
  id?: number;
  backUrl?: string;
  reservation?: any;
}) {
  const { t } = useTranslation("common");
  const router = useRouter();
  const [currentReservation, setCurrentReservation] = useState(
    reservation.data,
  );
  const [editMode, setEditMode] = useState(false);

  const submitEditedReservation = async () => {
    await fetch(
      `/api/private/documents/universal?id=${currentReservation.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(currentReservation),
      },
    ).then((res) => {
      router.push(backUrl ?? "/admin/reservations");
    });
  };

  if (!currentReservation) {
    return (
      <>
        <Head>
          <title>{t("reservation")}</title>
        </Head>
        <div className="mx-auto w-full py-2">{t("An error has occurred.")}</div>
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
                  <div className="flex flex-row gap-2">
                    {editMode && (
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
                    )}
                    <Button
                      onClick={() => {
                        setEditMode((prev) => !prev);
                        editMode ? submitEditedReservation() : {};
                      }}
                    >
                      {editMode ? (
                        <CheckIcon style={{ color: "#00FF00" }} />
                      ) : (
                        <PencilIcon style={{ color: "white" }} />
                      )}
                    </Button>
                  </div>
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
                  {editMode && <TableHeader></TableHeader>}
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
                    <TableCell
                      align="center"
                      className="flex flex-row items-center gap-2"
                    >
                      {!editMode ? (
                        <>{documentProduct.amount}</>
                      ) : (
                        <>
                          <Input
                            type="number"
                            min="1"
                            max="100"
                            value={documentProduct.amount}
                            onChange={(e) => {
                              setCurrentReservation((prev) => {
                                const docProds = prev.document_products;
                                const adjustedProduct = docProds.find(
                                  (docProd) => docProd.id == documentProduct.id,
                                );
                                adjustedProduct.amount = e.target.value;
                                return {
                                  ...prev,
                                  document_products: docProds,
                                };
                              });
                            }}
                          />
                        </>
                      )}
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
                    {editMode && (
                      <TableCell className="flex flex-row gap-2">
                        <Button
                          onClick={() =>
                            setCurrentReservation((prev) => {
                              const docProds = prev.document_products.filter(
                                (docProd) => docProd.id != documentProduct.id,
                              );
                              return {
                                ...prev,
                                document_products: docProds,
                              };
                            })
                          }
                        >
                          <TrashIcon style={{ color: "red" }} />
                        </Button>
                      </TableCell>
                    )}
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

export async function getServerSideProps(context) {
  const req = context.req;
  const query = context.query;
  let reservation = {
    id: 0,
    prefix: "",
    number: "",
    date: "",
    type: "Reservation",
    client: {
      id: 0,
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      company: "",
      taxID: "",
    },
    document_products: [],
  };
  if (query.id && query.id != "0") {
    reservation = await getDocuments({
      authToken: req.cookies.j,
      id: query.id,
    });
  }

  return {
    props: {
      reservation,
    },
  };
}
