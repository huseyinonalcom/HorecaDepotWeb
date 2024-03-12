import Link from "next/link";
import Image from "next/image";
import useTranslation from "next-translate/useTranslation";
import { ArrowLeft } from "react-feather";
import { useEffect, useState } from "react";
import componentThemes from "../componentThemes";

type Props = {
  collection;
};

const CollectionPreview = ({ collection }: Props) => {
  const { t } = useTranslation("common");

  const [currentImage, setCurrentImage] = useState(0);
  const [featured, setFeatured] = useState(collection.featured);

  const imageBase = "absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000";
  const imageVisible = "opacity-100 z-40";
  const imageInvisible = "opacity-0";

  useEffect(() => {
    setCurrentImage(0);
  }, [collection]);

  const collectionImages = [];

  for (let i = 0; i < collection.products.length; i++) {
    if (collection.products[i].images && collection.products[i].images.length > 0) {
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
        const request = await fetch(`/api/collections/admin/togglefeatured?id=` + collection.id, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ featured: !featured }),
        });
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
    <div key={collection.id} className="flex flex-row shadow-lg gap-2 bg-white p-2">
      <div className="flex flex-col">
        <p className="text-xl font-bold">{collection.name}</p>
        <div className="relative h-[150px] aspect-[24/9]">
          <Image
            fill
            style={{ objectFit: "contain" }}
            src={collection.image != null ? "https://hdapi.huseyinonalalpha.com" + collection.image.url : "/assets/img/placeholder.png"}
            alt=""
          />
        </div>
      </div>
      <div className="flex flex-col">
        <p className="">{collection.description}</p>
        <div className="flex flex-row">
          <div className="relative h-[130px] w-[130px]">
            {collectionImages.length > 0 ? (
              collectionImages.map((img, index) => (
                <Image
                  key={index}
                  src={`https://hdapi.huseyinonalalpha.com${img.url}`}
                  fill
                  style={{ objectFit: "contain" }}
                  alt={""}
                  className={`${imageBase} ${currentImage === index ? imageVisible : imageInvisible}`}
                />
              ))
            ) : (
              <Image key={1} src={`/assets/img/placeholder.png`} width={200} height={200} alt={""} className={`${imageBase}`} />
            )}
            {collectionImages.length > 1 ? (
              <div className="absolute z-40 left-0 h-full opacity-40 bg-slate-100 flex flex-col justify-center" onClick={slidePrevious}>
                <ArrowLeft />
              </div>
            ) : (
              <div></div>
            )}
            {collectionImages.length > 1 ? (
              <div className="absolute z-40 right-0 h-full opacity-40 bg-slate-100 flex flex-col justify-center" onClick={slideNext}>
                <ArrowLeft className="rotate-180" />
              </div>
            ) : (
              <div></div>
            )}
          </div>
          <div className="flex flex-col items-center w-full">
            <div className="flex flex-row">
              {featured == true ? (
                <div
                  className={`bg-green-300 cursor-pointer  border-1 border-black items-center py-1 px-2 justify-center flex flex-col`}
                  onClick={toggleCollectionFeatured}
                >
                  {t("Active")}
                </div>
              ) : (
                <div
                  className={`bg-red-300 cursor-pointer  border-1 border-black items-center py-1 px-2 justify-center flex flex-col`}
                  onClick={toggleCollectionFeatured}
                >
                  {t("Inactive")}
                </div>
              )}
            </div>
            <Link className={componentThemes.greenSubmitButton} href={"/admin/website/collection?id=" + collection.id}>
              {t("Modify")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionPreview;
