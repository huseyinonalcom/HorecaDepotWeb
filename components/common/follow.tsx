import { Facebook, Instagram, Twitter, Youtube } from "react-feather";
import Image from "next/image";
import Link from "next/link";

const Follow = () => {
  const iconSize: number = 20;
  const iconClassName = "rounded-full border-2 border-black p-2";
  return (
    <div className="flex flex-col justify-between gap-2 md:flex-row">
      <Link
        href={"/"}
        className="flex-shrink-0 pb-4 md:pb-0"
        style={{
          WebkitTapHighlightColor: "transparent",
        }}
      >
        <Image
          color="black"
          width={170}
          height={45}
          src="/assets/header/logob.png"
          alt="Horeca Depot Logo"
        />
      </Link>
      <div className="flex w-min flex-row gap-5">
        <Link
          href={"https://www.facebook.com/HorecaDepotBelgium/"}
          aria-label="Link to Facebook"
          className={iconClassName}
          target="_blank"
        >
          <Facebook width={iconSize} height={iconSize} />
        </Link>
        <Link
          aria-label="Link to Instagram"
          href={"https://www.instagram.com/horecadepot.be/"}
          className={iconClassName}
          target="_blank"
        >
          <Instagram width={iconSize} height={iconSize} />
        </Link>
        <Link
          aria-label="Link to Youtube"
          href={"https://www.youtube.com/@HorecaDepot/"}
          className={iconClassName}
          target="_blank"
        >
          <Youtube width={iconSize} height={iconSize} />
        </Link>
        <Link
          aria-label="Link to Pinterest"
          href={"https://www.pinterest.com/horecadepot/"}
          target="_blank"
          className={`h-[38px] w-[38px] rounded-full border-2 border-black p-2`}
        >
          <Image
            src={"/assets/img/pinterest.svg"}
            alt="Pinterest"
            width={iconSize}
            height={iconSize}
            color="black"
          />
        </Link>
      </div>
    </div>
  );
};

export default Follow;
