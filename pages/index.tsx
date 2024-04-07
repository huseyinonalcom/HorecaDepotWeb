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
import { useDragScroll } from "../components/common/use-drag-scroll";

export default function Index({ collections, images, imageUrls }) {
  const router = useRouter();
  const { t, lang } = useTranslation("common");
  const [currentImage, setCurrentImage] = useState(0);

  const imageBase =
    "absolute flex flex-col items-center justify-center transition-opacity duration-1000";
  const imageVisible = "opacity-100 z-40";
  const imageInvisible = "opacity-0";
  const homepageSpecialBox = "relative h-52 text-white pl-4 ";

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
    setCurrentImage((prevImage) => (prevImage + 1) % indexImages.length);
  };

  const indexImages = [
    {
      id: 1,
      wpath: "/assets/projects/teddy/w-1.jpg",
      vpath: "/assets/projects/teddy/v-1.jpg",
      alt: "Le Teddy's",
      url: null,
    },
    {
      id: 2,
      wpath: "/assets/projects/factory/w-1.jpg",
      vpath: "/assets/projects/factory/w-1.jpg",
      alt: "Factory",
      url: null,
    },
    {
      id: 3,
      wpath: "/assets/projects/moon/w-1.jpg",
      vpath: "/assets/projects/moon/v-1.jpg",
      alt: "Moon Lounge",
      url: "/products/149",
    },
    {
      id: 4,
      wpath: "/assets/projects/v-1.png",
      vpath: "/assets/projects/v-1.png",
      alt: "Incanto",
      url: "/products/116",
    },
    {
      id: 5,
      wpath: "/assets/projects/w-2.png",
      vpath: "/assets/projects/w-2.png",
      alt: "Misoni",
      url: "/products/307",
    },
    {
      id: 6,
      wpath: "/assets/projects/w-3.png",
      vpath: "/assets/projects/w-3.png",
      alt: "Florian",
      url: "/products/191",
    },
  ];

  const [ref] = useDragScroll();

  return (
    <Layout>
      <Head>
        <Meta />
        <title>Horeca Depot</title>
        <meta name="description" content={t("main_description")} />
        <meta name="language" content={lang} />
      </Head>
      <div className="flex flex-col items-center justify-center">
        <div className="relative h-[80vh] w-full">
          {indexImages && (
            <div className="relative h-full w-full">
              {indexImages.map((img, index) => (
                <Image
                  onClick={() => {
                    if (img.url) {
                      router.push(img.url);
                    }
                  }}
                  fill
                  id="background-image"
                  style={{ objectFit: "cover" }}
                  priority={index == 0}
                  loading="eager"
                  key={index}
                  src={`${img.wpath}`}
                  alt={""}
                  className={`${imageBase} hidden md:flex  ${
                    img.url ? "cursor-pointer" : ""
                  } ${currentImage === index ? imageVisible : imageInvisible}`}
                />
              ))}
              {indexImages.map((img, index) => (
                <Image
                  onClick={() => {
                    if (img.url) {
                      router.push(img.url);
                    }
                  }}
                  fill
                  id="background-image"
                  style={{ objectFit: "cover" }}
                  priority={index == 0}
                  loading="eager"
                  key={index}
                  src={`${img.vpath}`}
                  alt={""}
                  className={`${imageBase} flex md:hidden ${
                    img.url ? "cursor-pointer" : ""
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
        <div
          className="no-scrollbar flex h-full w-full flex-row  overflow-x-scroll py-2"
          ref={ref}
        >
          <div
            className="flex h-full w-full flex-row gap-2 py-2"
          >
            <div className={homepageSpecialBox + "w-[300px] bg-yellow-500"}>
              <Image
                src={"/assets/homepage/chaise.webp"}
                fill
                alt={"Chaise"}
                sizes="(max-width: 768px) 50vw, 33vw"
                style={{ objectFit: "contain" }}
                className="py-2"
              />
              <div className="absolute my-auto flex h-full flex-col items-start justify-center">
                <div className="flex flex-col items-center">
                  <p className="px-4 py-2 font-bold text-white">
                    {t("Chairs")}
                  </p>
                  <Link href={"products?category=1"}>
                    <button className="border border-solid border-gray-700 bg-gray-700 px-2 py-1 text-white duration-700 hover:bg-transparent">
                      {t("View produits")}
                    </button>
                  </Link>
                </div>
              </div>
            </div>
            <div className={homepageSpecialBox + "w-[300px] bg-red-500"}>
              <Image
                src={"/assets/homepage/banquette.webp"}
                fill
                alt={"Banquette"}
                sizes="(max-width: 768px) 50vw, 33vw"
                style={{ objectFit: "contain" }}
                className="py-2"
              />
              <div className="absolute my-auto flex h-full flex-col items-center justify-center">
                <div className="flex flex-col items-center">
                  <p className="px-4 py-2 font-bold text-white">
                    {t("Benches")}
                  </p>
                  <Link href={"products?category=10"}>
                    <button className="border border-solid border-gray-700 bg-gray-700 px-2 py-1 text-white duration-700 hover:bg-transparent">
                      {t("View produits")}
                    </button>
                  </Link>
                </div>
              </div>
            </div>
            <div className={homepageSpecialBox + "w-[300px] bg-orange-500"}>
              <Image
                src={"/assets/homepage/tabourette.webp"}
                fill
                alt={"Tabourette"}
                sizes="(max-width: 768px) 50vw, 33vw"
                style={{ objectFit: "contain" }}
                className="py-2"
              />
              <div className="absolute right-4 my-auto flex h-full flex-col items-end justify-center">
                <div className="flex flex-col items-center">
                  <p className="px-4 py-2 font-bold text-white">
                    {t("Stools")}
                  </p>
                  <Link href={"products?category=11"}>
                    <button className="border border-solid border-gray-700 bg-gray-700 px-2 py-1 text-white duration-700 hover:bg-transparent">
                      {t("View produits")}
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>{" "}
        </div>

        <div className="mt-4 grid w-full grid-cols-1 gap-4 md:grid-cols-3"></div>
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
