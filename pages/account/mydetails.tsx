import LoadingIndicator from "../../components/common/loadingIndicator";
import InputOutlined from "../../components/inputs/outlined";
import useTranslation from "next-translate/useTranslation";
import CustomTheme from "../../components/componentThemes";
import { Client } from "../../api/interfaces/client";
import Layout from "../../components/public/layout";
import Meta from "../../components/public/meta";
import { ChevronLeft } from "react-feather";
import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";

export default function MyDetails() {
  const { t, lang } = useTranslation("common");
  const [clientDetails, setClientDetails] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      const request = await fetch(`/api/client/client/getclientdetails`);
      const response = await request.json();
      if (request.ok) {
        return response;
      } else {
        throw "Failed to fetch client details.";
      }
    };

    fetchOrders()
      .then((details) => {
        setClientDetails(details);
      })
      .catch((_) => {})
      .finally(() => setIsLoading(false));
  }, []);

  const onSubmit = async () => {
    const request = await fetch(`/api/client/client/updateclientcredentials`, {
      method: "PUT",
      body: JSON.stringify(clientDetails),
    });
    if (request.ok) {
      setSuccess(t("submit_success"));
      setError(null);
    } else {
      setSuccess(null);
      setError(t("submit_error"));
    }
  };

  return (
    <Layout>
      <Head>
        <Meta />
        <title>Horeca Depot</title>
        <meta name="description" content={t("main_description")} />
        <meta name="language" content={lang} />
      </Head>
      <div className="mx-auto flex w-full flex-col items-start justify-start pt-2">
        <div className="mb-3 flex flex-row items-center gap-4">
          <Link href="/account/myaccount" className="group flex text-black">
            <ChevronLeft className="group-hover:animate-bounceHorizontal" />
            <p>{t("Back to Account")}</p>
          </Link>
          <h2 className="text-xl font-semibold">{t("My Details")}</h2>
        </div>
        <div className="flex w-full flex-col gap-4">
          {isLoading ? (
            <LoadingIndicator />
          ) : clientDetails ? (
            <div className="flex flex-col">
              <div className="grid grid-cols-2 items-center gap-2 md:grid-cols-3 lg:grid-cols-4">
                <InputOutlined
                  label={t("First Name")}
                  value={clientDetails.client_info.firstName}
                  name="first_name"
                  type="text"
                  onChange={(e) => {
                    setClientDetails((prev) => ({
                      ...prev,
                      client_info: {
                        ...prev.client_info,
                        firstName: e.target.value,
                      },
                    }));
                  }}
                />
                <InputOutlined
                  label={t("Last Name")}
                  value={clientDetails.client_info.lastName}
                  name="last_name"
                  type="text"
                  onChange={(e) => {
                    setClientDetails((prev) => ({
                      ...prev,
                      client_info: {
                        ...prev.client_info,
                        lastName: e.target.value,
                      },
                    }));
                  }}
                />
                <InputOutlined
                  label={t("E-mail")}
                  value={clientDetails.email}
                  name="e-mail"
                  type="e-mail"
                  onChange={(e) => {
                    setClientDetails((prev) => ({
                      ...prev,
                      email: e.target.value,
                      username: e.target.value,
                    }));
                  }}
                />
                <InputOutlined
                  label={t("Phone")}
                  value={clientDetails.client_info.phone}
                  name="phone"
                  type="tel"
                  onChange={(e) => {
                    setClientDetails((prev) => ({
                      ...prev,
                      client_info: {
                        ...prev.client_info,
                        phone: e.target.value,
                      },
                    }));
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    setClientDetails((prev) => ({
                      ...prev,
                      client_info: {
                        ...prev.client_info,
                        category: "Entreprise",
                      },
                    }));
                  }}
                  className={
                    CustomTheme.outlinedButton +
                    ` mb-2 ${clientDetails.client_info.category == "Entreprise" ? "bg-gray-300" : ""}`
                  }
                >
                  {t("Entreprise")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setClientDetails((prev) => ({
                      ...prev,
                      client_info: {
                        ...prev.client_info,
                        category: "Particulier",
                      },
                    }));
                  }}
                  className={
                    CustomTheme.outlinedButton +
                    ` mb-2 ${clientDetails.client_info.category == "Particulier" ? "bg-gray-300" : ""}`
                  }
                >
                  {t("Particulier")}
                </button>
                {clientDetails.client_info.category == "Entreprise" ? (
                  <>
                    <InputOutlined
                      label={t("Company")}
                      value={clientDetails.client_info.company}
                      name="Company"
                      type="text"
                      onChange={(e) => {
                        setClientDetails((prev) => ({
                          ...prev,
                          client_info: {
                            ...prev.client_info,
                            company: e.target.value,
                          },
                        }));
                      }}
                    />
                    <InputOutlined
                      label={t("TaxID")}
                      value={clientDetails.client_info.taxID}
                      name="TaxID"
                      type="text"
                      onChange={(e) => {
                        setClientDetails((prev) => ({
                          ...prev,
                          client_info: {
                            ...prev.client_info,
                            taxID: e.target.value,
                          },
                        }));
                      }}
                    />
                  </>
                ) : (
                  <>
                    <div></div>
                    <div></div>
                  </>
                )}
                <button
                  type="button"
                  onClick={onSubmit}
                  className={CustomTheme.outlinedButton + " mb-2"}
                >
                  {t("Save")}
                </button>
                {error && <p className="text-red-600">{error}</p>}
                {success && <p className="text-green-600">{success}</p>}
              </div>
            </div>
          ) : (
            <p>{t(`An error has occurred.`)}</p>
          )}
        </div>
      </div>
    </Layout>
  );
}
