import useTranslation from "next-translate/useTranslation";
import setLanguage from "next-translate/setLanguage";
import { useState, useCallback } from "react";
import Image from "next/image";
import { Dialog, DialogBody } from "./styled/dialog";

const languages: { code: string; label: string }[] = [
  {
    code: "en",
    label: "Change language to English",
  },
  {
    code: "fr",
    label: "Changer la langue en français",
  },
  {
    code: "nl",
    label: "Verander de taal naar Nederlands",
  },
  {
    code: "de",
    label: "Sprache auf Deutsch umstellen",
  },
];

export default function LocaleSwitcher() {
  const { t, lang } = useTranslation("common");

  const [showSwitcher, setShowSwitcher] = useState(false);

  const handleLanguageChange = useCallback((code: string) => {
    setLanguage(code);
    setShowSwitcher(false);
  }, []);

  return (
    <div className="flex flex-row pl-2">
      <button type="button" onClick={() => setShowSwitcher(true)}>
        <Image
          src={`/assets/header/${lang.toUpperCase()}.svg`}
          alt={t("locale")}
          width={46}
          height={30}
          className="shadow-[0_0_15px_rgba(255,255,255,0.4)]"
        />
      </button>

      <Dialog open={showSwitcher} onClose={setShowSwitcher} size="xs">
        <DialogBody className="flex flex-col items-center gap-4 text-sm/6 text-zinc-900">
          {languages.map(({ code, label }) =>
            lang !== code ? (
              <button
                key={code}
                name={label}
                aria-label={label}
                onClick={() => handleLanguageChange(code)}
              >
                <Image
                  src={`/assets/header/${code.toUpperCase()}.svg`}
                  alt={label}
                  width={70}
                  height={46}
                  className="shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                />
              </button>
            ) : null,
          )}
        </DialogBody>
      </Dialog>
    </div>
  );
}
