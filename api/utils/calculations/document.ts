export const calculateCartTotals = ({ cart }) => {
  const totalAfterDiscount = cart.reduce(
    (total, item) => total + item.amount * item.value,
    0,
  );
  const totalBeforeDiscount = cart.reduce((total, item) => {
    const effectivePrice = Math.max(item.priceBeforeDiscount, item.value);
    return total + item.amount * effectivePrice;
  }, 0);

  let amount = 0;
  cart.forEach((product) => (amount += product.amount));
  return { totalAfterDiscount, totalBeforeDiscount, amount };
};
