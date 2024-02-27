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
import HeaderDrawer from "../header/headerDrawer";

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
            <main className="min-h-[80dvh] bg-neutral-100">
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
            <footer className="bg-neutral-100 print:hidden border-t border-neutral-200 z-30 absolute botton-0 w-full py-8">
              <div className="flex flex-col w-full">
                <div className="flex flex-col md:flex-row justify-around items-center pb-2 gap-2">
                  <div></div>
                  <div className="w-min">
                    <Follow />
                  </div>
                </div>
                <div className="pb-2 px-2 mx-auto">
                  <AutoTextSize mode="oneline" maxFontSizePx={16}>
                    © Horeca Depot. {new Date().getFullYear()}.{" "}
                    {t("Tous Droits Réservés")}
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
