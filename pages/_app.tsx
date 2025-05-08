import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { CategoryProvider } from "../api/providers/categoryProvider";
import { WishlistProvider } from "../api/providers/wishlistProvider";
import { BannerProvider } from "../api/providers/bannerProdiver";
import { ClientProvider } from "../api/providers/clientProvider";
import { CartProvider } from "../api/providers/cartProvider";
import "yet-another-react-lightbox-lite/styles.css";
import { ReactElement, ReactNode, StrictMode } from "react";
import { AppProps } from "next/app";
import { NextPage } from "next";
import "../global.css";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const getLayout = Component.getLayout ?? ((page) => page);
  return getLayout(
    <>
      <StrictMode>
        <GoogleAnalytics gaId="G-3R8DQVPZVD" />
        <GoogleTagManager gtmId="GTM-5DMMM9F" />
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
      </StrictMode>
    </>,
  );
}
