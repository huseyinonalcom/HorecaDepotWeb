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
      <div className="flex w-full flex-col items-center overflow-x-auto rounded-md bg-white p-4 shadow-sm">
        <table className="w-full gap-2">
          <thead>
            <tr>
              <th>{t("name")}</th>
              <th>{t("email")}</th>
              <th>{t("role")}</th>
              <th>{t("status")}</th>
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

  const roles = await getFromApi({
    collection: "users-permissions/roles",
    authToken: req.cookies.j,
  });

  console.log(roles);

  return {
    props: {
      allUsers,
    },
  };
}
