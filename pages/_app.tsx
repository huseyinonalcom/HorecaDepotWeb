import { AppProps } from "next/app";
import "../global.css";
import { CategoryProvider } from "../api/providers/categoryProvider";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { WishlistProvider } from "../api/providers/wishlistProvider";
import { BannerProvider } from "../api/providers/bannerProdiver";
import { CartProvider } from "../api/providers/cartProvider";
import { ClientProvider } from "../api/providers/clientProvider";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <GoogleAnalytics gaId="G-3R8DQVPZVD" />
      <GoogleTagManager gtmId="GTM-5DMMM9F" />
      <GoogleAnalytics gaId="167998249" />
      <CategoryProvider>
        <BannerProvider>
          <ClientProvider>
            <CartProvider>
              <WishlistProvider>
                <Component {...pageProps} />
              </WishlistProvider>
            </CartProvider>
          </ClientProvider>
        </BannerProvider>
      </CategoryProvider>
    </>
  );
}
