import { AuthLayout } from "../../components/styled/auth-layout";
import { Field, Label } from "../../components/styled/fieldset";
import { Strong, Text } from "../../components/styled/text";
import useTranslation from "next-translate/useTranslation";
import { Button } from "../../components/styled/button";
import { Input } from "../../components/styled/input";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogTitle,
} from "../../components/styled/dialog";
import Image from "next/image";
import Head from "next/head";

export default function Admin() {
  const [error, setError] = useState("");
  const { t } = useTranslation("common");
  const passwordInput = useRef(null);
  const router = useRouter();
  const [showForgotDialog, setShowForgotDialog] = useState(false);

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
    if (event.key === "Enter") {
      event.preventDefault();
      goToPassword();
    }
  };

  const validateSession = async () => {
    const req = await fetch("/api/public/auth/checkloggedinuser");
    if (req.ok) {
      const answer = (await req.json()).result;
      navigateToDashboard(answer.role, router.query.destination);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      const formData = new FormData(event.currentTarget);
      const username = formData.get("username");
      const password = formData.get("password");

      const response = await fetch("/api/public/auth/postloginadmin", {
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
    } else if (role == "Tier 9") {
      router.push("/admin/dashboard");
    } else {
      router.push("/stock/list/all");
    }
  };

  const handleSubmitReset = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      const username = formData.get("username-forgot");

      fetch("/api/public/auth/forgotpass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: username }),
      }).then(() => alert(t("reset-email-sent")));
    } catch (error) {
      alert(t("try-again"));
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
              onSubmit={handleSubmit}
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
        </form>
        <div className="flex items-center justify-between">
          <Text>
            <button
              className="cursor-pointer"
              type="button"
              onClick={() => setShowForgotDialog(true)}
            >
              <Strong>{t("forgot_password")}</Strong>
            </button>
          </Text>
        </div>
        <Dialog open={showForgotDialog} onClose={setShowForgotDialog}>
          <form onSubmit={handleSubmitReset}>
            <DialogTitle>{t("forgot_password")}</DialogTitle>
            <DialogBody>
              <Field>
                <Label>{t("user")}</Label>
                <Input
                  type="text"
                  name="username-forgot"
                  autoComplete="username"
                />
              </Field>
            </DialogBody>
            <DialogActions>
              <Button
                type="button"
                plain
                onClick={() => setShowForgotDialog(false)}
              >
                {t("cancel")}
              </Button>
              <Button plain type="submit">
                {t("send")}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </AuthLayout>
    </>
  );
}
