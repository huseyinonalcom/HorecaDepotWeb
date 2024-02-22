import React from "react";
import Layout from "../components/public/layout";
import WishListComponent from "../components/products/wishlistComponent";
import useTranslation from "next-translate/useTranslation";

const WishList = () => {
  const { t, lang } = useTranslation("common");
  return (
    <Layout>
      <div className="h-[70px] bg-black shadow-lg flex flex-col justify-around">
        <div className="flex flex-row text-xl font-bold items-center justify-center text-white">
          <h1>{t("WISHLIST")}</h1>
        </div>
      </div>
      <div className="w-[90vw] mx-auto mt-4">
        <WishListComponent />
      </div>
    </Layout>
  );
};

export default WishList;
