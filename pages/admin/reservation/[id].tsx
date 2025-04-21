import { FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import StockLayout from "../../../components/stock/StockLayout";
import ProductCard from "../../../components/stock/ProductCard";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";

export default function ReservationAdmin() {
  const { t, lang } = useTranslation("common");

  return (
    <>
      <Head>
        <title>{t("reservation")}</title>
        <meta name="language" content={lang} />
      </Head>
    </>
  );
}

ReservationAdmin.getLayout = function getLayout(page: React.ReactNode) {
  return <StockLayout>{page}</StockLayout>;
};
