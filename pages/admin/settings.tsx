import StyledFormSection from "../../components/form/StyledFormSection";
import AdminPanelLayout from "../../components/admin/AdminPanelLayout";
import StyledRadioGroup from "../../components/form/StyledRadioGroup";
import useTranslation from "next-translate/useTranslation";
import InputField from "../../components/form/InputField";
import StyledForm from "../../components/form/StyledForm";
import Head from "next/head";
import { getConfig } from "../api/private/config";

export default function Settings(props) {
  const { t } = useTranslation("common");
  const config = props.config;

  return (
    <>
      <Head>
        <title>{t("settings")}</title>
      </Head>

      <StyledForm
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);

          fetch("/api/private/config", {
            method: "PUT",
            body: JSON.stringify({
              activeProvider: formData.get("activeProvider"),
              mollie: { MOLLIE_SECRET: formData.get("mollieSecret") },
              stripe: {
                STRIPE_LIVE_KEY: formData.get("stripePublishable"),
                STRIPE_SECRET_KEY: formData.get("stripeSecret"),
              },
              ogone: {
                OGONE_KEY: formData.get("ogoneKey"),
                OGONE_SECRET: formData.get("ogoneSecret"),
              },
              google: { GOOGLE_API_KEY: formData.get("googleApiKey") },
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
      >
        <StyledFormSection title="Mollie">
          <InputField
            name="mollieSecret"
            label="Mollie Secret Key"
            defaultValue={config.mollie.MOLLIE_SECRET}
          />
        </StyledFormSection>
        <StyledFormSection title="Stripe">
          <InputField
            name="stripePublishable"
            label="Stripe Publishable Key"
            defaultValue={config.stripe.STRIPE_LIVE_KEY}
          />
          <InputField
            name="stripeSecret"
            label="Stripe Secret Key"
            defaultValue={config.stripe.STRIPE_SECRET_KEY}
          />
        </StyledFormSection>
        <StyledFormSection title="Ogone">
          <InputField
            name="ogoneKey"
            label="Ogone Key"
            defaultValue={config.ogone.OGONE_KEY}
          />
          <InputField
            name="ogoneSecret"
            label="Ogone Secret"
            defaultValue={config.ogone.OGONE_SECRET}
          />
        </StyledFormSection>
        <StyledFormSection title={t("active-payment-processor")}>
          <StyledRadioGroup
            name="activeProvider"
            selectedValue={config.activeProvider ?? "mollie"}
            options={[
              { value: "mollie", label: "Mollie" },
              { value: "stripe", label: "Stripe" },
              { value: "ogone", label: "Ogone" },
            ]}
          />
        </StyledFormSection>
        <StyledFormSection title="Google">
          <InputField
            name="googleApiKey"
            label="Google API Key"
            defaultValue={config.google.GOOGLE_API_KEY}
          />
        </StyledFormSection>
        <StyledFormSection title={t("delivery-cost")}>
          <InputField
            name="costPerKM"
            label="€ / Km"
            defaultValue={config.costPerKM}
          />
        </StyledFormSection>
      </StyledForm>
    </>
  );
}

Settings.getLayout = function (page) {
  const { t } = useTranslation("common");
  return <AdminPanelLayout title={t("settings")}>{page}</AdminPanelLayout>;
};

export async function getServerSideProps(context) {
  const config = (await getConfig({ authToken: context.req.cookies.j })).result;
  return {
    props: {
      config,
    },
  };
}
