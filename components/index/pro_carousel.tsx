import Image from "next/image";
import Link from "next/link";
import React, { useRef } from "react";

const ProCarousel = ({ projects }) => {
  const total = projects.length;

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
        {projects &&
          projects.map((project) => (
            <Link
              href={`/projects/${project.id}`}
              draggable={false}
              key={project.id}
              className="relative aspect-[15/13] h-full w-full transform snap-start transition-all duration-500 ease-in-out md:aspect-[24/15]"
            >
              <Image
                draggable={false}
                src={`https://hdapi.huseyinonalalpha.com${project.cover.at(0).url}`}
                style={{
                  objectFit: "cover",
                }}
                className="z-10"
                fill
                sizes="(max-width: 768px) 45vw, 90vw"
                alt={`image of a ${project.title}`}
              />
              <p className="absolute bottom-1 left-1 z-30 w-full rounded-md px-4 py-4 font-bold text-white transition-all duration-700">
                {project.title}
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
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/30 group-hover:bg-white/50 group-focus:outline-none group-focus:ring-4 group-focus:ring-white sm:h-10 sm:w-10">
          <svg
            stroke="currentColor"
            fill="none"
            stroke-width="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-5 w-5 text-white sm:h-6 sm:w-6"
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
        onClick={() => next()}
        className="group absolute right-2 top-1/2 -mt-2"
        type="button"
        aria-label="Next slide"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/30 group-hover:bg-white/50 group-focus:outline-none group-focus:ring-4 group-focus:ring-white sm:h-10 sm:w-10">
          <svg
            stroke="currentColor"
            fill="none"
            stroke-width="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="h-5 w-5 text-white  sm:h-6 sm:w-6"
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

export default ProCarousel;
