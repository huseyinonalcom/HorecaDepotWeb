import Head from "next/head";
import Image from "next/image";

import useTranslation from "next-translate/useTranslation";

import Layout from "../components/public/layout";
import Meta from "../components/public/meta";

import Link from "next/link";
import { Product } from "../api/interfaces/product";
import { getProducts } from "../api/calls/productCalls";
import ProductPreview from "../components/products/product-preview";
import { useEffect, useState } from "react";
import { CFile } from "../api/interfaces/cfile";
import { ArrowLeft } from "react-feather";
import { useRouter } from "next/router";

// props
type Props = {
  newProducts: Product[];
};

export default function Index({ newProducts }: Props) {
  const { t, lang } = useTranslation("common");
  const router = useRouter();

  const homepageSpecialBox = "relative h-52 text-white pl-4";

  const [images, setImages] = useState<CFile[] | null>(null);

  const [imageUrls, setImageUrls] = useState(null);

  const fetchImages = async () => {
    const fetchImagesRequest = await fetch(
      "/api/website/public/getindexsliderimages",
      {
        method: "GET",
      }
    );
    if (fetchImagesRequest.ok) {
      const fetchImagesAnswer = await fetchImagesRequest.json();
      setImageUrls(fetchImagesAnswer.indexSliderImagesUrls);
      return fetchImagesAnswer.indexSliderImages;
    } else {
      return null;
    }
  };

  useEffect(() => {
    if (!images) {
      const fetchAndSetImages = async () => {
        setImages(await fetchImages());
      };
      fetchAndSetImages();
    }
  }, []);

  const [currentImage, setCurrentImage] = useState(0);

  const imageBase =
    "absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000";
  const imageVisible = "opacity-100 z-40";
  const imageInvisible = "opacity-0";

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
        <h3 className="font-bold text-2xl mt-4">{t("Nos Recommendations")}</h3>
        <div className="flex flex-col justify-start items-center mt-2 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 w-full">
            {newProducts.map((product) => (
              <div key={product.id} className="w-full mt-2 mb-2">
                <ProductPreview product={product} width={"full"} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps = async () => {
  const result = await getProducts({ page: 1, count: 12 });

  const uniqueNames = new Set();
  const newProducts: Product[] = [];

  for (const product of result[0]) {
    if (!uniqueNames.has(product.name)) {
      uniqueNames.add(product.name);
      newProducts.push(product);
      if (newProducts.length === 6) {
        break; // Stop once we have 6 unique products
      }
    }
  }

  return {
    props: {
      newProducts,
    },
    revalidate: 10,
  };
};
