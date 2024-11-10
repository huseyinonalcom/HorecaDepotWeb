import Layout from "../components/public/layout";
import WishListComponent from "../components/products/wishlistComponent";
import useTranslation from "next-translate/useTranslation";

const WishList = () => {
  const { t } = useTranslation("common");
  return (
    <Layout>
      <div className="flex h-[70px] w-full flex-col justify-around">
        <div className="flex flex-row items-center justify-center text-xl font-bold">
          <h1>{t("WISHLIST")}</h1>
        </div>
      </div>
      <div className="mx-auto mt-4">
        <WishListComponent />
      </div>
    </Layout>
  );
};

export default WishList;
