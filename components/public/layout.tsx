import Header from "../header/header";
import Meta from "./meta";
import useTranslation from "next-translate/useTranslation";
import { CartProvider } from "../../api/providers/cartProvider";
import { WishlistProvider } from "../../api/providers/wishlistProvider";
import { ClientProvider } from "../../api/providers/clientProvider";
import Image from "next/image";
import Link from "next/link";
import CartDrawer from "../cart/cartDrawer";
import Follow from "../common/follow";
import { useRouter } from "next/router";
import { Heart, ShoppingCart, User } from "react-feather";
import localFont from "next/font/local";
import { useEffect, useState } from "react";

const nexa = localFont({
  src: [
    { path: "../fonts/Nexa-Light.otf", weight: "200", style: "normal" },
    { path: "../fonts/Nexa-Regular.otf", weight: "400", style: "normal" },
    { path: "../fonts/Nexa-Bold.otf", weight: "700", style: "normal" },
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

  const [cookieDisclaimer, setCookieDisclaimer] = useState(false);

  useEffect(() => {
    if (
      localStorage.getItem("cookie_disclaimer") == null ||
      localStorage.getItem("cookie_disclaimer") == "true"
    ) {
      setCookieDisclaimer(true);
    }
  }, []);

  return (
    <>
      <ClientProvider>
        <CartProvider>
          <WishlistProvider>
            <Meta />
            <main className={`${nexa.className} min-h-[80dvh]`}>
              <div className="sticky top-0 z-40 w-full bg-black shadow-lg">
                <Header />
              </div>
              <div className="mx-auto min-h-[75vh] w-[95vw] md:w-[90vw]">
                {children}
              </div>
              <CartDrawer />
              <Link
                target="_blank"
                className="fixed bottom-14 right-10 z-40 print:hidden"
                href={`https://api.whatsapp.com/send?phone=32499738373&text=https://horecadepot.meubelweb.com${router.asPath}`}
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
                  <div className="mb-4 grid w-full grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
                    <div className="flex flex-col gap-2 pl-2">
                      <h3 className="-ml-2 font-semibold">{t("Categories")}</h3>
                      <div>
                        <a
                          href={
                            `/${lang}/products?page=1&category=` +
                            encodeURIComponent("Chaises")
                          }
                          className="whitespace-nowrap underline decoration-transparent decoration-1 underline-offset-2 duration-500 hover:decoration-black"
                        >
                          {t("Chaises")}
                        </a>
                      </div>
                      <div>
                        <a
                          href={
                            `/${lang}/products?page=1&category=` +
                            encodeURIComponent("Tables")
                          }
                          className="whitespace-nowrap underline decoration-transparent decoration-1 underline-offset-2 duration-500 hover:decoration-black"
                        >
                          {t("Tables")}
                        </a>
                      </div>
                      <div>
                        <a
                          href={
                            `/${lang}/products?page=1&category=` +
                            encodeURIComponent("Banquettes")
                          }
                          className="whitespace-nowrap underline decoration-transparent decoration-1 underline-offset-2 duration-500 hover:decoration-black"
                        >
                          {t("Banquettes")}
                        </a>
                      </div>
                      <div>
                        <a
                          href={
                            `/${lang}/products?page=1&category=` +
                            encodeURIComponent("Tabourets de Bar")
                          }
                          className="whitespace-nowrap underline decoration-transparent decoration-1 underline-offset-2 duration-500 hover:decoration-black"
                        >
                          {t("Tabourets de Bar")}
                        </a>
                      </div>
                      <div>
                        <a
                          href={
                            `/${lang}/products?page=1&category=` +
                            encodeURIComponent("Événement")
                          }
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
                          href={`/products`}
                          className="whitespace-nowrap underline decoration-transparent decoration-1 underline-offset-2 duration-500 hover:decoration-black"
                        >
                          {t("Boutique")}
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
                      <h3 className="-ml-2 font-semibold">
                        {t("Information")}
                      </h3>
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
                      <h3 className="-ml-2 text-base font-semibold">
                        Horeca Depot
                      </h3>
                      <p>
                        {t("Address")}:
                        <br />
                        Rue de Ribaucourt 154, 1080 Bruxelles
                        <br />
                        de Ribaucourtstraat 154, 1080 Brussel
                      </p>
                      <p>
                        Tel:
                        <br />
                        +32 499 73 83 73
                      </p>
                      <p>
                        E-mail:
                        <br />
                        info@horecadepot.be
                      </p>
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
                        height={58.5}
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
                          width={1000}
                          style={{
                            height: `${footerIconsHeight}px`,
                            width: "auto",
                          }}
                        />
                        <Image
                          src={"/assets/payment/bc.svg"}
                          alt="Bancontact"
                          height={footerIconsHeight}
                          width={1000}
                          style={{
                            height: `${footerIconsHeight}px`,
                            width: "auto",
                          }}
                        />
                        <Image
                          src={"/assets/payment/visa.svg"}
                          alt="Visa"
                          height={footerIconsHeight}
                          width={1000}
                          style={{
                            height: `${footerIconsHeight}px`,
                            width: "auto",
                          }}
                        />
                        <Image
                          src={"/assets/payment/ma.svg"}
                          alt="Maestro"
                          height={footerIconsHeight}
                          width={1000}
                          style={{
                            height: `${footerIconsHeight}px`,
                            width: "auto",
                          }}
                        />
                        <Image
                          src={"/assets/payment/mc.svg"}
                          alt="Mastercard"
                          height={footerIconsHeight}
                          width={1000}
                          style={{
                            height: `${footerIconsHeight}px`,
                            width: "auto",
                          }}
                        />
                        <Image
                          src={"/assets/payment/amex.svg"}
                          alt="American Express"
                          height={footerIconsHeight}
                          width={1000}
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
                          width={1000}
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
                  href="/products?page=1"
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
              {cookieDisclaimer && (
                <div className="fixed bottom-24 z-30 flex w-full max-w-[100vw] flex-row items-center justify-center gap-3 bg-black py-2 text-center text-white">
                  <p className="text-sm">{t("cookie_disclaimer")}</p>
                  <button
                    type="button"
                    className="whitespace-nowrap underline decoration-transparent decoration-1 underline-offset-2 duration-500 hover:decoration-black"
                    onClick={() => {
                      localStorage.setItem("cookie_disclaimer", "false");
                      setCookieDisclaimer(false);
                    }}
                  >
                    {t("I understand")}
                  </button>
                </div>
              )}
            </main>
          </WishlistProvider>
        </CartProvider>
      </ClientProvider>
    </>
  );
};

export default Layout;
