import { getIndexSliderImages } from "./api/website/public/getindexsliderimages";
import CollectionShowcase from "../components/public/collection-showcase";
import { getCollections } from "./api/collections/public/getcollections";
import useTranslation from "next-translate/useTranslation";
import Layout from "../components/public/layout";
import Meta from "../components/public/meta";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { useDragScroll } from "../components/common/use-drag-scroll";
import { CategoryContext } from "../api/providers/categoryProvider";

export default function Index({ collections, images, imageUrls }) {
  const router = useRouter();
  const { t, lang } = useTranslation("common");
  const [currentImage, setCurrentImage] = useState(0);
  const { categories } = useContext(CategoryContext);

  const imageBase =
    "absolute flex flex-col items-center justify-center transition-opacity duration-1000";
  const imageVisible = "opacity-100 z-40";
  const imageInvisible = "opacity-0";
  const homepageSpecialBox =
    "relative flex flex-col w-[300px] h-[200px] flex-shrink-0 items-center p-1 py-4 shadow-lg last:mr-4";

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
      alt: "Le Teddy's",
      text: "Designs élégants pour restaurants haut de gamme.",
      buttontext: "Voir les choix",
      url: "/products?page=1&search=flora&category=1",
    },
    {
      id: 2,
      wpath: "/assets/projects/factory/w-1.jpg",
      vpath: "/assets/projects/factory/w-1.jpg",
      alt: "Factory",
      text: "Fabrication et expédition rapides.",
      buttontext: "Visitez-nous",
      url: "contact",
    },
    {
      id: 3,
      wpath: "/assets/projects/moon/w-1.jpg",
      vpath: "/assets/projects/moon/v-1.jpg",
      alt: "Moon Lounge",
      text: "Tout pour l'horeca.",
      buttontext: "Commander maintenant",
      url: "/products?page=1&search=BALLOON",
    },
    // {
    //   id: 4,
    //   wpath: "/assets/projects/v-1.png",
    //   vpath: "/assets/projects/v-1.png",
    //   alt: "Incanto",
    //   url: "/products/116",
    // },
    // {
    //   id: 5,
    //   wpath: "/assets/projects/w-2.png",
    //   vpath: "/assets/projects/w-2.png",
    //   alt: "Misoni",
    //   url: "/products/307",
    // },
    // {
    //   id: 6,
    //   wpath: "/assets/projects/w-3.png",
    //   vpath: "/assets/projects/w-3.png",
    //   alt: "Florian",
    //   url: "/products/191",
    // },
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
        <div className="h-[80vh] w-full">
          <div className="relative h-full w-full">
            {indexImages.map((img, index) => (
              <div
                className={`absolute top-[50%] z-30 flex flex-col items-center gap-2 p-2 font-semibold duration-300 ${currentImage === index ? "left-[10%]" : "-left-[200%]"}`}
              >
                <p className="text-2xl text-white shadow-md">{img.text}</p>
                <Link
                  className="bg-black p-2 text-white duration-300 hover:bg-white hover:text-black"
                  href={img.url}
                >
                  {img.buttontext}
                </Link>
              </div>
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
                src={`${img.wpath}`}
                alt={""}
                className={`${imageBase} z-20 hidden md:flex  ${
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
                className={`${imageBase} z-20 flex md:hidden ${
                  img.url ? "cursor-pointer" : ""
                } ${currentImage === index ? imageVisible : imageInvisible}`}
              />
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
                className={`w-full md:aspect-[38/9]`}
              >
                <CollectionShowcase collection={collection} />
              </div>
            ))}
        </div>
        <h4 className="mb-4 mt-12 text-4xl font-bold">{t("Top Categories")}</h4>
        <div
          ref={ref}
          className="no-scrollbar mx-auto my-3 flex h-[230px] w-[95vw] flex-row gap-2 overflow-x-scroll py-2"
        >
          {categories &&
            categories
              .filter((cat) => cat.image?.url)
              .map((category) => (
                <div
                  onClick={() =>
                    router.push(`/products?category=${category.id}`)
                  }
                  key={category.id}
                  className={homepageSpecialBox + " group bg-orange-400"}
                >
                  <div className="relative h-[90%] w-[90%] duration-500 group-hover:h-full group-hover:w-full">
                    <Image
                      draggable={false}
                      src={
                        "https://hdapi.huseyinonalalpha.com" +
                        category.image.url
                      }
                      fill
                      alt={category.Name}
                      sizes="(max-width: 768px) 50vw, 33vw"
                      style={{ objectFit: "contain" }}
                      className="py-2"
                    />
                  </div>
                  <div className="absolute flex h-full flex-col items-start justify-end pb-3">
                    <Link href={`products?category=${category.id}`}>
                      <p className="px-4 py-2 font-bold text-white">
                        {t(category.Name)}
                      </p>
                    </Link>
                  </div>
                </div>
              ))}
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
