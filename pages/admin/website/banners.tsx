import AdminPanelLayout from "../../../components/admin/AdminPanelLayout";
import { PromoBanner } from "../../../components/banners/PromoBanner";
import componentThemes from "../../../components/componentThemes";
import useTranslation from "next-translate/useTranslation";
import { getBanners } from "../../api/private/banners";
import Link from "next/link";
import Head from "next/head";

export default function Banners(props) {
  const { t, lang } = useTranslation("common");

  const banners = props.banners;

  return (
    <>
      <Head>
        <title>{t("banners")}</title>
      </Head>
      <div className="mx-auto flex w-[95%] flex-col items-center p-2">
        <div className="flex flex-row">
          <Link
            className={componentThemes.outlinedButton}
            href={"/admin/website/banner-edit/new"}
          >
            {t("banner-new")}
          </Link>
        </div>
        {banners && (
          <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
            {banners
              .sort((a, b) => b.id - a.id)
              .map((banner) => (
                <Link
                  key={banner.id}
                  href={`/admin/website/banner-edit/${banner.id}`}
                >
                  <PromoBanner disabled banner={banner} homePage={{}} />
                </Link>
              ))}
          </div>
        )}
      </div>
    </>
  );
}

Banners.getLayout = function getLayout(children) {
  const { t } = useTranslation("common");
  return <AdminPanelLayout title={t("banners")}>{children}</AdminPanelLayout>;
};

export async function getServerSideProps(context) {
  const banners = await getBanners({});
  return {
    props: {
      banners,
    },
  };
}
