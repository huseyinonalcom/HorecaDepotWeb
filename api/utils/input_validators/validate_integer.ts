const validateInteger = (value: String) => {
  if (value.includes(",") || value.includes("."))
    return "validators_integer_invalid";
  const num = Number(value);
  if (isNaN(num) || num < 0) return "validators_integer_invalid";
  return null;
};

export default validateInteger;
