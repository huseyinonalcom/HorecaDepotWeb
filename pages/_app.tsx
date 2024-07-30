import { AppProps } from "next/app";
import "../global.css";
import { CategoryProvider } from "../api/providers/categoryProvider";
import { AdminDrawerProvider } from "../api/providers/adminDrawerProvider";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <GoogleAnalytics gaId="G-3R8DQVPZVD" />
      <GoogleTagManager gtmId="GTM-5DMMM9F" />
      <GoogleAnalytics gaId="167998249" />
      <CategoryProvider>
        <AdminDrawerProvider>
          <Component {...pageProps} />
        </AdminDrawerProvider>
      </CategoryProvider>
    </>
  );
}
