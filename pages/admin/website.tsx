import Head from "next/head";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import componentThemes from "../../components/componentThemes";
import AdminPanelLayout from "../../components/admin/AdminPanelLayout";

export default function Website() {
  const { t, lang } = useTranslation("common");

  return (
    <>
      <Head>
        <title>{t("website")}</title>
      </Head>
      <div className="flex w-full flex-col items-center px-2 pt-2">
        <div className="grid w-full grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          <Link
            className={componentThemes.greenSubmitButton + " text-center"}
            href={"/admin/website/homepage"}
          >
            {t("Homepage")}
          </Link>
          <Link
            className={componentThemes.greenSubmitButton + " text-center"}
            href={"/admin/website/popup"}
          >
            {t("Popup")}
          </Link>
          <Link
            className={componentThemes.greenSubmitButton + " text-center"}
            href={"/admin/website/banner"}
          >
            {t("Banner")}
          </Link>
          <Link
            className={componentThemes.greenSubmitButton + " text-center"}
            href={"/admin/website/categories"}
          >
            {t("Categories")}
          </Link>
          <Link
            className={componentThemes.greenSubmitButton + " text-center"}
            href={"/admin/website/collections"}
          >
            {t("Collections")}
          </Link>
          <Link
            className={componentThemes.greenSubmitButton + " text-center"}
            href={"/admin/website/bulkkeywordsetter"}
          >
            {t("Bulk Keyword Setter")}
          </Link>
        </div>
      </div>
    </>
  );
}

Website.getLayout = function getLayout(children) {
  const { t } = useTranslation("common");
  return <AdminPanelLayout title={t("orders")}>{children}</AdminPanelLayout>;
};
