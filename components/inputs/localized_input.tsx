import { Input } from "../styled/input";

export type LocalizedInputProps = {
  onChange: (arg0: { [x: string]: string }) => void;
  value: Record<string, string>;
  locales?: string[];
};

export const LocalizedInput = (props: LocalizedInputProps) => {
  const locales = props.locales || ["en", "fr", "nl", "de"];

  return (
    <>
      {locales.map((locale) => (
        <Input
          key={locale}
          label={locale}
          value={props.value[locale] || ""}
          onChange={(e) =>
            props.onChange({ ...props.value, [locale]: e.target.value })
          }
        />
      ))}
    </>
  );
};
