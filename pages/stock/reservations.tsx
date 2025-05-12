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
import Reservations from "../admin/reservations";

export default function ReservationsStock() {
  const { t, lang } = useTranslation("common");
  const [allReservations, setAllReservations] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const fetchData = async () => {
    try {
      const reservations = await (
        await fetch(
          `/api/private/documents/universal?type=reservation&page=${page}&search=${search}`,
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
    <div className="p-4">
      <Reservations href="/stock/reservation/" />
    </div>
  );
}

ReservationsStock.getLayout = function getLayout(page: React.ReactNode) {
  return <StockLayout>{page}</StockLayout>;
};
