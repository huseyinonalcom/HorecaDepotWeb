import ProductPreview from "../products/product-preview";
import { FiChevronLeft } from "react-icons/fi";
import { useRef } from "react";

type Props = {
  collection;
  id: string;
};

const CollectionShowcase = ({ collection, id }: Props) => {
  let isThrottled = false;
  const productRow = useRef(null);

  const scroll = (direction) => {
    if (isThrottled) return;

    if (direction === "left") {
      productRow.current.scrollBy({
        left: -180,
        behavior: "smooth",
      });
    } else {
      productRow.current.scrollBy({
        left: 180,
        behavior: "smooth",
      });
    }

    isThrottled = true;

    setTimeout(() => {
      isThrottled = false;
    }, 300);
  };

  return (
    <div className={`relative flex w-full flex-col`}>
      <div className="flex flex-row justify-between">
        <p className={`mb-4 text-2xl font-bold`}>{collection.name}</p>
        <div className="flex flex-row">
          <FiChevronLeft size={32} onClick={() => scroll("left")} />
          <FiChevronLeft
            size={32}
            onClick={() => scroll("right")}
            className="rotate-180"
          />
        </div>
      </div>
      <div
        draggable={false}
        ref={productRow}
        id={id}
        className="no-scrollbar flex snap-x snap-mandatory flex-row gap-4 overflow-x-scroll py-2"
      >
        {collection.products.map((prod) => (
          <div
            key={collection.id + "-" + prod.id}
            draggable={false}
            className="flex w-[220px] flex-shrink-0 snap-start md:w-[300px]"
          >
            <ProductPreview product={prod} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollectionShowcase;
