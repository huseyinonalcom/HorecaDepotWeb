import { formatDateTimeAPIToBe } from "../../api/utils/formatters/formatdateapibe";
import AdminPanelLayout from "../../components/admin/AdminPanelLayout";
import { FiX, FiCheck, FiChevronLeft } from "react-icons/fi";
import useTranslation from "next-translate/useTranslation";
import { useState, useEffect, ReactNode } from "react";
import Head from "next/head";
import Link from "next/link";

export default function Orders({ href }: { href: string }) {
  const { t } = useTranslation("common");
  const [allOrders, setAllOrders] = useState([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  if (!href) {
    href = "/admin/order?id=";
  }

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

  const OrderLink = ({ id, children }: { id: number; children: ReactNode }) => (
    <Link href={`${href}${id}`} className="flex w-full">
      {children}
    </Link>
  );

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
                } hover:bg-slate-500`}
              >
                <td>
                  <OrderLink id={order.id}>
                    {order.prefix + order.number}
                  </OrderLink>
                </td>
                <td className="flex w-full">
                  <OrderLink id={order.id}>
                    <div className="flex w-full flex-row items-end gap-1">
                      {formatDateTimeAPIToBe(order.createdAt).date}
                      <p className="text-xs">
                        {formatDateTimeAPIToBe(order.createdAt).time}
                      </p>
                    </div>
                  </OrderLink>
                </td>
                <td>
                  <OrderLink id={order.id}>
                    {`${order.client.firstName} ${order.client.lastName}`}
                  </OrderLink>
                </td>
                <td>
                  <OrderLink id={order.id}>
                    €{" "}
                    {order.document_products
                      .reduce((total, product) => total + product.subTotal, 0)
                      .toFixed(2)
                      .replaceAll(".", ",")}
                  </OrderLink>
                </td>
                <td>
                  <OrderLink id={order.id}>
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
                  </OrderLink>
                </td>
                <td>
                  <OrderLink id={order.id}>
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
                      <FiX className="text-red-500" />
                    ) : (
                      <FiCheck className="text-green-500" />
                    )}
                  </OrderLink>
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
                    <FiChevronLeft />
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
                    <FiChevronLeft className="rotate-180" />
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
