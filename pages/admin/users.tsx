import { formatDateTimeAPIToBe } from "../../api/utils/formatters/formatdateapibe";
import AdminLayout from "../../components/admin/adminLayout";
import useTranslation from "next-translate/useTranslation";
import { Check, ChevronLeft, X } from "react-feather";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { getFromApi } from "../api/universal/admin/getfromapi";

export default function Orders(props) {
  const router = useRouter();
  const { t, lang } = useTranslation("common");

  console.log(props.allUsers);
  return (
    <AdminLayout>
      <Head>
        <title>{t("document_orders")}</title>
        <meta name="language" content={lang} />
      </Head>
      <div className="flex w-full flex-col items-center overflow-x-auto rounded-md bg-white p-4 shadow-sm">
        <table className="w-full gap-2">
          <thead className="sticky top-0 bg-[#c0c1c3]">
            <tr>
              <th>{t("firstname")}</th>
            </tr>
          </thead>
          <tbody>
            {props.allUsers.map((user, index) => (
              <tr
                key={user.id}
                className={`cursor-pointer ${
                  index % 2 === 0 ? "bg-slate-300" : ""
                }`}
                onMouseOver={(e) =>
                  e.currentTarget.classList.add("hover:bg-slate-500")
                }
                onMouseOut={(e) =>
                  e.currentTarget.classList.remove("hover:bg-slate-500")
                }
              >
                <td>{user.user_info.firstName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps(context) {
  const req = context.req;
  const allUsers = await getFromApi({
    collection: "users",
    authToken: req.cookies.j,
    qs: "populate=role,user_info&filters[role][name][$contains]=Tier",
  });

  return {
    props: {
      allUsers,
    },
  };
}
