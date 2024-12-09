import { use, useEffect, useState } from "react";
import Head from "next/head";
import useTranslation from "next-translate/useTranslation";
import AdminLayout from "../../../components/admin/adminLayout";
import componentThemes from "../../../components/componentThemes";
import InputOutlined from "../../../components/inputs/outlined";
import { uploadFileToAPI } from "../../api/files/uploadfile";
import ImageWithURL from "../../../components/common/image";
import { useRouter } from "next/router";
import Index from "../..";
import { getCollections } from "../../api/collections/public/getcollections";
import { getWebsite } from "../../api/website/public/getwebsite";
import { getAllCategoriesFlattened } from "../../api/categories/public/getallcategoriesflattened";
import getT from "next-translate/getT";
import { getHomePage } from "../../api/website/public/gethomepage";
import { getBanners } from "../../api/website/public/getbanners";
import { Check } from "react-feather";

export default function HomePageAdmin({
  homePageFromAPI,
  collectionsFromAPI,
  bannersFromAPI,
  allCategories,
}) {
  const [homePage, setHomePage] = useState(homePageFromAPI);
  const { t, lang } = useTranslation("common");

  return (
    <AdminLayout>
      <Head>
        <title>Website</title>
        <meta name="language" content={lang} />
      </Head>
      <div className="mx-auto flex w-[95%] flex-col items-center p-2">
        {bannersFromAPI && (
          <Index
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
          fetch(`/api/universal/admin/puttoapi?collectiontoput=home-page`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(homePage),
          }).then((res) => {
            console.log(res);
            // window.location.reload();
          });
        }}
      >
        <Check color="green" size={64} />
      </button>
    </AdminLayout>
  );
}

export const getServerSideProps = async ({ locale }) => {
  const homePageFromAPI = await getHomePage();

  const allCategories = await getAllCategoriesFlattened();

  const collectionsFromAPI = await getCollections();

  const bannersFromAPI = await getBanners();

  return {
    props: {
      homePageFromAPI,
      collectionsFromAPI,
      allCategories,
      bannersFromAPI,
    },
  };
};
