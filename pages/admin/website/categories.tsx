import React, { useEffect, useState } from "react";
import Head from "next/head";
import useTranslation from "next-translate/useTranslation";
import AdminLayout from "../../../components/admin/adminLayout";
import componentThemes from "../../../components/componentThemes";
import InputOutlined from "../../../components/inputs/outlined";
import { uploadFileToAPI } from "../../api/files/uploadfile";
import ImageWithURL from "../../../components/common/image";
import { useRouter } from "next/router";

export default function HomePageAdmin() {
  const router = useRouter();
  const { t, lang } = useTranslation("common");
  const [categories, setCategories] = useState(null);

  const fetchCategories = async () => {
    const fetchWebsiteRequest = await fetch(
      `/api/categories/public/getallcategoriesflattened`,
      {
        method: "GET",
      },
    );
    if (fetchWebsiteRequest.ok) {
      const fetchWebsiteRequestAnswer = await fetchWebsiteRequest.json();
      return fetchWebsiteRequestAnswer;
    } else {
      return null;
    }
  };

  const putCategories = async () => {
    console.log(categories);

    return false;
  };

  useEffect(() => {
    if (!categories) {
      const fetchAndSetCategories = async () => {
        const categories = await fetchCategories();
        setCategories(categories);
      };
      fetchAndSetCategories();
    }
  }, []);

  return (
    <AdminLayout>
      <Head>
        <title>Website</title>
        <meta name="language" content={lang} />
      </Head>
      <div className="mx-auto flex w-[95%] flex-col items-center p-2">
        {categories && (
          <div className="grid w-full grid-cols-1 gap-2">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex w-full flex-row gap-3 border-b-2 py-1"
              >
                <div className="flex flex-shrink-0 flex-col gap-2">
                  <InputOutlined
                    label="name"
                    value={category.Name}
                    onChange={(e) => {
                      setCategories((prev) => {
                        const newMediaGroups = [...prev];
                        newMediaGroups.find((mg) => mg.id == category.id).Name =
                          e.target.value;
                        return newMediaGroups;
                      });
                    }}
                    name="name"
                    type="text"
                  />
                  <InputOutlined
                    label="add image"
                    type="file"
                    name="image"
                    onChange={async (e) => {
                      console.log(e.target.files.item(0) ?? "no file");

                      if (!e.target.files.item(0)) {
                        return;
                      } else {
                        uploadFileToAPI({
                          file: e.target.files.item(0),
                        })
                          .then((res) => {
                            setCategories((prev) => {
                              const newMediaGroups = [...prev];
                              newMediaGroups.find(
                                (mg) => mg.id == category.id,
                              ).image = {
                                id: res.id,
                                url: res.url,
                                alt: "",
                              };
                              return newMediaGroups;
                            });
                          })
                          .then(() => {
                            e.target.value = "";
                          });
                      }
                    }}
                  />
                </div>
              </div>
            ))}
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
        )}
        {categories && (
          <div className="flex flex-col gap-3">
            {categories.map((mg, index) => (
              <p key={index}>{JSON.stringify(mg)}</p>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
