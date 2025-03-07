import useTranslation from "next-translate/useTranslation";
import { Heart, ShoppingCart, User } from "react-feather";
import { CookieBanner } from "../googleanal";
import CartDrawer from "../cart/cartDrawer";
import { useEffect, useState } from "react";
import ImageWithURL from "../common/image";
import { useRouter } from "next/router";
import localFont from "next/font/local";
import Header from "../header/header";
import Follow from "../common/follow";
import Image from "next/image";
import Link from "next/link";
import Meta from "./meta";

const roboto = localFont({
  src: [
    {
      path: "../fonts/roboto/Roboto-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/roboto/Roboto-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    { path: "../fonts/roboto/Roboto-Bold.ttf", weight: "700", style: "normal" },
    {
      path: "../fonts/roboto/Roboto-Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
});

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  const { t, lang } = useTranslation("common");
  const navButtonsClass =
    "relative flex flex-col justify-center items-center p-1 duration-300 font-bold text-sm text-white hover:bg-black aspect-[1/1]";
  const router = useRouter();
  const footerIconsHeight = 17;

  const [showPopup, setShowPopup] = useState(false);
  const [popup, setPopup] = useState(null);

  const fetchPopup = async () => {
    const fetchWebsiteRequest = await fetch(`/api/popup/getpopup`, {
      method: "GET",
    });
    if (fetchWebsiteRequest.ok) {
      const fetchWebsiteRequestAnswer = await fetchWebsiteRequest.json();
      return fetchWebsiteRequestAnswer;
    } else {
      return null;
    }
  };

  useEffect(() => {
    if (!popup) {
      fetchPopup().then((res) => {
        setPopup(res?.data ?? { seen: true });
      });
    }
  }, []);

  useEffect(() => {
    if (popup && popup.img) {
      let popupLS = JSON.parse(localStorage.getItem("popup"));
      if (popupLS && popupLS.img == popup.img && popupLS.seen) {
        setShowPopup(false);
      } else {
        setShowPopup(true);
      }
    }
  }, [popup]);

  const handlePopupClose = () => {
    setShowPopup(false);
    localStorage.setItem(
      "popup",
      JSON.stringify({ img: popup.img, seen: true }),
    );
  };

  return (
    <>
      <Meta />
      <script
        type="text/javascript"
        src="https://embed.tawk.to/66ed67e0e5982d6c7bb18e39/1i87lrhj5"
        async
      ></script>
      <main className={`${roboto.className} min-h-[80dvh] bg-white`}>
        {showPopup && (
          <div
            onClick={handlePopupClose}
            className="max-w-screen fixed z-50 flex h-screen flex-col items-center justify-center bg-black/70 px-8"
          >
            <a target="_blank" href={popup.url}>
              <ImageWithURL
                src={popup.img}
                alt="Popup"
                width={1000}
                height={1000}
              />
            </a>
          </div>
        )}
        <div className="sticky top-0 z-40 w-full bg-black shadow-lg">
          <Header />
        </div>
        <div className="mx-auto min-h-[75vh] w-full max-w-[95vw] md:max-w-[90vw]">
          {children}
        </div>
        <CartDrawer />
        <Link
          target="_blank"
          className="fixed bottom-14 right-10 z-40 print:hidden"
          href={`https://api.whatsapp.com/send?phone=32499738373&text=${encodeURI(`Nous sommes interessés en cette produit: https://horecadepot.be${router.asPath}`)}`}
        >
          <Image
            alt="WhatsApp"
            width={50}
            height={50}
            src={"/assets/img/wa.png"}
          />
        </Link>
        <div className="z-30 flex w-full flex-col items-center border-t border-neutral-200 bg-neutral-100 px-3 pb-4 pt-4 print:hidden">
          <div className="flex w-full max-w-screen-2xl flex-col items-center justify-center">
            <div className="mb-4 grid w-full grid-cols-1 gap-3 px-12 md:grid-cols-2 xl:grid-cols-4">
              <div className="flex flex-col gap-2 pl-2">
                <h3 className="-ml-2 font-semibold">{t("Categories")}</h3>
                <div>
                  <a
                    href={`/${lang}/shop/${encodeURIComponent(t("Chaises"))}?page=1`}
                    className="whitespace-nowrap underline decoration-transparent decoration-1 underline-offset-2 duration-500 hover:decoration-black"
                  >
                    {t("Chaises")}
                  </a>
                </div>
                <div>
                  <a
                    href={`/${lang}/shop/${encodeURIComponent(t("Tables"))}?page=1`}
                    className="whitespace-nowrap underline decoration-transparent decoration-1 underline-offset-2 duration-500 hover:decoration-black"
                  >
                    {t("Tables")}
                  </a>
                </div>
                <div>
                  <a
                    href={`/${lang}/shop/${encodeURIComponent(t("Banquettes"))}?page=1`}
                    className="whitespace-nowrap underline decoration-transparent decoration-1 underline-offset-2 duration-500 hover:decoration-black"
                  >
                    {t("Banquettes")}
                  </a>
                </div>
                <div>
                  <a
                    href={`/${lang}/shop/${encodeURIComponent(t("Tabourets de Bar"))}?page=1`}
                    className="whitespace-nowrap underline decoration-transparent decoration-1 underline-offset-2 duration-500 hover:decoration-black"
                  >
                    {t("Tabourets de Bar")}
                  </a>
                </div>
                <div>
                  <a
                    href={`/${lang}/shop/${encodeURIComponent(t("Événement"))}?page=1`}
                    className="whitespace-nowrap underline decoration-transparent decoration-1 underline-offset-2 duration-500 hover:decoration-black"
                  >
                    {t("Événement")}
                  </a>
                </div>
              </div>
              <div className="flex flex-col gap-2 pl-2">
                <h3 className="-ml-2 font-semibold">{t("Site Plan")}</h3>
                <div>
                  <Link
                    href={`/shop/tous?page=1`}
                    className="whitespace-nowrap underline decoration-transparent decoration-1 underline-offset-2 duration-500 hover:decoration-black"
                  >
                    {t("Products")}
                  </Link>
                </div>
                <div>
                  <Link
                    href={`/contact`}
                    className="whitespace-nowrap underline decoration-transparent decoration-1 underline-offset-2 duration-500 hover:decoration-black"
                  >
                    {t("Contact")}
                  </Link>
                </div>
                <div>
                  <Link
                    href={`/about`}
                    className="whitespace-nowrap underline decoration-transparent decoration-1 underline-offset-2 duration-500 hover:decoration-black"
                  >
                    {t("About Us")}
                  </Link>
                </div>
                <div>
                  <Link
                    href={`/projects`}
                    className="whitespace-nowrap underline decoration-transparent decoration-1 underline-offset-2 duration-500 hover:decoration-black"
                  >
                    {t("Projects")}
                  </Link>
                </div>
                <div>
                  <Link
                    href={`/references`}
                    className="whitespace-nowrap underline decoration-transparent decoration-1 underline-offset-2 duration-500 hover:decoration-black"
                  >
                    {t("References")}
                  </Link>
                </div>
              </div>
              <div className="flex flex-col gap-2 pl-2">
                <h3 className="-ml-2 font-semibold">{t("Information")}</h3>
                <div>
                  <Link
                    href={`/privacy`}
                    className="whitespace-nowrap underline decoration-transparent decoration-1 underline-offset-2 duration-500 hover:decoration-black"
                  >
                    {t("Privacy Policy")}
                  </Link>
                </div>
                <div>
                  <Link
                    href={`/tos`}
                    className="whitespace-nowrap underline decoration-transparent decoration-1 underline-offset-2 duration-500 hover:decoration-black"
                  >
                    {t("Terms of Service")}
                  </Link>
                </div>
                <div>
                  <Link
                    href={`/deliveryterms`}
                    className="whitespace-nowrap underline decoration-transparent decoration-1 underline-offset-2 duration-500 hover:decoration-black"
                  >
                    {t("Delivery Terms")}
                  </Link>
                </div>
                <div>
                  <Link
                    href={`/companydetails`}
                    className="whitespace-nowrap underline decoration-transparent decoration-1 underline-offset-2 duration-500 hover:decoration-black"
                  >
                    {t("Company Details")}
                  </Link>
                </div>
              </div>
              <div className="flex flex-col gap-2 pl-2 text-sm">
                <h3 className="-ml-2 text-base font-semibold">Horeca Depot</h3>
                <div className="flex flex-row">
                  <a
                    target="blank"
                    href="https://www.google.com/maps/dir//HorecaDepot+Rue+de+Ribaucourt+154+1080+Bruxelles/@50.8618074,4.3429586,13z/data=!4m8!4m7!1m0!1m5!1m1!1s0x47c3c32a1a2325c3:0x7594491cb3de795a!2m2!1d4.3429586!2d50.8618074?entry=ttu"
                  >
                    <p>
                      {t("Address")}: Rue de Ribaucourtstraat 154, 1080
                      Bruxelles
                    </p>
                  </a>
                </div>
                <div className="flex flex-row">
                  <a href="tel:+32499738373">
                    <p>Tel: +32 499 73 83 73</p>
                  </a>
                </div>
                <div className="flex flex-row">
                  <a href="mailto:info@horecadepot.be">
                    <p>E-mail: info@horecadepot.be</p>
                  </a>
                </div>
                <p>
                  {t("Opening Hours")}:
                  <br />
                  {t("Monday")} - {t("Saturday")}: 09:30 - 19:00
                  <br />
                  {t("Sunday")}: {t("Closed")}
                </p>
              </div>
            </div>
            <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
              <Link
                href={"/"}
                className="flex flex-col items-center justify-center"
                style={{
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                <Image
                  color="black"
                  width={221}
                  height={39.7}
                  src="/assets/header/logob.png"
                  alt="Horeca Depot Logo"
                />
              </Link>
              <div className="flex flex-col items-center justify-center xl:order-4">
                <Follow />
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="flex-shrink-0 font-semibold">
                  {t("Payment Partners")}
                </p>
                <div className="flex h-[25px] w-full flex-row items-center justify-center gap-1.5">
                  <Image
                    src={"/assets/payment/wl.png"}
                    alt="Worldline"
                    height={footerIconsHeight}
                    width={168.44}
                    style={{
                      height: `${footerIconsHeight}px`,
                      width: "auto",
                    }}
                  />
                  <Image
                    src={"/assets/payment/bc.svg"}
                    alt="Bancontact"
                    height={footerIconsHeight}
                    width={24.08}
                    style={{
                      height: `${footerIconsHeight}px`,
                      width: "auto",
                    }}
                  />
                  <Image
                    src={"/assets/payment/visa.svg"}
                    alt="Visa"
                    height={footerIconsHeight}
                    width={52.38}
                    style={{
                      height: `${footerIconsHeight}px`,
                      width: "auto",
                    }}
                  />
                  <Image
                    src={"/assets/payment/ma.svg"}
                    alt="Maestro"
                    height={footerIconsHeight}
                    width={22.02}
                    style={{
                      height: `${footerIconsHeight}px`,
                      width: "auto",
                    }}
                  />
                  <Image
                    src={"/assets/payment/mc.svg"}
                    alt="Mastercard"
                    height={footerIconsHeight}
                    width={21.25}
                    style={{
                      height: `${footerIconsHeight}px`,
                      width: "auto",
                    }}
                  />
                </div>
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="flex-shrink-0 font-semibold">
                  {t("Logistics Partners")}
                </p>
                <div className="flex h-[25px] w-full flex-row items-center justify-center gap-1.5">
                  <Image
                    src={"/assets/logistics.png"}
                    alt="Logistics Partners Logos"
                    height={footerIconsHeight}
                    width={232.39}
                    style={{
                      height: `${footerIconsHeight}px`,
                      width: "auto",
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="flex w-fit flex-row">
              <p className="mx-auto whitespace-nowrap px-2 pt-6 text-sm">
                © Horeca Depot. {new Date().getFullYear()}.{" "}
                {t("All Rights Reserved")}
              </p>
            </div>
          </div>
        </div>
        <div className="sticky bottom-0 z-40 flex h-[50px] w-full flex-row justify-between bg-black px-5 md:hidden">
          <Link
            aria-label="Link to Shop"
            className={navButtonsClass}
            href="/shop/tous?page=1"
          >
            <ShoppingCart />
          </Link>
          <Link
            aria-label="Link to User Account Dashboard"
            className={navButtonsClass}
            href="/account/myaccount"
          >
            <User />
          </Link>
          <Link
            aria-label="Link to Wishlist"
            className={navButtonsClass}
            href="/wishlist"
          >
            <Heart />
          </Link>
        </div>
        <CookieBanner />
      </main>
    </>
  );
};

export default Layout;
