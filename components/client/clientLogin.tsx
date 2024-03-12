import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useState, useContext, useEffect } from "react";
import { Client, ClientConversion } from "../../api/interfaces/client";
import { ClientContext } from "../../api/providers/clientProvider";
import InputOutlined from "../inputs/outlined";
import CustomTheme from "../componentThemes";

const ClientLogin = () => {
  const { t } = useTranslation("common");
  const router = useRouter();

  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const { updateClient } = useContext(ClientContext);

  useEffect(() => {
    document.getElementById("username")?.focus();
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
        <form onSubmit={handleSubmit} className="w-full mt-4 max-w-md space-y-4">
          {error && <div className="bg-red-100 text-red-700 p-2 text-center ">{error}</div>}
          <InputOutlined required type="text" name="Username" label="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <InputOutlined required type="password" name="Password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" className={CustomTheme.greenSubmitButton}>
            {t("Login")}
          </button>
        </form>
      </div>
    </>
  );
};

export default ClientLogin;
