import AdminPanelLayout from "../../../components/admin/AdminPanelLayout";
import useTranslation from "next-translate/useTranslation";
import { getCustomers } from "../../api/private/customers";
import { useState } from "react";
import Head from "next/head";

export default function Client(props) {
  const { t } = useTranslation("common");

  const [customer, setCustomer] = useState(props.customer);

  const hasValue = (value) => {
    if (value === null || value === undefined) {
      return false;
    }
    if (typeof value === "string") {
      return value.trim().length > 0;
    }
    return true;
  };

  const displayText = (value) => {
    if (!hasValue(value)) {
      return "N/A";
    }
    if (typeof value === "string") {
      return value.trim();
    }
    return value;
  };

  const formatDateTime = (value) => {
    if (!hasValue(value)) {
      return "N/A";
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString();
  };

  const generalDetails = customer
    ? [
        { label: t("phone"), value: displayText(customer.phone) },
        { label: "Category", value: displayText(customer.category) },
        { label: t("company"), value: displayText(customer.company) },
        { label: t("taxID"), value: displayText(customer.taxID) },
        {
          label: t("email"),
          value: displayText(customer.login.email),
        },
        {
          label: t("phone"),
          value: displayText(customer.phone),
        },
      ]
    : [];

  const email =
    customer?.email ||
    customer?.login?.email ||
    customer?.login?.username ||
    null;

  const addresses = Array.isArray(customer?.addresses)
    ? customer.addresses
    : [];
  const documents = Array.isArray(customer?.documents)
    ? customer.documents
    : [];

  return (
    <>
      <Head>
        <title>{t("users")}</title>
      </Head>
      <div className="px-4 sm:px-6 lg:px-8">
        {customer ? (
          <div className="space-y-6 pb-12">
            <section className="rounded-lg bg-white shadow-sm ring-1 ring-black/5">
              <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {displayText(
                      [customer.firstName, customer.lastName]
                        .filter((part) => hasValue(part))
                        .join(" "),
                    )}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {displayText(email)}
                  </p>
                </div>
              </div>
              {generalDetails.length > 0 && (
                <div className="border-t border-gray-100 p-6">
                  <dl className="grid gap-x-8 gap-y-4 text-sm text-gray-900 sm:grid-cols-2 lg:grid-cols-3">
                    {generalDetails.map((detail) => (
                      <div key={detail.label}>
                        <dt className="text-xs font-semibold tracking-wide text-gray-500 uppercase">
                          {detail.label}
                        </dt>
                        <dd className="mt-1 text-gray-900">{detail.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </section>

            {addresses.length > 0 && (
              <section className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-black/5">
                <h3 className="text-base font-semibold text-gray-900">
                  Addresses
                </h3>
                <ul className="mt-4 space-y-4">
                  {addresses.map((address, index) => {
                    const streetLine = [address.street, address.doorNumber]
                      .filter((part) => hasValue(part))
                      .join(" ");
                    const cityLine = [address.zipCode, address.city]
                      .filter((part) => hasValue(part))
                      .join(" ");
                    return (
                      <li
                        key={address.id ?? "address-" + index}
                        className="rounded-lg border border-gray-100 p-4"
                      >
                        <div className="text-sm font-semibold text-gray-900">
                          {displayText(address.name || "Address")}
                        </div>
                        <div className="mt-2 space-y-1 text-sm text-gray-600">
                          {hasValue(streetLine) && <p>{streetLine}</p>}
                          {hasValue(cityLine) && <p>{cityLine}</p>}
                          {hasValue(address.province) && (
                            <p>{displayText(address.province)}</p>
                          )}
                          {hasValue(address.country) && (
                            <p>{displayText(address.country)}</p>
                          )}
                          {hasValue(address.floor) && (
                            <p>Floor: {displayText(address.floor)}</p>
                          )}
                          {hasValue(address.shippingDistance) && (
                            <p>
                              Shipping distance:{" "}
                              {displayText(address.shippingDistance)}
                            </p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

            {documents.length > 0 && (
              <section className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-black/5">
                <h3 className="text-base font-semibold text-gray-900">
                  Documents
                </h3>
                <div className="mt-4 overflow-hidden rounded-lg ring-1 ring-black/5">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-gray-500 uppercase">
                            Number
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-gray-500 uppercase">
                            Type
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-gray-500 uppercase">
                            Date
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-gray-500 uppercase">
                            Delivery Date
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold tracking-wide text-gray-500 uppercase">
                            Approved
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white text-sm text-gray-700">
                        {documents.map((document) => (
                          <tr key={document.id}>
                            <td className="px-4 py-3">
                              {displayText(document.number)}
                            </td>
                            <td className="px-4 py-3">
                              {displayText(document.type)}
                            </td>
                            <td className="px-4 py-3">
                              {displayText(
                                document.date ??
                                  formatDateTime(document.createdAt),
                              )}
                            </td>
                            <td className="px-4 py-3">
                              {hasValue(document.deliveryDate)
                                ? displayText(document.deliveryDate)
                                : "N/A"}
                            </td>
                            <td className="px-4 py-3">
                              {document.approved === null ||
                              document.approved === undefined
                                ? "N/A"
                                : document.approved
                                  ? "Yes"
                                  : "No"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}
          </div>
        ) : (
          <div className="rounded-lg bg-white p-6 text-sm text-gray-500 shadow-sm ring-1 ring-black/5">
            No customer data available.
          </div>
        )}
      </div>
    </>
  );
}

Client.getLayout = function getLayout(page) {
  const { t } = useTranslation("common");
  return <AdminPanelLayout title={t("users")}>{page}</AdminPanelLayout>;
};

export async function getServerSideProps(context) {
  const id = context.params.id;

  const customer = await getCustomers({
    id: parseInt(id),
    authToken: context.req.cookies.j,
    populate: ",documents",
  });

  return {
    props: {
      customer: customer?.data || null,
    },
  };
}
