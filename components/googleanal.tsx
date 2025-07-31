"use client";

import { usePathname, useSearchParams } from "next/navigation";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";
import Script from "next/script";

export default function GoogleAnalytics({
  GA_MEASUREMENT_ID,
}: {
  GA_MEASUREMENT_ID: string;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const url = pathname + searchParams.toString();

    pageview(GA_MEASUREMENT_ID, url);
  }, [pathname, searchParams, GA_MEASUREMENT_ID]);
  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                gtag('consent', 'default', {
                    'analytics_storage': 'denied'
                });
                
                gtag('config', '${GA_MEASUREMENT_ID}', {
                    page_path: window.location.pathname,
                });
                `,
        }}
      />
    </>
  );
}

export const pageview = (GA_MEASUREMENT_ID: string, url: string) => {
  window.gtag("config", GA_MEASUREMENT_ID, {
    page_path: url,
  });
};

export function CookieBanner() {
  const [cookieConsent, setCookieConsent] = useState(false);
  const { t } = useTranslation("common");

  useEffect(() => {
    const storedCookieConsent = getLocalStorage("cookie_consent", null);

    setCookieConsent(storedCookieConsent);
  }, [setCookieConsent]);

  useEffect(() => {
    const newValue = cookieConsent ? "granted" : "denied";

    try {
      window.gtag("consent", "update", {
        analytics_storage: newValue,
      });
    } catch (e) {}

    setLocalStorage("cookie_consent", cookieConsent);
  }, [cookieConsent]);
  return (
    <div
      className={`${cookieConsent != null ? "hidden" : "flex"} fixed right-0 bottom-0 left-0 mx-auto my-10 flex max-w-max flex-col items-center justify-between gap-4 rounded-lg bg-gray-700 px-3 py-3 text-white shadow sm:flex-row md:max-w-screen-sm md:px-4`}
    >
      <div className="text-center">
        <p className="text-sm">{t("cookie_disclaimer")}</p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setCookieConsent(false)}
          className="rounded-md border-gray-900 px-5 py-2 text-white"
        >
          {t("cookie_disclaimer_decline")}
        </button>
        <button
          onClick={() => setCookieConsent(true)}
          className="rounded-md border-gray-900 px-5 py-2 text-white"
        >
          {t("cookie_disclaimer_accept")}
        </button>
      </div>
    </div>
  );
}

export function getLocalStorage(key: string, defaultValue: any) {
  const stickyValue = localStorage.getItem(key);

  return stickyValue !== null && stickyValue !== "undefined"
    ? JSON.parse(stickyValue)
    : defaultValue;
}

export function setLocalStorage(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}
