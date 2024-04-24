import Header from "../header/header";
import Meta from "./meta";
import useTranslation from "next-translate/useTranslation";
import { CartProvider } from "../../api/providers/cartProvider";
import { WishlistProvider } from "../../api/providers/wishlistProvider";
import { ClientProvider } from "../../api/providers/clientProvider";
import { AutoTextSize } from "auto-text-size";
import Image from "next/image";
import Link from "next/link";
import CartDrawer from "../cart/cartDrawer";
import Follow from "../common/follow";
import { useRouter } from "next/router";
import { Heart, ShoppingCart, User } from "react-feather";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  const { t, lang } = useTranslation("common");
  const navButtonsClass =
    "relative flex flex-col justify-center items-center p-1 duration-300 font-bold text-sm text-white hover:bg-orange-400 aspect-[1/1]";
  const router = useRouter();
  return (
    <>
      <ClientProvider>
        <CartProvider>
          <WishlistProvider>
            <Meta />
            <main className="min-h-[80dvh]">
              <Header />
              {children}
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
              <div className="z-30 w-full border-t border-neutral-200 bg-neutral-100 pb-8 pt-4 print:hidden">
                <div className="flex w-full flex-col">
                  <div className="pb-4 px-4 border-b border-neutral-200 bg-neutral-100">
                      <Follow />
                  </div>
                  <div className="mx-auto px-2 pt-6">
                    <AutoTextSize mode="oneline" maxFontSizePx={16}>
                      © Horeca Depot. {new Date().getFullYear()}.{" "}
                      {t("All Rights Reserved")}
                    </AutoTextSize>
                  </div>
                </div>
              </div>
              <div className="sticky bottom-0 z-40 flex md:hidden h-[50px] w-full flex-row justify-between bg-black px-5">
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
                  href="/account/myorders"
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
