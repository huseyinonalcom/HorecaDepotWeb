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
import { useRouter } from "next/router";

const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  let res;
  if (formData.get("id") == "0") {
    await fetch("/api/universal/admin/posttoapi?collection=user-infos", {
      method: "POST",
      body: JSON.stringify({
        email: formData.get("email"),
        firstName: formData.get("firstName"),
      }),
    }).then(async (ansa) => {
      const ans = await ansa.json();
      await fetch(
        `/api/universal/admin/posttoapi?collection=users&nodata=true`,
        {
          method: "POST",
          body: JSON.stringify({
            user_info: ans.id,
            role: Number(formData.get("role")),
            email: formData.get("email"),
            username: formData.get("email"),
            password: randomBytes(16).toString("hex"),
            blocked: formData.get("blocked") ? false : true,
          }),
        },
      ).then(async (ansb) => {
        res = await ansb.json();
      });
    });
  } else {
    await fetch(
      "/api/universal/admin/puttoapi?collection=user-infos&id=" +
        formData.get("infoId"),
      {
        method: "POST",
        body: JSON.stringify({
          email: formData.get("email"),
          firstName: formData.get("firstName"),
        }),
      },
    ).then(async () => {
      await fetch(
        `/api/universal/admin/puttoapi?collection=users&nodata=true&id=` +
          formData.get("id"),
        {
          method: "POST",
          body: JSON.stringify({
            role: Number(formData.get("role")),
            email: formData.get("email"),
            username: formData.get("email"),
            password: randomBytes(16).toString("hex"),
            blocked: formData.get("blocked") ? false : true,
          }),
        },
      ).then(async (ansb) => {
        res = await ansb.json();
      });
    });
  }
  return res;
};

export default function User(props) {
  const { t } = useTranslation("common");
  const router = useRouter();

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

  return (
    <>
      <Head>
        <title>{t(props.user.id == 0 ? "user-create" : "user-edit")}</title>
      </Head>
      <StyledForm
        onSubmit={(e) =>
          handleSubmit(e).then((res) => {
            console.log(res);
            if (res.id) {
              router.replace("/admin/user?id=" + res.id);
              if (props.user.id == 0) {
                alert(t("user-created-success"));
              } else {
                alert(t("user-update-success"));
              }
            } else {
              if (props.user.id == 0) {
                alert(t("user-created-fail"));
              } else {
                alert(t("user-update-fail"));
              }
            }
          })
        }
      >
        <input type="hidden" name="id" value={props.user.id} />
        <input type="hidden" name="infoId" value={props.user.user_info.id} />
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
