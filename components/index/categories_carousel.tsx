import { Carousel } from "flowbite-react";
import Link from "next/link";
import { useState, useRef } from "react";

function CategoryCarousel({ categories }) {
  const [centerIndex, setCenterIndex] = useState(0);

  return (
    <div className="aspect-[15/13] w-full p-4 md:aspect-[24/15]">
      <Carousel
        onSlideChange={(e) => setCenterIndex(e)}
        indicators={false}
        className="duration-500"
        leftControl={
          <button
            className="group"
            data-testid="carousel-left-control"
            type="button"
            aria-label="Previous slide"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full  bg-gray-800/30 group-hover:bg-gray-800/60 group-focus:outline-none group-focus:ring-4 group-focus:ring-gray-800/70 group-focus:ring-white sm:h-10 sm:w-10">
              <svg
                stroke="currentColor"
                fill="none"
                stroke-width="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-5 w-5 text-gray-800 sm:h-6 sm:w-6"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 19l-7-7 7-7"
                ></path>
              </svg>
            </span>
          </button>
        }
        rightControl={
          <button
            className="group rotate-180"
            data-testid="carousel-right-control"
            type="button"
            aria-label="Previous slide"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full  bg-gray-800/30 group-hover:bg-gray-800/60 group-focus:outline-none group-focus:ring-4 group-focus:ring-gray-800/70 group-focus:ring-white sm:h-10 sm:w-10">
              <svg
                stroke="currentColor"
                fill="none"
                stroke-width="2"
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-5 w-5 text-gray-800 sm:h-6 sm:w-6"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 19l-7-7 7-7"
                ></path>
              </svg>
            </span>
          </button>
        }
        slide={false}
      >
        {categories &&
          categories.map((category, index) => (
            <div
              key={category.id}
              className={`relative aspect-[15/13] w-full transform transition-all duration-500 ease-in-out md:aspect-[24/15]`}
            >
              <img
                draggable={false}
                src={`https://hdapi.huseyinonalalpha.com${category.image.url}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
                alt={category.Name}
              />
              <div className="absolute bottom-0 left-0 z-40 m-4">
                <Link
                  className={
                    `bg-stone-300 px-6 py-4 font-bold text-black transition-all duration-700 hover:bg-black hover:text-white ` +
                    `${centerIndex === index ? "opacity-100" : "opacity-0"}`
                  }
                  href={`/products?category=${category.id}`}
                >
                  {category.Name}
                </Link>
              </div>
            </div>
          ))}
      </Carousel>
    </div>
  );
}

export default CategoryCarousel;
