import { PiCircleFill } from "react-icons/pi";
import { FiArrowLeft } from "react-icons/fi";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const CollectionPreview = ({ collection }) => {
  const [currentImage, setCurrentImage] = useState(0);

  const imageBase = "transition-opacity duration-1000";

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

  return (
    <Link
      href={"/admin/website/collection?id=" + collection.id}
      className="relative flex w-full flex-col items-center gap-2 p-2"
    >
      <div className="absolute top-2 right-2">
        <PiCircleFill size={20} color={collection.featured ? "green" : "red"} />
      </div>
      <p className="text-xl font-bold">{collection.name}</p>
      <div className="relative aspect-square w-full">
        {collectionImages.length > 0 ? (
          collectionImages.map((img, index) => (
            <Image
              key={index}
              src={`https://hdcdn.hocecomv1.com${img.url.replace("https://hdcdn.hocecomv1.com", "")}`}
              fill
              style={{ objectFit: "contain" }}
              alt={""}
              className={`${imageBase} ${currentImage === index ? "z-40 opacity-100" : "opacity-0"}`}
            />
          ))
        ) : (
          <Image
            key={1}
            src={`/uploads/placeholder_9db455d1f1.webp`}
            fill
            style={{ objectFit: "contain" }}
            alt={""}
            className={`${imageBase}`}
          />
        )}
        {collectionImages.length > 1 && (
          <>
            <div className="absolute left-0 z-40 flex h-full flex-col justify-center">
              <button
                className="rounded-lg bg-black p-0.5 duration-200 hover:opacity-80"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  slidePrevious();
                }}
              >
                <FiArrowLeft size={24} color="white" />
              </button>
            </div>
            <div className="absolute right-0 z-40 flex h-full flex-col justify-center">
              <button
                type="button"
                className="rounded-lg bg-black p-0.5 duration-200 hover:opacity-80"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  slideNext();
                }}
              >
                <FiArrowLeft size={24} className="rotate-180" color="white" />
              </button>
            </div>
          </>
        )}
      </div>
    </Link>
  );
};

export default CollectionPreview;
