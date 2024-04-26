import { useState, useEffect } from 'react';

function ProjectCarousel({ projects }) {
  const [centerIndex, setCenterIndex] = useState(0);

  useEffect(() => {
    // Center the project in the middle of the list initially
    setCenterIndex(Math.floor(projects.length / 2));
  }, [projects.length]);

  // Inline styles for the carousel items
  const styles = {
    carouselItem: {
      transition: 'transform 0.5s ease',
    },
    active: {
      transform: 'scale(1)',
      opacity: 1,
    },
    prevNext: {
      transform: 'scale(0.8)',
      opacity: 0.7,
    }
  };

  const getItemStyle = (index) => {
    if (index === centerIndex) return { ...styles.carouselItem, ...styles.active };
    if (index === centerIndex - 1 || index === centerIndex + 1) return { ...styles.carouselItem, ...styles.prevNext };
    return styles.carouselItem;
  };

  return (
    <div className="no-scrollbar mx-auto my-3 flex w-[95vw] flex-row gap-2 overflow-x-scroll py-2">
      {projects && projects.map((project, index) => (
        <div
          onClick={() => {
            // Update centerIndex when a project is clicked
            setCenterIndex(index);
          }}
          key={project.id}
          style={getItemStyle(index)}
        >
          <div className="relative h-[90%] w-full bg-stone-300 duration-500">
            <img
              draggable={false}
              src={`https://hdapi.huseyinonalalpha.com${project.cover.at(0).url}`}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              alt={project.Name}
            />
          </div>
          <div className="flex flex-col items-start justify-end pb-4">
            <a href={`/projects/${project.id}`}>
              <p className="px-4 py-2 font-bold text-gray-700">
                {project.Name}
              </p>
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProjectCarousel;
