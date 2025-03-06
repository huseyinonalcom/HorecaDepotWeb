import useTranslation from "next-translate/useTranslation";
import { useState, useEffect } from "react";
import { Check, ChevronLeft, X } from "react-feather";
import { useRouter } from "next/router";
import Head from "next/head";
import {
  formatDateAPIToBe,
  formatDateTimeAPIToBe,
} from "../../api/utils/formatters/formatdateapibe";
import AdminPanelLayout from "../../components/admin/AdminPanelLayout";

export default function Orders() {
  const router = useRouter();
  const { t, lang } = useTranslation("common");
  const [allOrders, setAllOrders] = useState([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

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

  const fetchOrders = async () => {
    const answer = await fetch(
      `/api/documents/admin/getalldocuments?page=${currentPage}&type=order&sort=createdAt:DESC`,
    );
    const data = await answer.json();
    setAllOrders(data["data"]);
    setTotalPages(data["meta"]["pagination"]["pageCount"]);
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage]);

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <Head>
        <title>{t("orders")}</title>
      </Head>
      <div className="flex w-full flex-col items-center overflow-x-auto rounded-md bg-white p-4 shadow-sm">
        <table className="w-full gap-2">
          <thead className="sticky top-0 bg-[#c0c1c3]">
            <tr>
              <th>{t("document_order")} #</th>
              <th>{t("Date")}</th>
              <th>{t("Client")}</th>
              <th>{t("Total")}</th>
              <th>{t("To pay")}</th>
              <th>{t("Paid")}</th>
            </tr>
          </thead>
          <tbody>
            {allOrders.map((order, index) => (
              <tr
                key={order.id}
                className={`cursor-pointer ${
                  index % 2 === 0 ? "bg-slate-300" : ""
                }`}
                onClick={() => router.push(`/admin/order?id=${order.id}`)}
                onMouseOver={(e) =>
                  e.currentTarget.classList.add("hover:bg-slate-500")
                }
                onMouseOut={(e) =>
                  e.currentTarget.classList.remove("hover:bg-slate-500")
                }
              >
                <td>{order.prefix + order.number}</td>
                <td className="flex flex-row items-end gap-1">
                  {formatDateTimeAPIToBe(order.createdAt).date}
                  <p className="text-xs">
                    {formatDateTimeAPIToBe(order.createdAt).time}
                  </p>
                </td>
                <td>{`${order.client.firstName} ${order.client.lastName}`}</td>
                <td>
                  €{" "}
                  {order.document_products
                    .reduce((total, product) => total + product.subTotal, 0)
                    .toFixed(2)
                    .replaceAll(".", ",")}
                </td>
                <td>
                  €{" "}
                  {(
                    order.document_products.reduce(
                      (total, product) => total + product.subTotal,
                      0,
                    ) -
                    order.payments.reduce(
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
                <td>
                  {order.document_products.reduce(
                    (total, product) => total + product.subTotal,
                    0,
                  ) -
                    order.payments.reduce(
                      (total, payment) =>
                        total +
                        (payment.deleted || !payment.verified
                          ? 0
                          : payment.value),
                      0,
                    ) >
                  0 ? (
                    <X className="text-red-500" />
                  ) : (
                    <Check className="text-green-500" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <>
          {allOrders.length > 0 ? (
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
    </>
  );
}

Orders.getLayout = function getLayout(children) {
  const { t } = useTranslation("common");
  return <AdminPanelLayout title={t("orders")}>{children}</AdminPanelLayout>;
};
