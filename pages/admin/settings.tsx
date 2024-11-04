import Head from "next/head";
import useTranslation from "next-translate/useTranslation";
import AdminLayout from "../../components/admin/adminLayout";
import { getConfig } from "../api/config/private/getconfig";
import componentThemes from "../../components/componentThemes";
import InputOutlined from "../../components/inputs/outlined";
import { Divide } from "react-feather";

export default function Settings(props) {
  const { t, lang } = useTranslation("common");

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

            const mollieSecret = formData.get("MOLLIE_SECRET");
            const stripeLiveKey = formData.get("STRIPE_LIVE_KEY");
            const stripeSecretKey = formData.get("STRIPE_SECRET_KEY");
            const ogoneKey = formData.get("OGONE_KEY");
            const ogoneSecret = formData.get("OGONE_SECRET");
            const activeProvider = formData.get("activeProvider");
            const googleApiKey = formData.get("GOOGLE_API_KEY");
            const costPerKM = formData.get("costPerKM");

            fetch("/api/config/admin/updateconfig", {
              method: "PUT",
              body: JSON.stringify({
                activeProvider: activeProvider,
                mollie: { MOLLIE_SECRET: mollieSecret },
                stripe: {
                  STRIPE_LIVE_KEY: stripeLiveKey,
                  STRIPE_SECRET_KEY: stripeSecretKey,
                },
                ogone: { OGONE_KEY: ogoneKey, OGONE_SECRET: ogoneSecret },
                google: { GOOGLE_API_KEY: googleApiKey },
                costPerKM: costPerKM,
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
