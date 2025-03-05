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

export default function Settings(props) {
  const { t } = useTranslation("common");

  return (
    <>
      <Head>
        <title>{t("configuration")}</title>
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
      >
        <div className="px-4 py-5 sm:p-6">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base/7 font-semibold text-gray-900">Mollie</h2>
            <div>
              <label
                htmlFor="mollieSecret"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Mollie Secret Key
              </label>
              <div className="mt-2">
                <input
                  id="mollieSecret"
                  name="mollieSecret"
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
          </div>
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base/7 font-semibold text-gray-900">Mollie</h2>
            <div>
              <label
                htmlFor="mollieSecret"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Mollie Secret Key
              </label>
              <div className="mt-2">
                <input
                  id="mollieSecret"
                  name="mollieSecret"
                  type="text"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
          </div>

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
            inputMode="decimal"
            defaultValue={props.config.costPerKM ?? ""}
            className="w-full border border-gray-300 p-2"
            type="decimal"
            name="costPerKM"
            label="€ / Km"
          />
          <h2 className="text-xl font-semibold">{t("mail")}</h2>
          <InputOutlined
            defaultValue={props.config.mail?.mailUser ?? ""}
            className="w-full border border-gray-300 p-2"
            type="text"
            name="mailUser"
            label={t("mail-user")}
          />
          <InputOutlined
            defaultValue={props.config.mail?.mailPass ?? ""}
            className="w-full border border-gray-300 p-2"
            type="text"
            name="mailPass"
            label={t("mail-pass")}
          />
          <InputOutlined
            defaultValue={props.config.mail?.mailHost ?? ""}
            className="w-full border border-gray-300 p-2"
            type="text"
            name="mailHost"
            label={t("mail-host")}
          />
          <InputOutlined
            defaultValue={props.config.mail?.mailPort ?? ""}
            className="w-full border border-gray-300 p-2"
            type="text"
            name="mailPort"
            label={t("mail-port")}
          />
          <InputOutlined
            defaultValue={props.config.mail?.mailSender ?? ""}
            className="w-full border border-gray-300 p-2"
            type="text"
            name="mailSender"
            label={t("mail-sender")}
          />
          <InputOutlined
            defaultValue={props.config.mail?.mailSenderName ?? ""}
            className="w-full border border-gray-300 p-2"
            type="text"
            name="mailSenderName"
            label={t("mail-sender-name")}
          />
          <h2 className="text-xl font-semibold">{t("mail-test")}</h2>
          <InputOutlined
            className="w-full border border-gray-300 p-2"
            type="text"
            name="mailTo"
            label={t("mail-to")}
          />

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

export async function getServerSideProps(context) {
  const config = await getConfig();
  return {
    props: {
      config,
    },
  };
}
