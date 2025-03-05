import useTranslation from "next-translate/useTranslation";
import setLanguage from "next-translate/setLanguage";
import { useState, useCallback } from "react";
import Image from "next/image";

const languages = [
  {
    code: "en",
    label: "Set Language to English",
    alt: "Change language to English",
  },
  {
    code: "fr",
    label: "Set Language to French",
    alt: "Changer la langue en français",
  },
  {
    code: "nl",
    label: "Set Language to Dutch",
    alt: "Verander de taal naar Nederlands",
  },
  {
    code: "de",
    label: "Set Language to German",
    alt: "Sprache auf Deutsch umstellen",
  },
];

export default function LocaleSwitcher() {
  const { t, lang } = useTranslation();
  const [showSwitcher, setShowSwitcher] = useState(false);

  const handleLanguageChange = useCallback(async (code: string) => {
    await setLanguage(code);
    setShowSwitcher(false);
  }, []);

  return (
    <>
      <button type="button" onClick={() => setShowSwitcher(true)}>
        <Image
          src={`/assets/header/${lang.toUpperCase()}.svg`}
          alt={t("locale")}
          width={46}
          height={30}
          className="shadow-[0_0_15px_rgba(255,255,255,0.4)]"
        />
      </button>

      {showSwitcher && (
        <div
          onClick={() => setShowSwitcher(false)}
          className="fixed inset-0 z-[999] flex flex-col items-center justify-center gap-2 bg-black duration-300"
        >
          {languages.map(({ code, label, alt }) =>
            lang !== code ? (
              <button
                key={code}
                name={label}
                aria-label={label}
                onClick={() => handleLanguageChange(code)}
                className="underline-animation-white whitespace-nowrap px-4 font-bold duration-300"
              >
                <Image
                  src={`/assets/header/${code.toUpperCase()}.svg`}
                  alt={alt}
                  width={70}
                  height={46}
                  className="shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                />
              </button>
            ) : null,
          )}
        </div>
      )}
    </>
  );
}
