import areAllPropertiesEmpty from "../../api/utils/input_validators/are_all_properties_empty";
import areAllPropertiesNull from "../../api/utils/input_validators/are_all_properties_null";
import validateEmpty from "../../api/utils/input_validators/validate_empty";
import { Client, ClientConversion } from "../../api/interfaces/client";
import { ClientContext } from "../../api/providers/clientProvider";
import { useContext, useEffect, useRef, useState } from "react";
import { CartContext } from "../../api/providers/cartProvider";
import useTranslation from "next-translate/useTranslation";
import { Document } from "../../api/interfaces/document";
import { Address } from "../../api/interfaces/address";
import componentThemes from "../componentThemes";
import InputOutlined from "../inputs/outlined";
import CustomTheme from "../componentThemes";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CheckOutInfo() {
  const router = useRouter();
  const { t, lang } = useTranslation("common");
  const { cart, calculateTotal, clearCart } = useContext(CartContext);

  // don't change these for now
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const options = ["Entreprise", "Particulier"];
  const [errorLogin, setErrorLogin] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const { client, clearClient } = useContext(ClientContext);
  const [clientType, setClientType] = useState(options.at(0));
  const [isOpenClientType, setIsOpenClientType] = useState(false);
  useEffect(() => {
    setTimeout(async () => {
      const data = await fetch("/api/client/client/checkloggedinuser");
      if (data.status != 200) {
        clearClient();
        await fetch("/api/client/client/logout").then(() => {});
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
        updateClient(authedClient);
        setShowLogin(false);
      } else {
        setErrorLogin(t("user_pass_invalid"));
      }
    } catch (error) {
      setErrorLogin(t("user_pass_invalid"));
    }
  };

  // don't change these for now
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
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [addressNewClient, setAddressNewClient] = useState<Address>({
    country: "",
    city: "",
    zipCode: "",
    doorNumber: "",
    street: "",
    floor: "",
  });
  const [errorsNewClientForm, setErrorsNewClientForm] = useState({
    company: null,
    taxID: null,
    firstName: null,
    lastName: null,
    email: null,
    password: null,
    password_repeat: null,
    country: null,
    street: null,
    doorNumber: null,
    floor: null,
    zipCode: null,
    city: null,
  });
  const handleClientSubmit = async (event) => {
    event.preventDefault();

    setErrorsNewClientForm((e) => ({
      company: null,
      taxID: null,
      firstName: null,
      lastName: null,
      email: null,
      password: null,
      password_repeat: null,
      country: null,
      street: null,
      doorNumber: null,
      floor: null,
      zipCode: null,
      city: null,
    }));

    if (clientType === options.at(0)) {
      setErrorsNewClientForm((e) => ({
        ...e,
        company: validateEmpty(newClient.client_info.company),
      }));
      setErrorsNewClientForm((e) => ({
        ...e,
        taxID: validateEmpty(newClient.client_info.taxID),
      }));
    }

    setErrorsNewClientForm((e) => ({
      ...e,
      firstName: validateEmpty(newClient.client_info.firstName),
    }));
    setErrorsNewClientForm((e) => ({
      ...e,
      lastName: validateEmpty(newClient.client_info.lastName),
    }));
    setErrorsNewClientForm((e) => ({
      ...e,
      email: validateEmpty(newClient.email),
    }));
    setErrorsNewClientForm((e) => ({
      ...e,
      password: validateEmpty(newClient.password),
    }));
    setErrorsNewClientForm((e) => ({
      ...e,
      password_repeat: validateEmpty(passwordRepeat),
    }));

    if (!validateEmpty(passwordRepeat) && !validateEmpty(newClient.password)) {
      setErrorsNewClientForm((e) => ({
        ...e,
        password_repeat:
          passwordRepeat == newClient.password
            ? null
            : t("password_notmatching"),
      }));
    }

    setErrorsNewClientForm((e) => ({
      ...e,
      country: validateEmpty(addressNewClient.country),
    }));
    setErrorsNewClientForm((e) => ({
      ...e,
      street: validateEmpty(addressNewClient.street),
    }));
    setErrorsNewClientForm((e) => ({
      ...e,
      doorNumber: validateEmpty(addressNewClient.doorNumber),
    }));
    setErrorsNewClientForm((e) => ({
      ...e,
      floor: validateEmpty(addressNewClient.floor),
    }));
    setErrorsNewClientForm((e) => ({
      ...e,
      zipCode: validateEmpty(addressNewClient.zipCode),
    }));
    setErrorsNewClientForm((e) => ({
      ...e,
      city: validateEmpty(addressNewClient.city),
    }));
  };
  useEffect(() => {
    if (
      areAllPropertiesNull(errorsNewClientForm) &&
      !areAllPropertiesEmpty(newClient) &&
      !areAllPropertiesEmpty(addressNewClient)
    ) {
      const post = async () => {
        const clientToSend: Client = {
          ...newClient,
          username: newClient.email,
          email: newClient.email,
          password: newClient.password,
          blocked: false,
          client_info: {
            ...newClient.client_info,
            company:
              clientType == options.at(0)
                ? newClient.client_info.company
                : null,
            taxID:
              clientType == options.at(0) ? newClient.client_info.taxID : null,
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
      post();
    }
  }, [errorsNewClientForm]);

  // don't change these for now
  const { updateClient } = useContext(ClientContext);
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
          updateClient(answerUpdatedClient);
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
  const [chosenInvoiceAddressId, setChosenInvoiceAddressId] = useState(null);
  const [totalAfterPromo, setTotalAfterPromo] = useState<number | null>(null);
  const [chosenDeliveryAddressId, setChosenDeliveryAddressId] = useState(null);
  const [deliverySameAddressAsInvoice, setDeliverySameAddressAsInvoice] =
    useState(true);
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
    if (!deliverySameAddressAsInvoice && !chosenDeliveryAddressId) {
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
      decisionMaker: null,
      document_products: cart.map((cartProduct) => {
        return {
          product: cartProduct.id,
          amount: cartProduct.amount,
        };
      }),
      docAddress: client.client_info.addresses.find(
        (address) => address.id == chosenInvoiceAddressId,
      ),
      delAddress: null,
    };
    documentToPost.decisionMaker = `${client.client_info.firstName} ${client.client_info.lastName}`;
    if (deliverySameAddressAsInvoice == true) {
      documentToPost.delAddress = client.client_info.addresses.find(
        (address) => address.id == chosenInvoiceAddressId,
      );
    } else {
      documentToPost.delAddress = client.client_info.addresses.find(
        (address) => address.id == chosenDeliveryAddressId,
      );
    }
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
      const orderID = answer.documentID;
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
          clearCart();
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

  if (cart.length <= 0) {
    return (
      <div className="flex flex-col">
        <div className="flex w-full flex-row justify-center">
          <div>
            <Link
              href={"/products"}
              className={componentThemes.greenSubmitButton}
            >
              SHOP
            </Link>
          </div>
        </div>
      </div>
    );
  } else if (showLogin == true && !client) {
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
              {t("Return")}
            </button>
            <form
              onSubmit={handleLoginSubmit}
              className="mt-4 w-full max-w-md space-y-4"
            >
              <InputOutlined
                required
                type="text"
                name="Username"
                label="Username"
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
        <h2 className="text-xl font-bold">{t("INVOICING DETAILS")}</h2>
        <div className="flex flex-col">
          <h3 className="">{t("Already have an account?")}</h3>
          <button
            type="button"
            onClick={() => {
              setShowLogin(true);
            }}
            className={`${CustomTheme.greenSubmitButton} mb-2 mt-0`}
          >
            {t("Login")}
          </button>
          <h3 className="">{t("Business or Individual")}</h3>
          <div className="relative z-40 inline-block text-left">
            <button
              type="button"
              className="-md inline-flex justify-center border border-gray-300 bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none"
              id="menu-button"
              aria-expanded="true"
              aria-haspopup="true"
              onClick={() => setIsOpenClientType(!isOpenClientType)}
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
              className={`-md absolute mt-2 bg-white px-4 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${
                isOpenClientType
                  ? "visible scale-100 transform opacity-100 transition duration-100 ease-out"
                  : "invisible scale-95 transform opacity-0 transition duration-75 ease-in"
              }`}
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
            >
              <div className="py-1" role="none">
                <button
                  type="button"
                  className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                  id="menu-item-0"
                  onClick={() => {
                    setClientType(options.at(0));
                    setIsOpenClientType(false);
                  }}
                >
                  {options.at(0)}
                </button>
                <button
                  type="button"
                  className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  role="menuitem"
                  id="menu-item-1"
                  onClick={() => {
                    setClientType(options.at(1));
                    setIsOpenClientType(false);
                  }}
                >
                  {options.at(1)}
                </button>
              </div>
            </div>
          </div>
        </div>
        <form onSubmit={handleClientSubmit} className="flex flex-col gap-2">
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
                  onChange={(e) => {
                    setNewClient({
                      ...newClient,
                      client_info: {
                        ...newClient.client_info,
                        company: e.target.value,
                      },
                    });
                  }}
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
                  onChange={(e) => {
                    setNewClient({
                      ...newClient,
                      client_info: {
                        ...newClient.client_info,
                        taxID: e.target.value,
                      },
                    });
                  }}
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
                onChange={(e) => {
                  setNewClient({
                    ...newClient,
                    client_info: {
                      ...newClient.client_info,
                      firstName: e.target.value,
                    },
                  });
                }}
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
                onChange={(e) => {
                  setNewClient({
                    ...newClient,
                    client_info: {
                      ...newClient.client_info,
                      lastName: e.target.value,
                    },
                  });
                }}
              />
            </div>
          </div>
          <div className="flex w-full flex-col">
            <InputOutlined
              required
              type="text"
              name="Country"
              label="Country"
              value={addressNewClient.country}
              error={errorsNewClientForm.country}
              onChange={(e) => {
                setAddressNewClient({
                  ...addressNewClient,
                  country: e.target.value,
                });
              }}
            />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="flex w-full flex-col sm:w-7/12">
              <InputOutlined
                required
                type="text"
                name="Street"
                label="Street"
                value={addressNewClient.street}
                error={errorsNewClientForm.street}
                onChange={(e) => {
                  setAddressNewClient({
                    ...addressNewClient,
                    street: e.target.value,
                  });
                }}
              />
            </div>
            <div className="flex w-full flex-col sm:w-3/12">
              <InputOutlined
                required
                type="text"
                name="DoorNumber"
                label="Door"
                value={addressNewClient.doorNumber}
                error={errorsNewClientForm.doorNumber}
                onChange={(e) => {
                  setAddressNewClient({
                    ...addressNewClient,
                    doorNumber: e.target.value,
                  });
                }}
              />
            </div>
            <div className="flex w-full flex-col sm:w-2/12">
              <InputOutlined
                required
                type="text"
                name="Floor"
                label="Floor"
                value={addressNewClient.floor}
                error={errorsNewClientForm.floor}
                onChange={(e) => {
                  setAddressNewClient({
                    ...addressNewClient,
                    floor: e.target.value,
                  });
                }}
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
                value={addressNewClient.zipCode}
                error={errorsNewClientForm.zipCode}
                onChange={(e) => {
                  setAddressNewClient({
                    ...addressNewClient,
                    zipCode: e.target.value,
                  });
                }}
              />
            </div>
            <div className="flex w-full flex-col sm:w-8/12">
              <InputOutlined
                required
                type="text"
                name="City"
                label="City"
                value={addressNewClient.city}
                error={errorsNewClientForm.city}
                onChange={(e) => {
                  setAddressNewClient({
                    ...addressNewClient,
                    city: e.target.value,
                  });
                }}
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
                onChange={(e) => {
                  setNewClient({
                    ...newClient,
                    client_info: {
                      ...newClient.client_info,
                      phone: e.target.value,
                    },
                  });
                }}
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
                onChange={(e) => {
                  setNewClient({
                    ...newClient,
                    email: e.target.value,
                  });
                }}
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
                onChange={(e) => {
                  setNewClient({
                    ...newClient,
                    password: e.target.value,
                  });
                }}
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
            <button type="submit" className={CustomTheme.greenSubmitButton}>
              {t("Proceed")}
            </button>
          </div>
        </form>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col">
        <h2 className="mb-2 text-xl font-bold">{t("INVOICING DETAILS")}</h2>
        <div className="flex flex-col items-start justify-between gap-2 lg:flex-row">
          <div className="flex flex-col">
            <p>
              {t("Invoiced to")}{" "}
              <span className="font-bold">
                {client.client_info.firstName} {client.client_info.lastName}
              </span>
              <br />
              {t("Phone")}: {client.client_info.phone} <br />
              {t("Email")}: {client.email}
            </p>
          </div>
          <div className="flex flex-col lg:w-1/3">
            <p>
              {t("Total before reduction")}: €{" "}
              {calculateTotal().totalBeforeDiscount}
            </p>
            <p>
              {t("Total after reduction")}: €{" "}
              {calculateTotal().totalAfterDiscount}
            </p>
            {totalAfterPromo && (
              <p>
                {t("Total after promo")}: € {totalAfterPromo}
              </p>
            )}
          </div>
          <div className="flex flex-col justify-start lg:w-1/4">
            <label htmlFor="promo" className="text-lg font-bold">
              {t("Promo Code")}
            </label>
            <input
              className="w-full border  border-gray-300 p-2"
              type="text"
              id="promo"
              value={usedPromoCode}
              onChange={(e) => setUsedPromoCode(e.target.value)}
              placeholder={t("Promo Code")}
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
          {client.client_info.addresses.map((address) => (
            <div
              key={"i" + address.id}
              className="mt-2 flex flex-row gap-2  bg-white p-4 shadow-lg"
            >
              <input
                type="radio"
                id={`invoice-address-${address.id}`}
                name="invoiceAddress"
                value={address.id}
                checked={chosenInvoiceAddressId == address.id}
                onChange={(e) => {
                  e.preventDefault();
                  setChosenInvoiceAddressId(e.target.value);
                }}
              />
              <label
                htmlFor={`invoice-address-${address.id}`}
                className="w-full"
              >
                {address.street} {address.doorNumber}
                <br />
                {address.city} {address.zipCode}
              </label>
            </div>
          ))}
          <button
            className={CustomTheme.greenSubmitButton}
            onClick={() => setShowAddressForm(!showAddressForm)}
          >
            {showAddressForm ? t("new_address_hide") : t("new_address_show")}
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
                  onChange={(e) => {
                    setNewAddressExistingClient({
                      ...newAddressExistingClient,
                      country: e.target.value,
                    });
                  }}
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
                    onChange={(e) => {
                      setNewAddressExistingClient({
                        ...newAddressExistingClient,
                        street: e.target.value,
                      });
                    }}
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
                    onChange={(e) => {
                      setNewAddressExistingClient({
                        ...newAddressExistingClient,
                        doorNumber: e.target.value,
                      });
                    }}
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
                    onChange={(e) => {
                      setNewAddressExistingClient({
                        ...newAddressExistingClient,
                        floor: e.target.value,
                      });
                    }}
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
                    onChange={(e) => {
                      setNewAddressExistingClient({
                        ...newAddressExistingClient,
                        zipCode: e.target.value,
                      });
                    }}
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
                    onChange={(e) => {
                      setNewAddressExistingClient({
                        ...newAddressExistingClient,
                        city: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
              <div className="flex w-full flex-row">
                <button type="submit" className={CustomTheme.greenSubmitButton}>
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
            <>
              {client.client_info.addresses.map((address) => (
                <div
                  key={"d" + address.id}
                  className="mt-2 flex flex-row gap-2 bg-white p-4 shadow-lg"
                >
                  <input
                    type="radio"
                    id={`delivery-address-${address.id}`}
                    name="deliveryAddress"
                    value={address.id}
                    checked={chosenDeliveryAddressId == address.id}
                    onChange={(e) => {
                      e.preventDefault();
                      setChosenDeliveryAddressId(e.target.value);
                    }}
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
            </>
          )}
        </div>
        {submitErrorDocument && (
          <p className="text-red-500">{submitErrorDocument}</p>
        )}
        <button
          onClick={handleOrderSubmit}
          className={CustomTheme.greenSubmitButton}
        >
          {t("Proceed with order")}
        </button>
        <p className="mt-8">
          {t("wrong_user", {
            userName: `${client.client_info.firstName} ${client.client_info.lastName}`,
          })}
        </p>
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
