import useTranslation from "next-translate/useTranslation";
import componentThemes from "../componentThemes";
import { FiArrowLeft } from "react-icons/fi";
import { useEffect, useState } from "react";
import ImageWithURL from "../common/image";
import Image from "next/image";
import Link from "next/link";

type Props = {
  collection;
};

const CollectionPreview = ({ collection }: Props) => {
  const { t } = useTranslation("common");

  const [currentImage, setCurrentImage] = useState(0);
  const [featured, setFeatured] = useState(collection.featured);

  const imageBase =
    "absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000";
  const imageVisible = "opacity-100 z-40";
  const imageInvisible = "opacity-0";

  useEffect(() => {
    setCurrentImage(0);
  }, [collection]);

  const collectionImages = [];

  for (let i = 0; i < collection.products.length; i++) {
    if (
      collection.products[i].images &&
      collection.products[i].images.length > 0
    ) {
      collectionImages.push(collection.products[i].images[0]);
    }
  }

  const slideNext = () => {
    setCurrentImage((prevImage) => (prevImage + 1) % collectionImages.length);
  };

  const slidePrevious = () => {
    setCurrentImage((prevImage) => {
      if (prevImage === 0) {
        return collectionImages.length - 1;
      } else {
        return prevImage - 1;
      }
    });
  };

  const toggleCollectionFeatured = () => {
    const toggleFeatured = async () => {
      try {
        const request = await fetch(
          `/api/collections/admin/togglefeatured?id=` + collection.id,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ featured: !featured }),
          },
        );
        const answer = await request.json();
        if (!request.ok) {
        } else {
          setFeatured(answer);
        }
      } catch {}
    };

    toggleFeatured();
  };

  return (
    <div
      key={collection.id}
      className="flex flex-row gap-2 bg-white p-2 shadow-lg"
    >
      <div className="flex flex-col">
        <p className="text-xl font-bold">{collection.name}</p>
        <div className="relative aspect-[24/9] h-[150px]">
          <ImageWithURL
            fill
            style={{ objectFit: "contain" }}
            src={
              collection.image != null
                ? collection.image.url
                : "/uploads/placeholder_9db455d1f1.webp"
            }
            alt=""
          />
        </div>
      </div>
      <div className="flex flex-col">
        <p >{collection.description}</p>
        <div className="flex flex-row">
          <div className="relative h-[130px] w-[130px]">
            {collectionImages.length > 0 ? (
              collectionImages.map((img, index) => (
                <Image
                  key={index}
                  src={`https://hdcdn.hocecomv1.com${img.url.replace("https://hdcdn.hocecomv1.com", "")}`}
                  fill
                  style={{ objectFit: "contain" }}
                  alt={""}
                  className={`${imageBase} ${currentImage === index ? imageVisible : imageInvisible}`}
                />
              ))
            ) : (
              <Image
                key={1}
                src={`/uploads/placeholder_9db455d1f1.webp`}
                width={200}
                height={200}
                alt={""}
                className={`${imageBase}`}
              />
            )}
            {collectionImages.length > 1 ? (
              <div
                className="absolute left-0 z-40 flex h-full flex-col justify-center bg-slate-100 opacity-40"
                onClick={slidePrevious}
              >
                <FiArrowLeft />
              </div>
            ) : (
              <div></div>
            )}
            {collectionImages.length > 1 ? (
              <div
                className="absolute right-0 z-40 flex h-full flex-col justify-center bg-slate-100 opacity-40"
                onClick={slideNext}
              >
                <FiArrowLeft className="rotate-180" />
              </div>
            ) : (
              <div></div>
            )}
          </div>
          <div className="flex w-full flex-col items-center">
            <div className="flex flex-row">
              {featured == true ? (
                <div
                  className={`border-1 flex  cursor-pointer flex-col items-center justify-center border-black bg-green-300 px-2 py-1`}
                  onClick={toggleCollectionFeatured}
                >
                  {t("Active")}
                </div>
              ) : (
                <div
                  className={`border-1 flex  cursor-pointer flex-col items-center justify-center border-black bg-red-300 px-2 py-1`}
                  onClick={toggleCollectionFeatured}
                >
                  {t("Inactive")}
                </div>
              )}
            </div>
            <Link
              className={componentThemes.outlinedButton}
              href={"/admin/website/collection?id=" + collection.id}
            >
              {t("Modify")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionPreview;
