import React from "react";
import Head from "next/head";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import AdminLayout from "../../components/admin/adminLayout";

export default function Settings() {
  const { t, lang } = useTranslation("common");
  const router = useRouter();

  return (
    <AdminLayout>
      <Head>
        <title>Configuration</title>
        <meta name="language" content={lang} />
      </Head>
    </AdminLayout>
  );
}
