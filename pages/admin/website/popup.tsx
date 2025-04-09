import AdminPanelLayout from "../../../components/admin/AdminPanelLayout";
import StyledForm from "../../../components/form/StyledForm";
import useTranslation from "next-translate/useTranslation";
import { FiCheck, FiX } from "react-icons/fi";
import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import InputField from "../../../components/form/InputField";
import { getPopup } from "../../api/popup/getpopup";
import {
  Description,
  Field,
  Fieldset,
} from "../../../components/styled/fieldset";
import { InputImage } from "../../../components/form/InputImage";

export default function PopupAdmin(props) {
  const router = useRouter();
  const { t } = useTranslation("common");
  const [popup, setPopup] = useState(props.popup);

  const putPopup = async (updatedPopup) => {
    const putWebsiteRequest = await fetch("/api/popup/putpopup", {
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
        const request = await fetch("/api/files/admin/sendfile", {
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
            console.log(updatedPopup);
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
            onDelete={(e) => {
              e.preventDefault();
              e.stopPropagation();
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

export async function getServerSideProps() {
  const popup = (await getPopup()).data;
  return {
    props: {
      popup,
    },
  };
}
