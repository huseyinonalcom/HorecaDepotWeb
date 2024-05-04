import ProductPreview from "../products/product-preview";
import { useDragScroll } from "../common/use-drag-scroll";
import { useRef } from "react";
import { ArrowLeft } from "react-feather";

type Props = {
  collection;
};

const CollectionShowcase = ({ collection }: Props) => {
  const [ref] = useDragScroll();

  const mobileRow = useRef(null);

  const scroll = (direction) => {
    if (direction === "left") {
      mobileRow.current.scrollLeft -= 220;
      document.getElementById(`desktopRow-${collection.id}`).scrollLeft -= 320;
    } else {
      mobileRow.current.scrollLeft += 220;
      document.getElementById(`desktopRow-${collection.id}`).scrollLeft += 320;
    }
  };

  return (
    <div className={`relative flex w-full flex-col px-6`}>
      <p className={`text-2xl font-bold`}>{collection.name}</p>
      <div
        ref={ref}
        id={`desktopRow-${collection.id}`}
        className="no-scrollbar flex flex-row overflow-x-scroll scroll-smooth pt-4"
      >
        <div className="hidden flex-row items-center justify-center gap-2 md:flex">
          {collection.products.map((prod) => (
            <div
              key={prod.id}
              draggable={false}
              className="flex h-full w-[300px] flex-shrink-0 flex-col items-center justify-center bg-white p-1 last:mr-4"
            >
              <ProductPreview width={"full"} product={prod} />
            </div>
          ))}
        </div>
      </div>
      <div
        ref={mobileRow}
        className="no-scrollbar flex h-full flex-row overflow-x-scroll scroll-smooth py-2 md:hidden"
      >
        <div className="flex h-full w-full items-center gap-2">
          {collection.products.map((prod) => (
            <div
              key={prod.id}
              draggable={false}
              className="flex w-[200px] flex-shrink-0 items-center bg-white last:mr-4"
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
        <ArrowLeft />
      </button>
      <button
        type="button"
        className="absolute right-0 top-[50%] rotate-180"
        onClick={() => scroll("right")}
      >
        <ArrowLeft />
      </button>
    </div>
  );
};

export default CollectionShowcase;
