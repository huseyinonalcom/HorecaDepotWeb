import { FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import StockLayout from "../../components/stock/StockLayout";
import {
  Pagination,
  PaginationList,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
} from "../../components/styled/pagination";
import AdminPanelLayout from "../../components/admin/AdminPanelLayout";

export default function ReservationsAdmin() {
  const { t, lang } = useTranslation("common");
  const [allReservations, setAllReservations] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const fetchData = async () => {
    try {
      const reservations = await (
        await fetch(
          `/api/private/documents?type=reservation&page=${page}&search=${search}`,
        )
      ).json();

      setAllReservations(reservations.data);
      setTotalPages(reservations.meta.pagination.pageCount);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, page]);

  return (
    <div>
      <Head>
        <title>{t("reservations")}</title>
        <meta name="language" content={lang} />
      </Head>
      <div className="flex w-full flex-col items-center gap-1 p-2"></div>
      <Pagination className="sticky bottom-0 -mt-1 flex w-full rounded-lg rounded-t-none border-1 border-zinc-950/10 bg-white p-4">
        <PaginationPrevious
          onClick={
            page > 1
              ? () => {
                  scroll({
                    top: 0,
                    behavior: "smooth",
                  });
                  setPage(page - 1);
                }
              : undefined
          }
        >
          <p className="text-black">{t("previous")}</p>
        </PaginationPrevious>
        <PaginationList>
          <PaginationPage className="data-disabled:opacity-100">
            {page}
          </PaginationPage>
        </PaginationList>
        <PaginationNext
          onClick={
            page < totalPages
              ? () => {
                  scroll({
                    top: 0,
                    behavior: "smooth",
                  });
                  setPage(page + 1);
                }
              : undefined
          }
        >
          <p className="text-black">{t("next")}</p>
        </PaginationNext>
      </Pagination>
    </div>
  );
}

ReservationsAdmin.getLayout = function getLayout(page: React.ReactNode) {
  const { t } = useTranslation("common");
  return <AdminPanelLayout title={t("reservations")}>{page}</AdminPanelLayout>;
};
