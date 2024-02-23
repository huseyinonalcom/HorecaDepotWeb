    import { useState } from "react";
    import { ArrowLeft } from "react-feather";
    import Image from "next/image";
    import ProductPreview from "../products/product-preview";

    type Props = {
      collection;
      bgColor?: string;
    };

    const CollectionShowcase = ({ collection, bgColor }: Props) => {
      const [currentSlide, setCurrentSlide] = useState(0);

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

      return (
        <div className={`flex flex-row h-full w-full`}>
          <div className="relative h-full w-1/2">
            <Image
              fill
              style={{ objectFit: "cover", zIndex: 30 }}
              src={
                collection.images != null
                  ? "https://hdapi.huseyinonalalpha.com" +
                    collection.images.at(0).url
                  : "/assets/img/placeholder.png"
              }
              alt=""
            />
            <div className="absolute top-2 left-2 flex flex-col z-40">
              <p className="text-2xl font-bold">{collection.name}</p>
            </div>
            
            <p className="w-full mt-2 font-semibold text-lg text-center">
              {collection.description}
            </p>
          </div>

          <div
            className={`flex flex-col w-1/2  h-full`}
          >
            <div className="flex flex-row w-full py-2 h-full relative overflow-hidden">
              <div
                className="w-full h-full items-center gap-2 flex"
                style={{
                  transform: `translateX(-${currentSlide * 250}px)`,
                  transition: "transform 0.5s ease",
                }}
              >
                {collection.products.map((prod) => (
                  <div
                    key={prod.id}
                    className="w-[250px] bg-white rounded shadow-lg p-1 flex-shrink-0"
                  >
                    <ProductPreview width={"full"} product={prod} />
                  </div>
                ))}
              </div>
              {collection.products.length > 3 && (
                <div className="absolute left-1 top-0 z-20 h-full flex items-center">
                  <ArrowLeft className="cursor-pointer bg-white p-0.5 rounded-full" onClick={slidePrevious} />
                </div>
              )}
              {collection.products.length > 3 && (
                <div className="absolute right-1 top-0 z-20 h-full flex items-center">
                  <ArrowLeft
                    className="cursor-pointer rotate-180 bg-white p-0.5 rounded-full"
                    onClick={slideNext}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      );
    };

    export default CollectionShowcase;
