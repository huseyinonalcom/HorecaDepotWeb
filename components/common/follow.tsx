import Image from "next/image";
import Link from "next/link";

const Follow = () => {
  const iconSize: number = 36;
  return (
    <div className="grid grid-cols-4 items-center gap-8">
      <Link
        href={"https://www.facebook.com/HorecaDepotBelgium/"}
        aria-label="Link to Facebook"
        target="_blank"
      >
        <Image
          src={"/assets/header/fb.svg"}
          alt="Facebook"
          width={iconSize}
          height={iconSize}
        />
      </Link>
      <Link
        aria-label="Link to Instagram"
        href={"https://www.instagram.com/horecadepot.be/"}
        target="_blank"
      >
        <Image
          src={"/assets/header/ig.svg"}
          alt="Instagram"
          width={iconSize}
          height={iconSize}
        />
      </Link>
      <Link
        aria-label="Link to Youtube"
        href={"https://www.youtube.com/@HorecaDepot/"}
        target="_blank"
      >
        <Image
          src={"/assets/header/yt.svg"}
          alt="Youtube"
          width={iconSize}
          height={iconSize}
        />
      </Link>
      <Link
        aria-label="Link to Pinterest"
        href={"https://www.pinterest.com/horecadepot/"}
        target="_blank"
      >
        <Image
          src={"/assets/header/pt.svg"}
          alt="Pinterest"
          width={iconSize}
          height={iconSize}
        />
      </Link>
    </div>
  );
};

export default Follow;
