import { useState, useEffect, useRef } from "react";
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

  useEffect(() => {
    const validateSession = async () => {
      const data = await fetch("/api/admin/checkloggedinuser");

      if (data.status == 200) {
        router.push("/admin/dashboard");
      }
    };
    validateSession();
  }, []);

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
        router.push("/admin/stock/all");
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
      <div className="flex min-h-screen items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md space-y-4  bg-white p-4 shadow-lg"
        >
          <h2 className="text-center text-xl font-bold">ADMIN LOGIN</h2>
          {error && (
            <div className="bg-red-100 p-2 text-center text-red-700 ">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="username" className="text-lg font-bold">
              {t("user")}
            </label>
            <input
              className="w-full border  border-gray-300 p-2"
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder={t("user")}
            />
          </div>
          <div>
            <label htmlFor="password" className="text-lg font-bold">
              {t("password")}
            </label>
            <input
              className="w-full border  border-gray-300 p-2"
              type="password"
              ref={passwordInput}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("password")}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black py-2 text-white hover:bg-gray-600 "
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
