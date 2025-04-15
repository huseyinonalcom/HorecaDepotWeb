import { Strong, TextLink, Text } from "../components/styled/text";
import { AuthLayout } from "../components/styled/auth-layout";
import { Field, Label } from "../components/styled/fieldset";
import useTranslation from "next-translate/useTranslation";
import { Button } from "../components/styled/button";
import { useState, useEffect, useRef } from "react";
import { Input } from "../components/styled/input";
import { useRouter } from "next/router";
import Image from "next/image";
import Head from "next/head";

export default function Admin() {
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
      const formData = new FormData(event.currentTarget); // 👈 this is the key
      const username = formData.get("username");
      const password = formData.get("password");

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
    <>
      <Head>
        <title>{t("Login")}</title>
      </Head>
      <AuthLayout>
        <form
          onSubmit={handleSubmit}
          className="grid w-full max-w-sm grid-cols-1 gap-8"
        >
          <div className="relative h-32 w-full max-w-md">
            <Image
              src="/assets/header/logob.png"
              alt="Horeca Depot Logo"
              sizes="400px"
              priority
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
          <Field>
            <Label>{t("user")}</Label>
            <Input
              type="text"
              name="username"
              onKeyDown={handleKeyPress}
              autoComplete="username"
            />
          </Field>
          <Field>
            <Label>{t("password")}</Label>
            <Input
              type="password"
              name="password"
              ref={passwordInput}
              autoComplete="current-password"
            />
          </Field>
          {error && (
            <div className="bg-red-100 p-2 text-center text-red-700">
              {error}
            </div>
          )}
          <Button type="submit" className="w-full">
            {t("Login")}
          </Button>
          <div className="flex items-center justify-between">
            <Text color="white">
              <TextLink href="#">
                <Strong> {t("forgot_password")}</Strong>
              </TextLink>
            </Text>
          </div>
        </form>
      </AuthLayout>
    </>
  );
}
