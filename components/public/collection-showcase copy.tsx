import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import ProductPreview from "../products/product-preview";
import { useDragScroll } from "../common/use-drag-scroll";

type Props = {
  collection;
};

const CollectionShowcase = ({ collection }: Props) => {
  const [textColor, setTextColor] = useState("");
  const [description, setDescription] = useState(<p></p>);
  const [title, setTitle] = useState(<p></p>);

  const [ref] = useDragScroll();

  useEffect(() => {
    setTextColor(collection.textColor);
  }, [collection]);

  useEffect(() => {
    setTitle(
      <p
        style={{
          color: `#${textColor.substring(0, 2)}${textColor.substring(2, 4)}${textColor.substring(4, 6)}`,
        }}
        className={`text-2xl font-bold`}
      >
        {collection.name}
      </p>,
    );

    setDescription(
      <p
        style={{
          color: `#${textColor.substring(0, 2)}${textColor.substring(2, 4)}${textColor.substring(4, 6)}`,
        }}
        className={`w-full font-semibold`}
      >
        {collection.description}
      </p>,
    );
  }, [textColor]);

  return (
    <div
      className={`flex flex-col ${collection.right ? "md:flex-row-reverse" : "md:flex-row"} h-full w-full md:aspect-[38/9]`}
    >
      <div className="relative h-[250px] w-full md:h-full md:w-1/2">
        <Image
          fill
          style={{ objectFit: "cover", zIndex: 10 }}
          src={
            collection.image != null
              ? "https://hdapi.huseyinonalalpha.com" + collection.image.url
              : "/assets/img/placeholder.png"
          }
          className="z-10"
          alt=""
        />
        <div className="relative z-20 flex h-full w-full flex-col items-center justify-center">
          <div className="z-20">{title}</div>
          <div className="z-20 text-sm">{description}</div>
        </div>
      </div>

      <div className={`relative flex h-full w-full flex-col px-2 md:w-1/2`}>
        <div
          ref={ref}
          className="no-scrollbar flex h-full flex-row overflow-x-scroll py-2"
        >
          <div className="hidden h-full w-full items-center gap-2 md:flex">
            {collection.products.map((prod) => (
              <div
                key={prod.id}
                draggable={false}
                className="flex aspect-[250/430] h-full flex-shrink-0 flex-col items-center justify-center bg-white p-1 shadow-lg last:mr-4"
              >
                <ProductPreview width={"full"} product={prod} />
              </div>
            ))}
          </div>
        </div>
        <div className="no-scrollbar flex h-full flex-row overflow-x-scroll py-2 md:hidden">
          <div className="flex h-full w-full items-center gap-2">
            {collection.products.map((prod) => (
              <div
                key={prod.id}
                draggable={false}
                className="flex w-[200px] flex-shrink-0 items-center bg-white p-1 py-4 shadow-lg last:mr-4"
              >
                <ProductPreview width={"full"} product={prod} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionShowcase;
