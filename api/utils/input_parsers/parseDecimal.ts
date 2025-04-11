export default function parseDecimal(value: string | number) {
  let num;

  if (typeof value == "string") {
    num = Number(value.replaceAll(",", "."));
  } else {
    num = value;
  }

  return num;
}
