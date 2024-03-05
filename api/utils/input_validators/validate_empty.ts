const validateEmpty = (value: string) => {
  return value.trim() === "" ? "validators_empty_invalid" : null;
};

export default validateEmpty;
