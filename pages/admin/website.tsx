import React from "react";
import Head from "next/head";
import useTranslation from "next-translate/useTranslation";
import AdminLayout from "../../components/admin/adminLayout";
import Link from "next/link";
import componentThemes from "../../components/componentThemes";

export default function Website() {
  const { t, lang } = useTranslation("common");

  return (
    <AdminLayout>
      <Head>
        <title>Website</title>
        <meta name="language" content={lang} />
      </Head>
      <div className="flex flex-col w-[95%] mx-auto items-center pt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 w-full gap-2">
          <Link
            className={componentThemes.greenSubmitButton + " text-center"}
            href={"/admin/website/indexslider"}
          >
            {t("Images promo")}
          </Link>
          <Link
            className={componentThemes.greenSubmitButton + " text-center"}
            href={"/admin/website/collections"}
          >
            {t("Collections")}
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
}
