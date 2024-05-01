import { Carousel } from "flowbite-react";
import Image from "next/image";
import Link from "next/link";

function ProjectCarousel({ projects }) {
  return (
    <div className="aspect-[15/13] w-full p-4 md:aspect-[24/15]">
      <Carousel
        draggable={false}
        indicators={false}
        className="z-20 duration-500"
        slide={false}
      >
        {projects &&
          projects.map((project) => (
            <Link
              href={`/projects/${project.id}`}
              key={project.id}
              className="relative z-20 aspect-[15/13] w-full transform transition-all duration-500 ease-in-out md:aspect-[24/15]"
            >
              <Image
                draggable={false}
                src={`https://hdapi.huseyinonalalpha.com${project.cover.at(0).url}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
                className="z-20"
                alt={project.title}
              />
              <p className="absolute bottom-1 left-1 z-40 w-full rounded-md px-4 py-4 font-bold text-white transition-all duration-700  hover:text-white">
                {project.title}
              </p>
            </Link>
          ))}
      </Carousel>
    </div>
  );
}

export default ProjectCarousel;
