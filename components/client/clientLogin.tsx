import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useState, useContext, useEffect, useRef } from "react";
import { Client, ClientConversion } from "../../api/interfaces/client";
import { ClientContext } from "../../api/providers/clientProvider";

const ClientLogin = () => {
  const { t, lang } = useTranslation("common");
  const router = useRouter();

  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const { updateClient } = useContext(ClientContext);

  useEffect(() => {
    document.getElementById("username")?.focus();
  }, []);

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && event.target.id === "username") {
      event.preventDefault();
      goToPassword();
    }
  };

  const goToPassword = () => {
    passwordInput.current?.focus();
  };

  const [password, setPassword] = useState("");
  const passwordInput = useRef(null);

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
        router.push("/account/myorders");
      } else {
        setError(t("user_pass_invalid"));
      }
    } catch (error) {
      setError(t("user_pass_invalid"));
    }
  };

  return (
    <>
      <div className="flex flex-col">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
          {error && (
            <div className="bg-red-100 text-red-700 p-2 text-center ">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="username" className="font-bold text-lg">
              {t("Utilisateur")}
            </label>
            <input
              className="w-full p-2  border border-gray-300"
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
              className="w-full p-2  border border-gray-300"
              type="password"
              ref={passwordInput}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("Mote de Passe")}
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-orange-400 hover:bg-orange-600 duration-700 text-black font-bold "
          >
            {t("Login")}
          </button>
        </form>
      </div>
    </>
  );
};

export default ClientLogin;
