import AdminPanelLayout from "../../../components/admin/AdminPanelLayout";
import componentThemes from "../../../components/componentThemes";
import InputOutlined from "../../../components/inputs/outlined";
import StyledForm from "../../../components/form/StyledForm";
import ImageWithURL from "../../../components/common/image";
import useTranslation from "next-translate/useTranslation";
import { PhotoIcon, TrashIcon } from "@heroicons/react/24/outline";
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
          <div className="col-span-full">
            <label
              htmlFor="img"
              className="relative cursor-pointer rounded-md bg-white font-semibold"
            >
              <div className="group relative mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10 hover:border-indigo-600">
                {popup.img ? (
                  <>
                    <ImageWithURL
                      src={popup.img}
                      alt={""}
                      height={1000}
                      width={1000}
                    />
                    <div className="invisible absolute inset-0 flex cursor-default items-center justify-center bg-gray-400/50 group-hover:visible">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setPopup({
                            ...popup,
                            img: null,
                          });
                        }}
                      >
                        <TrashIcon className="translate-[-50%] absolute left-1/2 top-1/2 h-10 w-10 cursor-pointer rounded-lg bg-black p-2 text-red-500" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center">
                    <PhotoIcon
                      aria-hidden="true"
                      className="mx-auto size-12 text-gray-300"
                    />
                    <div className="mt-4 flex text-sm/6 text-gray-600">
                      <span>{t("upload-file")}</span>
                      <input
                        id="img"
                        name="img"
                        type="file"
                        className="sr-only"
                        onChange={uploadFile}
                      />
                    </div>
                  </div>
                )}
              </div>
            </label>
          </div>
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
