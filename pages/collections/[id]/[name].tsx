import ProductPreview2 from "../../../components/products/product-preview2";
import useTranslation from "next-translate/useTranslation";
import Layout from "../../../components/public/layout";
import Head from "next/head";
import { getCollections } from "../../api/public/collections";

export default function Collection(props) {
  const { t, lang } = useTranslation("common");

  return (
    <Layout>
      <Head>
        <title>Horeca Depot</title>
        <meta name="description" content={t("main_description")} />
        <meta name="language" content={lang} />
      </Head>
      <div
        id={t("Shop")}
        className="flex w-full flex-col items-start text-black"
      >
        <h2 className="mt-2 flex w-full justify-center text-5xl font-bold">
          {t(props.collection.name)}
        </h2>
        <div className="flex w-full flex-col">
          {props.collection.products.length <= 0 ? (
            <h3 className="flex w-full justify-center text-xl font-bold text-red-700">
              {t("No products matching")}
            </h3>
          ) : (
            <div className="grid w-full grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
              {props.collection.products.map((product) => (
                <div key={product.id} className="mt-2 mb-2 w-full px-4">
                  <ProductPreview2 product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const collection = await getCollections({ id: context.params.id });

  if (context.params.name != collection.name) {
    return {
      redirect: {
        permanent: true,
        destination: `/${context.locale}/collections/${context.params.id}/${collection.name}`,
      },
    };
  }

  return {
    props: {
      collection,
      params: context.params,
    },
  };
}
