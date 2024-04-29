import { Carousel } from "flowbite-react";
import Link from "next/link";
import { useState, useRef } from "react";

function ProjectCarousel({ projects }) {
  const [centerIndex, setCenterIndex] = useState(0);

  return (
    <div className="aspect-[15/13] w-full p-4 md:aspect-[24/15]">
      <Carousel
        onSlideChange={(e) => setCenterIndex(e)}
        indicators={false}
        className="duration-500"
        slide={false}
      >
        {projects &&
          projects.map((project, index) => (
            <div
              key={project.id}
              className={`relative aspect-[15/13] w-full transform transition-all duration-500 ease-in-out md:aspect-[24/15]`}
            >
              <img
                draggable={false}
                src={`https://hdapi.huseyinonalalpha.com${project.cover.at(0).url}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                alt={project.title}
              />
              <div className="absolute bottom-4 left-1 z-40">
                <Link
                  className={
                    `rounded-md bg-stone-300 px-4 py-4 font-bold text-black transition-all duration-700 hover:bg-black hover:text-white ` +
                    `${centerIndex === index ? "opacity-100" : "opacity-0"}`
                  }
                  href={`/projects/${project.id}`}
                >
                  {project.title}
                </Link>
              </div>
            </div>
          ))}
      </Carousel>
    </div>
  );
}

export default ProjectCarousel;
