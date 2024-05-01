import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const CatCarousel = ({ categories }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = categories.length;

  const next = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % total);
  };

  const prev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + total) % total);
  };

  return (
    <div className="relative mx-auto aspect-[15/13] w-[95%] overflow-hidden rounded-lg md:aspect-[24/15]">
      <div
        className="flex aspect-[15/13] transition-transform duration-500 ease-in-out md:aspect-[24/15]"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {categories &&
          categories.map((category) => (
            <Link
              href={`/products?category=${category.id}`}
              draggable={false}
              key={category.id}
              className="relative aspect-[15/13] w-full transform transition-all duration-500 ease-in-out 
              md:aspect-[24/15]"
            >
              <Image
                draggable={false}
                src={`https://hdapi.huseyinonalalpha.com${category.image.url}`}
                style={{
                  objectFit: "contain",
                }}
                className="z-10"
                fill
                alt={`image of a ${category.Name}`}
              />
              <p className="absolute bottom-1 left-1 z-30 w-full rounded-md px-4 py-4 font-bold text-black transition-all duration-700">
                {category.Name}
              </p>
            </Link>
          ))}
      </div>

      <button
        onClick={prev}
        className="group absolute left-2 top-1/2 -mt-2 rotate-180"
        type="button"
        aria-label="Next slide"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800/30 hover:bg-gray-800/60 focus:outline-none focus:ring-4 focus:ring-gray-800/70 sm:h-10 sm:w-10">
          <svg
            stroke="currentColor"
            fill="none"
            stroke-width="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-5 w-5 text-black sm:h-6 sm:w-6"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
        </span>
      </button>

      <button
        onClick={next}
        className="group absolute right-2 top-1/2 -mt-2"
        type="button"
        aria-label="Next slide"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800/30 hover:bg-gray-800/60 focus:outline-none focus:ring-4 focus:ring-gray-800/70 sm:h-10 sm:w-10">
          <svg
            stroke="currentColor"
            fill="none"
            stroke-width="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-5 w-5 text-black sm:h-6 sm:w-6"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
        </span>
      </button>
    </div>
  );
};

export default CatCarousel;
