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

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  const { t, lang } = useTranslation("common");
  const router = useRouter();
  return (
    <>
      <ClientProvider>
        <CartProvider>
          <WishlistProvider>
            <Meta />
            <Header />
            <main className="min-h-[80dvh]">
              {children}
              <CartDrawer />
              <Link
                target="_blank"
                className="fixed bottom-10 right-10 z-40 print:hidden"
                href={`https://api.whatsapp.com/send?phone=32499738373&text=https://horecadepot.meubelweb.com${router.asPath}`}
              >
                <Image
                  alt="WhatsApp"
                  width={50}
                  height={50}
                  src={"/assets/img/wa.png"}
                />
              </Link>
            </main>
            <footer className="botton-0 absolute z-30 w-full border-t border-neutral-200 bg-neutral-100 py-8 print:hidden">
              <div className="flex w-full flex-col">
                <div className="flex flex-col items-center justify-around gap-2 pb-2 md:flex-row">
                  <div></div>
                  <div className="w-min">
                    <Follow />
                  </div>
                </div>
                <div className="mx-auto px-2 pb-2">
                  <AutoTextSize mode="oneline" maxFontSizePx={16}>
                    © Horeca Depot. {new Date().getFullYear()}.{" "}
                    {t("All Rights Reserved")}
                  </AutoTextSize>
                </div>
              </div>
            </footer>
          </WishlistProvider>
        </CartProvider>
      </ClientProvider>
    </>
  );
};

export default Layout;
