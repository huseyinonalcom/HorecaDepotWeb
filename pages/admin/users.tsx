import { getFromApi } from "../api/universal/admin/getfromapi";
import AdminLayout from "../../components/admin/adminLayout";
import useTranslation from "next-translate/useTranslation";
import { rankFromRole } from "../../api/utils/ranks";
import Head from "next/head";

export default function Users(props) {
  const { t, lang } = useTranslation("common");

  return (
    <>
      <Head>
        <title>{t("document_orders")}</title>
        <meta name="language" content={lang} />
      </Head>
      <div className="flex w-full flex-row justify-center">
        <h1 className="text-2xl font-semibold">{t("users")}</h1>
      </div>
      <div className="mt-4 flex w-full flex-col items-center overflow-x-auto rounded-md bg-white p-4 shadow-sm">
        <table className="w-full">
          <thead className="bg-gray-400">
            <tr>
              <th>{t("name")}</th>
              <th>{t("email")}</th>
              <th>{t("role")}</th>
              <th>{t("status")}</th>
            </tr>
          </thead>
          <tbody>
            {props.allUsers.map((user) => (
              <tr
                key={user.id}
                className="cursor-pointer odd:bg-slate-300 hover:bg-slate-400"
              >
                <td>{user.user_info.firstName}</td>
                <td>{user.email}</td>
                <td>{rankFromRole(user.role.name)}</td>
                <td>{t(user.blocked ? "blocked" : "active")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

Users.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};

export async function getServerSideProps(context) {
  const req = context.req;
  const allUsers = await getFromApi({
    collection: "users",
    authToken: req.cookies.j,
    qs: "populate=role,user_info&filters[role][name][$contains]=Tier",
  });

  const allRoles = await getFromApi({
    collection: "users-permissions/roles",
    authToken: req.cookies.j,
  });

  return {
    props: {
      allUsers,
      allRoles,
    },
  };
}
