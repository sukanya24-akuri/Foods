export const calculatorCartTotals = (cartItems, quantities) => {
  const subTotal = cartItems.reduce(
    (acc, food) => acc + food.price * quantities[food.id],
    0
  );
  const shippingCharge = subTotal === 0 ? 0.0 : 10;
  const tax = subTotal * 0.01;
  const totalAmount = subTotal + shippingCharge + tax;
  return { subTotal, shippingCharge, tax, totalAmount };
};
