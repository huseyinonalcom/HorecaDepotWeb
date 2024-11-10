import Head from "next/head";
import useTranslation from "next-translate/useTranslation";
import AdminLayout from "../../components/admin/adminLayout";
import { getConfig } from "../api/config/private/getconfig";
import componentThemes from "../../components/componentThemes";
import InputOutlined from "../../components/inputs/outlined";
import { useState } from "react";
import { Loader } from "react-feather";

export default function Settings(props) {
  const { t, lang } = useTranslation("common");
  const [mailParams, setMailParams] = useState({
    mailUser: props?.config?.mail?.mailUser ?? "",
    mailHost: props?.config?.mail?.mailHost ?? "",
    mailPass: props?.config?.mail?.mailPass ?? "",
    mailPort: props?.config?.mail?.mailPort ?? "",
    mailSender: props?.config?.mail?.mailSender ?? "",
    mailSenderName: props?.config?.mail?.mailSenderName ?? "",
    mailTo: "",
  });
  const [loading, setLoading] = useState(false);

  const testMail = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    fetch("/api/admin/testmail", {
      method: "post",
      body: JSON.stringify(mailParams),
    })
      .then(async (ans) => {
        let answer = await ans.text();
        console.log(answer);
        alert(answer);
      })
      .finally(() => setLoading(false));
  };

  return (
    <AdminLayout>
      <Head>
        <title>Configuration</title>
        <meta name="language" content={lang} />
      </Head>
      <div className="mx-auto flex w-[95vw] flex-col items-center justify-start">
        <div className="w-full py-2 text-center text-xl font-semibold">
          {t("Settings")}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);

            fetch("/api/config/admin/updateconfig", {
              method: "PUT",
              body: JSON.stringify({
                activeProvider: formData.get("activeProvider"),
                mollie: { MOLLIE_SECRET: formData.get("MOLLIE_SECRET") },
                stripe: {
                  STRIPE_LIVE_KEY: formData.get("STRIPE_LIVE_KEY"),
                  STRIPE_SECRET_KEY: formData.get("STRIPE_SECRET_KEY"),
                },
                ogone: {
                  OGONE_KEY: formData.get("OGONE_KEY"),
                  OGONE_SECRET: formData.get("OGONE_SECRET"),
                },
                google: { GOOGLE_API_KEY: formData.get("GOOGLE_API_KEY") },
                costPerKM: formData.get("costPerKM"),
                mail: {
                  mailUser: formData.get("mailUser"),
                  mailHost: formData.get("mailHost"),
                  mailPass: formData.get("mailPass"),
                  mailPort: formData.get("mailPort"),
                  mailSender: formData.get("mailSender"),
                  mailSenderName: formData.get("mailSenderName"),
                },
              }),
            }).then(async (res) => alert(t(await res.json())));
          }}
          className="grid w-full grid-cols-1 gap-2"
        >
          <h2 className="text-xl font-semibold">{t("Mollie")}</h2>
          <InputOutlined
            defaultValue={props.config.mollie.MOLLIE_SECRET}
            className="w-full border border-gray-300 p-2"
            type="text"
            name="MOLLIE_SECRET"
            label={t("Mollie Secret Key")}
          />
          <h2 className="text-xl font-semibold">{t("Stripe")}</h2>
          <InputOutlined
            defaultValue={props.config.stripe.STRIPE_LIVE_KEY}
            className="w-full border border-gray-300 p-2"
            type="text"
            name="STRIPE_LIVE_KEY"
            label={t("Stripe Publishable Key")}
          />
          <InputOutlined
            defaultValue={props.config.stripe.STRIPE_SECRET_KEY}
            className="w-full border border-gray-300 p-2"
            type="text"
            name="STRIPE_SECRET_KEY"
            label={t("Stripe Secret Key")}
          />
          <h2 className="text-xl font-semibold">{t("Ogone")}</h2>
          <InputOutlined
            defaultValue={props.config.ogone.OGONE_KEY}
            className="w-full border border-gray-300 p-2"
            type="text"
            name="OGONE_KEY"
            label={t("Ogone Key")}
          />
          <InputOutlined
            defaultValue={props.config.ogone.OGONE_SECRET}
            className="w-full border border-gray-300 p-2"
            type="text"
            name="OGONE_SECRET"
            label={t("Ogone Secret")}
          />
          <h2 className="text-xl font-semibold">{t("Active")}</h2>
          <select
            defaultValue={props.config.activeProvider}
            className="w-full border border-gray-300 p-2"
            name="activeProvider"
          >
            <option value="mollie">{t("Mollie")}</option>
            <option value="stripe">{t("Stripe")}</option>
            <option value="ogone">{t("Ogone")}</option>
          </select>
          <h2 className="text-xl font-semibold">{t("Google")}</h2>
          <InputOutlined
            defaultValue={props.config.google?.GOOGLE_API_KEY ?? ""}
            className="w-full border border-gray-300 p-2"
            type="text"
            name="GOOGLE_API_KEY"
            label={t("Google API Key")}
          />
          <InputOutlined
            defaultValue={props.config.costPerKM ?? ""}
            className="w-full border border-gray-300 p-2"
            type="number"
            name="costPerKM"
            label="€ / Km"
          />
          <h2 className="text-xl font-semibold">{t("mail")}</h2>
          <InputOutlined
            defaultValue={props.config.mail?.mailUser ?? ""}
            className="w-full border border-gray-300 p-2"
            type="text"
            name="mailUser"
            onChange={(e) =>
              setMailParams((mp) => ({
                ...mp,
                mailUser: e.target.value,
              }))
            }
            label={t("mail-user")}
          />
          <InputOutlined
            defaultValue={props.config.mail?.mailPass ?? ""}
            className="w-full border border-gray-300 p-2"
            type="text"
            name="mailPass"
            onChange={(e) =>
              setMailParams((mp) => ({
                ...mp,
                mailPass: e.target.value,
              }))
            }
            label={t("mail-pass")}
          />
          <InputOutlined
            defaultValue={props.config.mail?.mailHost ?? ""}
            className="w-full border border-gray-300 p-2"
            type="text"
            name="mailHost"
            onChange={(e) =>
              setMailParams((mp) => ({
                ...mp,
                mailHost: e.target.value,
              }))
            }
            label={t("mail-host")}
          />
          <InputOutlined
            defaultValue={props.config.mail?.mailPort ?? ""}
            className="w-full border border-gray-300 p-2"
            type="text"
            name="mailPort"
            onChange={(e) =>
              setMailParams((mp) => ({
                ...mp,
                mailPort: e.target.value,
              }))
            }
            label={t("mail-port")}
          />
          <InputOutlined
            defaultValue={props.config.mail?.mailSender ?? ""}
            className="w-full border border-gray-300 p-2"
            type="text"
            name="mailSender"
            onChange={(e) =>
              setMailParams((mp) => ({
                ...mp,
                mailSender: e.target.value,
              }))
            }
            label={t("mail-sender")}
          />
          <InputOutlined
            defaultValue={props.config.mail?.mailSenderName ?? ""}
            className="w-full border border-gray-300 p-2"
            type="text"
            name="mailSenderName"
            onChange={(e) =>
              setMailParams((mp) => ({
                ...mp,
                mailSenderName: e.target.value,
              }))
            }
            label={t("mail-sender-name")}
          />
          <h2 className="text-xl font-semibold">{t("mail-test")}</h2>
          <InputOutlined
            className="w-full border border-gray-300 p-2"
            type="text"
            name="mailTo"
            onChange={(e) =>
              setMailParams((mp) => ({
                ...mp,
                mailTo: e.target.value,
              }))
            }
            label={t("mail-to")}
          />
          <button
            type="button"
            onClick={() => testMail()}
            className={componentThemes.greenSubmitButton}
          >
            {loading ? (
              <Loader className="animate-spin mx-auto text-orange-500" size={24} />
            ) : (
              t("test-mail")
            )}
          </button>
          <button type="submit" className={componentThemes.greenSubmitButton}>
            {t("update_config")}
          </button>
        </form>
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps(context) {
  const config = await getConfig();
  return {
    props: {
      config,
    },
  };
}
