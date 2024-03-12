import useTranslation from "next-translate/useTranslation";

type Props = {
  onChange?;
  onKeyDown?;
  onSubmit?;
  value?: string;
  name: string;
  label?: string;
  error?: string;
  required?: boolean;
};

const TextareaOutlined = ({ onChange, onKeyDown, onSubmit, value, required, name, label, error }: Props) => {
  const { t } = useTranslation("common");
  return (
    <div className="w-full">
      <div className="relative">
        <textarea
          required={required ?? false}
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
          className="block px-2.5 pb-1.5 pt-3 bg-white w-full text-sm text-black bg-transparent -0 border-2 border-gray-300 outline-none focus:ring-0 focus:border-orange-400 peer"
          placeholder=""
        />
        <label
          htmlFor="input"
          aria-label={`${t("label_for", { labelTarget: t(name) })}`}
          className="absolute pointer-events-none text-sm text-gray-800 duration-300 transform -translate-y-3 scale-75 top-1 z-10 origin-[0] bg-white px-2 ml-1 peer-placeholder-shown:text-gray-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-3 start-1"
        >
          {t(label) ?? t(name)}
        </label>
      </div>
      {error && (
        <p aria-label={`${t("error_for", { errorTarget: t(name) })}`} className="pl-3 text-xs text-red-600">
          {t(error)}
        </p>
      )}
    </div>
  );
};

export default TextareaOutlined;
