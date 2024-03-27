import { getIndexSliderImages } from "./api/website/public/getindexsliderimages";
import CollectionShowcase from "../components/public/collection-showcase";
import { getCollections } from "./api/collections/public/getcollections";
import useTranslation from "next-translate/useTranslation";
import Layout from "../components/public/layout";
import Meta from "../components/public/meta";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";

export default function Index({ collections, images, imageUrls }) {
  const router = useRouter();
  const { t, lang } = useTranslation("common");
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
      <div className="mx-auto flex w-[90vw] flex-col items-center justify-center">
        <div className="relative aspect-[1/1] w-full md:aspect-[4/1]">
          {images && (
            <div className="relative h-full w-full">
              {images.map((img, index) => (
                <Image
                  onClick={() => {
                    if (imageUrls[img.id] && imageUrls[img.id] !== "/") {
                      router.push(imageUrls[img.id]);
                    }
                  }}
                  fill
                  id="background-image"
                  style={{ objectFit: "cover" }}
                  priority={index == 0}
                  loading="eager"
                  key={index}
                  src={`https://hdapi.huseyinonalalpha.com${img.url}`}
                  alt={""}
                  className={`${imageBase} ${
                    imageUrls[img.id] && imageUrls[img.id] !== "/"
                      ? "cursor-pointer"
                      : ""
                  } ${currentImage === index ? imageVisible : imageInvisible}`}
                />
              ))}
            </div>
          )}
        </div>
        <div className="mt-2 flex w-full flex-col items-center justify-start gap-3">
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

        <div className="mt-4 grid w-full grid-cols-1 gap-4 md:grid-cols-3">
          <div className={homepageSpecialBox + " bg-yellow-500"}>
            <Image
              src={"/assets/homepage/chaise.webp"}
              fill
              alt={"Chaise"}
              sizes="(max-width: 768px) 50vw, 33vw"
              style={{ objectFit: "contain" }}
              className="py-2"
            />
            <div className="absolute left-4 my-auto flex h-full w-full flex-col items-start justify-center">
              <div className="flex flex-col items-center">
                <p className="px-4 py-2 font-bold text-white">{t("Chairs")}</p>
                <Link href={"products?category=1"}>
                  <button className="border border-solid border-gray-700 bg-gray-700 px-2 py-1 text-white duration-700 hover:bg-transparent">
                    {t("View produits")}
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
            <div className="absolute my-auto flex h-full w-full flex-col items-center justify-center">
              <div className="flex flex-col items-center">
                <p className="px-4 py-2 font-bold text-white">{t("Benches")}</p>
                <Link href={"products?category=10"}>
                  <button className="border border-solid border-gray-700 bg-gray-700 px-2 py-1 text-white duration-700 hover:bg-transparent">
                    {t("View produits")}
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
            <div className="absolute right-4 my-auto flex h-full w-full flex-col items-end justify-center">
              <div className="flex flex-col items-center">
                <p className="px-4 py-2 font-bold text-white">{t("Stools")}</p>
                <Link href={"products?category=11"}>
                  <button className="border border-solid border-gray-700 bg-gray-700 px-2 py-1 text-white duration-700 hover:bg-transparent">
                    {t("View produits")}
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
