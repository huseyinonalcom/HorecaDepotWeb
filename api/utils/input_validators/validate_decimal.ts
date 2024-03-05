const validateDecimal = (value: string) => {
  const num = Number(value.replaceAll(",", "."));
  if (isNaN(num) || num < 0) return "validators_decimal_invalid";
  return null;
};

export default validateDecimal;
