import useTranslation from "next-translate/useTranslation";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Head from "next/head";

export default function Admin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { t } = useTranslation("common");
  const passwordInput = useRef(null);
  const router = useRouter();

  const goToPassword = () => {
    passwordInput.current?.focus();
  };

  useEffect(() => {
    document.getElementById("username")?.focus();
  }, []);

  useEffect(() => {
    validateSession();
  }, []);

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && event.target.id === "username") {
      event.preventDefault();
      goToPassword();
    }
  };

  const validateSession = async () => {
    const req = await fetch("/api/private/auth/checkloggedinuser");
    if (req.ok) {
      const answer = await req.json();
      navigateToDashboard(answer.role, router.query.destination);
    }
  };

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
        const answer = await response.json();
        navigateToDashboard(answer, router.query.destination);
      } else {
        setError(t("user_pass_invalid"));
      }
    } catch (error) {
      setError(t("user_pass_invalid"));
    }
  };

  const navigateToDashboard = (role, destination) => {
    if (destination) {
      router.push(decodeURIComponent(destination as string));
    } else if (role == "Tier 9" || role == "Tier 8") {
      router.push("/admin/dashboard");
    } else {
      router.push("/stock/list/all");
    }
  };

  return (
    <div>
      <Head>
        <title>Login</title>
      </Head>
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-black">
        <div className="relative h-32 w-full max-w-md">
          <Image
            src="/assets/header/logo.svg"
            alt="Horeca Depot Logo"
            sizes="400px"
            priority
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md space-y-4 bg-white p-4 shadow-lg"
        >
          <h2 className="text-center text-xl font-bold">LOGIN</h2>
          {error && (
            <div className="bg-red-100 p-2 text-center text-red-700">
              {error}
            </div>
          )}
          <div>
            <label htmlFor="username" className="text-lg font-bold">
              {t("user")}
            </label>
            <input
              className="w-full border border-gray-300 p-2"
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
              className="w-full border border-gray-300 p-2"
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
            className="w-full bg-black py-2 text-white hover:bg-gray-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
