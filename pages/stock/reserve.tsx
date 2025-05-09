import { Radio, RadioField, RadioGroup } from "../../components/styled/radio";
import { CustomerSelector } from "../../components/selector/CustomerSelector";
import { calculateCartTotals } from "../../api/utils/calculations/document";
import { formatCurrency } from "../../api/utils/formatters/formatcurrency";
import { Switch, SwitchField } from "../../components/styled/switch";
import { getCoverImageUrl } from "../../api/utils/getprodcoverimage";
import StockLayout from "../../components/stock/StockLayout";
import useTranslation from "next-translate/useTranslation";
import StyledForm from "../../components/form/StyledForm";
import ImageWithURL from "../../components/common/image";
import { ClientUser } from "../../api/interfaces/client";
import { Select } from "../../components/styled/select";
import { Button } from "../../components/styled/button";
import { FiMinus, FiPlus, FiX } from "react-icons/fi";
import { Input } from "../../components/styled/input";
import { countries } from "../../api/utils/countries";
import { useEffect, useState } from "react";
import {
  Field,
  Fieldset,
  Label,
  Legend,
} from "../../components/styled/fieldset";
import {
  Dialog,
  DialogBody,
  DialogTitle,
} from "../../components/styled/dialog";

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
      category: "Particulier",
      company: "",
      taxID: "",
      addresses: [],
    },
  });

  const [showCustomerSelector, setShowCustomerSelector] = useState(false);

  const submitReservation = async (e) => {
    e.preventDefault();
    alert("Reservation created");
    cart.forEach((product) => {
      removeFromCart(product.id);
    });

    return;
    const body = {
      document: {
        type: "Reservation",
        date: new Date(),
        customer: customer,
        documentProducts: cart,
      },
    };
    const request = await fetch("/api/private/documents", {
      method: "POST",
      body: JSON.stringify(body),
    });

    if (request.ok) {
      alert("Reservation created");
      cart.forEach((product) => {
        removeFromCart(product.id);
      });
    }
  };

  const [sameAsInvoice, setSameAsInvoice] = useState(true);

  return (
    <div>
      <div className="ww-full mx-auto grid grid-cols-1 gap-x-4 lg:grid-cols-2 lg:px-4 lg:py-4">
        <h1 className="sr-only">{t("create-reservation")}</h1>

        <section
          aria-labelledby="summary-heading"
          className="w-full bg-white p-4 shadow-sm md:p-12 lg:col-start-2 lg:row-start-1 lg:rounded-lg"
        >
          <h2 id="summary-heading" className="sr-only">
            {t("reservation-summary")}
          </h2>

          <ul
            role="list"
            className="divide-y divide-white/10 text-sm font-medium"
          >
            {cart.map((product) => (
              <li key={product.id} className="flex items-start space-x-4 py-6">
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
        </section>

        <section
          aria-labelledby="payment-and-shipping-heading"
          className="w-full py-16 lg:col-start-1 lg:row-start-1 lg:pt-0 lg:pb-24"
        >
          <h2 id="payment-and-shipping-heading" className="sr-only">
            {t("customer-details")}
          </h2>
          <StyledForm onSubmit={submitReservation}>
            <Button type="button" onClick={() => setShowCustomerSelector(true)}>
              {t("existing-customer")}
            </Button>
            <Dialog
              size="5xl"
              open={showCustomerSelector}
              onClose={setShowCustomerSelector}
            >
              <DialogTitle>{t("choose-customer")}</DialogTitle>
              <DialogBody>
                <CustomerSelector
                  onCustomerSelected={(customer) => {
                    setCustomer({ ...customer.login, client_info: customer });
                  }}
                />
              </DialogBody>
            </Dialog>
            <Fieldset>
              <Legend>{t("customer-type")}</Legend>
              <RadioGroup
                name="customerType"
                value={customer.client_info.category}
                onChange={(value) =>
                  setCustomer((prev) => ({
                    ...prev,
                    client_info: { ...prev.client_info, category: value },
                  }))
                }
              >
                <RadioField>
                  <Radio value="Particulier" />
                  <Label>{t("individual")}</Label>
                </RadioField>
                <RadioField>
                  <Radio value="Entreprise" />
                  <Label>{t("business")}</Label>
                </RadioField>
              </RadioGroup>
            </Fieldset>
            {customer.client_info.category === "Entreprise" && (
              <Fieldset>
                <Legend>{t("business-information")}</Legend>
                <Input
                  name="company"
                  label={t("company")}
                  required
                  value={customer.client_info.company}
                  onChange={(e) =>
                    setCustomer((prev) => ({
                      ...prev,
                      client_info: {
                        ...prev.client_info,
                        company: e.target.value,
                      },
                    }))
                  }
                />
                <Input
                  name="taxID"
                  label={t("taxID")}
                  required
                  value={customer.client_info.taxID}
                  onChange={(e) =>
                    setCustomer((prev) => ({
                      ...prev,
                      client_info: {
                        ...prev.client_info,
                        taxID: e.target.value,
                      },
                    }))
                  }
                />
              </Fieldset>
            )}
            <Fieldset>
              <Legend>{t("customer-information")}</Legend>
              <Input
                name="firstName"
                label={t("firstname")}
                required
                value={customer.client_info.firstName}
                onChange={(e) =>
                  setCustomer((prev) => ({
                    ...prev,
                    client_info: {
                      ...prev.client_info,
                      firstName: e.target.value,
                    },
                  }))
                }
              />
              <Input
                name="lastName"
                label={t("lastname")}
                required
                value={customer.client_info.lastName}
                onChange={(e) =>
                  setCustomer((prev) => ({
                    ...prev,
                    client_info: {
                      ...prev.client_info,
                      lastName: e.target.value,
                    },
                  }))
                }
              />
              <Input
                name="email"
                label={t("email")}
                required
                value={customer.email}
                onChange={(e) =>
                  setCustomer((prev) => ({
                    ...prev,
                    email: e.target.value,
                    username: e.target.value,
                    client_info: {
                      email: e.target.value,
                    },
                  }))
                }
              />
              <Input
                name="phone"
                label={t("phone")}
                value={customer.client_info.phone}
                onChange={(e) =>
                  setCustomer((prev) => ({
                    ...prev,
                    client_info: {
                      ...prev.client_info,
                      phone: e.target.value,
                    },
                  }))
                }
              />
            </Fieldset>
            {/*   <Fieldset>
              <Legend>{t("invoice-address")}</Legend>
              <Field>
                <Label>{t("country")}</Label>
                <Select required name="invoiceCountry">
                  <option value="none">{t("choose-country")}</option>
                  {countries
                    .flatMap((country) => country.names)
                    .filter((name, index, arr) => arr.indexOf(name) === index)
                    .sort((a, b) => a.localeCompare(b))
                    .map((name) => (
                      <option key={`${name}`} value={name}>
                        {name}
                      </option>
                    ))}
                </Select>
              </Field>
              <Input name="invoiceStreet" label={t("street")} required />
              <Input
                name="invoiceDoorNumber"
                label={t("doorNumber")}
                required
              />
              <Input name="invoiceFloor" label={t("floor")} />
              <Input name="invoiceZipCode" label={t("zipCode")} required />
              <Input name="invoiceCity" label={t("city")} required />
            </Fieldset>
            <Fieldset>
              <Legend>{t("delivery-address")}</Legend>
              <SwitchField>
                <Label>{t("same-as-invoice")}</Label>
                <Switch
                  name="deliverySameAsInvoice"
                  defaultChecked={true}
                  onChange={(checked) => {
                    setSameAsInvoice(checked);
                  }}
                />
              </SwitchField>
              {!sameAsInvoice && (
                <>
                  <Field>
                    <Label>{t("country")}</Label>
                    <Select required name="deliveryCountry">
                      <option value="none">{t("choose-country")}</option>
                      {countries
                        .flatMap((country) => country.names)
                        .filter(
                          (name, index, arr) => arr.indexOf(name) === index,
                        )
                        .sort((a, b) => a.localeCompare(b))
                        .map((name) => (
                          <option key={`${name}`} value={name}>
                            {name}
                          </option>
                        ))}
                    </Select>
                  </Field>
                  <Input name="deliveryStreet" label={t("street")} required />
                  <Input name="deliveryDoorNumber" label={t("doorNumber")} />
                  <Input name="deliveryFloor" label={t("floor")} />
                  <Input name="deliveryZipCode" label={t("zipCode")} required />
                  <Input name="deliveryCity" label={t("city")} required />
                </>
              )}
            </Fieldset> */}
          </StyledForm>
        </section>
      </div>
    </div>
  );
}

Reserve.getLayout = function getLayout(page: React.ReactNode) {
  return <StockLayout>{page}</StockLayout>;
};
