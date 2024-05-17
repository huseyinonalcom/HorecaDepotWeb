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
  const { t } = useTranslation("common");
  const navButtonsClass =
    "relative flex flex-col justify-center items-center p-1 duration-300 font-bold text-sm text-white hover:bg-black aspect-[1/1]";
  const router = useRouter();

  return (
    <>
      <ClientProvider>
        <CartProvider>
          <WishlistProvider>
            <Meta />
            <main className={`${nexa.className} min-h-[80dvh]`}>
              <Header />
              <div className="mx-auto">{children}</div>
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
                      <div className="relative flex aspect-[4488/268] h-full w-full flex-row">
                        <Image
                          src={"/assets/payment.png"}
                          alt="Payment Partners Logos"
                          fill
                          style={{ objectFit: "contain" }}
                        />
                      </div>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <p className="flex-shrink-0 font-semibold">
                        {t("Logistics Partners")}
                      </p>
                      <div className="relative flex aspect-[4488/268] h-full w-full flex-row">
                        <Image
                          src={"/assets/logistics.png"}
                          alt="Logistics Partners Logos"
                          fill
                          style={{ objectFit: "contain" }}
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
            </main>
          </WishlistProvider>
        </CartProvider>
      </ClientProvider>
    </>
  );
};

export default Layout;
