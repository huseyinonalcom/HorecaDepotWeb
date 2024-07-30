import { AppProps } from "next/app";
import Script from "next/script";
import "../global.css";
import { CategoryProvider } from "../api/providers/categoryProvider";
import { AdminDrawerProvider } from "../api/providers/adminDrawerProvider";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Script
        strategy="afterInteractive"
        src="https://www.googletagmanager.com/gtag/js?id=G-3R8DQVPZVD"
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-3R8DQVPZVD);
        `,
        }}
      />
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
