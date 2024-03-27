import React from "react";
import Layout from "../components/public/layout";
import WishListComponent from "../components/products/wishlistComponent";
import useTranslation from "next-translate/useTranslation";

const WishList = () => {
  const { t, lang } = useTranslation("common");
  return (
    <Layout>
      <div className="flex h-[70px] flex-col justify-around bg-black shadow-lg">
        <div className="flex flex-row items-center justify-center text-xl font-bold text-white">
          <h1>{t("WISHLIST")}</h1>
        </div>
      </div>
      <div className="mx-auto mt-4 w-[90vw]">
        <WishListComponent />
      </div>
    </Layout>
  );
};

export default WishList;
