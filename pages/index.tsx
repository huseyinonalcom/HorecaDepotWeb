import Head from "next/head";
import Image from "next/image";
import useTranslation from "next-translate/useTranslation";
import Layout from "../components/public/layout";
import Meta from "../components/public/meta";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import CollectionShowcase from "../components/public/collection-showcase";
import { getCollections } from "./api/collections/public/getcollections";
import { getIndexSliderImages } from "./api/website/public/getindexsliderimages";

export default function Index({ collections, images, imageUrls }) {
  const { t, lang } = useTranslation("common");
  const router = useRouter();

  const [currentImage, setCurrentImage] = useState(0);

  const imageBase =
    "absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000";
  const imageVisible = "opacity-100 z-40";
  const imageInvisible = "opacity-0";
  const homepageSpecialBox = "relative h-52 text-white pl-4";

  useEffect(() => {
    setCurrentImage(0);
  }, [images]);

  useEffect(() => {
    const interval = setInterval(() => {
      slideNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [images]);

  const slideNext = () => {
    setCurrentImage((prevImage) => (prevImage + 1) % images.length);
  };

  return (
    <Layout>
      <Head>
        <Meta />
        <title>Horeca Depot</title>
        <meta name="description" content={t("main_description")} />
        <meta name="language" content={lang} />
      </Head>
      <div className="flex w-[90vw] flex-col items-center justify-center mx-auto">
        <div className="relative w-[97vw] md:w-full aspect-[32/9] max-h-[50vh]">
          {images && (
            <div className="relative w-full h-full">
              {images.map((img, index) =>
                imageUrls[img.id] != "/" && imageUrls[img.id] != "" ? (
                  <Image
                    onClick={() => router.push(imageUrls[img.id])}
                    fill
                    id="background-image"
                    style={{ objectFit: "cover" }}
                    priority={index == 0}
                    loading="eager"
                    key={index}
                    src={`https://hdapi.huseyinonalalpha.com${img.url}`}
                    alt={""}
                    className={`${imageBase} cursor-pointer ${
                      currentImage === index ? imageVisible : imageInvisible
                    }`}
                  />
                ) : (
                  <Image
                    fill
                    id="background-image"
                    style={{ objectFit: "cover" }}
                    priority={index == 0}
                    loading="eager"
                    key={index}
                    src={`https://hdapi.huseyinonalalpha.com${img.url}`}
                    alt={""}
                    className={`${imageBase} ${
                      currentImage === index ? imageVisible : imageInvisible
                    }`}
                  />
                )
              )}
            </div>
          )}
        </div>
        <div className="flex flex-col justify-start items-center mt-2 w-full gap-3">
          {collections &&
            collections.map((collection) => (
              <div
                key={collection.id}
                style={{ backgroundColor: `#${collection.bgColor}` }}
                className={`w-full md:aspect-[38/9]`}
              >
                <CollectionShowcase collection={collection} />
              </div>
            ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 mt-4 w-[95%] sm:w-full gap-4">
          <div className={homepageSpecialBox + " bg-yellow-500"}>
            <Image
              src={"/assets/homepage/chaise.webp"}
              fill
              alt={"Chaise"}
              sizes="(max-width: 768px) 50vw, 33vw"
              style={{ objectFit: "contain" }}
              className="py-2"
            />
            <div className="absolute my-auto left-4 flex flex-col justify-center items-start h-full w-full">
              <div className="flex flex-col items-center">
                <p className="text-white font-bold py-2 px-4">{t("Chaises")}</p>
                <Link href={"products?category=1"}>
                  <button className="bg-gray-700 hover:bg-transparent text-white border-solid border-gray-700 px-2 py-1 border duration-700">
                    {t("Voir produits")}
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <div className={homepageSpecialBox + " bg-red-500"}>
            <Image
              src={"/assets/homepage/banquette.webp"}
              fill
              alt={"Banquette"}
              sizes="(max-width: 768px) 50vw, 33vw"
              style={{ objectFit: "contain" }}
              className="py-2"
            />
            <div className="absolute my-auto flex flex-col justify-center items-center h-full w-full">
              <div className="flex flex-col items-center">
                <p className="text-white font-bold py-2 px-4">
                  {t("Banquettes")}
                </p>
                <Link href={"products?category=10"}>
                  <button className="bg-gray-700 hover:bg-transparent text-white border-solid border-gray-700 px-2 py-1 border duration-700">
                    {t("Voir produits")}
                  </button>
                </Link>
              </div>
            </div>
          </div>
          <div className={homepageSpecialBox + " bg-orange-500"}>
            <Image
              src={"/assets/homepage/tabourette.webp"}
              fill
              alt={"Tabourette"}
              sizes="(max-width: 768px) 50vw, 33vw"
              style={{ objectFit: "contain" }}
              className="py-2"
            />
            <div className="absolute my-auto right-4 flex flex-col justify-center items-end h-full w-full">
              <div className="flex flex-col items-center">
                <p className="text-white font-bold py-2 px-4">
                  {t("Tabourettes")}
                </p>
                <Link href={"products?category=11"}>
                  <button className="bg-gray-700 hover:bg-transparent text-white border-solid border-gray-700 px-2 py-1 border duration-700">
                    {t("Voir produits")}
                  </button>
                </Link>
              </div>
            </div>
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
  return {
    props: {
      collections,
      images,
      imageUrls,
    },
    revalidate: 1800,
  };
};
