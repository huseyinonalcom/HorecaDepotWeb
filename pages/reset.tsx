import  { useState } from "react";
import Head from "next/head";
import useTranslation from "next-translate/useTranslation";
import Layout from "../components/public/layout";
import { useRouter } from "next/router";
import InputOutlined from "../components/inputs/outlined";
import CustomTheme from "../components/componentThemes";

export default function Reset() {
  const { t, lang } = useTranslation("common");
  const router = useRouter();

  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (event.target.password.value !== event.target.passwordrepeat.value) {
      setError(t("password_reset_error"));
      return;
    }

    setError("");
    try {
      const response = await fetch("/api/auth/resetpass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: event.target.password.value,
          code: router.query.code,
        }),
      });

      if (response.ok) {
        router.push("/login");
      } else {
        setError(t("password_reset_error"));
      }
    } catch (error) {
      setError(t("password_reset_error"));
    }
  };

  return (
    <Layout>
      <Head>
        <title>Login</title>
        <meta name="language" content={lang} />
      </Head>
      <div className="flex h-[50svh] w-full min-w-[350px] items-center justify-center">
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
              type="password"
              name="password"
              label="Password"
            />
            <InputOutlined
              required
              type="password"
              name="passwordrepeat"
              label="Password_repeat"
            />
            <button type="submit" className={CustomTheme.outlinedButton}>
              {t("set_new_password")}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}
