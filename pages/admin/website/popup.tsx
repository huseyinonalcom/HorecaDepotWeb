import AdminPanelLayout from "../../../components/admin/AdminPanelLayout";
import { InputImage } from "../../../components/form/InputImage";
import StyledForm from "../../../components/form/StyledForm";
import useTranslation from "next-translate/useTranslation";
import InputField from "../../../components/form/InputField";
import { getPopup } from "../../api/public/popups";
import { FiCheck, FiX } from "react-icons/fi";
import {
  Description,
  Field,
  Fieldset,
} from "../../../components/styled/fieldset";
import { useRouter } from "next/router";
import { useState } from "react";
import Head from "next/head";
import { syncAllProductsCurrentStock } from "../../api/private/products/products";

export default function PopupAdmin(props) {
  const router = useRouter();
  const { t } = useTranslation("common");
  const [popup, setPopup] = useState(props.popup);

  const putPopup = async (updatedPopup) => {
    const putWebsiteRequest = await fetch("/api/private/popup", {
      method: "PUT",
      body: JSON.stringify({
        url: updatedPopup.url,
        img: updatedPopup.img,
      }),
    });
    if (putWebsiteRequest.ok) {
      return true;
    } else {
      return false;
    }
  };

  const uploadFile = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.target.files && e.target.files[0]) {
      const files = e.target.files;
      await sendFile(files).then(() => (e.target.value = ""));
    }
  };

  const sendFile = async (files: File[]) => {
    let uploadedFiles = [];

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append("file", files[i]);
      try {
        const request = await fetch("/api/private/files/sendfile", {
          method: "POST",
          body: formData,
        });

        if (request.status == 201) {
          const result = await request.json();
          uploadedFiles.push(result);
        }
      } catch (error) {}
    }

    setPopup((pr) => ({
      ...pr,
      img: uploadedFiles.at(0).url,
    }));
  };

  return (
    <>
      <Head>
        <title>{t("popup")}</title>
      </Head>
      {popup && (
        <StyledForm
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const updatedPopup = {
              url: formData.get("url"),
              img: popup.img,
            };
            putPopup(updatedPopup).then((res) => {
              if (res == true) {
                // router.reload();
              }
            });
          }}
        >
          <Fieldset>
            <Field>
              <InputField
                name="url"
                label={t("url")}
                defaultValue={popup.url}
              />
              <Description
                style={{
                  color: "green",
                }}
                className="text flex flex-row items-center"
              >
                https://horecadepot.be/shop/...
                <FiCheck />
              </Description>
              <Description
                style={{
                  color: "red",
                }}
                className="text flex flex-row items-center"
              >
                horecadepot.be/shop/...
                <FiX />
              </Description>
            </Field>
          </Fieldset>
          <InputImage
            url={popup.img}
            onChange={uploadFile}
            onDelete={() => {
              setPopup({
                ...popup,
                img: null,
              });
            }}
          />
        </StyledForm>
      )}
    </>
  );
}

PopupAdmin.getLayout = function getLayout(children) {
  const { t } = useTranslation("common");
  return <AdminPanelLayout title={t("popup")}>{children}</AdminPanelLayout>;
};

export async function getServerSideProps({ req }) {
  const popup = (await getPopup()).data;

  // syncAllProductsCurrentStock({ authToken: req.cookies.j }).then((res) => console.log(res));

  return {
    props: {
      popup,
    },
  };
}
