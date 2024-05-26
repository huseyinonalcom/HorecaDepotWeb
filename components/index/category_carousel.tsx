import Image from "next/image";
import Link from "next/link";
import React, { useRef } from "react";
import { ChevronLeft } from "react-feather";

const CatCarousel = ({ categories }) => {
  const total = categories.length;

  const slider = useRef<HTMLDivElement>(null);

  const next = () => {
    const maxScroll = slider.current.clientWidth * (total - 1);
    if (maxScroll - slider.current.scrollLeft < 50) {
      slider.current.scrollLeft = 0;
      return;
    } else {
      slider.current.scrollLeft =
        (slider.current.scrollLeft / slider.current.clientWidth + 1) *
        slider.current.clientWidth;
      return;
    }
  };

  const prev = () => {
    if (slider.current.scrollLeft === 0) {
      slider.current.scrollLeft = slider.current.clientWidth * (total - 1);
      return;
    } else {
      slider.current.scrollLeft =
        (slider.current.scrollLeft / slider.current.clientWidth - 1) *
        slider.current.clientWidth;
      return;
    }
  };
  return (
    <div className="relative mx-auto aspect-[15/13] w-[95%] overflow-hidden rounded-lg md:aspect-[24/15]">
      <div
        ref={slider}
        className="no-scrollbar flex aspect-[15/13] snap-x snap-mandatory flex-row overflow-x-auto scroll-smooth transition-transform duration-500 ease-in-out md:aspect-[24/15]"
      >
        {categories &&
          categories.map((category) => (
            <Link
              href={`/shop/${encodeURIComponent(category.Name)}`}
              draggable={false}
              key={category.id}
              className="relative aspect-[15/13] h-full w-full transform snap-start transition-all duration-500 ease-in-out md:aspect-[24/15]"
            >
              <Image
                draggable={false}
                src={`https://hdapi.huseyinonalalpha.com${category.image.url}`}
                style={{
                  objectFit: "contain",
                }}
                className="z-10"
                fill
                sizes="(max-width: 768px) 45vw, 90vw"
                alt={`image of a ${category.Name}`}
              />
              <p className="absolute bottom-1 left-1 z-30 w-full rounded-md px-4 py-4 font-bold text-black transition-all duration-700">
                {category.Name}
              </p>
            </Link>
          ))}
      </div>

      <button
        name="prev"
        aria-label="Previous Category"
        type="button"
        className="absolute bottom-[35%] left-0 ml-2 rounded-full bg-gray-800/30 p-1 hover:bg-gray-800/60"
        onClick={prev}
      >
        <ChevronLeft size={32} />
      </button>
      <button
        name="next"
        aria-label="Next Category"
        type="button"
        className="absolute bottom-[35%] right-0 mr-2 rotate-180 rounded-full bg-gray-800/30 p-1 hover:bg-gray-800/60"
        onClick={next}
      >
        <ChevronLeft size={32} />
      </button>
    </div>
  );
};

export default CatCarousel;
