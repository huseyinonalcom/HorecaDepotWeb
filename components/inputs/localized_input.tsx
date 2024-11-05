import InputOutlined from "./outlined";

export type LocalizedInputProps = {
  onChange: (arg0: { [x: string]: string }) => void;
  value: Record<string, string>;
  title: string;
  locales?: string[];
};

export const LocalizedInput = (props: LocalizedInputProps) => {
  const locales = props.locales || ["en", "fr", "nl", "de"];

  return (
    <div className="flex flex-col gap-4 border-2 border-gray-400 p-2">
      <p className="text-xl font-bold">{props.title}</p>
      {locales.map((locale) => (
        <InputOutlined
          key={locale}
          label={locale}
          value={props.value[locale] || ""}
          onChange={(e) =>
            props.onChange({ ...props.value, [locale]: e.target.value })
          }
        />
      ))}
    </div>
  );
};
