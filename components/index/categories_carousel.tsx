import { Carousel } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";

function CategoryCarousel({ categories }) {
  return (
    <div className="aspect-[15/13] w-full p-4 md:aspect-[24/15]">
      <Carousel
        draggable={false}
        indicators={false}
        className="z-10 duration-500"
        leftControl={
          <span className="z-20 inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-800/30 hover:bg-gray-800/60 focus:outline-none focus:ring-4 focus:ring-gray-800/70 focus:ring-white sm:h-10 sm:w-10">
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
        }
        rightControl={
          <span className="z-20 inline-flex h-8 w-8 rotate-180 items-center justify-center rounded-full bg-gray-800/30 hover:bg-gray-800/60 focus:outline-none focus:ring-4 focus:ring-gray-800/70 focus:ring-white sm:h-10 sm:w-10">
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
        }
        slide={false}
      >
        {categories &&
          categories.map((category, index) => (
            <Link
              href={`/products?category=${category.id}`}
              draggable={false}
              key={category.id}
              className="relative aspect-[15/13] w-full transform transition-all duration-500 ease-in-out md:aspect-[24/15]"
            >
              <Image
                draggable={false}
                src={`https://hdapi.huseyinonalalpha.com${category.image.url}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
                alt={category.Name}
              />
              <p className="absolute bottom-1 left-1 z-30 w-full rounded-md  px-4 py-4 font-bold text-black transition-all duration-700">
                {category.Name}
              </p>
            </Link>
          ))}
      </Carousel>
    </div>
  );
}

export default CategoryCarousel;
