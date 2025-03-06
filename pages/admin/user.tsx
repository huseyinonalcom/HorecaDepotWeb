import StyledFormSection from "../../components/form/StyledFormSection";
import AdminPanelLayout from "../../components/admin/AdminPanelLayout";
import StyledRadioGroup from "../../components/form/StyledRadioGroup";
import { getFromApi } from "../api/universal/admin/getfromapi";
import useTranslation from "next-translate/useTranslation";
import InputField from "../../components/form/InputField";
import StyledForm from "../../components/form/StyledForm";
import { Field, Label, Switch } from "@headlessui/react";
import Head from "next/head";
import { randomBytes } from "crypto";

const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  let url;
  let method;
  if (formData.get("id") == "0") {
    fetch("/api/universal/admin/posttoapi?collection=user-infos", {
      method: "POST",
      body: JSON.stringify({
        email: formData.get("email"),
        firstName: formData.get("firstName"),
      }),
    }).then(async (res) => {
      const ans = await res.json();
      console.log(
        JSON.stringify({
          user_info: ans.id,
          role: formData.get("role"),
          email: formData.get("email"),
          username: formData.get("email"),
          password: randomBytes(16).toString("hex"),
          blocked: formData.get("blocked") ? false : true,
        }),
      );
      const randomString = randomBytes(16).toString("hex");
      fetch(`/api/universal/admin/posttoapi?collection=users`, {
        method: "POST",
        body: JSON.stringify({
          user_info: ans.id,
          role: formData.get("role"),
          email: formData.get("email"),
          username: formData.get("email"),
          password: randomBytes(16).toString("hex"),
          blocked: formData.get("blocked") ? false : true,
        }),
      });
    });
  } else {
    url = `/api/universal/puttoapi?collection=users&id=${formData.get("id")}`;
    method = "PUT";
  }
  // fetch(url, {
  //   method,
  //   body: JSON.stringify({
  //
  //       role: formData.get("role"),
  //       email: formData.get("email"),
  //       username: formData.get("email"),
  //       blocked: formData.get("blocked"),
  //       user_info: {
  //         email: formData.get("email"),
  //         firstName: formData.get("firstName"),
  //       },
  //   }),
  // });
};

export default function User(props) {
  const { t } = useTranslation("common");

  const validRoles = ["Tier 8"];

  const roleNames = {
    "Tier 8": t("seller"),
  };

  const ranks = props.allRoles
    .filter((role) => validRoles.includes(role.name))
    .map((role) => ({
      value: Number(role.id),
      label: roleNames[role.name] ?? role.name,
    }));

  console.log(props.user);

  return (
    <>
      <Head>
        <title>{t("user-edit")}</title>
      </Head>
      <StyledForm onSubmit={handleSubmit}>
        <input type="hidden" name="id" value={props.user.id} />
        <StyledFormSection title={t("user-details")}>
          <InputField
            name="firstName"
            label="Prénom"
            defaultValue={props.user.user_info.firstName}
          />
          <InputField
            name="email"
            label="Email"
            defaultValue={props.user.email}
          />
        </StyledFormSection>
        <StyledFormSection title={t("role")}>
          <StyledRadioGroup
            name="role"
            selectedValue={Number(
              props.allRoles.find((role) => role.name == "Tier 8").id,
            )}
            options={ranks}
          />
        </StyledFormSection>
        <StyledFormSection title={t("status")}>
          <Field className="mt-2 flex items-center justify-between">
            <span className="flex grow flex-col">
              <Label
                as="span"
                passive
                className="text-sm/6 font-medium text-gray-900"
              >
                {t("active")}
              </Label>
            </span>
            <Switch
              name="blocked"
              defaultChecked={!props.user.blocked}
              className="focus:outline-hidden data-checked:bg-indigo-600 group relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
            >
              <span
                aria-hidden="true"
                className="group-data-checked:translate-x-5 pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out"
              />
            </Switch>
          </Field>
        </StyledFormSection>
      </StyledForm>
    </>
  );
}

User.getLayout = function getLayout(page) {
  const { t } = useTranslation("common");
  return <AdminPanelLayout title={t("users")}>{page}</AdminPanelLayout>;
};

export async function getServerSideProps(context) {
  const req = context.req;
  const query = context.query;
  let user = {
    id: 0,
    username: "",
    email: "",
    confirmed: true,
    blocked: false,
    role: {
      id: 0,
      name: "",
      description: "",
      type: "",
    },
    user_info: {
      id: 0,
      firstName: "",
      lastName: "",
      phone: "",
    },
  };
  if (query.id && query.id != "0") {
    user = await getFromApi({
      collection: "users",
      authToken: req.cookies.j,
      id: query.id,
      qs: "populate=role,user_info&filters[role][name][$contains]=Tier",
    });
  }

  console.log(user);

  const allRoles =
    (await getFromApi({
      collection: "users-permissions/roles",
      authToken: req.cookies.j,
    })) || [];

  return {
    props: {
      user,
      allRoles: allRoles.roles,
    },
  };
}
