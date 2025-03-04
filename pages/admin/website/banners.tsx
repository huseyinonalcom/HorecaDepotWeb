import { PromoBanner } from "../../../components/banners/PromoBanner";
import componentThemes from "../../../components/componentThemes";
import { getBanners } from "../../api/website/public/getbanners";
import AdminLayout from "../../../components/admin/adminLayout";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import Link from "next/link";

export default function Banners(props) {
  const { t, lang } = useTranslation("common");

  const banners = props.banners;

  return (
    <>
      <Head>
        <title>Website</title>
        <meta name="language" content={lang} />
      </Head>
      <div className="mx-auto flex w-[95%] flex-col items-center p-2">
        <div className="flex flex-row">
          <Link
            className={componentThemes.greenSubmitButton}
            href={"/admin/website/banner-edit/new"}
          >
            {t("banner-new")}
          </Link>
        </div>
        {banners && (
          <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
            {banners.map((banner) => (
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

Banners.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};

export async function getServerSideProps(context) {
  const banners = await getBanners({});
  return {
    props: {
      banners,
    },
  };
}
