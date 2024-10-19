import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useState, useContext, useEffect } from "react";
import { Client, ClientConversion } from "../../api/interfaces/client";
import { ClientContext } from "../../api/providers/clientProvider";
import InputOutlined from "../inputs/outlined";
import CustomTheme from "../componentThemes";

const ClientLogin = ({ onLogin }: { onLogin?: VoidFunction }) => {
  const { t } = useTranslation("common");
  const router = useRouter();

  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const { updateClient } = useContext(ClientContext);

  useEffect(() => {
    document.getElementById("E-mail")?.focus();
  }, []);

  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
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
  } else
    return (
      <div className="flex min-w-[350px] flex-col">
        <form
          onSubmit={handleSubmit}
          className="mb-6 mt-4 w-full max-w-md space-y-4"
        >
          {error && (
            <div className="bg-red-100 p-2 text-center text-red-700 ">
              {error}
            </div>
          )}
          <InputOutlined
            required
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
      </div>
    );
};

export default ClientLogin;
