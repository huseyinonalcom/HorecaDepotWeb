import Image from "next/image";
import { useDragScroll } from "./use-drag-scroll";

export default function ListingImages({
  images,
}: {
  images: { url: string; id: number }[];
}) {
  const [ref] = useDragScroll();

  return (
    <>
      <div
        ref={ref}
        className="hidden md:flex flex-row overflow-x-auto w-full h-[300px] gap-3"
      >
        {images.map((img) => (
          <Image
            draggable={false}
            key={img.id}
            src={img.url}
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: "100%", height: "auto" }}
            alt={""}
          />
        ))}
      </div>
      <div className="md:hidden flex flex-row overflow-x-auto w-full h-[300px] gap-3">
        {images.map((img) => (
          <Image
            draggable={false}
            key={img.id}
            src={img.url}
            width={0}
            height={0}
            sizes="100vw"
            style={{ width: "100%", height: "auto" }}
            alt={""}
          />
        ))}
      </div>
    </>
  );
}