import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import AdminLayout from "../../components/admin/adminLayout";
import { CheckCircle, ChevronLeft, ChevronRight } from "react-feather";
import formatDateAPIToBe from "../../api/utils/formatdateapibe";

export default function Orders() {
  const { t, lang } = useTranslation("common");
  const [allOrders, setAllOrders] = useState([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedRows, setSelectedRows] = useState(new Set<number>());
  const router = useRouter();
  let lastSelectedRow = useRef<number | null>(null);

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

  const fetchProducts = async () => {
    const answer = await fetch(
      `/api/documents/admin/getalldocuments?page=${currentPage}`
    );
    const data = await answer.json();
    setAllOrders(data["data"]);
    setTotalPages(data["meta"]["pagination"]["pageCount"]);
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage]);

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleRowClick = (
    index: number,
    event: React.MouseEvent<HTMLTableRowElement, MouseEvent>
  ) => {
    const newSelectedRows = new Set(selectedRows);

    if (event.shiftKey && lastSelectedRow.current !== null) {
      const start = Math.min(lastSelectedRow.current, index);
      const end = Math.max(lastSelectedRow.current, index);
      for (let i = start; i <= end; i++) {
        newSelectedRows.add(i);
      }
    } else if (event.ctrlKey || event.metaKey) {
      if (newSelectedRows.has(index)) {
        newSelectedRows.delete(index);
      } else {
        newSelectedRows.add(index);
      }
    } else {
      newSelectedRows.clear();
      newSelectedRows.add(index);
    }

    lastSelectedRow.current = index;
    setSelectedRows(newSelectedRows);
  };

  return (
    <AdminLayout>
      <Head>
        <title>Produits</title>
        <meta name="language" content={lang} />
      </Head>
      <div className="flex flex-col w-full items-center pt-2">
        <div>
          <div className="orders-table-container">
            <table className="rounded overflow-x-auto shadow-lg bg-gray-100 p-2">
              <thead>
                <tr>
                  <th>{t("No")}</th>
                  <th>{t("Date")}</th>
                  <th>{t("Client")}</th>
                  <th>{t("Total")}</th>
                  <th>{t("A payer")}</th>
                </tr>
              </thead>
              <tbody>
                {allOrders.map((order, index) => (
                  <tr
                    key={index}
                    className={`cursor-pointer ${
                      !selectedRows.has(index) && index % 2 === 0
                        ? "bg-slate-300"
                        : ""
                    } ${selectedRows.has(index) ? "bg-orange-300" : ""}`}
                    onDoubleClick={() =>
                      router.push(`/admin/order?id=${order.id}`)
                    }
                    onClick={(e) => handleRowClick(index, e)}
                    onMouseOver={(e) =>
                      e.currentTarget.classList.add("hover:bg-slate-500")
                    }
                    onMouseOut={(e) =>
                      e.currentTarget.classList.remove("hover:bg-slate-500")
                    }
                  >
                    <td>{order.prefix + order.number}</td>
                    <td>{formatDateAPIToBe(order.date)}</td>
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
                          0
                        ) -
                        order.payments.reduce(
                          (total, payment) =>
                            total +
                            (payment.deleted || !payment.verified
                              ? 0
                              : payment.value),
                          0
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
          <>
            {allOrders.length > 0 ? (
              <div className="flex flex-row px-6 justify-center mb-4">
                <div className="mt-2">
                  <div className="flex justify-center items-center space-x-1">
                    <button
                      className="p-2 border rounded hover:bg-gray-200"
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
                          className={`p-2 border rounded hover:bg-gray-200 ${
                            currentPage === page ? "bg-gray-300" : ""
                          }`}
                          onClick={() => goToPage(page)}
                        >
                          {page}
                        </button>
                      )
                    )}
                    <button
                      className="p-2 border rounded hover:bg-gray-200"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight />
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
    </AdminLayout>
  );
}
