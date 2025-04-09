import AdminPanelLayout from "../../../components/admin/AdminPanelLayout";
import componentThemes from "../../../components/componentThemes";
import InputOutlined from "../../../components/inputs/outlined";
import StyledForm from "../../../components/form/StyledForm";
import ImageWithURL from "../../../components/common/image";
import useTranslation from "next-translate/useTranslation";
import { PhotoIcon } from "@heroicons/react/24/outline";
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

export default function PopupAdmin(props) {
  const router = useRouter();
  const { t } = useTranslation("common");
  const [popup, setPopup] = useState(props.popup);

  const putPopup = async () => {
    const putWebsiteRequest = await fetch("/api/popup/putpopup", {
      method: "PUT",
      body: JSON.stringify({
        url: popup.url,
        img: popup.img,
      }),
    });
    if (putWebsiteRequest.ok) {
      return true;
    } else {
      return false;
    }
  };

  const uploadFiles = async (e) => {
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
        <StyledForm onSubmit={(e) => e.preventDefault()}>
          <Fieldset>
            <Field>
              <InputField
                name="url"
                label={t("url")}
                defaultValue={popup.url}
              />
              <Description>
                <div className="text flex flex-row items-center text-green-600">
                  <p>https://horecadepot.be/shop/...</p>
                  <FiCheck />
                </div>

                <div className="text flex flex-row items-center text-red-600">
                  <p>horecadepot.be/shop/...</p>
                  <FiX />
                </div>
              </Description>
            </Field>
          </Fieldset>
          <div className="col-span-full">
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
              <div className="text-center">
                <PhotoIcon
                  aria-hidden="true"
                  className="mx-auto size-12 text-gray-300"
                />
                <div className="mt-4 flex text-sm/6 text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="focus-within:outline-hidden relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                  >
                    <span>{t("upload-file")}</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      onChange={uploadFiles}
                      onDrop={uploadFiles}
                    />
                  </label>
                  <p className="pl-1">{t("or-drag-drop")}</p>
                </div>
              </div>
            </div>
          </div>
          {popup.img && (
            <div className="flex flex-col gap-2">
              <ImageWithURL
                src={popup.img}
                alt={""}
                height={1000}
                width={1000}
              />
              <button
                onClick={() => {
                  setPopup({
                    ...popup,
                    img: null,
                  });
                }}
                className={componentThemes.outlinedButton}
              >
                {t("delete")}
              </button>
            </div>
          )}
          <button
            onClick={async () => {
              const response = await putPopup();
              if (response == true) {
                router.reload();
              }
            }}
            className={componentThemes.outlinedButton}
          >
            {t("save")}
          </button>
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
