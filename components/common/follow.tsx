import useTranslation from "next-translate/useTranslation";
import { Facebook, Instagram, Twitter, Youtube } from "react-feather";
import Image from "next/image";
import Link from "next/link";

const Follow = () => {
  const { t } = useTranslation("common");

  const iconSize: number = 36;
  return (
    <div className="flex flex-col gap-2">
      <h3 className="font-bold text-2xl text-center">{t("Suivez-nous !")}</h3>
      <div className="flex flex-row gap-5 justify-around">
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
          className={`w-[36px] h-[36px]`}
        >
          <Image
            src={"/assets/img/pinterest.svg"}
            alt="Pinterest"
            width={iconSize}
            height={iconSize}
            color="black"
            className={`w-[36px] h-[36px]`}
          />
        </Link>
      </div>
    </div>
  );
};

export default Follow;
