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
      <div className="flex flex-col items-center justify-center">
        <div className="relative aspect-[3/4] w-full md:aspect-[23/10]">
          {indexImages.map((img, index) => (
            <>
              <Image
                fill
                id="background-image"
                style={{ objectFit: "cover" }}
                priority={index == 0}
                sizes="100vw"
                key={`${index}-img`}
                src={img.wpath}
                alt={img.alt}
                className={`${imageBase} z-20 flex ${currentImage === index ? imageVisible : imageInvisible}`}
              />
              <div
                key={`${index}-cta`}
                className={`absolute top-[40%] z-30 flex w-full flex-col items-center gap-2 p-4 font-semibold duration-300 ${currentImage === index ? "left-[0%]" : "-left-[200%]"}`}
              >
                <p className="mb-8 text-center text-xl font-black text-white md:text-3xl">
                  {img.text}
                </p>
                <Link
                  className="bg-black px-4 py-2 text-white duration-300 hover:bg-white hover:text-black md:text-2xl"
                  href={img.url}
                >
                  {img.buttontext}
                </Link>
              </div>
            </>
          ))}
        </div>
        {/* <h4 className="mb-4 mt-12 text-4xl font-bold">
          {t("Special Collections")}
        </h4> */}
        <div className="mt-4 flex w-full max-w-[1400px] flex-col items-center justify-start gap-6">
          {collections &&
            collections.map((collection) => (
              <div key={collection.id} className="mt-12 w-full pb-2">
                <CollectionShowcase collection={collection} />
              </div>
            ))}
        </div>
        <h3 className="mr-auto pl-4 text-xl font-bold md:hidden">
          {t("Restaurant Chic")}
        </h3>
        <div className=" grid w-full max-w-[1400px] grid-cols-1 p-4 md:grid-cols-5">
          <div className="relative col-span-1 aspect-[16/14] w-full md:col-span-2 md:aspect-auto md:h-auto">
            <Image
              src={
                "https://hdapi.huseyinonalalpha.com/uploads/IMG_20230611_WA_0006_77d584d9fb.jpg"
              }
              fill
              style={{ objectFit: "cover" }}
              alt={"table with chairs in luxurious restaurant"}
            />
          </div>
          <div className={`col-span-3 flex flex-col bg-stone-100`}>
            <h3 className="hidden pl-4 pt-2 text-2xl font-bold md:flex">
              {t("Restaurant Chic")}
            </h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="p-4">
                <ProductPreview width={"full"} product={producta} />
              </div>
              <div className="p-4">
                <ProductPreview width={"full"} product={productb} />
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 grid w-[95vw] grid-cols-1 md:grid-cols-2">
          <div className="flex flex-col">
            <h4 className="mb-4 mt-12 pl-2 text-4xl font-bold">
              {t("Our Projects")}
            </h4>
            <ProCarousel projects={projects} />
          </div>
          <div className="flex flex-col">
            <h4 className="mb-4 mt-12 pl-2 text-4xl font-bold">
              {t("Top Categories")}
            </h4>
            <CatCarousel
              categories={allCategories.filter((cat) => cat.image?.url)}
            />
          </div>
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
