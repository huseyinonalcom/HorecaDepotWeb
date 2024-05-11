import ProductPreview from "../products/product-preview";
import { useRef } from "react";
import { ChevronLeft } from "react-feather";

type Props = {
  collection;
  name: string;
};

const CollectionShowcase = ({ collection, name }: Props) => {
  const mobileRow = useRef(null);

  let isThrottled = false;

  const scroll = (direction) => {
    if (isThrottled) return;

    if (direction === "left") {
      mobileRow.current.scrollLeft -= 220;
      document.getElementById(`${name}-desktopRow-${collection.id}`).scrollBy({
        left: -320,
        behavior: "smooth",
      });
    } else {
      mobileRow.current.scrollLeft += 220;
      document.getElementById(`${name}-desktopRow-${collection.id}`).scrollBy({
        left: 320,
        behavior: "smooth",
      });
    }

    isThrottled = true;

    setTimeout(() => {
      isThrottled = false;
    }, 300);
  };

  return (
    <div className={`relative flex w-full flex-col px-6`}>
      <div className="flex flex-row justify-between">
        <p className={`mb-4 text-2xl font-bold`}>{collection.name}</p>
        <div className="flex flex-row">
          <ChevronLeft size={32} onClick={() => scroll("left")} />
          <ChevronLeft
            size={32}
            onClick={() => scroll("right")}
            className="rotate-180"
          />
        </div>
      </div>
      <div
        id={`${name}-desktopRow-${collection.id}`}
        className="no-scrollbar hidden snap-x flex-row gap-4 overflow-x-scroll pt-4 sm:flex"
      >
        {collection.products.map((prod) => (
          <div
            key={collection.id + "-" + prod.id}
            draggable={false}
            className="flex w-[300px] flex-shrink-0 snap-start bg-white last:mr-4"
          >
            <ProductPreview width={"full"} product={prod} />
          </div>
        ))}
      </div>
      <div
        ref={mobileRow}
        className="no-scrollbar flex snap-x snap-mandatory flex-row gap-4 overflow-x-scroll py-2 sm:hidden"
      >
        {collection.products.map((prod) => (
          <div
            key={prod.id}
            draggable={false}
            className="flex w-[200px] flex-shrink-0 snap-start bg-white last:mr-4"
          >
            <ProductPreview width={"full"} product={prod} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollectionShowcase;
