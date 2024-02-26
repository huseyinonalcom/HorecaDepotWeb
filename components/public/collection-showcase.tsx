import { useEffect, useState } from "react";
import { ArrowLeft } from "react-feather";
import Image from "next/image";
import ProductPreview from "../products/product-preview";

type Props = {
  collection;
};

const CollectionShowcase = ({ collection }: Props) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const [xAtTouchStart, setXAtTouchStart] = useState(0);
  const [xWhereTouchStarted, setXWhereTouchStarted] = useState(0);

  const handleTouchStart = (e) => {
    setXAtTouchStart(currentX);
    setXWhereTouchStarted(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (
      xAtTouchStart - (xWhereTouchStarted - e.targetTouches[0].clientX) >
      10
    ) {
      setCurrentX(10);
    } else if (
      xAtTouchStart - (xWhereTouchStarted - e.targetTouches[0].clientX) <
      -((collection.products.length - 1) * 208) + 5
    ) {
      setCurrentX(-((collection.products.length - 1) * 208) + 5);
    } else {
      setCurrentX(
        xAtTouchStart - (xWhereTouchStarted - e.targetTouches[0].clientX)
      );
    }
  };

  const handleTouchEnd = (e) => {
    setCurrentSlide(-Number((currentX / 208).toFixed(0)));
  };

  const slideNext = () => {
    setCurrentSlide(
      (prevSlide) => (prevSlide + 1) % collection.products.length
    );
  };

  const slidePrevious = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? collection.products.length - 1 : prevSlide - 1
    );
  };

  useEffect(() => {
    setCurrentX(-currentSlide * 208 + 5);
  }, [currentSlide]);

  const [currentX, setCurrentX] = useState(0);

  const [textColor, setTextColor] = useState("");
  const [description, setDescription] = useState(<p></p>);
  const [title, setTitle] = useState(<p></p>);

  useEffect(() => {
    setTextColor(collection.textColor);
  }, [collection]);

  useEffect(() => {
    setTitle(
      <p
        style={{
          color: `#${textColor.substring(0, 2)}${textColor.substring(
            2,
            4
          )}${textColor.substring(4, 6)}`,
        }}
        className={`text-2xl font-bold ${textColor}`}
      >
        {collection.name}
      </p>
    );

    setDescription(
      <p
        style={{
          color: `#${textColor.substring(0, 2)}${textColor.substring(
            2,
            4
          )}${textColor.substring(4, 6)}`,
        }}
        className={`w-full mt-2 font-semibold text-lg absolute bottom-2 left-2 flex flex-col z-40`}
      >
        {collection.description}
      </p>
    );
  }, [textColor]);

  return (
    <div className={`flex flex-col ${collection.right ? "md:flex-row-reverse" : "md:flex-row"} h-full w-full md:aspect-[38/9]`}>
      <div className="relative h-[250px] md:h-full w-full md:w-1/2">
        <Image
          fill
          style={{ objectFit: "cover", zIndex: 30 }}
          src={
            collection.image != null
              ? "https://hdapi.huseyinonalalpha.com" + collection.image.url
              : "/assets/img/placeholder.png"
          }
          alt=""
        />
        <div className="absolute top-2 left-2 flex flex-col z-40">{title}</div>

        {description}
      </div>

      <div
        className={`flex flex-col w-full md:w-1/2 h-full`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex flex-row w-full py-2 h-full relative overflow-hidden">
          <div
            className="w-full h-full items-center gap-2 flex"
            style={{
              transform: `translateX(${currentX}px)`,
              transition: "transform 0.5s ease",
            }}
          >
            {collection.products.map((prod) => (
              <div
                key={prod.id}
                className="w-[200px] bg-white rounded shadow-lg p-1 flex-shrink-0"
              >
                <ProductPreview width={"full"} product={prod} />
              </div>
            ))}
          </div>
          {collection.products.length > 3 && (
            <div
              className="absolute left-1 top-0 z-20 h-full flex items-center"
              onClick={slidePrevious}
            >
              <ArrowLeft className="cursor-pointer bg-white p-0.5 rounded-full" />
            </div>
          )}
          {collection.products.length > 3 && (
            <div
              className="absolute right-1 top-0 z-20 h-full flex items-center"
              onClick={slideNext}
            >
              <ArrowLeft className="cursor-pointer rotate-180 bg-white p-0.5 rounded-full" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectionShowcase;
