import { getIndexSliderImages } from "./api/website/public/getindexsliderimages";
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

export default function Index({ collections, images, projects }) {
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
  }, [images]);

  useEffect(() => {
    const interval = setInterval(() => {
      slideNext();
    }, 8000);

    return () => clearInterval(interval);
  }, [images]);

  const slideNext = () => {
    setCurrentImage((prevImage) => (prevImage + 1) % indexImages.length);
  };

  const indexImages = [
    {
      id: 1,
      wpath: "/assets/projects/teddy/w-1.jpg",
      vpath: "/assets/projects/teddy/v-1.jpg",
      alt: "Image of Le Teddy's Restaurant",
      text: "Designs élégants pour restaurants haut de gamme.",
      buttontext: "Voir les choix",
      url: "/products?page=1&search=flora&category=1",
    },
    {
      id: 2,
      wpath: "/assets/projects/factory/w-1.jpg",
      vpath: "/assets/projects/factory/w-1.jpg",
      alt: "Image of HorecaDepot Factory",
      text: "Fabrication et expédition rapides.",
      buttontext: "Visitez-nous",
      url: "contact",
    },
    {
      id: 3,
      wpath: "/assets/projects/moon/w-1.jpg",
      vpath: "/assets/projects/moon/v-1.jpg",
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
        <div className="h-[60vh] w-full">
          <div className="relative h-full w-full">
            {indexImages.map((img, index) => (
              <Image
                fill
                id="background-image"
                style={{ objectFit: "cover" }}
                priority={index == 0}
                sizes="100vw"
                key={index}
                src={img.wpath}
                alt={img.alt}
                className={`${imageBase} z-20 hidden md:flex ${currentImage === index ? imageVisible : imageInvisible}`}
              />
            ))}
            {indexImages.map((img, index) => (
              <Image
                fill
                id="background-image"
                style={{ objectFit: "cover" }}
                priority={index == 0}
                sizes="100vw"
                key={index}
                src={img.vpath}
                alt={img.alt}
                className={`${imageBase} z-20 flex md:hidden ${currentImage === index ? imageVisible : imageInvisible}`}
              />
            ))}
            {indexImages.map((img, index) => (
              <div
                key={index}
                className={`absolute top-[50%] z-30 flex w-[90vw] flex-col items-center gap-2 p-4 font-semibold duration-300 ${currentImage === index ? "left-[0%]" : "-left-[200%]"}`}
              >
                <p className="text-center text-xl font-black text-white md:text-3xl">
                  {img.text}
                </p>
                <Link
                  className="bg-black p-2 text-white duration-300 hover:bg-white hover:text-black md:text-2xl"
                  href={img.url}
                >
                  {img.buttontext}
                </Link>
              </div>
            ))}
          </div>
        </div>
        <h4 className="mb-4 mt-12 text-4xl font-bold">
          {t("Special Collections")}
        </h4>
        <div className="mt-2 flex w-full flex-col items-center justify-start gap-3">
          {collections &&
            collections.map((collection) => (
              <div
                key={collection.id}
                style={{ backgroundColor: `#${collection.bgColor}` }}
                className="w-full pb-2 md:aspect-[38/9]"
              >
                <CollectionShowcase collection={collection} />
              </div>
            ))}
        </div>

        <div className="grid w-[95vw] grid-cols-1 md:grid-cols-2 mb-6">
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
  const imageStuff = await getIndexSliderImages();
  const images = imageStuff.indexSliderImages;
  const imageUrls = imageStuff.indexSliderImagesUrls;
  const projects = await getProjects();
  return {
    props: {
      collections,
      images,
      imageUrls,
      projects,
    },
    revalidate: 1800,
  };
};
