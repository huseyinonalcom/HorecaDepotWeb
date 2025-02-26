import useTranslation from "next-translate/useTranslation";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Image from "next/image";

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
      const data = await fetch("/api/private/auth/checkloggedinuser");
      const answer = await data.json();
      if (data.status == 200) {
        if (router.query.destination) {
          router.push(decodeURIComponent(router.query.destination as string));
        } else {
          if (answer.role.name == "Tier 9") {
            router.push("/admin/dashboard");
          } else {
            router.push("/stock/list/all");
          }
        }
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
        const answer = await response.json();
        console.log(answer);
        if (router.query.destination) {
          router.push(decodeURIComponent(router.query.destination as string));
        } else {
          if (answer.role.name == "Tier 9") {
            router.push("/admin/dashboard");
          } else {
            router.push("/stock/list/all");
          }
        }
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
        <title>Login</title>
        <meta name="language" content={lang} />
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
