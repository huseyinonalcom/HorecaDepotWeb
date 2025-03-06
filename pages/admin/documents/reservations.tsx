import { formatDateAPIToBe } from "../../../api/utils/formatters/formatdateapibe";
import AdminPanelLayout from "../../../components/admin/AdminPanelLayout";
import useTranslation from "next-translate/useTranslation";
import { useState, useEffect } from "react";
import { ChevronLeft } from "react-feather";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Reservations() {
  const router = useRouter();
  const { t, lang } = useTranslation("common");
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [allReservations, setAllReservations] = useState([]);

  const getPageNumbers = () => {
    let pages = [];
    let startPage, endPage;

    if (totalPages <= 6) {
      startPage = 1;
      endPage = totalPages;
    } else {
      if (currentPage <= 4) {
        startPage = 1;
        endPage = 5;
      } else if (currentPage + 2 >= totalPages) {
        startPage = totalPages - 4;
        endPage = totalPages;
      } else {
        startPage = currentPage - 2;
        endPage = currentPage + 2;
      }
    }

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push("...");
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push("...");
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const fetchReservations = async () => {
    const answer = await fetch(
      `/api/documents/admin/getalldocuments?page=${currentPage}&type=reservation`,
    );
    const data = await answer.json();
    setAllReservations(data["data"]);
    setTotalPages(data["meta"]["pagination"]["pageCount"]);
  };

  useEffect(() => {
    fetchReservations();
  }, [currentPage]);

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <Head>
        <title>{t("reservations")}</title>
      </Head>
      <div className="flex w-full flex-col items-center pt-2">
        <div>
          <div className="flex w-full flex-shrink-1 flex-col items-center overflow-y-hidden pt-1">
            <div className="flex max-w-full flex-col overflow-x-auto overflow-y-auto">
              <table className="relative w-full bg-gray-100 p-2 shadow-lg">
                <thead className="sticky top-0 bg-[#c0c1c3]">
                  <tr>
                    <th>{t("No")}</th>
                    <th>{t("Date")}</th>
                    <th>{t("Client")}</th>
                    <th>{t("Total")}</th>
                    <th>{t("To pay")}</th>
                  </tr>
                </thead>
                <tbody>
                  {allReservations.map((reservation, index) => (
                    <tr
                      key={index}
                      className={`cursor-pointer ${
                        index % 2 === 0 ? "bg-slate-300" : ""
                      } `}
                      onDoubleClick={() =>
                        router.push(
                          `/admin/documents/reservation?id=${reservation.id}`,
                        )
                      }
                      onMouseOver={(e) =>
                        e.currentTarget.classList.add("hover:bg-slate-500")
                      }
                      onMouseOut={(e) =>
                        e.currentTarget.classList.remove("hover:bg-slate-500")
                      }
                    >
                      <td>{reservation.prefix + reservation.number}</td>
                      <td>{formatDateAPIToBe(reservation.date)}</td>
                      <td>{`${reservation.client.firstName} ${reservation.client.lastName}`}</td>
                      <td>
                        €{" "}
                        {reservation.document_products
                          .reduce(
                            (total, product) => total + product.subTotal,
                            0,
                          )
                          .toFixed(2)
                          .replaceAll(".", ",")}
                      </td>
                      <td>
                        €{" "}
                        {(
                          reservation.document_products.reduce(
                            (total, product) => total + product.subTotal,
                            0,
                          ) -
                          reservation.payments.reduce(
                            (total, payment) =>
                              total +
                              (payment.deleted || !payment.verified
                                ? 0
                                : payment.value),
                            0,
                          )
                        )
                          .toFixed(2)
                          .replaceAll(".", ",")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <>
            {allReservations.length > 0 ? (
              <div className="mb-4 flex flex-row justify-center px-6">
                <div className="mt-2">
                  <div className="flex items-center justify-center space-x-1">
                    <button
                      className="border p-2 hover:bg-gray-200"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft />
                    </button>
                    {getPageNumbers().map((page, index) =>
                      page === "..." ? (
                        <span key={index} className="p-2">
                          ...
                        </span>
                      ) : (
                        <button
                          key={index}
                          className={`border p-2 hover:bg-gray-200 ${
                            currentPage === page ? "bg-gray-300" : ""
                          }`}
                          onClick={() => goToPage(page)}
                        >
                          {page}
                        </button>
                      ),
                    )}
                    <button
                      className="border p-2 hover:bg-gray-200"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronLeft className="rotate-180" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <p></p>
            )}
          </>
        </div>
      </div>
    </>
  );
}

Reservations.getLayout = function getLayout(page) {
  const { t } = useTranslation("common");
  return <AdminPanelLayout title={t("reservations")}>{page}</AdminPanelLayout>;
};
