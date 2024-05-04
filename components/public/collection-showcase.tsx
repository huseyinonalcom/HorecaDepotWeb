import ProductPreview from "../products/product-preview";
import { useDragScroll } from "../common/use-drag-scroll";
import { useRef } from "react";
import { ChevronLeft } from "react-feather";

type Props = {
  collection;
};

const CollectionShowcase = ({ collection }: Props) => {
  const mobileRow = useRef(null);

  const scroll = (direction) => {
    if (direction === "left") {
      mobileRow.current.scrollLeft -= 220;
      document.getElementById(`desktopRow-${collection.id}`).scrollBy({
        left: -320,
        behavior: "smooth",
      });
    } else {
      mobileRow.current.scrollLeft += 220;
      document.getElementById(`desktopRow-${collection.id}`).scrollBy({
        left: 320,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className={`relative flex w-full flex-col px-6`}>
      <p className={`mb-4 text-2xl font-bold`}>{collection.name}</p>
      <div
        id={`desktopRow-${collection.id}`}
        className="no-scrollbar hidden snap-x flex-row gap-2 overflow-x-scroll pt-4 md:flex"
      >
        {collection.products.map((prod) => (
          <div
            key={prod.id}
            draggable={false}
            className="flex w-[300px] flex-shrink-0 snap-start bg-white last:mr-4"
          >
            <ProductPreview width={"full"} product={prod} />
          </div>
        ))}
      </div>
      <div
        ref={mobileRow}
        id={`desktopRow-${collection.id}`}
        className="no-scrollbar flex snap-x flex-row overflow-x-scroll scroll-smooth py-2 md:hidden"
      >
        <div className="flex flex-row gap-2">
          {collection.products.map((prod) => (
            <div
              key={prod.id}
              draggable={false}
              className="flex w-[170px] flex-shrink-0 snap-start bg-white last:mr-4"
            >
              <ProductPreview width={"full"} product={prod} />
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        className="absolute left-0 top-[50%]"
        onClick={() => scroll("left")}
      >
        <ChevronLeft size={42} />
      </button>
      <button
        type="button"
        className="absolute right-0 top-[50%] rotate-180"
        onClick={() => scroll("right")}
      >
        <ChevronLeft size={42} />
      </button>
    </div>
  );
};

export default CollectionShowcase;
