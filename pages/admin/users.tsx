import AdminPanelLayout from "../../components/admin/AdminPanelLayout";
import { getFromApi } from "../api/universal/admin/getfromapi";
import useTranslation from "next-translate/useTranslation";
import { rankFromRole } from "../../api/utils/ranks";
import Head from "next/head";
import Link from "next/link";

export default function Users(props) {
  const { t } = useTranslation("common");

  return (
    <>
      <Head>
        <title>{t("users")}</title>
      </Head>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <Link
            href="/admin/user"
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {t("user-add")}
          </Link>
        </div>
        <div className="mt-8 flow-root">
          <div className="no-scrollbar -mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow-sm ring-1 ring-black/5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        {t("name")}
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        {t("role")}
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        {t("e-mail")}
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        {t("status")}
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pr-4 pl-3 sm:pr-6"
                      >
                        <span className="sr-only">{t("edit")}</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {props?.allUsers?.map((user) => (
                      <tr key={user.email}>
                        <td className="py-4 pr-3 pl-4 text-sm whitespace-nowrap sm:pl-6">
                          {user.user_info.firstName}
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                          {t(rankFromRole(user.role.name).toString())}
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                          {user.blocked ? t("blocked") : t("active")}
                        </td>
                        <td className="relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-6">
                          <Link
                            href={`/admin/user?id=${user.id}`}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            {t("edit")}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

Users.getLayout = function getLayout(page) {
  const { t } = useTranslation("common");
  return <AdminPanelLayout title={t("users")}>{page}</AdminPanelLayout>;
};

export async function getServerSideProps(context) {
  const req = context.req;

  const allUsers =
    (await getFromApi({
      collection: "users",
      authToken: req.cookies.j,
      qs: "populate=role,user_info&filters[role][name][$contains]=Tier",
    })) || [];

  const allRoles =
    (await getFromApi({
      collection: "users-permissions/roles",
      authToken: req.cookies.j,
    })) || [];

  return {
    props: {
      allUsers,
      allRoles,
    },
  };
}
