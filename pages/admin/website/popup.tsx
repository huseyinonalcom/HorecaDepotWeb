import { useEffect, useState } from "react";
import Head from "next/head";
import useTranslation from "next-translate/useTranslation";
import AdminLayout from "../../../components/admin/adminLayout";
import componentThemes from "../../../components/componentThemes";
import InputOutlined from "../../../components/inputs/outlined";
import ImageWithURL from "../../../components/common/image";
import { useRouter } from "next/router";
import { Check, X } from "react-feather";

export default function HomePageAdmin() {
  const router = useRouter();
  const { t, lang } = useTranslation("common");
  const [popup, setPopup] = useState(null);

  const fetchCategories = async () => {
    const fetchWebsiteRequest = await fetch(`/api/popup/getpopup`, {
      method: "GET",
    });
    if (fetchWebsiteRequest.ok) {
      const fetchWebsiteRequestAnswer = await fetchWebsiteRequest.json();
      return fetchWebsiteRequestAnswer;
    } else {
      return null;
    }
  };

  const putCategories = async () => {
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

  useEffect(() => {
    if (!popup) {
      const fetchAndSetCategories = async () => {
        await fetchCategories().then((res) => {
          setPopup(res.data);
          return res;
        });
      };
      fetchAndSetCategories();
    }
  }, []);

  const uploadFiles = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.target.files && e.target.files[0]) {
      const files = e.target.files;
      await sendFile(files).then((res) => (e.target.value = ""));
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
    <AdminLayout>
      <Head>
        <title>Website</title>
        <meta name="language" content={lang} />
      </Head>
      <div className="mx-auto flex w-[95%] flex-col items-center p-2">
        {popup && (
          <div className="grid w-full grid-cols-1 gap-2">
            <div className="flex flex-col gap-2">
              <InputOutlined
                label={t("url")}
                value={popup.url}
                onChange={(e) => {
                  setPopup({ ...popup, url: e.target.value });
                }}
              />
              <div className="text flex flex-row text-green-600">
                <p>https://horecadepot.be/shop/...</p>
                <Check />
              </div>

              <div className="text flex flex-row text-red-600">
                <p>horecadepot.be/shop/...</p>
                <X />
              </div>
              <input type="file" onChange={uploadFiles} />
              {popup.img && (
                <div className="grid grid-cols-1 gap-2">
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
                </div>
              )}
              <button
                onClick={async () => {
                  const response = await putCategories();
                  if (response == true) {
                    router.reload();
                  }
                }}
                className={componentThemes.outlinedButton}
              >
                {t("save")}
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
