import ProductPreview from "../products/product-preview";
import { useDragScroll } from "../common/use-drag-scroll";
import { useRef } from "react";
import { ArrowLeft, ChevronLeft } from "react-feather";

type Props = {
  collection;
};

const CollectionShowcase = ({ collection }: Props) => {
  const [ref] = useDragScroll();

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
        ref={ref}
        id={`desktopRow-${collection.id}`}
        className="no-scrollbar hidden overflow-x-scroll pt-4 md:flex"
      >
        <div className="flex flex-row justify-center gap-2">
          {collection.products.map((prod) => (
            <div
              key={prod.id}
              draggable={false}
              className="flex w-[300px] flex-shrink-0 bg-white last:mr-4"
            >
              <ProductPreview width={"full"} product={prod} />
            </div>
          ))}
        </div>
      </div>
      <div
        ref={mobileRow}
        className="no-scrollbar flex overflow-x-scroll scroll-smooth py-2 md:hidden"
      >
        <div className="flex flex-row gap-2">
          {collection.products.map((prod) => (
            <div
              key={prod.id}
              draggable={false}
              className="flex w-[180px] flex-shrink-0 bg-white last:mr-4"
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
        <ChevronLeft />
      </button>
      <button
        type="button"
        className="absolute right-0 top-[50%] rotate-180"
        onClick={() => scroll("right")}
      >
        <ChevronLeft />
      </button>
    </div>
  );
};

export default CollectionShowcase;
