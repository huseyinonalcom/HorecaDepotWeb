import React, { useState, useEffect, useRef } from "react";
import Head from "next/head";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";

export default function Admin() {
  const router = useRouter();
  const { t, lang } = useTranslation("common");

  const [error, setError] = useState("");

  const [username, setUsername] = useState("");

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
      const response = await fetch("/api/auth/postloginadmin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier: username, password }),
      });

      if (response.ok) {
        router.push("/admin/products");
      } else {
        setError(t("user_pass_invalid"));
      }
    } catch (error) {
      setError(t("user_pass_invalid"));
    }
  };

  return (
    <div>
      <Head>
        <title>Admin Login</title>
        <meta name="language" content={lang} />
      </Head>
      <div className="flex justify-center items-center min-h-screen">
        <form onSubmit={handleSubmit} className="w-full max-w-md p-4  shadow-lg space-y-4 bg-white">
          <h2 className="text-xl font-bold text-center">ADMIN LOGIN</h2>
          {error && <div className="bg-red-100 text-red-700 p-2 text-center ">{error}</div>}
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
          <button type="submit" className="w-full py-2 bg-black hover:bg-gray-600 text-white ">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
