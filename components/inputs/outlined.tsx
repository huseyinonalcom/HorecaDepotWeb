import useTranslation from "next-translate/useTranslation";

type Props = {
  onChange?;
  onKeyDown?;
  onSubmit?;
  value?: string;
  name: string;
  label?: string;
  type: string;
  error?: string;
  required?: boolean;
};

const InputOutlined = ({
  onChange,
  onKeyDown,
  onSubmit,
  value,
  required,
  name,
  label,
  type,
  error,
}: Props) => {
  const { t } = useTranslation("common");
  return (
    <div className="w-full">
      <div className="relative">
        <input
          required={required ?? false}
          type={type}
          name={t(name)}
          onSubmit={
            onSubmit ??
            ((e) => {
              e.preventDefault();
            })
          }
          aria-label={t(name)}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          id="input"
          className="-0 peer block w-full border-2 border-gray-300 bg-transparent bg-white px-2.5 pb-1.5 pt-3 text-sm text-black outline-none focus:border-black focus:ring-0"
          placeholder=""
        />
        <label
          htmlFor="input"
          aria-label={`${t("label_for", { labelTarget: t(name) })}`}
          className="pointer-events-none absolute start-1 top-1 z-10 ml-1 origin-[0] -translate-y-3 scale-75 transform bg-white px-2 text-sm text-gray-800 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:text-gray-500 peer-focus:top-1 peer-focus:-translate-y-3 peer-focus:scale-75"
        >
          {t(label) ?? t(name)}
        </label>
      </div>
      {error && (
        <p
          aria-label={`${t("error_for", { errorTarget: t(name) })}`}
          className="pl-3 text-xs text-red-600"
        >
          {t(error)}
        </p>
      )}
    </div>
  );
};

export default InputOutlined;
