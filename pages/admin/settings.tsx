import componentThemes from "../../components/componentThemes";
import InputOutlined from "../../components/inputs/outlined";
import AdminLayout from "../../components/admin/adminLayout";
import { getConfig } from "../api/config/private/getconfig";
import useTranslation from "next-translate/useTranslation";
import { Loader } from "react-feather";
import { useState } from "react";
import Head from "next/head";
import AdminPanelLayout from "../../components/admin/AdminPanelLayout";
import {
  ChevronDownIcon,
  PhotoIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";

function InputField({ label, name, defaultValue = "", type = "text" }) {
  return (
    <div className="col-span-full">
      <label htmlFor={name} className="block text-sm font-medium text-gray-900">
        {label}
      </label>
      <div className="mt-2">
        <input
          defaultValue={defaultValue}
          id={name}
          name={name}
          type={type}
          className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
        />
      </div>
    </div>
  );
}

function ConfigSection({ title, children }) {
  return (
    <div className="border-b border-gray-900/10 pb-12">
      <h2 className="text-base font-semibold text-gray-900">{title}</h2>
      <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        {children}
      </div>
    </div>
  );
}

export default function Settings(props) {
  const { t } = useTranslation("common");
  const config = props.config;

  return (
    <>
      <Head>
        <title>{t("settings")}</title>
      </Head>

      <form
        className="overflow-hidden rounded-lg bg-white shadow-sm"
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);

          fetch("/api/config/admin/updateconfig", {
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
      >
        <div className="space-y-12 px-4 py-5 sm:p-6">
          <ConfigSection title="Mollie">
            <InputField
              name="mollieSecret"
              label="Mollie Secret Key"
              defaultValue={config.mollie.MOLLIE_SECRET}
            />
          </ConfigSection>
          <ConfigSection title="Stripe">
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
          </ConfigSection>
          <ConfigSection title="Ogone">
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
          </ConfigSection>
          <div className="mt-6 flex items-center justify-end gap-x-6">
            <button
              type="submit"
              className="shadow-xs rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Save
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

Settings.getLayout = function (page) {
  const { t } = useTranslation("common");
  return <AdminPanelLayout title={t("settings")}>{page}</AdminPanelLayout>;
};

export async function getServerSideProps() {
  const config = await getConfig();
  return {
    props: {
      config,
    },
  };
}
