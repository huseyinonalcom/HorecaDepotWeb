import { useContext, useEffect, useRef, useState } from "react";
import { ClientContext } from "../../api/providers/clientProvider";
import useTranslation from "next-translate/useTranslation";
import { CartContext } from "../../api/providers/cartProvider";
import { Client, ClientConversion } from "../../api/interfaces/client";
import CustomTheme from "../componentThemes";
import { Address } from "../../api/interfaces/address";
import Link from "next/link";
import { Document } from "../../api/interfaces/document";
import { useRouter } from "next/navigation";

export default function CheckOutInfo() {
  const { t, lang } = useTranslation("common");
  const router = useRouter();

  useEffect(() => {
    setTimeout(async () => {
      const data = await fetch("/api/client/client/checkloggedinuser");
      if (data.status != 200) {
        clearClient();
      }
    }, 300);
  }, []);

  // new client
  const [newClient, setNewClient] = useState<Client>({
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
  const [addressNewClient, setAddressNewClient] = useState<Address>({
    name: "Primaire",
    country: "",
    city: "",
    zipCode: "",
    doorNumber: "",
    street: "",
    floor: null,
  });
  const [isOpen, setIsOpen] = useState(false);
  const options = ["Entreprise", "Particulier"];
  const [clientType, setClientType] = useState(options.at(0));
  const [passwordRepeat, setPasswordRepeat] = useState("");

  const handleNewClientChange = (event) => {
    const { name, value } = event.target;

    if (name in newClient) {
      setNewClient({ ...newClient, [name]: value });
    } else if (name in newClient.client_info) {
      setNewClient({
        ...newClient,
        client_info: { ...newClient.client_info, [name]: value },
      });
    } else if (name in addressNewClient) {
      setAddressNewClient({ ...addressNewClient, [name]: value });
    } else if (name == "password_repeat") {
      setPasswordRepeat(value);
    }
  };

  const handleClientSubmit = async (event) => {
    event.preventDefault();
    const clientToSend: Client = {
      ...newClient,
      username: newClient.email,
      password: newClient.password,
      blocked: false,
      client_info: {
        ...newClient.client_info,
        company:
          clientType == options.at(0) ? newClient.client_info.company : null,
        taxID: clientType == options.at(0) ? newClient.client_info.taxID : null,
        category: clientType,
        addresses: [addressNewClient],
      },
    };
    const request = await fetch("/api/client/public/createclient", {
      method: "POST",
      body: JSON.stringify({
        clientToSend,
      }),
    });

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
      setAddressNewClient({
        name: "Primaire",
        country: "",
        city: "",
        zipCode: "",
        doorNumber: "",
        street: "",
        floor: "",
      });
      setPasswordRepeat("");
      setShowLogin(true);
    }
  };

  // login
  const [showLogin, setShowLogin] = useState(false);
  const [error, setError] = useState("");
  const { updateClient } = useContext(ClientContext);

  const [username, setUsername] = useState("");
  const handleKeyPress = (event) => {
    if (event.key === "Enter" && event.target.id === "username") {
      event.preventDefault();
      passwordInput.current?.focus();
    }
  };

  const [password, setPassword] = useState("");
  const passwordInput = useRef(null);
  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    setError("");
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
        updateClient(authedClient as Client);
        setShowLogin(false);
      } else {
        setError(t("user_pass_invalid"));
      }
    } catch (error) {
      setError(t("user_pass_invalid"));
    }
  };

  // existing client
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddressExistingClient, setNewAddressExistingClient] =
    useState<Address>({
      name: "Secondaire",
      country: "",
      city: "",
      zipCode: "",
      doorNumber: "",
      street: "",
      floor: "",
    });
  const handleNewAddressExistingClientChange = async (event) => {
    const { name, value } = event.target;

    if (name in newAddressExistingClient) {
      setNewAddressExistingClient({
        ...newAddressExistingClient,
        [name]: value,
      });
    }
  };

  const handleNewAddressExistingClientSubmit = async (event) => {
    event.preventDefault();
    const request = await fetch(
      "/api/client/client/postnewaddress?client=" + client.client_info.id,
      {
        method: "POST",
        body: JSON.stringify({
          newAddressExistingClient,
        }),
      }
    );
    if (request.ok) {
      setShowAddressForm(false);
      const requestUpdatedClient = await fetch(
        "/api/client/client/updateclientinfo"
      );
      const answerUpdatedClient = await requestUpdatedClient.json();
      updateClient(answerUpdatedClient);
    }
  };

  const handleLogOut = async (event) => {
    event.preventDefault();
    clearClient();
    await fetch("/api/client/client/logout").then(() => {});
  };

  const { client, clearClient } = useContext(ClientContext);
  const [cartError, setCartError] = useState("");
  const { cart, calculateTotal, clearCart } = useContext(CartContext);
  const [documentToPost, setDocumentToPost] = useState<Document>({
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
    decisionMaker: null,
    document_products: [{ id: 0 }, { id: 1 }],
    docAddress: null,
    delAddress: null,
  });

  const [chosenInvoiceAddressId, setChosenInvoiceAddressId] = useState(null);
  const handleInvoiceAddressChange = async (e) => {
    e.preventDefault();
    setChosenInvoiceAddressId(e.target.value);
  };
  const InvoiceAddressSelector = ({ addresses }) => {
    return (
      <div>
        {addresses.map((address) => (
          <div
            key={"i" + address.id}
            className="flex flex-row gap-2 shadow-lg rounded p-4 bg-white mt-2"
          >
            <input
              type="radio"
              id={`invoice-address-${address.id}`}
              name="invoiceAddress"
              value={address.id}
              checked={chosenInvoiceAddressId == address.id}
              onChange={handleInvoiceAddressChange}
            />
            <label htmlFor={`invoice-address-${address.id}`} className="w-full">
              {address.street} {address.doorNumber}
              <br />
              {address.city} {address.zipCode}
            </label>
          </div>
        ))}
      </div>
    );
  };

  const [deliverySameAddressAsInvoice, setDeliverySameAddressAsInvoice] =
    useState(true);
  const [chosenDeliveryAddressId, setChosenDeliveryAddressId] = useState(null);
  const handleDeliveryAddressChange = async (e) => {
    e.preventDefault();
    setChosenDeliveryAddressId(e.target.value);
  };
  const DeliveryAddressSelector = ({ addresses }) => {
    return (
      <div>
        {addresses.map((address) => (
          <div
            key={"d" + address.id}
            className="flex flex-row gap-2 shadow-lg rounded p-4 bg-white mt-2"
          >
            <input
              type="radio"
              id={`delivery-address-${address.id}`}
              name="deliveryAddress"
              value={address.id}
              checked={chosenDeliveryAddressId == address.id}
              onChange={handleDeliveryAddressChange}
            />
            <label
              htmlFor={`delivery-address-${address.id}`}
              className="w-full"
            >
              {address.street} {address.doorNumber}
              <br />
              {address.city} {address.zipCode}
            </label>
          </div>
        ))}
      </div>
    );
  };

  const [usedPromoCode, setUsedPromoCode] = useState<string>("");
  const [totalAfterPromo, setTotalAfterPromo] = useState<number | null>(null);
  const [promoError, setPromoError] = useState("");
  const [currentPromo, setCurrentPromo] = useState(null);
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
        }
      );

      if (response.ok) {
        setPromoError(null);
        const answer = await response.json();
        calculateTotalWithPromo(answer);
        setCurrentPromo(answer);
      } else {
        setPromoError(t("Promo n'est pas valide"));
        setTotalAfterPromo(null);
      }
    } catch (error) {
      setPromoError(t("Promo n'est pas valide"));
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

  const [addressError, setAddressError] = useState("");
  const [submitError, setSubmitError] = useState("");

  const handleOrderSubmit = async (event) => {
    event.preventDefault();
    if (!chosenInvoiceAddressId) {
      setAddressError("Choissisez un address pour facturation!");
      return;
    }
    if (!deliverySameAddressAsInvoice && !chosenDeliveryAddressId) {
      setAddressError("Choissisez un address pour livrasion!");
      return;
    }
    setAddressError(null);
    if (calculateTotal().totalAfterDiscount < 0) {
      setCartError(t("Panier Vide"));
      return;
    }
    documentToPost.decisionMaker = `${client.client_info.firstName} ${client.client_info.lastName}`;
    documentToPost.docAddress = client.client_info.addresses.find(
      (address) => address.id == chosenInvoiceAddressId
    );
    if (deliverySameAddressAsInvoice == true) {
      documentToPost.delAddress = client.client_info.addresses.find(
        (address) => address.id == chosenInvoiceAddressId
      );
    } else {
      documentToPost.delAddress = client.client_info.addresses.find(
        (address) => address.id == chosenDeliveryAddressId
      );
    }
    documentToPost.document_products = cart.map((cartProduct) => {
      return {
        product: cartProduct.id,
        amount: cartProduct.amount,
      };
    });
    const request = await fetch(
      "/api/checkout/client/postorder?final=true&promo=" + usedPromoCode,
      {
        method: "POST",
        body: JSON.stringify({
          documentToPost,
        }),
      }
    );
    if (request.ok) {
      const answer = await request.json();
      const orderID = answer.documentID;
      clearCart();
      const paymentReq = await fetch(
        `/api/payment/createpaymentlink?test=false`,
        {
          method: "POST",
          body: JSON.stringify(answer),
        }
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
      setSubmitError(
        "Une erreur s'est produite lors de la création de votre commande!"
      );
    }
  };

  if (cart.length <= 0) {
    return (
      <div className="flex flex-col">
        <div className="w-full flex flex-row justify-center">
          <Link
            href={"/products"}
            className="flex flex-row items-center mr-1 font-bold text-black h-full bg-orange-400 pl-3 py-2 pr-3"
          >
            SHOP
          </Link>
        </div>
      </div>
    );
  }
  if (showLogin == true && !client) {
    return (
      <div className="flex flex-col items-center">
        <div className="flex flex-row">
          <div className="flex flex-col">
            <h3 className="">{t("Don't have an account?")}</h3>
            <button
              type="button"
              onClick={() => {
                setShowLogin(false);
              }}
              className={CustomTheme.orangeSubmitButton}
            >
              {t("Retourner")}
            </button>
            <form
              onSubmit={handleLoginSubmit}
              className="w-full mt-4 max-w-md space-y-4"
            >
              {error && (
                <div className="bg-red-100 text-red-700 p-2 text-center rounded">
                  {error}
                </div>
              )}
              <div>
                <label htmlFor="username" className="font-bold text-lg">
                  {t("Utilisateur")}
                </label>
                <input
                  className="w-full p-2 rounded border border-gray-300"
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={t("Utilisateur")}
                />
              </div>
              <div>
                <label htmlFor="password" className="font-bold text-lg">
                  {t("Mote de Passe")}
                </label>
                <input
                  className="w-full p-2 rounded border border-gray-300"
                  type="password"
                  ref={passwordInput}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("Mote de Passe")}
                />
              </div>
              <button type="submit" className={CustomTheme.greenSubmitButton}>
                {t("Login")}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  } else if (!client) {
    return (
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold">{t("DÉTAILS DE FACTURATION")}</h2>
        <div className="flex flex-col">
          <h3 className="">{t("Already have an account?")}</h3>
          <button
            type="button"
            onClick={() => {
              setShowLogin(true);
            }}
            className={`${CustomTheme.greenSubmitButton} mt-0 mb-2`}
          >
            {t("Login")}
          </button>
          <h3 className="">{t("Entreprise ou Particulier")}</h3>
          <div className="relative inline-block text-left z-40">
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm py-2 px-4 bg-blue-600 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none"
              id="menu-button"
              aria-expanded="true"
              aria-haspopup="true"
              onClick={() => setIsOpen(!isOpen)}
            >
              {clientType}
              <svg
                className="-mr-1 ml-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <div
              className={`absolute mt-2 rounded-md px-4 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${
                isOpen
                  ? "transition ease-out duration-100 transform opacity-100 scale-100 visible"
                  : "invisible transition ease-in duration-75 transform opacity-0 scale-95"
              }`}
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
            >
              <div className="py-1" role="none">
                <button
                  type="button"
                  className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 w-full"
                  role="menuitem"
                  id="menu-item-0"
                  onClick={() => {
                    setClientType(options.at(0));
                    setIsOpen(false);
                  }}
                >
                  {options.at(0)}
                </button>
                <button
                  type="button"
                  className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 w-full"
                  role="menuitem"
                  id="menu-item-1"
                  onClick={() => {
                    setClientType(options.at(1));
                    setIsOpen(false);
                  }}
                >
                  {options.at(1)}
                </button>
              </div>
            </div>
          </div>
        </div>
        <form className="flex flex-col gap-2">
          {clientType == options[0] && (
            <>
              <div className="flex flex-col w-full">
                <h3 className="">{t("Nom d'entreprise")}</h3>
                <div className="pr-4">
                  <input
                    required
                    onChange={handleNewClientChange}
                    className="w-full p-2 rounded border border-gray-300"
                    type="text"
                    name="company"
                    value={newClient.client_info.company}
                    placeholder={t("Nom d'entreprise")}
                  />
                </div>
              </div>
              <div className="flex flex-col w-full">
                <h3 className="">{t("Numéro de TVA")}</h3>
                <div className="pr-4">
                  <input
                    required
                    onChange={handleNewClientChange}
                    className="w-full p-2 rounded border border-gray-300"
                    type="text"
                    name="taxID"
                    value={newClient.client_info.taxID}
                    placeholder={t("Numéro de TVA")}
                  />
                </div>
              </div>
            </>
          )}
          <div className="flex flex-col sm:flex-row">
            <div className="flex flex-col w-full sm:w-1/2">
              <h3 className="">{t("Votre Prénom")}</h3>
              <div className="pr-4">
                <input
                  required
                  onChange={handleNewClientChange}
                  className="w-full p-2 rounded border border-gray-300"
                  type="text"
                  name="firstName"
                  value={newClient.client_info.firstName}
                  placeholder={t("Votre Prénom")}
                />
              </div>
            </div>
            <div className="flex flex-col w-full sm:w-1/2">
              <h3 className="">{t("Votre Nom de famille")}</h3>
              <div className="pr-4">
                <input
                  required
                  onChange={handleNewClientChange}
                  className="w-full p-2 rounded border border-gray-300"
                  type="text"
                  name="lastName"
                  value={newClient.client_info.lastName}
                  placeholder={t("Votre Nom de famille")}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col w-full">
            <h3 className="">{t("Pays")}</h3>
            <div className="pr-4">
              <input
                required
                onChange={handleNewClientChange}
                className="w-full p-2 rounded border border-gray-300"
                type="text"
                name="country"
                value={addressNewClient.country}
                placeholder={t("Pays")}
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row">
            <div className="flex flex-col w-full sm:w-8/12">
              <h3 className="">{t("Rue")}</h3>
              <div className="pr-4">
                <input
                  required
                  onChange={handleNewClientChange}
                  className="w-full p-2 rounded border border-gray-300"
                  type="text"
                  name="street"
                  value={addressNewClient.street}
                  placeholder={t("Rue")}
                />
              </div>
            </div>
            <div className="flex flex-col w-full sm:w-4/12">
              <h3 className="">{t("Porte")}</h3>
              <div className="pr-4">
                <input
                  required
                  onChange={handleNewClientChange}
                  className="w-full p-2 rounded border border-gray-300"
                  type="text"
                  name="doorNumber"
                  value={addressNewClient.doorNumber}
                  placeholder={t("Porte")}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row">
            <div className="flex flex-col w-full sm:w-4/12">
              <h3 className="">{t("Code Postal")}</h3>
              <div className="pr-4">
                <input
                  required
                  onChange={handleNewClientChange}
                  className="w-full p-2 rounded border border-gray-300"
                  type="text"
                  name="zipCode"
                  value={addressNewClient.zipCode}
                  placeholder={t("Code Postal")}
                />
              </div>
            </div>
            <div className="flex flex-col w-full sm:w-8/12">
              <h3 className="">{t("Ville")}</h3>
              <div className="pr-4">
                <input
                  required
                  onChange={handleNewClientChange}
                  className="w-full p-2 rounded border border-gray-300"
                  type="text"
                  name="city"
                  value={addressNewClient.city}
                  placeholder={t("Ville")}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-row">
            <div className="flex flex-col w-full">
              <h3 className="">{t("Téléphone")}</h3>
              <div className="pr-4">
                <input
                  required
                  onChange={handleNewClientChange}
                  className="w-full p-2 rounded border border-gray-300"
                  type="text"
                  name="phone"
                  value={newClient.client_info.phone}
                  placeholder={t("Téléphone")}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-row">
            <div className="flex flex-col w-full">
              <h3 className="">{t("E-mail")}</h3>
              <div className="pr-4">
                <input
                  required
                  onChange={handleNewClientChange}
                  className="w-full p-2 rounded border border-gray-300"
                  autoComplete="chrome-off"
                  type="email"
                  name="email"
                  value={newClient.email}
                  placeholder={t("E-mail")}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-row">
            <div className="flex flex-col w-full">
              <h3 className="">{t("Mote de Passe")}</h3>
              <div className="pr-4">
                <input
                  required
                  onChange={handleNewClientChange}
                  className="w-full p-2 rounded border border-gray-300"
                  autoComplete="new-password"
                  type="password"
                  name="password"
                  value={newClient.password}
                  placeholder={t("Mote de Passe")}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-row">
            <div className="flex flex-col w-full">
              <h3 className="">{t("Repeat Mote de Passe")}</h3>
              <div className="pr-4">
                <input
                  required
                  onChange={handleNewClientChange}
                  className="w-full p-2 rounded border border-gray-300"
                  autoComplete="password-repeat"
                  type="password"
                  name="password_repeat"
                  value={passwordRepeat}
                  placeholder={t("Repeat Mote de Passe")}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-row w-full">
            <button
              onClick={handleClientSubmit}
              type="submit"
              className={CustomTheme.greenSubmitButton}
            >
              {t("Proceed")}
            </button>
          </div>
        </form>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col">
        <h2 className="text-xl font-bold mb-2">
          {t("DÉTAILS DE FACTURATION")}
        </h2>
        <div className="flex flex-col gap-2 lg:flex-row justify-between items-start">
          <div className="flex flex-col">
            <p>
              {t("Facture a")}{" "}
              <span className="font-bold">
                {client.client_info.firstName} {client.client_info.lastName}
              </span>
              <br />
              {t("Telephone")}: {client.client_info.phone} <br />
              {t("Email")}: {client.email}
            </p>
          </div>
          <div className="flex flex-col lg:w-1/3">
            <p>
              {t("Total avant remise")}: €{" "}
              {calculateTotal().totalBeforeDiscount}
            </p>
            <p>
              {t("Total avec remise")}: € {calculateTotal().totalAfterDiscount}
            </p>
            {totalAfterPromo && (
              <p>
                {t("Total avec promo")}: € {totalAfterPromo}
              </p>
            )}
          </div>
          <div className="lg:w-1/4 flex flex-col justify-start">
            <label htmlFor="promo" className="font-bold text-lg">
              {t("Code Promo")}
            </label>
            <input
              className="w-full p-2 rounded border border-gray-300"
              type="text"
              id="promo"
              value={usedPromoCode}
              onChange={(e) => setUsedPromoCode(e.target.value)}
              placeholder={t("Code Promo")}
            />
            {promoError && <p className="text-red-400">{promoError}</p>}
            <button
              onClick={validatePromo}
              className={CustomTheme.greenSubmitButton}
            >
              {t("Apply Promo")}
            </button>
          </div>
        </div>
        <div className="mt-2">
          <h3 className="text-lg font-bold">
            {t("Select an Address for invoicing")}
          </h3>
          <InvoiceAddressSelector addresses={client.client_info.addresses} />
          <button
            className={CustomTheme.greenSubmitButton}
            onClick={() => setShowAddressForm(!showAddressForm)}
          >
            {t("Add new address")}
          </button>
          {showAddressForm && (
            <form>
              <div className="flex flex-row">
                <div className="flex flex-col w-full">
                  <h3 className="">{t("Pays")}</h3>
                  <div className="pr-4">
                    <input
                      required
                      onChange={handleNewAddressExistingClientChange}
                      className="w-full p-2 rounded border border-gray-300"
                      type="text"
                      name="country"
                      value={newAddressExistingClient.country}
                      placeholder={t("Pays")}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col lg:flex-row">
                <div className="flex flex-col lg:w-8/12">
                  <h3 className="">{t("Rue")}</h3>
                  <div className="pr-4">
                    <input
                      required
                      onChange={handleNewAddressExistingClientChange}
                      className="w-full p-2 rounded border border-gray-300"
                      type="text"
                      name="street"
                      value={newAddressExistingClient.street}
                      placeholder={t("Rue")}
                    />
                  </div>
                </div>
                <div className="flex flex-col lg:w-4/12">
                  <h3 className="">{t("Porte")}</h3>
                  <div className="pr-4">
                    <input
                      required
                      onChange={handleNewAddressExistingClientChange}
                      className="w-full p-2 rounded border border-gray-300"
                      type="text"
                      name="doorNumber"
                      value={newAddressExistingClient.doorNumber}
                      placeholder={t("Porte")}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col lg:flex-row">
                <div className="flex flex-col lg:w-4/12">
                  <h3 className="">{t("Code Postal")}</h3>
                  <div className="pr-4">
                    <input
                      required
                      onChange={handleNewAddressExistingClientChange}
                      className="w-full p-2 rounded border border-gray-300"
                      type="text"
                      name="zipCode"
                      value={newAddressExistingClient.zipCode}
                      placeholder={t("Code Postal")}
                    />
                  </div>
                </div>
                <div className="flex flex-col lg:w-8/12">
                  <h3 className="">{t("Ville")}</h3>
                  <div className="pr-4">
                    <input
                      required
                      onChange={handleNewAddressExistingClientChange}
                      className="w-full p-2 rounded border border-gray-300"
                      type="text"
                      name="city"
                      value={newAddressExistingClient.city}
                      placeholder={t("Ville")}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-row w-full">
                <button
                  onClick={handleNewAddressExistingClientSubmit}
                  type="submit"
                  className={CustomTheme.greenSubmitButton}
                >
                  {t("Register new address")}
                </button>
              </div>
            </form>
          )}
        </div>
        <div className="mt-2">
          <h3 className="text-lg font-bold">
            {t("Select an Address for delivery")}
          </h3>
          {deliverySameAddressAsInvoice ? (
            <button
              className={CustomTheme.greenSubmitButton}
              onClick={() =>
                setDeliverySameAddressAsInvoice(!deliverySameAddressAsInvoice)
              }
            >
              {t("Delivery to different address")}
            </button>
          ) : (
            <button
              className={CustomTheme.greenSubmitButton}
              onClick={() =>
                setDeliverySameAddressAsInvoice(!deliverySameAddressAsInvoice)
              }
            >
              {t("Delivery to same address as invoice")}
            </button>
          )}
          {!deliverySameAddressAsInvoice && (
            <DeliveryAddressSelector addresses={client.client_info.addresses} />
          )}
        </div>
        {addressError && <p className="text-red-500">{addressError}</p>}
        {cartError && <p className="text-red-500">{cartError}</p>}
        {submitError && <p className="text-red-500">{submitError}</p>}
        <button
          onClick={handleOrderSubmit}
          className={CustomTheme.greenSubmitButton}
        >
          {t("Proceed with order")}
        </button>
        {lang != "tr" ? (
          <p className="mt-8">
            {t("Not")} {client.client_info.firstName}{" "}
            {client.client_info.lastName}?
          </p>
        ) : (
          <p className="mt-8">
            Siz {client.client_info.firstName} {client.client_info.lastName}{" "}
            değil misiniz?
          </p>
        )}
        <button
          onClick={handleLogOut}
          className={CustomTheme.orangeSubmitButton}
        >
          {t("Log Out")}
        </button>
      </div>
    );
  }
}
