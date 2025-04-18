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

          <form></form>
        </section>
      </div>
    </div>
  );
}

Reserve.getLayout = function getLayout(page: React.ReactNode) {
  return <StockLayout>{page}</StockLayout>;
};
