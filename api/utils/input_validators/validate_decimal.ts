const isValidDecimal = (value: string | number) => {
  let num;

  if (typeof value == "string") {
    num = Number(value.replaceAll(",", "."));
  } else {
    num = value;
  }

  if (isNaN(num)) return false;

  return true;
};

export default isValidDecimal;
