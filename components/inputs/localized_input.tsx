import { Field, Label } from "../styled/fieldset";
import { Input } from "../styled/input";
import { Textarea } from "../styled/textarea";

export type LocalizedInputProps = {
  onChange: (arg0: { [x: string]: string }) => void;
  value: Record<string, string>;
  locales?: string[];
  required?: boolean;
  lines?: number;
};

export const LocalizedInput = (props: LocalizedInputProps) => {
  const locales = props.locales || ["en", "fr", "nl", "de"];

  if (props.lines) {
    return locales.map((locale) => (
      <Field key={locale}>
        <Label>{locale}</Label>
        <Textarea
          required={props.required}
          key={locale}
          rows={props.lines}
          value={props.value[locale] || ""}
          onChange={(e) =>
            props.onChange({ ...props.value, [locale]: e.target.value })
          }
        />
      </Field>
    ));
  } else {
    return locales.map((locale) => (
      <Input
        required={props.required}
        key={locale}
        label={locale}
        value={props.value[locale] || ""}
        onChange={(e) =>
          props.onChange({ ...props.value, [locale]: e.target.value })
        }
      />
    ));
  }
};
