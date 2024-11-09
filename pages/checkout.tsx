import areAllPropertiesEmpty from "../api/utils/input_validators/are_all_properties_empty";
import areAllPropertiesNull from "../api/utils/input_validators/are_all_properties_null";
import validateEmpty from "../api/utils/input_validators/validate_empty";
import validateEmail from "../api/utils/input_validators/validate_email";
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

export default function Checkout(props) {
  const { t, lang } = useTranslation("common");
  const router = useRouter();
  const [showLoginForm, setShowLoginForm] = useState<boolean>(false);
  const [showRegisterForm, setShowRegisterForm] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const options = ["Entreprise", "Particulier"];
  const [errorLogin, setErrorLogin] = useState<string>("");
  const [clientType, setClientType] = useState<string>(options.at(1));
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
        await fetch("/api/client/client/logout");
      } else {
      }
    }, 200);
  }, []);

  const handleLogOut = async (event) => {
    event.preventDefault();
    clearClient();
    await fetch("/api/client/client/logout").then(() => {});
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setErrorLogin("");
    try {
      const response = await fetch("/api/auth/postlogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier: username, password }),
      });

      if (response.ok) {
        const answer = await response.json();
        const authedClient: Client = ClientConversion.fromJson(answer);
        setCurrentClient(authedClient);

        localStorage.setItem("client", JSON.stringify(authedClient));
        setShowLoginForm(false);
      } else {
        setErrorLogin(t("user_pass_invalid"));
      }
    } catch (error) {
      setErrorLogin(t("user_pass_invalid"));
    }
  };

  const [newClient, setNewClient] = useState<Client>({
    username: "",
    email: "",
    password: "",
    client_info: {
      firstName: "",
      lastName: "",
      phone: "",
      category: "",
      company: "",
      taxID: "",
    },
  });

  const [passwordRepeat, setPasswordRepeat] = useState<string>("");

  const [errorsNewClientForm, setErrorsNewClientForm] = useState({
    company: null,
    taxID: null,
    firstName: null,
    lastName: null,
    email: null,
    password: null,
    password_repeat: null,
  });

  const handleClientSubmit = async (event) => {
    event.preventDefault();

    const clientErrors = {
      company: null,
      taxID: null,
      firstName: null,
      lastName: null,
      email: null,
      password: null,
      password_repeat: null,
    };

    if (clientType === options.at(0)) {
      clientErrors.company = validateEmpty(newClient.client_info.company);
      clientErrors.taxID = validateEmpty(newClient.client_info.taxID);
    }

    clientErrors.firstName = validateEmpty(newClient.client_info.firstName);
    clientErrors.lastName = validateEmpty(newClient.client_info.lastName);
    clientErrors.email = validateEmail(newClient.email);
    clientErrors.password = validateEmpty(newClient.password);
    if (newClient.password != passwordRepeat) {
      clientErrors.password_repeat = t("password_notmatching");
    }
    clientErrors.password_repeat = validateEmpty(passwordRepeat);

    if (
      areAllPropertiesNull(clientErrors) &&
      !areAllPropertiesEmpty(newClient)
    ) {
      postNewUser();
    } else {
      setErrorsNewClientForm(clientErrors);
    }
  };

  const postNewUser = async () => {
    const clientToSend: Client = {
      ...newClient,
      username: newClient.email,
      email: newClient.email,
      password: newClient.password,
      blocked: false,
      client_info: {
        ...newClient.client_info,
        company:
          clientType == options.at(0) ? newClient.client_info.company : null,
        taxID: clientType == options.at(0) ? newClient.client_info.taxID : null,
        category: clientType,
      },
    };
    const request = await fetch("/api/client/public/createclient", {
      method: "POST",
      body: JSON.stringify({
        clientToSend,
      }),
    });

    const answer = await request.json();

    if (request.status == 200) {
      setNewClient({
        username: "",
        email: "",
        password: "",
        blocked: true,
        client_info: {
          deleted: false,
          firstName: "",
          lastName: "",
          phone: "",
          category: "",
          company: "",
          taxID: "",
        },
      });
      setPasswordRepeat("");
      setShowLoginForm(true);
      setShowRegisterForm(false);
    } else {
    }
  };

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

  const [
    errorsNewAddressExistingClientForm,
    setErrorsNewAddressExistingClientForm,
  ] = useState({
    country: null,
    street: null,
    doorNumber: null,
    floor: null,
    zipCode: null,
    city: null,
  });

  const handleNewAddressExistingClientFormSubmit = async (event) => {
    event.preventDefault();

    setErrorsNewAddressExistingClientForm((e) => ({
      country: null,
      street: null,
      doorNumber: null,
      floor: null,
      zipCode: null,
      city: null,
    }));

    setErrorsNewAddressExistingClientForm((e) => ({
      ...e,
      country: validateEmpty(newAddressExistingClient.country),
    }));
    setErrorsNewAddressExistingClientForm((e) => ({
      ...e,
      street: validateEmpty(newAddressExistingClient.street),
    }));
    setErrorsNewAddressExistingClientForm((e) => ({
      ...e,
      doorNumber: validateEmpty(newAddressExistingClient.doorNumber),
    }));
    setErrorsNewAddressExistingClientForm((e) => ({
      ...e,
      floor: validateEmpty(newAddressExistingClient.floor),
    }));
    setErrorsNewAddressExistingClientForm((e) => ({
      ...e,
      zipCode: validateEmpty(newAddressExistingClient.zipCode),
    }));
    setErrorsNewAddressExistingClientForm((e) => ({
      ...e,
      city: validateEmpty(newAddressExistingClient.city),
    }));
  };

  useEffect(() => {
    if (
      areAllPropertiesNull(errorsNewAddressExistingClientForm) &&
      !areAllPropertiesEmpty(newAddressExistingClient)
    ) {
      const post = async () => {
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
      post();
    }
  }, [errorsNewAddressExistingClientForm]);

  // might need to be checked
  const [promoError, setPromoError] = useState("");
  const [currentPromo, setCurrentPromo] = useState(null);
  const [usedPromoCode, setUsedPromoCode] = useState<string>("");
  const [submitErrorDocument, setSubmitErrorDocument] = useState("");
  const [chosenInvoiceAddressId, setChosenInvoiceAddressId] = useState(
    client?.client_info?.addresses.at(0).id ?? null,
  );
  const [totalAfterPromo, setTotalAfterPromo] = useState<number | null>(null);
  const [chosenDeliveryAddressId, setChosenDeliveryAddressId] = useState(null);

  useEffect(() => {
    if (client) {
      if (!chosenDeliveryAddressId) {
        setChosenDeliveryAddressId(client?.client_info?.addresses.at(0).id);
      }
      if (!chosenInvoiceAddressId) {
        setChosenInvoiceAddressId(client?.client_info?.addresses.at(0).id);
      }
    }
  });

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
  const handleOrderSubmit = async (event) => {
    event.preventDefault();
    setSubmitErrorDocument(null);
    if (!chosenInvoiceAddressId) {
      setSubmitErrorDocument("Choissisez un address pour facturation!");
      return;
    }
    if (!chosenDeliveryAddressId) {
      setSubmitErrorDocument("Choissisez un address pour livrasion!");
      return;
    }
    if (calculateTotal().totalAfterDiscount < 0) {
      setSubmitErrorDocument(t("Cart Empty"));
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

  return (
    <Layout>
      <Head>
        <title>Horeca Depot</title>
        <meta name="description" content={t("main_description")} />
        <meta name="language" content={lang} />
      </Head>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <div className="order-2 mb-2 mt-1 p-3 shadow-lg sm:order-1">
          {client && (
            <div className="flex flex-col">
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
                    onClick={handleLogOut}
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
                      error={errorsNewAddressExistingClientForm.country}
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
                        error={errorsNewAddressExistingClientForm.street}
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
                        error={errorsNewAddressExistingClientForm.doorNumber}
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
                        error={errorsNewAddressExistingClientForm.floor}
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
                        error={errorsNewAddressExistingClientForm.zipCode}
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
                        error={errorsNewAddressExistingClientForm.city}
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
              {submitErrorDocument && (
                <p className="text-red-500">{submitErrorDocument}</p>
              )}
              <button
                name="orderSubmit"
                aria-label="Order Submit"
                onClick={handleOrderSubmit}
                className={CustomTheme.outlinedButton}
              >
                {t("Proceed with order")}
              </button>
            </div>
          )}
          {!client && !showLoginForm && !showRegisterForm && (
            <div className="flex flex-col gap-3">
              <h2 className="text-xl font-bold">{t("identification")}</h2>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex w-full flex-col">
                  <p className="text-sm font-light">{t("exsting_customer")}</p>
                  <button
                    name="showLoginForm"
                    aria-label="Show Login Form"
                    type="button"
                    onClick={() => {
                      setShowLoginForm(true);
                      setShowRegisterForm(false);
                    }}
                    className={CustomTheme.outlinedButton}
                  >
                    {t("Déjà inscrit")}
                  </button>
                </div>
                <div className="flex w-full flex-col">
                  <p className="text-sm font-light">{t("new_customer")}</p>
                  <button
                    name="showRegisterForm"
                    aria-label="Show Register Form"
                    type="button"
                    onClick={() => {
                      setShowLoginForm(false);
                      setShowRegisterForm(true);
                    }}
                    className={CustomTheme.outlinedButton}
                  >
                    {t("Inscrivez-vous")}
                  </button>
                </div>
              </div>
            </div>
          )}
          {!client && showLoginForm && !showRegisterForm && (
            <div className="flex w-full flex-col items-center">
              <h2 className="text-xl font-bold">
                {t("Login to your account")}
              </h2>
              <form
                onSubmit={handleLoginSubmit}
                className="mt-4 w-[60%] space-y-4"
              >
                <InputOutlined
                  required
                  type="text"
                  name="E-mail"
                  label="E-mail"
                  value={username}
                  error={errorLogin}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <InputOutlined
                  required
                  type="password"
                  name="Password"
                  label="Password"
                  value={password}
                  error={errorLogin}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  name="login"
                  aria-label="Login"
                  type="submit"
                  className={CustomTheme.outlinedButton}
                >
                  {t("Login")}
                </button>
              </form>
              <h3 className="mt-3">{t("Don't have an account yet?")}</h3>
              <button
                name="closeLoginForm"
                aria-label="Close Login Form"
                type="button"
                onClick={() => {
                  setShowLoginForm(false);
                  setShowRegisterForm(false);
                }}
                className={CustomTheme.outlinedButton + " w-[60%]"}
              >
                {t("Return")}
              </button>
            </div>
          )}
          {!client && !showLoginForm && showRegisterForm && (
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-bold">{t("Register an account")}</h2>
              <div className="flex flex-col">
                <h3 className="mt-1">{t("Already have an account?")}</h3>
                <button
                  name="closeRegisterForm"
                  aria-label="Close Registration Form"
                  type="button"
                  onClick={() => {
                    setShowLoginForm(false);
                    setShowRegisterForm(false);
                  }}
                  className={CustomTheme.outlinedButton + " w-[60%]"}
                >
                  {t("Return")}
                </button>
                <h3 className="mt-3">{t("Business or Individual")}</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex w-full flex-col">
                    <button
                      name="setClientTypeToIndividual"
                      aria-label="Set Client Type to Individual"
                      type="button"
                      onClick={() => setClientType(options.at(1))}
                      className={
                        CustomTheme.outlinedButton +
                        ` ${clientType == options.at(1) ? "bg-gray-300" : ""}`
                      }
                    >
                      {options.at(1)}
                    </button>
                  </div>
                  <div className="flex w-full flex-col">
                    <button
                      name="setClientTypeToBusiness"
                      aria-label="Set Client Type to Business"
                      type="button"
                      onClick={() => setClientType(options.at(0))}
                      className={
                        CustomTheme.outlinedButton +
                        ` ${clientType == options.at(0) ? "bg-gray-300" : ""}`
                      }
                    >
                      {options.at(0)}
                    </button>
                  </div>
                </div>
              </div>
              <form
                onSubmit={handleClientSubmit}
                className="flex flex-col gap-2"
              >
                {clientType == options[0] && (
                  <>
                    <div className="flex w-full flex-col">
                      <InputOutlined
                        required
                        type="text"
                        name="Company"
                        label="The name of your company"
                        value={newClient.client_info.company}
                        error={errorsNewClientForm.company}
                        onChange={(e) =>
                          setNewClient({
                            ...newClient,
                            client_info: {
                              ...newClient.client_info,
                              company: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="flex w-full flex-col">
                      <InputOutlined
                        required
                        type="text"
                        name="TaxID"
                        label="VAT number"
                        value={newClient.client_info.taxID}
                        error={errorsNewClientForm.taxID}
                        onChange={(e) =>
                          setNewClient({
                            ...newClient,
                            client_info: {
                              ...newClient.client_info,
                              taxID: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </>
                )}
                <div className="flex flex-col gap-2 sm:flex-row">
                  <div className="flex w-full flex-col sm:w-1/2">
                    <InputOutlined
                      required
                      type="text"
                      name="FirstName"
                      label="Your first name"
                      value={newClient.client_info.firstName}
                      error={errorsNewClientForm.firstName}
                      onChange={(e) =>
                        setNewClient({
                          ...newClient,
                          client_info: {
                            ...newClient.client_info,
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
                      value={newClient.client_info.lastName}
                      error={errorsNewClientForm.lastName}
                      onChange={(e) =>
                        setNewClient({
                          ...newClient,
                          client_info: {
                            ...newClient.client_info,
                            lastName: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
                <div className="flex flex-row">
                  <div className="flex w-full flex-col">
                    <InputOutlined
                      type="text"
                      name="Phone"
                      label="Your Phone"
                      value={newClient.client_info.phone}
                      onChange={(e) =>
                        setNewClient({
                          ...newClient,
                          client_info: {
                            ...newClient.client_info,
                            phone: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
                <div className="flex flex-row">
                  <div className="flex w-full flex-col">
                    <InputOutlined
                      required
                      type="email"
                      name="E-mail"
                      label="E-mail"
                      value={newClient.email}
                      error={errorsNewClientForm.email}
                      onChange={(e) =>
                        setNewClient({
                          ...newClient,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="flex flex-row">
                  <div className="flex w-full flex-col">
                    <InputOutlined
                      required
                      type="password"
                      name="Password"
                      label="Password"
                      value={newClient.password}
                      error={errorsNewClientForm.password}
                      onChange={(e) =>
                        setNewClient({
                          ...newClient,
                          password: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="flex flex-row">
                  <div className="flex w-full flex-col">
                    <InputOutlined
                      required
                      type="password"
                      name="password_repeat"
                      label="Repeat Password"
                      value={passwordRepeat}
                      error={errorsNewClientForm.password_repeat}
                      onChange={(e) => setPasswordRepeat(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex w-full flex-row">
                  <button
                    name="submitNewClient"
                    aria-label="Submit New Client"
                    type="submit"
                    className={CustomTheme.greenSubmitButton}
                  >
                    {t("Proceed")}
                  </button>
                </div>
              </form>
            </div>
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
                <div className="flex w-full flex-col items-center">
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
                  <h3 className="h-[25px] w-full justify-center overflow-hidden text-base font-bold duration-700">
                    <AutoTextSize maxFontSizePx={14}>
                      {product.name}
                    </AutoTextSize>
                  </h3>
                  <h4 className="h-[20px] w-full justify-center overflow-hidden text-base duration-700">
                    <AutoTextSize maxFontSizePx={12}>
                      {product.internalCode}
                    </AutoTextSize>
                  </h4>
                </div>
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
                {t("Shipping")}: €{" "}
                {(client?.client_info.addresses?.find(
                  (add) => add.id == chosenDeliveryAddressId,
                )?.shippingDistance ?? 0) * props?.costPerKM}
              </p>
              <p>
                {t("Total")}: €{" "}
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

export async function getServerSideProps(context) {
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
