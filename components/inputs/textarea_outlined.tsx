import { DetailedHTMLProps, InputHTMLAttributes } from "react";
import useTranslation from "next-translate/useTranslation";

interface Props
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > {
  label: string;
  error?: string;
  rounded?: boolean;
}

const TextareaOutlined = ({ label, error, rounded, ...rest }: Props) => {
  const { t } = useTranslation("common");
  return (
    <div className="w-full">
      <div className="relative">
        <textarea
          {...rest}
          aria-label={t(label)}
          id="input"
          className={`peer block w-full border-2 border-gray-300 bg-white px-2.5 pb-1.5 pt-3 text-sm text-black outline-none focus:border-black focus:ring-0 ${rounded ? "rounded-2xl" : ""}`}
          placeholder=""
        />
        <label
          htmlFor="input"
          aria-label={`${t("label_for", { labelTarget: t(label) })}`}
          className="pointer-events-none absolute start-1 top-1 z-10 ml-1 origin-[0] -translate-y-3 scale-75 transform bg-white px-2 text-sm text-gray-800 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-500 peer-focus:top-1 peer-focus:-translate-y-3 peer-focus:scale-75"
        >
          {t(label)}
        </label>
      </div>
      {error && (
        <p
          aria-label={`${t("error_for", { errorTarget: t(label) })}`}
          className="pl-3 text-xs text-red-600"
        >
          {t(error)}
        </p>
      )}
    </div>
  );
};

export default TextareaOutlined;
