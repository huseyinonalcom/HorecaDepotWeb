import CollectionShowcase from "../components/public/collection-showcase";
import { getCollections } from "./api/collections/public/getcollections";
import useTranslation from "next-translate/useTranslation";
import Layout from "../components/public/layout";
import Meta from "../components/public/meta";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { ChevronLeft } from "react-feather";
import { getAllCategoriesFlattened } from "./api/categories/public/getallcategoriesflattened";

export default function Index({ collections, allCategories }) {
  const { t, lang } = useTranslation("common");

  return (
    <Layout>
      <Head>
        <Meta />
        <title>Horeca Depot</title>
        <meta name="description" content={t("main_description")} />
        <meta name="language" content={lang} />
      </Head>
      <div
        className={`mx-auto flex max-w-screen-2xl flex-col items-center justify-center gap-8 overflow-hidden py-8`}
      >
        <div className="flex w-full flex-col items-center">
          <div
            id="slider-1"
            className={`no-scrollbar flex w-[90vw] max-w-screen-2xl snap-x snap-mandatory flex-row overflow-x-scroll`}
          >
            {[1, 2, 3].map((item) => (
              <div
                key={`slider1-${item}`}
                className={`snap-start px-4 2xl:w-1/3`}
              >
                <div className="border-1 flex h-min flex-shrink-0 flex-col overflow-hidden rounded-xl border border-black/30">
                  <div className="aspect-[15/8] w-[85vw] bg-orange-400 md:w-[42vw] 2xl:w-full"></div>
                  <div className="flex h-[150px] w-full flex-col gap-2 p-4">
                    <p className="text-xl font-semibold">Başlık</p>
                    <p>İlgili yazı</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="ml-4 mt-2 flex w-[90vw] max-w-screen-2xl flex-row justify-start gap-2 2xl:hidden">
            <ChevronLeft
              onClick={() => {
                document
                  .getElementById("slider-1")
                  .scrollBy({ left: -100, behavior: "smooth" });
              }}
              className="h-8 w-8"
            />
            <ChevronLeft
              onClick={() => {
                document
                  .getElementById("slider-1")
                  .scrollBy({ left: 100, behavior: "smooth" });
              }}
              className="h-8 w-8 rotate-180"
            />
          </div>
        </div>

        <div className="grid w-[90vw] max-w-screen-2xl grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {allCategories.length > 0 &&
            allCategories?.map((category) => (
              <div key={`grid1-${category.id}`} className={``}>
                <Link
                  href={"/products?page=1&category=" + category.id}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="relative aspect-[15/14] w-full overflow-hidden rounded-xl">
                    <Image
                      fill
                      style={{ objectFit: "contain" }}
                      sizes="42vw, (max-width: 640px) 28vw, (max-width: 1024px) 13vw, (nax-width: 1536px) 236px"
                      src={
                        "https://hdapi.huseyinonalalpha.com" +
                        category.image.url
                      }
                      alt={category.Name + " image"}
                    />
                  </div>
                  <p className="font-semibold">{t(category.Name)}</p>
                </Link>
              </div>
            ))}
        </div>

        <Link
          href={"/products?page=1"}
          className="relative aspect-[21/9] w-[90vw] max-w-screen-2xl overflow-hidden rounded-xl md:aspect-[205/7] lg:aspect-[205/78]"
        >
          <Image
            src={
              "https://hdapi.huseyinonalalpha.com/uploads/banner_5083e5ad1d.jpg"
            }
            alt="terrace promo"
            sizes="90vw, (max-width: 1536px) 1536px"
            fill
            style={{ objectFit: "cover" }}
          />
        </Link>

        <div className="flex w-[90vw] max-w-screen-2xl flex-col items-center">
          {collections && (
            <div key={"collection1"} className="w-full">
              <CollectionShowcase collection={collections.at(0)} />
            </div>
          )}
        </div>
        {/* 
        <div className="grid w-[90vw] max-w-screen-2xl grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={`grid2-${item}`} className={``}>
              <div className="flex flex-col items-center gap-2">
                <div className="aspect-[15/14] w-full overflow-hidden rounded-xl bg-orange-400"></div>
                <p className="font-semibold">Başlık</p>
              </div>
            </div>
          ))}
        </div> */}

        <Link
          href={"/products?page=1"}
          className="relative aspect-[17/9] w-[90vw] max-w-screen-2xl overflow-hidden rounded-xl md:aspect-[32/9] lg:aspect-[32/9]"
        >
          <Image
            src={
              "https://hdapi.huseyinonalalpha.com/uploads/web_2_b54f79691c.jpg"
            }
            alt="best furniture design"
            sizes="90vw, (max-width: 1536px) 1536px"
            fill
            style={{ objectFit: "cover" }}
          />
        </Link>

        <div className="flex w-[90vw] max-w-screen-2xl flex-col items-center">
          {collections.length > 1 && (
            <div key={"collection2"} className="w-full">
              <CollectionShowcase collection={collections.at(1)} />
            </div>
          )}
        </div>

        <Link
          href={"/products?page=1"}
          className="relative aspect-[18/9] w-[90vw] max-w-screen-2xl overflow-hidden rounded-xl md:aspect-[16/7] lg:aspect-[19/5]"
        >
          <Image
            src={
              "https://hdapi.huseyinonalalpha.com/uploads/cargo_9093a8c9b5.jpg"
            }
            alt="speedy delivery"
            sizes="90vw, (max-width: 1536px) 1536px"
            fill
            style={{ objectFit: "cover" }}
          />
        </Link>

        {/* <div className="grid w-[90vw] max-w-screen-2xl grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={`grid3-${item}`} className={``}>
              <div className="flex flex-col items-center gap-2">
                <div className="aspect-[15/14] w-full overflow-hidden rounded-xl bg-orange-400"></div>
                <p className="font-semibold">Başlık</p>
              </div>
            </div>
          ))}
        </div> */}

        {/* <div className="flex w-[90vw] max-w-screen-2xl flex-col items-center">
          {collections && (
            <div key={"collection1"} className="w-full">
              <CollectionShowcase collection={collections.at(0)} />
            </div>
          )}
        </div> */}
        {/* 
        <div className="flex w-[90vw] max-w-screen-2xl flex-col items-center">
          {collections.length > 1 && (
            <div key={"collection3"} className="w-full">
              <CollectionShowcase collection={collections.at(0)} />
            </div>
          )}
        </div> */}
      </div>
    </Layout>
  );
}

export const getStaticProps = async () => {
  let collections = await getCollections();
  const allCategoriesRaw = await getAllCategoriesFlattened();
  let allCategories = [];
  allCategories.push(allCategoriesRaw.find((cat) => cat.id === 3));
  allCategories.push(allCategoriesRaw.find((cat) => cat.id === 2));
  allCategories.push(allCategoriesRaw.find((cat) => cat.id === 6));
  allCategories.push(allCategoriesRaw.find((cat) => cat.id === 10));
  allCategories.push(allCategoriesRaw.find((cat) => cat.id === 11));
  allCategories.push(allCategoriesRaw.find((cat) => cat.id === 17));
  // const images = imageStuff.indexSliderImages;
  // const imageUrls = imageStuff.indexSliderImagesUrls;
  // const projects = await getProjects();
  return {
    props: {
      collections,
      allCategories,
      // images,
      // imageUrls,
      // projects,
    },
    revalidate: 1800,
  };
};
