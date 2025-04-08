import AdminPanelLayout from "../../components/admin/AdminPanelLayout";
import { getFromApi } from "../api/universal/admin/getfromapi";
import useTranslation from "next-translate/useTranslation";
import { rankFromRole } from "../../api/utils/ranks";
import Head from "next/head";
import Link from "next/link";
import { Field, Label } from "../../components/styled/fieldset";
import { Select } from "../../components/styled/select";
import { useEffect, useState } from "react";
import {
  Pagination,
  PaginationList,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
} from "../../components/styled/pagination";

const fetchUsers = async (filter) => {
  const allUsers = await fetch(
    `/api/universal/admin/getfromapi?collection=${filter.role == 14 ? "clients" : "user-infos"}&qs=${encodeURIComponent(`filters[login][role][id][$eq]=${filter.role}&populate=login&pagination[page]=${filter.page}`)}`,
  );

  return allUsers;
};

export default function Users(props) {
  const { t } = useTranslation("common");
  const [filter, setFilter] = useState({
    role: 14,
    page: 1,
  });
  const [users, setUsers] = useState({
    data: [],
    meta: { pagination: { pageCount: 0 } },
  });

  useEffect(() => {
    fetchUsers(filter)
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
      });
  }, [filter]);

  return (
    <>
      <Head>
        <title>{t("users")}</title>
      </Head>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="flex sm:flex-auto">
            <Field>
              <Label style={{ color: "black" }}>{t("role")}</Label>
              <Select
                name="role"
                value={filter.role}
                style={{
                  color: "black",
                  backgroundColor: "white",
                }}
                onChange={(e) =>
                  setFilter({
                    ...filter,
                    role: Number(e.target.value),
                    page: 1,
                  })
                }
              >
                {props?.allRoles &&
                  props?.allRoles?.map((role) => (
                    <option key={role.id} value={role.id}>
                      {t(rankFromRole(role.name).toString())}
                    </option>
                  ))}
              </Select>
            </Field>
          </div>

          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <Link
              href="/admin/user"
              className="shadow-xs block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {t("user-add")}
            </Link>
          </div>
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
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        {t("name")}
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
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                      >
                        <span className="sr-only">{t("edit")}</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {users.data.map((user) => (
                      <tr key={user.login?.role?.name + "-" + user.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                          {user.firstName} {user.lastName}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {user.email ?? user.login?.email}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {user.login.blocked ? t("blocked") : t("active")}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          {filter.role != 14 ? (
                            filter.role != 4 && (
                              <Link
                                href={`/admin/user?id=${user.login.id}`}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                {t("edit")}
                              </Link>
                            )
                          ) : (
                            <Link
                              href={`/admin/client?id=${user.id}`}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              {t("details")}
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Pagination className="m-1">
                  <PaginationPrevious
                    onClick={
                      filter.page > 1
                        ? () => {
                            scroll({
                              top: 0,
                              behavior: "smooth",
                            });
                            setFilter({ ...filter, page: filter.page - 1 });
                          }
                        : undefined
                    }
                  >
                    <p className="text-black">{t("previous")}</p>
                  </PaginationPrevious>
                  <PaginationList>
                    <PaginationPage className="data-disabled:opacity-100">
                      {filter.page}
                    </PaginationPage>
                  </PaginationList>
                  <PaginationNext
                    onClick={
                      filter.page < users?.meta?.pagination?.pageCount
                        ? () => {
                            scroll({
                              top: 0,
                              behavior: "smooth",
                            });
                            setFilter({ ...filter, page: filter.page + 1 });
                          }
                        : undefined
                    }
                  >
                    <p className="text-black">{t("next")}</p>
                  </PaginationNext>
                </Pagination>
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

  const allRoles =
    (await getFromApi({
      collection: "users-permissions/roles",
      authToken: req.cookies.j,
    })) || [];

  const valiedRoles = ["Tier 7", "Tier 8", "Tier 9", "Client"];

  return {
    props: {
      allRoles: allRoles.roles
        .filter((role) => valiedRoles.includes(role.name))
        .sort((a, b) => a.name.localeCompare(b.name)),
    },
  };
}
