import Link from "next/link";
import { useState, useEffect } from "react";

function ProjectCarousel({ projects }) {
  const [centerIndex, setCenterIndex] = useState(0);
  console.log(projects);
  useEffect(() => {
    setCenterIndex(Math.floor(projects.length / 2));
  }, [projects.length]);

  return (
    <div className="md:no-scrollbar flex w-[95vw] flex-row gap-4 overflow-x-auto md:-mb-12">
      {projects &&
        projects.map((project, index) => (
          <div
            onClick={() => {
              setCenterIndex(index);
            }}
            key={project.id}
            className="aspect-[15/14] h-[280px] w-[350px] pt-10 md:h-[40vw] md:w-[50vw]"
          >
            <div className="relative h-min w-full duration-500">
              <img
                draggable={false}
                src={`https://hdapi.huseyinonalalpha.com${project.cover.at(0).url}`}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                }}
                alt={project.title}
                className="z-10"
              />
              <div className="absolute -bottom-5 z-20 flex w-full flex-col items-center justify-center">
                <Link
                  className="z-20 -mt-12 bg-stone-300 px-6 py-4 font-bold text-black duration-300 hover:bg-black hover:text-white"
                  href={`/projects/${project.id}`}
                >
                  {project.title}
                </Link>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

export default ProjectCarousel;
