import CollectionShowcase from "../components/public/collection-showcase";
import { getCollections } from "./api/collections/public/getcollections";
import useTranslation from "next-translate/useTranslation";
import Layout from "../components/public/layout";
import Meta from "../components/public/meta";
import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { CategoryContext } from "../api/providers/categoryProvider";
import { getProjects } from "./api/projects/public/getprojects";
import CatCarousel from "../components/index/category_carousel";
import ProCarousel from "../components/index/pro_carousel";
import ProductPreview from "../components/products/product-preview";
import { getProductByID } from "../api/calls/productCalls";
import { ChevronLeft } from "react-feather";

export default function Index({ collections, projects, producta, productb }) {
  const { t, lang } = useTranslation("common");
  const [currentImage, setCurrentImage] = useState(0);
  const { categories } = useContext(CategoryContext);

  const imageBase =
    "absolute top-0 flex flex-col items-center justify-center transition-opacity duration-1000";
  const imageVisible = "opacity-100 z-20";
  const imageInvisible = "opacity-0";

  let allCategories = [];

  for (let i = 0; i < categories.length; i++) {
    allCategories.push(categories[i]);
    allCategories.push(...categories[i].subCategories);
  }

  useEffect(() => {
    setCurrentImage(0);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      slideNext();
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const slideNext = () => {
    setCurrentImage((prevImage) => (prevImage + 1) % indexImages.length);
  };

  const indexImages = [
    {
      id: 1,
      wpath: "/assets/projects/teddy/w-1.jpg",
      alt: "Image of Le Teddy's Restaurant",
      text: "Designs élégants pour restaurants haut de gamme.",
      buttontext: "Voir les choix",
      url: "/products?page=1&search=flora&category=1",
    },
    {
      id: 3,
      wpath: "/assets/projects/moon/w-1.jpg",
      alt: "Image of Moon Lounge interior",
      text: "Tout pour l'horeca.",
      buttontext: "Commander maintenant",
      url: "/products?page=1&search=BALLOON",
    },
  ];

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
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={`grid1-${item}`} className={``}>
              <div className="flex flex-col items-center gap-2">
                <div className="aspect-[15/14] w-full overflow-hidden rounded-xl bg-orange-400"></div>
                <p className="font-semibold">Başlık</p>
              </div>
            </div>
          ))}
        </div>

        <div className="aspect-[13/9] w-[90vw] max-w-screen-2xl rounded-xl bg-orange-400 md:aspect-[16/7] lg:aspect-[19/5]"></div>

        <div className="grid w-[90vw] max-w-screen-2xl grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={`grid2-${item}`} className={``}>
              <div className="flex flex-col items-center gap-2">
                <div className="aspect-[15/14] w-full overflow-hidden rounded-xl bg-orange-400"></div>
                <p className="font-semibold">Başlık</p>
              </div>
            </div>
          ))}
        </div>

        <div className="aspect-[13/9] w-[90vw] max-w-screen-2xl rounded-xl bg-orange-400 md:aspect-[16/7] lg:aspect-[19/5]"></div>

        <div className="flex w-[90vw] max-w-screen-2xl flex-col items-center">
          {collections && (
            <div key={"collection1"} className="w-full">
              <CollectionShowcase collection={collections.at(0)} />
            </div>
          )}
        </div>

        <div className="aspect-[13/9] w-[90vw] max-w-screen-2xl overflow-hidden rounded-xl bg-orange-400 md:aspect-[16/7] lg:aspect-[19/5]"></div>

        <div className="grid w-[90vw] max-w-screen-2xl grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={`grid3-${item}`} className={``}>
              <div className="flex flex-col items-center gap-2">
                <div className="aspect-[15/14] w-full overflow-hidden rounded-xl bg-orange-400"></div>
                <p className="font-semibold">Başlık</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex w-[90vw] max-w-screen-2xl flex-col items-center">
          {collections.length > 1 && (
            <div key={"collection2"} className="w-full">
              <CollectionShowcase collection={collections.at(1)} />
            </div>
          )}
        </div>

        <div className="flex w-[90vw] max-w-screen-2xl flex-col items-center">
          {collections.length > 1 && (
            <div key={"collection3"} className="w-full">
              <CollectionShowcase collection={collections.at(0)} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps = async () => {
  let collections = await getCollections();
  collections = collections.sort(() => Math.random() - 0.5);
  // const imageStuff = await getIndexSliderImages();
  // const images = imageStuff.indexSliderImages;
  // const imageUrls = imageStuff.indexSliderImagesUrls;
  let producta = await getProductByID(149);
  let productb = await getProductByID(359);
  const projects = await getProjects();
  return {
    props: {
      collections,
      producta,
      productb,
      // images,
      // imageUrls,
      projects,
    },
    revalidate: 1800,
  };
};
