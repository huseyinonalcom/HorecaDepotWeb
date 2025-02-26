import useTranslation from "next-translate/useTranslation";
import setLanguage from "next-translate/setLanguage";
import { Globe } from "react-feather";
import { useState } from "react";
import Image from "next/image";

export default function LocaleSwitcher() {
  const { t, lang } = useTranslation();
  const [showSwitcher, setShowSwitcher] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setShowSwitcher(true)}>
        <Globe className="ml-auto" />
      </button>
      {showSwitcher && (
        <div
          onClick={() => {
            setShowSwitcher(false);
          }}
          className="fixed inset-0 flex flex-col items-center justify-center gap-2 bg-black duration-300"
        >
          <button
            name="setLanguageToEN"
            aria-label="Set Language to English"
            onClick={async () => await setLanguage("en")}
            className={`underline-animation-white whitespace-nowrap px-4 font-bold duration-300 ${lang == "en" ? "hidden" : ""}`}
          >
            <Image
              src={`/assets/header/EN.svg`}
              alt={t("locale")}
              width={70}
              height={46}
              style={{ width: "70px", height: "46px" }}
              className="shadow-[0_0_15px_rgba(255,255,255,0.4)]"
            />
          </button>
          <button
            name="setLanguageToFR"
            aria-label="Set Language to French"
            onClick={async () => await setLanguage("fr")}
            className={`underline-animation-white whitespace-nowrap px-4 font-bold duration-300 ${lang == "fr" ? "hidden" : ""}`}
          >
            <Image
              src={`/assets/header/FR.svg`}
              alt={t("locale")}
              width={70}
              height={46}
              style={{ width: "70px", height: "46px" }}
              className="shadow-[0_0_15px_rgba(255,255,255,0.4)]"
            />
          </button>
          <button
            name="setLanguageToNL"
            aria-label="Set Language to Dutch"
            onClick={async () => await setLanguage("nl")}
            className={`underline-animation-white whitespace-nowrap px-4 font-bold duration-300 ${lang == "nl" ? "hidden" : ""}`}
          >
            <Image
              src={`/assets/header/NL.svg`}
              alt={t("locale")}
              width={70}
              height={46}
              style={{ width: "70px", height: "46px" }}
              className="shadow-[0_0_15px_rgba(255,255,255,0.4)]"
            />
          </button>
          <button
            name="setLanguageToDE"
            aria-label="Set Language to German"
            onClick={async () => await setLanguage("de")}
            className={`underline-animation-white whitespace-nowrap px-4 font-bold duration-300 ${lang == "de" ? "hidden" : ""}`}
          >
            <Image
              src={`/assets/header/DE.svg`}
              alt={t("locale")}
              width={70}
              height={46}
              style={{ width: "70px", height: "46px" }}
              className="shadow-[0_0_15px_rgba(255,255,255,0.4)]"
            />
          </button>
        </div>
      )}
    </>
  );
}
