import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "react-feather";
import Image from "next/image";
import ProductPreview from "../products/product-preview";

type Props = {
  collection;
};

const CollectionShowcase = ({ collection }: Props) => {
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
          color: `#${textColor.substring(0, 2)}${textColor.substring(2, 4)}${textColor.substring(4, 6)}`,
        }}
        className={`text-2xl font-bold ${textColor}`}
      >
        {collection.name}
      </p>
    );

    setDescription(
      <p
        style={{
          color: `#${textColor.substring(0, 2)}${textColor.substring(2, 4)}${textColor.substring(4, 6)}`,
        }}
        className={`w-full font-semibold text-lg`}
      >
        {collection.description}
      </p>
    );
  }, [textColor]);

  const containerRef = useRef(null);

  const handleScroll = (scrollOffset) => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += scrollOffset;
    }
  };

  return (
    <div className={`flex flex-col ${collection.right ? "md:flex-row-reverse" : "md:flex-row"} h-full w-full md:aspect-[38/9]`}>
      <div className="relative h-[250px] md:h-full w-full md:w-1/2">
        <Image
          fill
          style={{ objectFit: "cover", zIndex: 30 }}
          src={collection.image != null ? "https://hdapi.huseyinonalalpha.com" + collection.image.url : "/assets/img/placeholder.png"}
          alt=""
        />
        <div className="absolute top-0 left-0 pt-1 pl-2 pr-2 flex whitespace-nowrap bg-opacity-50 bg-neutral-100 flex-col z-40">{title}</div>
        <div className="absolute bottom-0 left-0 pl-2 pb-1 pr-2 flex whitespace-nowrap bg-opacity-50 bg-neutral-100 z-40">{description}</div>
      </div>

      <div className={`flex relative flex-col w-full md:w-1/2 px-2 h-full`}>
        <div className="flex flex-row py-2 h-full overflow-x-scroll no-scrollbar" ref={containerRef} style={{ scrollBehavior: "smooth" }}>
          <div className="w-full h-full items-center gap-2 flex">
            {collection.products.map((prod) => (
              <div key={prod.id} className="flex w-[38vw] md:w-[12vw] md:aspect-[10/16] flex-shrink-0 bg-white shadow-lg p-1 items-center last:mr-4">
                <ProductPreview width={"full"} product={prod} />
              </div>
            ))}
          </div>
        </div>
        {collection.products.length > 3 && (
          <div className="absolute left-1 top-0 z-20 h-full flex items-center" onClick={() => handleScroll(-250)}>
            <ArrowLeft className="cursor-pointer bg-orange-400 p-0.5 hover:animate-pulse" />
          </div>
        )}
        {collection.products.length > 3 && (
          <div className="absolute right-1 top-0 z-20 h-full flex items-center" onClick={() => handleScroll(250)}>
            <ArrowLeft className="cursor-pointer rotate-180 bg-orange-400 p-0.5 hover:animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionShowcase;
