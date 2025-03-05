import { LocalizedInput } from "../../../components/inputs/localized_input";
import componentThemes from "../../../components/componentThemes";
import AdminLayout from "../../../components/admin/adminLayout";
import InputOutlined from "../../../components/inputs/outlined";
import { uploadFileToAPI } from "../../api/files/uploadfile";
import ImageWithURL from "../../../components/common/image";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

function compareArrays(arr1, arr2) {
  const isEqual = (obj1, obj2) => JSON.stringify(obj1) === JSON.stringify(obj2);

  const onlyInArr1 = arr1.filter(
    (obj1) => !arr2.some((obj2) => isEqual(obj1, obj2)),
  );

  const differences = [...onlyInArr1];

  return differences;
}

export default function CategoriesAdmin() {
  const router = useRouter();
  const { t, lang } = useTranslation("common");
  const [categories, setCategories] = useState(null);
  const [categoriesOriginal, setCategoriesOriginal] = useState(null);

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
    const changedCategories = compareArrays(categories, categoriesOriginal);

    const putWebsiteRequest = await fetch(
      "/api/categories/admin/putcategories",
      {
        method: "PUT",
        body: JSON.stringify(changedCategories),
      },
    );
    if (putWebsiteRequest.ok) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    if (!categories) {
      const fetchAndSetCategories = async () => {
        await fetchCategories()
          .then((res) => {
            setCategories(res);
            return res;
          })
          .then((res) => {
            setCategoriesOriginal(structuredClone(res));
            return res;
          });
      };
      fetchAndSetCategories();
    }
  }, []);

  return (
    <>
      <Head>
        <title>{t("categories")}</title>
      </Head>
      <div className="mx-auto flex w-[95%] flex-col items-center p-2">
        {categories && (
          <div className="grid w-full grid-cols-1 gap-2">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex w-full flex-row gap-3 border-b-2 py-1"
              >
                <div className="flex flex-shrink-0 flex-row gap-2">
                  <div className="flex w-[250px] flex-shrink-0 flex-col gap-2">
                    <div className={"w-full"}>
                      <LocalizedInput
                        title={t("name")}
                        value={
                          category.localized_name ?? {
                            nl: category?.Name,
                            en: category?.Name,
                            fr: category?.Name,
                            de: category?.Name,
                          }
                        }
                        onChange={(value) => {
                          setCategories((prev) => {
                            const newMediaGroups = [...prev];
                            newMediaGroups.find(
                              (mg) => mg.id == category.id,
                            ).localized_name = value;
                            return newMediaGroups;
                          });
                        }}
                      />
                    </div>
                    <InputOutlined
                      label="order"
                      value={category.priority}
                      onChange={(e) => {
                        setCategories((prev) => {
                          const newCategories = [...prev];
                          newCategories.find(
                            (cat) => cat.id == category.id,
                          ).priority = e.target.value;
                          return newCategories;
                        });
                      }}
                      name="priority"
                      min={1}
                      type="number"
                    />
                    <div className="flex flex-col gap-1 border bg-slate-100 p-1">
                      <p>{t("parent_category")}</p>
                      <select
                        value={category.headCategory?.id ?? null}
                        name="headCategory"
                        id={`${category.id}-headCategory`}
                        onChange={(e) => {
                          setCategories((prev) => {
                            const newCategories = [...prev];
                            newCategories.find(
                              (cat) => cat.id == category.id,
                            ).headCategory = newCategories.find(
                              (cat) => cat.id == e.target.value,
                            );
                            return newCategories;
                          });
                        }}
                      >
                        <option value={null}>{t("no_parent_category")}</option>
                        {categories
                          .filter((cat) => cat.id != category.id)
                          .map((cat) => (
                            <option
                              key={cat.id + "-" + category.id + "-headCategory"}
                              value={cat.id}
                            >
                              {cat.localized_name[lang]}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>

                  <InputOutlined
                    label="add image"
                    type="file"
                    name="image"
                    onChange={async (e) => {
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
                  <button
                    onClick={() => {
                      setCategories((prev) => {
                        const newMediaGroups = [...prev];
                        newMediaGroups.find(
                          (mg) => mg.id == category.id,
                        ).image = null;
                        return newMediaGroups;
                      });
                    }}
                  >
                    {t("delete_image")}
                  </button>
                  {category.image && (
                    <ImageWithURL
                      src={category.image.url}
                      alt={category.image.alt}
                      height={500}
                      width={500}
                      className="h-[250px] w-auto"
                    />
                  )}
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
        {/* {categories && (
          <div className="flex flex-col gap-3">
            {categories.map((mg, index) => (
              <p key={index}>{JSON.stringify(mg)}</p>
            ))}
          </div>
        )} */}
      </div>
    </>
  );
}

CategoriesAdmin.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};
