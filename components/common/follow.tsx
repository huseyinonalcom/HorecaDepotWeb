import useTranslation from "next-translate/useTranslation";
import { Facebook, Instagram, Twitter, Youtube } from "react-feather";
import Image from "next/image";
import Link from "next/link";

const Follow = () => {
  const { t } = useTranslation("common");

  const iconSize: number = 36;
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-center text-2xl font-bold">{t("Follow us!")}</h3>
      <div className="flex flex-row justify-around gap-5">
        <Link
          href={"https://www.facebook.com/HorecaDepotBelgium/"}
          aria-label="Link to Facebook"
          target="_blank"
        >
          <Facebook width={iconSize} height={iconSize} />
        </Link>
        <Link
          aria-label="Link to Instagram"
          href={"https://www.instagram.com/horecadepot.be/"}
          target="_blank"
        >
          <Instagram width={iconSize} height={iconSize} />
        </Link>
        <Link
          aria-label="Link to Youtube"
          href={"https://www.youtube.com/@HorecaDepot/"}
          target="_blank"
        >
          <Youtube width={iconSize} height={iconSize} />
        </Link>
        <Link
          aria-label="Link to Pinterest"
          href={"https://www.pinterest.com/horecadepot/"}
          target="_blank"
          className={`h-[36px] w-[36px]`}
        >
          <Image
            src={"/assets/img/pinterest.svg"}
            alt="Pinterest"
            width={iconSize}
            height={iconSize}
            color="black"
            className={`h-[36px] w-[36px]`}
          />
        </Link>
      </div>
    </div>
  );
};

export default Follow;
