import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useState, useContext, useEffect } from "react";
import { Client, ClientConversion } from "../../api/interfaces/client";
import { ClientContext } from "../../api/providers/clientProvider";
import InputOutlined from "../inputs/outlined";
import CustomTheme from "../componentThemes";
import validateEmpty from "../../api/utils/input_validators/validate_empty";
import validateEmail from "../../api/utils/input_validators/validate_email";
import areAllPropertiesNull from "../../api/utils/input_validators/are_all_properties_null";
import areAllPropertiesEmpty from "../../api/utils/input_validators/are_all_properties_empty";

const ClientLogin = ({ onLogin }: { onLogin?: VoidFunction }) => {
  const { t } = useTranslation("common");
  const router = useRouter();

  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { updateClient } = useContext(ClientContext);

  const handleSubmit = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
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
        onLogin && onLogin();
        !onLogin && router.push("/account/myaccount");
      } else {
        setError(t("user_pass_invalid"));
      }
    } catch (error) {
      setError(t("user_pass_invalid"));
    }
  };

  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [resetText, setResetText] = useState("");
  const forgotPassword = async (e) => {
    e.preventDefault();
    await fetch("/api/auth/forgotpass", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: username }),
    });
    setResetText(t("forgot_sent"));
  };

  const [registerMode, setRegisterMode] = useState(false);
  const options = ["Entreprise", "Particulier"];
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

    if (newClient.client_info.category === options.at(0)) {
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
          newClient.client_info.category == options.at(0)
            ? newClient.client_info.company
            : null,
        taxID:
          newClient.client_info.category == options.at(0)
            ? newClient.client_info.taxID
            : null,
        category: newClient.client_info.category,
      },
    };
    const request = await fetch("/api/client/public/createclient", {
      method: "POST",
      body: JSON.stringify({
        clientToSend,
      }),
    });

    if (request.status == 200) {
      setUsername(newClient.email);
      setPassword(newClient.password);
      handleSubmit({
        username: newClient.email,
        password: newClient.password,
      });
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
      setRegisterMode(false);
    } else {
      setError(t("register_error"));
    }
  };

  if (forgotPasswordMode) {
    return (
      <>
        <div className="flex min-w-[350px] flex-col">
          <form
            onSubmit={forgotPassword}
            className="mb-6 mt-4 w-full max-w-md space-y-4"
          >
            {resetText && <div className="p-2 text-center">{resetText}</div>}
            {!resetText && (
              <>
                <InputOutlined
                  required
                  type="text"
                  name="E-mail"
                  label="E-mail"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <button
                  name="requestPasswordReset"
                  aria-label="Request Password Reset"
                  type="submit"
                  className={CustomTheme.outlinedButton}
                >
                  {t("send_reset")}
                </button>
              </>
            )}
          </form>
          <button
            type="button"
            name="cancelResetPassword"
            aria-label="Cancel Reset Password"
            onClick={() => {
              setForgotPasswordMode(false);
              setResetText("");
            }}
            className={CustomTheme.outlinedButton}
          >
            {t("remembered_password")}
          </button>
        </div>
      </>
    );
  } else if (registerMode) {
    return (
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold">{t("Register an account")}</h2>
        <div className="flex flex-col">
          <h3 className="mt-1">{t("Already have an account?")}</h3>
          <button
            name="closeRegisterForm"
            aria-label="Close Registration Form"
            type="button"
            onClick={() => {
              setRegisterMode(false);
            }}
            className={CustomTheme.outlinedButton + " w-[60%]"}
          >
            {t("Return")}
          </button>
        </div>
        {error && (
          <div className="bg-red-100 p-2 text-center text-red-700 ">
            {error}
          </div>
        )}
        <form onSubmit={handleClientSubmit} className="flex flex-col gap-2">
          <h3 className="mt-3">{t("Business or Individual")}?</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex w-full flex-col">
              <button
                name="setClientTypeToIndividual"
                aria-label="Set Client Type to Individual"
                type="button"
                onClick={() =>
                  setNewClient({
                    ...newClient,
                    client_info: {
                      ...newClient.client_info,
                      category: options.at(1),
                    },
                  })
                }
                className={
                  CustomTheme.outlinedButton +
                  ` ${newClient.client_info.category == options.at(1) ? "bg-gray-300" : ""}`
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
                onClick={() =>
                  setNewClient({
                    ...newClient,
                    client_info: {
                      ...newClient.client_info,
                      category: options.at(0),
                    },
                  })
                }
                className={
                  CustomTheme.outlinedButton +
                  ` ${newClient.client_info.category == options.at(0) ? "bg-gray-300" : ""}`
                }
              >
                {options.at(0)}
              </button>
            </div>
          </div>
          {newClient.client_info.category == options[0] && (
            <>
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
          <InputOutlined
            required
            type="password"
            name="password_repeat"
            label="Repeat Password"
            value={passwordRepeat}
            error={errorsNewClientForm.password_repeat}
            onChange={(e) => setPasswordRepeat(e.target.value)}
          />
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
    );
  } else {
    return (
      <div className="mx-auto flex w-full min-w-[350px] max-w-md flex-col">
        <p className="text-2xl font-bold">
          {t("Login to your HorecaDepot account")}
        </p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit({
              username,
              password,
            });
          }}
          className="mb-6 mt-4 w-full max-w-md space-y-4"
        >
          {error && (
            <div className="bg-red-100 p-2 text-center text-red-700 ">
              {error}
            </div>
          )}
          <InputOutlined
            required
            autoFocus
            type="text"
            name="E-mail"
            label="E-mail"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <InputOutlined
            required
            type="password"
            name="Password"
            label="Password"
            value={password}
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
        <button
          type="button"
          name="forgotPassword"
          aria-label="Forgot Password"
          onClick={() => setForgotPasswordMode(true)}
          className={CustomTheme.outlinedButton}
        >
          {t("forgot_password")}
        </button>
        <button
          type="button"
          name="newUser"
          aria-label="New User"
          onClick={() => setRegisterMode(true)}
          className={CustomTheme.outlinedButton}
        >
          {t("Inscrivez-vous")}
        </button>
      </div>
    );
  }
};

export default ClientLogin;
