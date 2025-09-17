import { getAllCategoriesFlattened } from "../../api/categories/public/getallcategoriesflattened";
import AdminPanelLayout from "../../../components/admin/AdminPanelLayout";
import { getTopProductsWeek } from "../../api/private/products/stats";
import { getCollections } from "../../api/private/collections";
import useTranslation from "next-translate/useTranslation";
import { getHomepage } from "../../api/private/homepage";
import { getBanners } from "../../api/private/banners";
import { FiCheck } from "react-icons/fi";
import { useState } from "react";
import Head from "next/head";
import Index from "../..";

export default function HomePageAdmin({
  homePageFromAPI,
  collectionsFromAPI,
  bannersFromAPI,
  allCategories,
  topProductsWeek,
}) {
  const [homePage, setHomePage] = useState(homePageFromAPI);
  const { t, lang } = useTranslation("common");

  return (
    <>
      <Head>
        <title>{t("homepage")}</title>
      </Head>
      <div className="max-w-full">
        {bannersFromAPI && (
          <Index
            topProductsWeek={topProductsWeek}
            banners={bannersFromAPI}
            homePage={homePage}
            collections={collectionsFromAPI}
            onEdit={(homePage) => {
              setHomePage(homePage);
            }}
            categories={allCategories.filter((cat) =>
              homePage.layout["2"].content.includes(cat.id),
            )}
            allCategories={allCategories}
          />
        )}
      </div>
      <button
        type="button"
        onClick={() => {
          fetch(`/api/private/homepage`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(homePage),
          }).then((res) => {
            window.location.reload();
          });
        }}
      >
        <FiCheck color="green" size={64} />
      </button>
    </>
  );
}

HomePageAdmin.getLayout = function getLayout(children) {
  const { t } = useTranslation("common");
  return <AdminPanelLayout title={t("homepage")}>{children}</AdminPanelLayout>;
};

export const getServerSideProps = async ({ locale }) => {
  const homePageFromAPI = await getHomepage({});

  const allCategories = await getAllCategoriesFlattened();

  const collectionsFromAPI = await getCollections({});

  const bannersFromAPI = await getBanners({});

  const topProductsWeekData = await getTopProductsWeek({});

  const topProductsWeek = {
    id: 0,
    products: topProductsWeekData.result.map((prod) => ({
      ...prod.product,
    })),
  };

  return {
    props: {
      homePageFromAPI,
      collectionsFromAPI,
      allCategories,
      bannersFromAPI,
      topProductsWeek,
    },
  };
};
