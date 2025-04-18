import { calculateCartTotals } from "../../api/utils/calculations/document";
import { formatCurrency } from "../../api/utils/formatters/formatcurrency";
import { getCoverImageUrl } from "../../api/utils/getprodcoverimage";
import StockLayout from "../../components/stock/StockLayout";
import useTranslation from "next-translate/useTranslation";
import ImageWithURL from "../../components/common/image";
import { ClientUser } from "../../api/interfaces/client";
import { Button } from "../../components/styled/button";
import { FiMinus, FiPlus, FiX } from "react-icons/fi";
import { useEffect, useState } from "react";

const emptyAddress = {
  country: "",
  city: "",
  zipCode: "",
  doorNumber: "",
  street: "",
  floor: "",
};

export default function Reserve() {
  const { t } = useTranslation("common");

  const [cart, setCart] = useState<any[]>([]);

  const totals = calculateCartTotals({ cart });

  const getCart = async () => {
    const cart = localStorage.getItem("stock-cart");
    setCart(cart ? JSON.parse(cart) : []);
  };

  useEffect(() => {
    getCart();
  }, []);

  const removeFromCart = (productId: number) => {
    const cart = JSON.parse(localStorage.getItem("stock-cart") ?? "[]");
    const itemToDelete = cart.find((p) => p.id === productId);
    if (!itemToDelete) return;
    const index = cart.indexOf(itemToDelete);
    cart.splice(index, 1);
    localStorage.setItem("stock-cart", JSON.stringify(cart));
    setCart(cart);
  };

  const setAmount = (productId: number, amount: number) => {
    const cart = JSON.parse(localStorage.getItem("stock-cart") ?? "[]");
    const itemToUpdate = cart.find((p) => p.id === productId);
    if (!itemToUpdate) return;
    if (amount < 1) return;
    itemToUpdate.amount = amount;
    localStorage.setItem("stock-cart", JSON.stringify(cart));
    setCart(cart);
  };

  const [customer, setCustomer] = useState<ClientUser>({
    id: 0,
    client_info: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      category: "",
      company: "",
      taxID: "",
      addresses: [],
    },
  });

  return (
    <div>
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-x-16 lg:grid-cols-2 lg:px-8 lg:pt-16">
        <h1 className="sr-only">{t("create-reservation")}</h1>

        <section
          aria-labelledby="summary-heading"
          className="py-12 md:px-10 lg:col-start-2 lg:row-start-1 lg:mx-auto lg:w-full lg:max-w-lg lg:bg-transparent lg:px-0 lg:pt-0 lg:pb-24"
        >
          <div className="mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0">
            <h2 id="summary-heading" className="sr-only">
              {t("reservation-summary")}
            </h2>

            <ul
              role="list"
              className="divide-y divide-white/10 text-sm font-medium"
            >
              {cart.map((product) => (
                <li
                  key={product.id}
                  className="flex items-start space-x-4 py-6"
                >
                  <ImageWithURL
                    src={
                      product.images != null
                        ? getCoverImageUrl(product)
                        : "/uploads/placeholder_9db455d1f1.webp"
                    }
                    alt={product.name}
                    width={80}
                    height={80}
                    className="size-20 flex-none rounded-md object-cover"
                  />
                  <div className="flex-auto space-y-1">
                    <h3>{product.name}</h3>
                    <p>{product.internalCode}</p>
                    <p>{product.color}</p>
                    <p>{product.size}</p>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <p className="flex-none text-base font-medium">
                      {formatCurrency(product.value * product.amount)}
                    </p>

                    <div className="flex flex-row items-center justify-center">
                      <button
                        name="removeFromCart"
                        aria-label="Remove from Cart"
                        onClick={() => removeFromCart(product.id)}
                        className="mr-2.5"
                      >
                        <FiX color="red" />
                      </button>
                      <div className="mr-2 flex h-fit flex-row items-center justify-center rounded-md border-2 border-black bg-black p-0.5 duration-300">
                        <FiMinus
                          name="decreaseQuantity"
                          aria-label="Decrease Quantity"
                          className="h-6 w-6 cursor-pointer rounded-md bg-white px-1 duration-300 hover:text-red-500"
                          onClick={() =>
                            setAmount(product.id, product.amount - 1)
                          }
                        />
                        <p className="mx-1.25 w-[40px] text-center text-white">
                          {product.amount}
                        </p>
                        <FiPlus
                          name="increaseQuantity"
                          aria-label="Increase Quantity"
                          className="h-6 w-6 cursor-pointer rounded-md bg-white px-1 duration-300 hover:text-green-500"
                          onClick={() =>
                            setAmount(product.id, product.amount + 1)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <dl className="space-y-6 border-t border-white/10 pt-6 text-sm font-medium">
              {/*    <div className="flex items-center justify-between">
                <dt>{t("shipping")}</dt>
                <dd>{formatCurrency(shippingCost)}</dd>
              </div>
            */}

              <div className="flex items-center justify-between border-t border-white/10 pt-6">
                <dt className="text-base">{t("Total")}</dt>
                <dd className="text-base">
                  {formatCurrency(totals.totalAfterDiscount / 1.21 + 0)}
                </dd>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-6">
                <dt className="text-base">
                  {t("Total")} {t("vat-incl")}
                </dt>
                <dd className="text-base">
                  {formatCurrency(totals.totalAfterDiscount + 0)}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <section
          aria-labelledby="payment-and-shipping-heading"
          className="py-16 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:w-full lg:max-w-lg lg:pt-0 lg:pb-24"
        >
          <h2 id="payment-and-shipping-heading" className="sr-only">
            {t("customer-details")}
          </h2>

          <form>
            <div className="mx-auto max-w-2xl px-4 lg:max-w-none lg:px-0">
              <div>
                <h3
                  id="contact-info-heading"
                  className="text-lg font-medium text-gray-900"
                >
                  Contact information
                </h3>

                <div className="mt-6">
                  <label
                    htmlFor="email-address"
                    className="block text-sm/6 font-medium text-gray-700"
                  >
                    Email address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email-address"
                      name="email-address"
                      type="email"
                      autoComplete="email"
                      className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="text-lg font-medium text-gray-900">
                  Payment details
                </h3>

                <div className="mt-6 grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-4">
                  <div className="col-span-3 sm:col-span-4">
                    <label
                      htmlFor="card-number"
                      className="block text-sm/6 font-medium text-gray-700"
                    >
                      Card number
                    </label>
                    <div className="mt-2">
                      <input
                        id="card-number"
                        name="card-number"
                        type="text"
                        autoComplete="cc-number"
                        className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />
                    </div>
                  </div>

                  <div className="col-span-2 sm:col-span-3">
                    <label
                      htmlFor="expiration-date"
                      className="block text-sm/6 font-medium text-gray-700"
                    >
                      Expiration date (MM/YY)
                    </label>
                    <div className="mt-2">
                      <input
                        id="expiration-date"
                        name="expiration-date"
                        type="text"
                        autoComplete="cc-exp"
                        className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="cvc"
                      className="block text-sm/6 font-medium text-gray-700"
                    >
                      CVC
                    </label>
                    <div className="mt-2">
                      <input
                        id="cvc"
                        name="cvc"
                        type="text"
                        autoComplete="csc"
                        className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="text-lg font-medium text-gray-900">
                  Shipping address
                </h3>

                <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-3">
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="address"
                      className="block text-sm/6 font-medium text-gray-700"
                    >
                      Address
                    </label>
                    <div className="mt-2">
                      <input
                        id="address"
                        name="address"
                        type="text"
                        autoComplete="street-address"
                        className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="city"
                      className="block text-sm/6 font-medium text-gray-700"
                    >
                      City
                    </label>
                    <div className="mt-2">
                      <input
                        id="city"
                        name="city"
                        type="text"
                        autoComplete="address-level2"
                        className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="region"
                      className="block text-sm/6 font-medium text-gray-700"
                    >
                      State / Province
                    </label>
                    <div className="mt-2">
                      <input
                        id="region"
                        name="region"
                        type="text"
                        autoComplete="address-level1"
                        className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="postal-code"
                      className="block text-sm/6 font-medium text-gray-700"
                    >
                      Postal code
                    </label>
                    <div className="mt-2">
                      <input
                        id="postal-code"
                        name="postal-code"
                        type="text"
                        autoComplete="postal-code"
                        className="block w-full rounded-md bg-white px-3 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="text-lg font-medium text-gray-900">
                  Billing information
                </h3>

                <div className="mt-6 flex gap-3">
                  <div className="flex h-5 shrink-0 items-center">
                    <div className="group grid size-4 grid-cols-1">
                      <input
                        defaultChecked
                        id="same-as-shipping"
                        name="same-as-shipping"
                        type="checkbox"
                        className="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                      />
                      <svg
                        fill="none"
                        viewBox="0 0 14 14"
                        className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                      >
                        <path
                          d="M3 8L6 11L11 3.5"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="opacity-0 group-has-checked:opacity-100"
                        />
                        <path
                          d="M3 7H11"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="opacity-0 group-has-indeterminate:opacity-100"
                        />
                      </svg>
                    </div>
                  </div>
                  <label
                    htmlFor="same-as-shipping"
                    className="text-sm font-medium text-gray-900"
                  >
                    Same as shipping information
                  </label>
                </div>
              </div>

              <div className="mt-10 flex justify-end border-t border-gray-200 pt-6">
                <Button type="submit">
                  <p>{t("reserve")}</p>
                </Button>
              </div>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

Reserve.getLayout = function getLayout(page: React.ReactNode) {
  return <StockLayout>{page}</StockLayout>;
};
