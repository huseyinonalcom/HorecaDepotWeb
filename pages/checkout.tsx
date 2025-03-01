import areAllPropertiesEmpty from "../api/utils/input_validators/are_all_properties_empty";
import areAllPropertiesNull from "../api/utils/input_validators/are_all_properties_null";
import validateEmpty from "../api/utils/input_validators/validate_empty";
import { Client, ClientConversion } from "../api/interfaces/client";
import useTranslation from "next-translate/useTranslation";
import ButtonShadow1 from "../components/buttons/shadow_1";
import InputOutlined from "../components/inputs/outlined";
import CustomTheme from "../components/componentThemes";
import { Document } from "../api/interfaces/document";
import { Address } from "../api/interfaces/address";
import Layout from "../components/public/layout";
import { AutoTextSize } from "auto-text-size";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import ImageWithURL from "../components/common/image";
import { getCoverImageUrl } from "../api/utils/getprodcoverimage";
import { ClientContext } from "../api/providers/clientProvider";
import { CartContext } from "../api/providers/cartProvider";
import { getConfig } from "./api/config/private/getconfig";
import ClientLogin from "../components/client/clientLogin";
import { Loader } from "react-feather";

export default function Checkout(props) {
  const { t, lang } = useTranslation("common");
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { client, clearClient, setCurrentClient } = useContext(ClientContext);
  const { cart, removeFromCart, increaseQuantity, decreaseQuantity } =
    useContext(CartContext);

  const calculateTotal = () => {
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

  useEffect(() => {
    setTimeout(async () => {
      const data = await fetch("/api/client/client/checkloggedinuser");
      if (data.status != 200) {
        clearClient();
      }
    }, 200);
  }, []);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddressExistingClient, setNewAddressExistingClient] =
    useState<Address>({
      country: "",
      city: "",
      zipCode: "",
      doorNumber: "",
      street: "",
      floor: "",
    });

  const handleNewAddressExistingClientFormSubmit = async (event) => {
    event.preventDefault();

    if (newAddressExistingClient.country == "") {
      alert("Please select a country");
      return;
    }

    if (newAddressExistingClient.street == "") {
      alert("Please enter a street");
      return;
    }

    if (newAddressExistingClient.zipCode == "") {
      alert("Please enter a zip code");
      return;
    }

    if (newAddressExistingClient.city == "") {
      alert("Please enter a city");
      return;
    }

    const request = await fetch(
      "/api/client/client/postnewaddress?client=" + client.client_info.id,
      {
        method: "POST",
        body: JSON.stringify({
          newAddressExistingClient,
        }),
      },
    );
    if (request.ok) {
      setShowAddressForm(false);
      const requestUpdatedClient = await fetch(
        "/api/client/client/updateclientinfo",
      );
      const answerUpdatedClient = await requestUpdatedClient.json();
      setCurrentClient(ClientConversion.fromJson(answerUpdatedClient));
    }
  };

  // might need to be checked
  const [promoError, setPromoError] = useState("");
  const [currentPromo, setCurrentPromo] = useState(null);
  const [usedPromoCode, setUsedPromoCode] = useState<string>("");
  const [submitErrorDocument, setSubmitErrorDocument] = useState("");
  const [chosenInvoiceAddressId, setChosenInvoiceAddressId] = useState(null);
  const [totalAfterPromo, setTotalAfterPromo] = useState<number | null>(null);
  const [chosenDeliveryAddressId, setChosenDeliveryAddressId] = useState(null);

  useEffect(() => {
    if (client) {
      if (!chosenDeliveryAddressId) {
        setChosenDeliveryAddressId(client?.client_info?.addresses?.at(0).id);
      }
      if (!chosenInvoiceAddressId) {
        setChosenInvoiceAddressId(client?.client_info?.addresses?.at(0).id);
      }
    }
  }, [client?.client_info.addresses]);

  useEffect(() => {
    if (usedPromoCode != "") {
      calculateTotalWithPromo(currentPromo);
    }
  }, [cart]);

  const validatePromo = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "/api/checkout/client/validatepromo?promo=" + usedPromoCode,
        {
          method: "GET",
        },
      );

      if (response.ok) {
        setPromoError(null);
        const answer = await response.json();
        calculateTotalWithPromo(answer);
        setCurrentPromo(answer);
      } else {
        setPromoError(t("promo_invalid"));
        setTotalAfterPromo(null);
      }
    } catch (error) {
      setPromoError(t("promo_invalid"));
      setTotalAfterPromo(null);
    }
  };

  const calculateTotalWithPromo = async (promoDetails) => {
    const cartAfterPromo = JSON.parse(JSON.stringify(cart));
    const discountAmount = promoDetails.discount;
    const discountPer = promoDetails.perAmount;
    const isPercentage = promoDetails.discountIsPercentage;
    const perProduct = promoDetails.products.length > 0;
    const promoProducts = promoDetails.products;
    const promoCategories = promoDetails.categories;
    var grandTotal = 0;

    const applyDiscount = (item, amount) => {
      let totalDiscount = 0;
      if (isPercentage) {
        totalDiscount = ((item.value * discountAmount) / 100) * amount;
      } else {
        totalDiscount = discountAmount * amount;
      }
      return totalDiscount;
    };

    cartAfterPromo.forEach((item) => {
      if (perProduct && promoProducts.find((prod) => prod.id === item.id)) {
        const discountableAmount =
          Math.floor(item.amount / discountPer) * discountPer;
        const totalDiscount = applyDiscount(item, discountableAmount);
        item.total = item.value * item.amount - totalDiscount;
      } else if (
        !perProduct &&
        promoCategories.find((cat) => cat.id === item.category.id)
      ) {
        const discountableAmount =
          Math.floor(item.amount / discountPer) * discountPer;
        const totalDiscount = applyDiscount(item, discountableAmount);
        item.total = item.value * item.amount - totalDiscount;
      } else {
        item.total = item.value * item.amount;
      }

      grandTotal += item.total;
    });

    setTotalAfterPromo(grandTotal);
  };

  // might need to be checked
  const handleOrderSubmit = async () => {
    setSubmitErrorDocument(null);
    if (!chosenInvoiceAddressId) {
      setSubmitErrorDocument("Choissisez un address pour facturation!");
      setSubmitting(false);
      return;
    }
    if (!chosenDeliveryAddressId) {
      setSubmitErrorDocument("Choissisez un address pour livrasion!");
      setSubmitting(false);
      return;
    }
    if (calculateTotal().totalAfterDiscount < 0) {
      setSubmitErrorDocument(t("Cart Empty"));
      setSubmitting(false);
      return;
    }
    let documentToPost: Document = {
      id: 0,
      type: "Commande",
      prefix: "NB-",
      number: "0",
      phase: 1,
      invoiced: false,
      deleted: false,
      date: "",
      client: { id: 0 },
      note: null,
      decisionMaker: `${client.client_info.firstName} ${client.client_info.lastName}`,
      document_products: cart.map((cartProduct) => {
        return {
          product: cartProduct.id,
          amount: cartProduct.amount,
        };
      }),
      docAddress: client.client_info.addresses.find(
        (address) => address.id == chosenInvoiceAddressId,
      ),
      delAddress: client.client_info.addresses.find(
        (address) => address.id == chosenDeliveryAddressId,
      ),
    };

    const request = await fetch(
      "/api/checkout/client/postorder?final=true&promo=" + usedPromoCode,
      {
        method: "POST",
        body: JSON.stringify({
          documentToPost,
        }),
      },
    );

    if (request.ok) {
      const answer = await request.json();
      const orderID = answer.id;
      const paymentReq = await fetch(
        `/api/payment/createpaymentlink?test=false`,
        {
          method: "POST",
          body: JSON.stringify(answer),
        },
      );
      if (paymentReq.ok) {
        const response = await paymentReq.json();
        if (response.url != 0) {
          window.location.href = response.url;
        } else {
          router.push(`/account/order?id=${orderID}`);
        }
      }
    } else {
      setSubmitErrorDocument(
        "Une erreur s'est produite lors de la création de votre commande!",
      );
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const updateAdd = async () => {
      if (
        client.client_info.addresses.find(
          (ad) => ad.id == chosenDeliveryAddressId,
        ).shippingDistance == 0 ||
        client.client_info.addresses.find(
          (ad) => ad.id == chosenDeliveryAddressId,
        ).shippingDistance == null
      ) {
        let updateReq = await fetch(
          "/api/client/client/updateaddress?id=" + chosenDeliveryAddressId,
          {
            method: "PUT",
          },
        );
        if (updateReq.ok) {
          const requestUpdatedClient = fetch(
            "/api/client/client/updateclientinfo",
          );
          requestUpdatedClient.then((response) => {
            response.json().then((answer) => {
              setCurrentClient(ClientConversion.fromJson(answer));
            });
          });
        }
      }
    };
    if (chosenDeliveryAddressId) {
      updateAdd();
    }
  }, [chosenDeliveryAddressId]);

  const [showLogin, setShowLogin] = useState(false);

  const [guestData, setGuestData] = useState<Client>({
    email: "",
    client_info: {
      category: "Particulier",
      firstName: "",
      lastName: "",
      phone: "",
      addresses: [],
      company: "",
      taxID: "",
    },
  });

  return (
    <Layout>
      <Head>
        <title>Horeca Depot</title>
        <meta name="description" content={t("main_description")} />
        <meta name="language" content={lang} />
      </Head>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div className="order-2 mb-2 mt-1 flex w-full flex-col items-center p-3 shadow-lg sm:order-1">
          {!client && !showLogin && (
            <div className="w-1/2">
              <button
                onClick={() => setShowLogin(true)}
                className={CustomTheme.greenSubmitButton}
              >
                {t("login-to-your-account")}
              </button>
            </div>
          )}
          {!client && showLogin && (
            <div className="w-1/2">
              <button
                onClick={() => setShowLogin(false)}
                className={CustomTheme.greenSubmitButton}
              >
                {t("checkout-without-account")}
              </button>
              <ClientLogin onLogin={() => {}} />
            </div>
          )}

          {!client && !showLogin && (
            <div className="flex w-full flex-col gap-2">
              <h3 className="mt-3">{t("Business or Individual")}?</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  name="setClientTypeToIndividual"
                  aria-label="Set Client Type to Individual"
                  type="button"
                  onClick={() =>
                    setGuestData({
                      ...guestData,
                      client_info: {
                        ...guestData.client_info,
                        category: "Particulier",
                      },
                    })
                  }
                  className={
                    CustomTheme.outlinedButton +
                    ` ${guestData.client_info.category == "Particulier" ? "bg-gray-300" : ""}`
                  }
                >
                  {t("Individual")}
                </button>
                <button
                  name="setClientTypeToIndividual"
                  aria-label="Set Client Type to Individual"
                  type="button"
                  onClick={() =>
                    setGuestData({
                      ...guestData,
                      client_info: {
                        ...guestData.client_info,
                        category: "Entreprise",
                      },
                    })
                  }
                  className={
                    CustomTheme.outlinedButton +
                    ` ${guestData.client_info.category == "Entreprise" ? "bg-gray-300" : ""}`
                  }
                >
                  {t("Business")}
                </button>
              </div>
              {guestData.client_info.category == `Entreprise` && (
                <>
                  <InputOutlined
                    required
                    type="text"
                    name="Company"
                    label="The name of your company"
                    value={guestData.client_info.company}
                    error={
                      guestData.client_info.company == "" ? t("required") : ""
                    }
                    onChange={(e) =>
                      setGuestData({
                        ...guestData,
                        client_info: {
                          ...guestData.client_info,
                          company: e.target.value,
                        },
                      })
                    }
                  />
                  <InputOutlined
                    required
                    type="text"
                    name="TaxID"
                    label="VAT number"
                    value={guestData.client_info.taxID}
                    error={
                      guestData.client_info.taxID == "" ? t("required") : ""
                    }
                    onChange={(e) =>
                      setGuestData({
                        ...guestData,
                        client_info: {
                          ...guestData.client_info,
                          taxID: e.target.value,
                        },
                      })
                    }
                  />
                </>
              )}
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="flex w-full flex-col sm:w-1/2">
                  <InputOutlined
                    required
                    type="text"
                    name="FirstName"
                    label="Your first name"
                    value={guestData.client_info.firstName}
                    error={
                      guestData.client_info.firstName == "" ? t("required") : ""
                    }
                    onChange={(e) =>
                      setGuestData({
                        ...guestData,
                        client_info: {
                          ...guestData.client_info,
                          firstName: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="flex w-full flex-col sm:w-1/2">
                  <InputOutlined
                    required
                    type="text"
                    name="LastName"
                    label="Your last name"
                    value={guestData.client_info.lastName}
                    error={
                      guestData.client_info.lastName == "" ? t("required") : ""
                    }
                    onChange={(e) =>
                      setGuestData({
                        ...guestData,
                        client_info: {
                          ...guestData.client_info,
                          lastName: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
              <InputOutlined
                type="text"
                name="Phone"
                label="Your Phone"
                value={guestData.client_info.phone}
                onChange={(e) =>
                  setGuestData({
                    ...guestData,
                    client_info: {
                      ...guestData.client_info,
                      phone: e.target.value,
                    },
                  })
                }
              />
              <InputOutlined
                required
                type="email"
                name="E-mail"
                label="E-mail"
                value={guestData.email}
                error={guestData.email == "" ? t("required") : ""}
                onChange={(e) =>
                  setGuestData({
                    ...guestData,
                    email: e.target.value,
                  })
                }
              />
            </div>
          )}

          {client && (
            <div className="flex w-full flex-col">
              <h2 className="mb-2 text-xl font-bold">
                {t("INVOICING DETAILS")}
              </h2>
              <div className="flex flex-col items-start justify-between gap-2 lg:flex-row">
                <div className="flex flex-col">
                  <p>
                    {t("Invoiced to")}{" "}
                    <span className="font-bold">
                      {client.client_info.firstName}{" "}
                      {client.client_info.lastName}
                    </span>
                    <br />
                    {t("Phone")}: {client.client_info.phone} <br />
                    {t("Email")}: {client.email}
                  </p>
                </div>
                <div>
                  <p className="">
                    {t("wrong_user", {
                      userName: `${client.client_info.firstName} ${client.client_info.lastName}`,
                    })}
                  </p>
                  <button
                    name="logOut"
                    aria-label="Log Out"
                    type="button"
                    onClick={() => clearClient()}
                    className={CustomTheme.outlinedButton}
                  >
                    {t("Log Out")}
                  </button>
                </div>
              </div>
              {client.client_info.addresses &&
                client.client_info.addresses.length > 0 && (
                  <div>
                    <div className="mt-2">
                      <h3 className="text-lg font-bold">
                        {t("Select an Address for invoicing")}
                      </h3>
                      {client.client_info.addresses?.map((address) => (
                        <div
                          key={"i" + address.id}
                          className={`mt-2 flex flex-row gap-2 p-4 shadow-lg ${chosenInvoiceAddressId == address.id ? "bg-blue-200" : "bg-white"}`}
                          onClick={() => setChosenInvoiceAddressId(address.id)}
                        >
                          <p className="w-full">
                            {address.street} {address.doorNumber}
                            <br />
                            {address.city} {address.zipCode}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-2">
                      <h3 className="text-lg font-bold">
                        {t("Select an Address for delivery")}
                      </h3>
                      {client.client_info.addresses?.map((address) => (
                        <div
                          key={"d" + address.id}
                          className={`mt-2 flex flex-row gap-2 p-4 shadow-lg ${chosenDeliveryAddressId == address.id ? "bg-blue-200" : "bg-white"}`}
                          onClick={() => setChosenDeliveryAddressId(address.id)}
                        >
                          <p className="w-full">
                            {address.street} {address.doorNumber}
                            <br />
                            {address.city} {address.zipCode}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              <button
                name="showAddressForm"
                aria-label="Show Address Form"
                className={CustomTheme.outlinedButton}
                onClick={() => setShowAddressForm(!showAddressForm)}
              >
                {showAddressForm
                  ? t("new_address_hide")
                  : t("new_address_show")}
              </button>
              {showAddressForm && (
                <form
                  onSubmit={handleNewAddressExistingClientFormSubmit}
                  className="m-2 flex flex-col gap-2 bg-white px-1 pb-1"
                >
                  <div className="mt-2 flex w-full flex-col">
                    <InputOutlined
                      required
                      type="text"
                      name="Country"
                      label="Country"
                      value={newAddressExistingClient.country}
                      error={
                        newAddressExistingClient.country == ""
                          ? t("required")
                          : ""
                      }
                      onChange={(e) =>
                        setNewAddressExistingClient({
                          ...newAddressExistingClient,
                          country: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <div className="flex w-full flex-col sm:w-7/12">
                      <InputOutlined
                        required
                        type="text"
                        name="Street"
                        label="Street"
                        value={newAddressExistingClient.street}
                        error={
                          newAddressExistingClient.street == ""
                            ? t("required")
                            : ""
                        }
                        onChange={(e) =>
                          setNewAddressExistingClient({
                            ...newAddressExistingClient,
                            street: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="flex w-full flex-col sm:w-3/12">
                      <InputOutlined
                        required
                        type="text"
                        name="DoorNumber"
                        label="Door"
                        value={newAddressExistingClient.doorNumber}
                        error={
                          newAddressExistingClient.doorNumber == ""
                            ? t("required")
                            : ""
                        }
                        onChange={(e) =>
                          setNewAddressExistingClient({
                            ...newAddressExistingClient,
                            doorNumber: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="flex w-full flex-col sm:w-2/12">
                      <InputOutlined
                        required
                        type="text"
                        name="Floor"
                        label="Floor"
                        value={newAddressExistingClient.floor}
                        onChange={(e) =>
                          setNewAddressExistingClient({
                            ...newAddressExistingClient,
                            floor: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <div className="flex w-full flex-col sm:w-4/12">
                      <InputOutlined
                        required
                        type="text"
                        name="ZipCode"
                        label="Zip Code"
                        value={newAddressExistingClient.zipCode}
                        error={
                          newAddressExistingClient.zipCode == ""
                            ? t("required")
                            : ""
                        }
                        onChange={(e) =>
                          setNewAddressExistingClient({
                            ...newAddressExistingClient,
                            zipCode: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="flex w-full flex-col sm:w-8/12">
                      <InputOutlined
                        required
                        type="text"
                        name="City"
                        label="City"
                        value={newAddressExistingClient.city}
                        error={
                          newAddressExistingClient.city == ""
                            ? t("required")
                            : ""
                        }
                        onChange={(e) =>
                          setNewAddressExistingClient({
                            ...newAddressExistingClient,
                            city: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex w-full flex-row">
                    <button
                      name="submitNewAddress"
                      aria-label="Submit New Address"
                      type="submit"
                      className={CustomTheme.outlinedButton}
                    >
                      {t("Register new address")}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
          <button
            name="orderSubmit"
            aria-label="Order Submit"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              if (!submitting) {
                setSubmitting(true);
                handleOrderSubmit();
              }
            }}
            className={CustomTheme.outlinedButton}
          >
            {submitting ? (
              <Loader className="mx-auto" />
            ) : (
              t("Proceed with order")
            )}
          </button>
          {submitErrorDocument && (
            <p className="text-red-500">{submitErrorDocument}</p>
          )}
        </div>
        <div className="order-1 my-2 grid grid-cols-1 p-4 shadow-lg sm:order-2">
          <div className="grid auto-rows-min grid-cols-2 gap-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {cart.length <= 0 && (
              <div className="col-span-2 flex flex-col items-center p-4">
                <div className="flex w-full flex-row justify-center">
                  <p>{t("Your cart is empty")}</p>
                </div>
                <Link
                  href={"/shop/tous?page=1"}
                  className={CustomTheme.outlinedButton + " w-[60%]"}
                >
                  <p className="flex w-full flex-row justify-center">
                    {t("Shop")}
                  </p>
                </Link>
              </div>
            )}
            {cart.map((product) => (
              <div
                key={product.id}
                className="mb-2 flex w-full flex-col bg-white pb-3 pt-2 shadow-lg"
              >
                <div className="flex flex-row justify-center">
                  <ImageWithURL
                    src={
                      product.images != null
                        ? getCoverImageUrl(product)
                        : "/uploads/placeholder_9db455d1f1.webp"
                    }
                    alt={product.name}
                    width={150}
                    height={150}
                  />
                </div>
                <h3 className="mt-auto h-[25px] w-full justify-center overflow-hidden text-base font-bold duration-700">
                  <AutoTextSize maxFontSizePx={14}>{product.name}</AutoTextSize>
                </h3>
                <h4 className="h-[20px] w-full justify-center overflow-hidden text-base duration-700">
                  <AutoTextSize maxFontSizePx={12}>
                    {product.internalCode}
                  </AutoTextSize>
                </h4>
                <div className="mb-2 flex w-full flex-row items-end justify-center">
                  <p className="mb-1 mr-1 text-sm text-gray-400 line-through">
                    {product.priceBeforeDiscount > product.value
                      ? "€ " +
                        (product.priceBeforeDiscount * product.amount)
                          .toFixed(2)
                          .replaceAll(".", ",")
                      : ""}
                  </p>
                  <p className="text-lg font-bold text-black">
                    €{" "}
                    {(product.value * product.amount)
                      .toFixed(2)
                      .replaceAll(".", ",")}
                  </p>
                </div>

                <div className="flex flex-row items-end justify-center">
                  <button
                    name="removeFromCart"
                    aria-label="Remove from Cart"
                    onClick={() => removeFromCart(product.id)}
                    className="mr-2.5"
                  >
                    🗑
                  </button>
                  <ButtonShadow1 onClick={() => decreaseQuantity(product.id)}>
                    <p className="aspect-[1/1] h-6 w-6 font-bold">-</p>
                  </ButtonShadow1>
                  <p className="mx-1.25 w-[40px] text-center">
                    {product.amount}
                  </p>
                  <ButtonShadow1 onClick={() => increaseQuantity(product.id)}>
                    <p className="aspect-[1/1] h-6 w-6 font-bold">+</p>
                  </ButtonShadow1>
                </div>
              </div>
            ))}
          </div>

          {cart.length > 0 && (
            <div>
              <p>
                {t("shipping")}: €{" "}
                {(client?.client_info.addresses?.find(
                  (add) => add.id == chosenDeliveryAddressId,
                )?.shippingDistance ?? 0) * props?.costPerKM}
              </p>
              <p>
                {t("Total")}: €{" "}
                {(
                  (calculateTotal().totalAfterDiscount +
                    (client?.client_info.addresses?.find(
                      (add) => add.id == chosenDeliveryAddressId,
                    )?.shippingDistance ?? 0) *
                      props.costPerKM) /
                  1.21
                )
                  .toFixed(2)
                  .replaceAll(".", ",")}
              </p>
              <p>
                {t("Total")} {t("vat-incl")}: €{" "}
                {calculateTotal().totalAfterDiscount +
                  (client?.client_info.addresses?.find(
                    (add) => add.id == chosenDeliveryAddressId,
                  )?.shippingDistance ?? 0) *
                    props.costPerKM}
              </p>

              {totalAfterPromo && (
                <p>
                  {t("Total after promo")}: € {totalAfterPromo}
                </p>
              )}
              <label htmlFor="promo" className="text-lg font-bold">
                {t("Promo Code")}
              </label>
              <input
                className="w-full border border-gray-300 p-2"
                type="text"
                id="promo"
                value={usedPromoCode}
                onChange={(e) => setUsedPromoCode(e.target.value)}
                placeholder={t("Promo Code")}
              />
              {promoError && <p className="text-red-400">{promoError}</p>}
              <button
                name="validatePromo"
                aria-label="Validate Promo"
                onClick={validatePromo}
                className={CustomTheme.outlinedButton}
              >
                {t("Apply Promo")}
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  let costPerKM = 1;
  const config = await getConfig();
  if (config && config.costPerKM) {
    costPerKM = config.costPerKM;
  }

  return {
    props: {
      costPerKM,
    },
  };
}
