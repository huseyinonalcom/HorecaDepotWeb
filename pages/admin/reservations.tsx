import { formatDateTimeAPIToBe } from "../../api/utils/formatters/formatdateapibe";
import AdminPanelLayout from "../../components/admin/AdminPanelLayout";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import useTranslation from "next-translate/useTranslation";
import Card from "../../components/universal/Card";
import { useState, useEffect } from "react";
import {
  Pagination,
  PaginationGap,
  PaginationList,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
} from "../../components/styled/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/styled/table";
import Head from "next/head";

export default function Orders({ href }: { href: string }) {
  const { t } = useTranslation("common");
  const [allOrders, setAllOrders] = useState([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  if (!href) {
    href = `/admin/reservation/`;
  }

  const fetchReservations = async () => {
    const answer = await fetch(
      `/api/private/documents/universal?type=reservation&page=${currentPage}`,
    );
    const data = await answer.json();
    setAllOrders(data["data"]);
    setTotalPages(data["meta"]["pagination"]["pageCount"]);
  };

  useEffect(() => {
    fetchReservations();
  }, [currentPage]);

  return (
    <>
      <Head>
        <title>{t("reservations")}</title>
      </Head>
      <Card>
        <Table striped>
          <TableHead>
            <TableRow>
              <TableHeader>{t("reservation")} #</TableHeader>
              <TableHeader>{t("date")}</TableHeader>
              <TableHeader>{t("customer")}</TableHeader>
              <TableHeader>{t("approved")}</TableHeader>
              {/* <TableHeader>{t("total")}</TableHeader> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {allOrders.map((order) => (
              <TableRow href={`${href}${order.id}`} key={order.id}>
                <TableCell>{order.prefix + order.number}</TableCell>
                <TableCell className="flex w-full flex-row items-center gap-1">
                  {formatDateTimeAPIToBe(order.createdAt).date}
                  <p className="text-xs">
                    {formatDateTimeAPIToBe(order.createdAt).time}
                  </p>
                </TableCell>
                <TableCell>
                  {`${order.client?.firstName ?? ""} ${order.client?.lastName ?? ""}`}
                </TableCell>
                <TableCell>
                  {order.approved ? (
                    <CheckIcon height={32} style={{ color: "green" }} />
                  ) : (
                    <XMarkIcon height={32} style={{ color: "red" }} />
                  )}
                </TableCell>
                {/** <TableCell>
                  €{" "}
                  {order.document_products
                    .reduce((total, product) => total + product.subTotal, 0)
                    .toFixed(2)
                    .replaceAll(".", ",")}
                </TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Pagination className="sticky bottom-0 -mt-1 flex w-full rounded-lg rounded-t-none border-1 border-zinc-950/10 bg-white p-4">
          <PaginationPrevious
            onClick={
              currentPage > 1
                ? () => {
                    scroll({
                      top: 0,
                      behavior: "smooth",
                    });
                    setCurrentPage((currentPage) => currentPage - 1);
                  }
                : undefined
            }
          >
            <p className="text-black">{t("previous")}</p>
          </PaginationPrevious>
          <PaginationList>
            <PaginationPage
              onClick={() => {
                scroll({ top: 0, behavior: "smooth" });
                setCurrentPage(1);
              }}
              current={currentPage === 1}
            >
              1
            </PaginationPage>
            {currentPage > 4 && <PaginationGap />}
            {[currentPage - 2, currentPage - 1]
              .filter((page) => page > 1)
              .map((page) => (
                <PaginationPage
                  key={page}
                  onClick={() => {
                    scroll({ top: 0, behavior: "smooth" });
                    setCurrentPage(page);
                  }}
                >
                  {page}
                </PaginationPage>
              ))}
            {currentPage !== 1 && currentPage !== totalPages && (
              <PaginationPage current>{currentPage}</PaginationPage>
            )}
            {[currentPage + 1, currentPage + 2]
              .filter((page) => page < totalPages)
              .map((page) => (
                <PaginationPage
                  key={page}
                  onClick={() => {
                    scroll({ top: 0, behavior: "smooth" });
                    setCurrentPage(page);
                  }}
                >
                  {page}
                </PaginationPage>
              ))}
            {currentPage < totalPages - 3 && <PaginationGap />}
            {totalPages > 1 && (
              <PaginationPage
                onClick={() => {
                  scroll({ top: 0, behavior: "smooth" });
                  setCurrentPage(totalPages);
                }}
                current={currentPage === totalPages}
              >
                {totalPages}
              </PaginationPage>
            )}
          </PaginationList>
          <PaginationNext
            onClick={
              currentPage < totalPages
                ? () => {
                    scroll({
                      top: 0,
                      behavior: "smooth",
                    });
                    setCurrentPage((currentPage) => currentPage + 1);
                  }
                : undefined
            }
          >
            <p className="text-black">{t("next")}</p>
          </PaginationNext>
        </Pagination>
      </Card>
    </>
  );
}

Orders.getLayout = function getLayout(children) {
  const { t } = useTranslation("common");
  return (
    <AdminPanelLayout title={t("reservations")}>{children}</AdminPanelLayout>
  );
};
