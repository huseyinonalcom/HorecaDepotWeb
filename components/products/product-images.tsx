import Image from "next/image";
import { useState, useEffect } from "react";
import { ArrowLeft, X } from "react-feather";

const ProductImages = ({ product }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const imageBase =
    "z-20 absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000";
  const imageVisible = "opacity-100 z-20";
  const imageInvisible = "opacity-0";
  const slidePrevious = () => {
    setCurrentImage((prevImage) => {
      if (prevImage === 0) {
        return product.images.length - 1;
      } else {
        return prevImage - 1;
      }
    });
  };

  const slideNext = () => {
    setCurrentImage((prevImage) => (prevImage + 1) % product.images.length);
  };

  useEffect(() => {
    setCurrentImage(0);
  }, [product]);

  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleCloseFullscreen = () => {
    setSelectedImageIndex(null);
  };

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.keyCode === 27) {
        setSelectedImageIndex(null);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return function cleanup() {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const scrollIntoViewOnClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="aspect-1/1 relative flex h-[90vw] w-[90vw] flex-shrink-0 flex-row items-center justify-center md:h-[45vw] md:w-[45vw]">
      {product.images && product.images.length > 0 ? (
        product.images.map((img, index) => (
          <Image
            key={img.id}
            src={`https://hdcdn.hocecomv1.com${img.url.replace("https://hdcdn.hocecomv1.com", "")}`}
            fill
            priority
            loading="eager"
            style={{ objectFit: "contain" }}
            alt={product.name}
            className={`${imageBase} ${currentImage === index ? imageVisible : imageInvisible}`}
            onClick={() => handleImageClick(img.id)}
            sizes="100vw"
          />
        ))
      ) : (
        <Image
          key={1}
          src={`/uploads/placeholder_9db455d1f1.webp`}
          fill
          style={{ objectFit: "contain" }}
          alt={product.name}
          className={`${imageBase}`}
        />
      )}
      {product.images && product.images.length > 1 ? (
        <div
          className="absolute left-0 z-40 flex h-full w-[30%] flex-col items-start justify-center"
          onClick={slidePrevious}
        >
          <ArrowLeft />
        </div>
      ) : null}
      {product.images && product.images.length > 1 ? (
        <div
          className="absolute right-0 z-40 flex h-full w-[30%] flex-col items-end justify-center"
          onClick={slideNext}
        >
          <ArrowLeft className="rotate-180" />
        </div>
      ) : null}
      {selectedImageIndex !== null && (
        <div className="fixed bottom-0 left-0 right-0 top-0 z-50 flex h-full w-full flex-col items-center justify-center bg-white/90">
          <div className="flex w-full flex-row justify-end">
            <X
              size={38}
              className="text-black"
              color="black"
              onClick={handleCloseFullscreen}
            />
          </div>
          <div className="relative h-full w-full">
            <Image
              key={selectedImageIndex + "-selected"}
              src={`https://hdcdn.hocecomv1.com${product.images.find((img) => img.id == selectedImageIndex).url.replace("https://hdcdn.hocecomv1.com", "")}`}
              fill
              className="z-40"
              style={{ objectFit: "contain" }}
              alt={product.name}
            />
          </div>
          <div className="flex h-36 flex-row justify-start gap-2 overflow-x-auto bg-white p-3">
            {product.images.map((img) => (
              <Image
                key={img.id + "-selectable"}
                src={`https://hdcdn.hocecomv1.com${img.url.replace("https://hdcdn.hocecomv1.com", "")}`}
                className="z-40"
                width={0}
                height={0}
                sizes="100vw"
                style={{ width: "100%", height: "auto" }}
                alt={product.name}
                onClick={() => {
                  setSelectedImageIndex(img.id);
                  scrollIntoViewOnClick(img.id.toString() + "-full");
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductImages;
