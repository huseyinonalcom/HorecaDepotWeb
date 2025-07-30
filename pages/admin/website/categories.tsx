import { LocalizedInput } from "../../../components/inputs/localized_input";
import AdminPanelLayout from "../../../components/admin/AdminPanelLayout";
import { uploadFileToAPI } from "../../api/private/files/uploadfile";
import componentThemes from "../../../components/componentThemes";
import InputOutlined from "../../../components/inputs/outlined";
import { Divider } from "../../../components/styled/divider";
import ImageWithURL from "../../../components/common/image";
import useTranslation from "next-translate/useTranslation";
import Card from "../../../components/universal/Card";
import { FiChevronLeft } from "react-icons/fi";
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

const CategoryItem = ({ category, onClick }) => {
  const { lang } = useTranslation("common");
  const [isHovered, setisHovered] = useState(false);
  const hasSubCategories =
    category.subCategories && category.subCategories.length > 0;

  return (
    <div
      key={category.localized_name[lang]}
      className="relative cursor-pointer hover:bg-gray-200"
      onClick={() => onClick()}
      onMouseEnter={() => {
        setisHovered(true);
      }}
      onMouseLeave={() => {
        setisHovered(false);
      }}
    >
      <div className="flex w-full flex-row items-center justify-between px-3 py-2 text-left">
        {category.localized_name[lang]}
        {hasSubCategories && (
          <FiChevronLeft
            className={`h-4 w-4 duration-300 ${isHovered ? "rotate-180" : ""}`}
          />
        )}
      </div>
      {hasSubCategories && isHovered && (
        <div
          onMouseEnter={() => {
            setisHovered(true);
          }}
          onMouseLeave={() => {
            setisHovered(false);
          }}
          className="absolute top-0 left-full z-50 min-w-[200px] bg-white shadow-lg"
        >
          {category.subCategories
            .filter(
              (subCategory) =>
                subCategory.products_multi_categories.filter(
                  (prod) => prod.active,
                ).length > 0,
            )
            .map((subCategory) => (
              <CategoryItem
                key={subCategory.id}
                category={subCategory}
                onClick={() => onClick()}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default function CategoriesAdmin() {
  const router = useRouter();
  const { t, lang } = useTranslation("common");
  const [categories, setCategories] = useState(null);
  const [categoriesOriginal, setCategoriesOriginal] = useState(null);
  const [previewCategories, setPreviewCategories] = useState([]);

  const fetchCategories = async () => {
    const fetchWebsiteRequest = await fetch(
      "/api/categories/public/getallcategoriesflattened",
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

  const fetchPreviewCategories = async () => {
    const fetchWebsiteRequest = await fetch(
      "/api/categories/getallcategories?flat=false",
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
          });

        await fetchPreviewCategories().then((res) => {
          const validCategories = [];
          res?.forEach((category) => {
            if (category.products_multi_categories.length > 0) {
              validCategories.push(category);
            } else if (category.subCategories) {
              category.subCategories.forEach((subCategory) => {
                if (subCategory.products_multi_categories.length > 0) {
                  validCategories.push(category);
                } else if (subCategory.subCategories) {
                  subCategory.subCategories.forEach((subSubCategory) => {
                    if (subSubCategory.products_multi_categories.length > 0) {
                      validCategories.push(category);
                    }
                  });
                }
              });
            }
          });
          let dedupedCategories = new Set(validCategories);
          setPreviewCategories(Array.from(dedupedCategories));
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
      <div className="mx-auto mb-6 flex h-fit max-w-screen-2xl flex-col items-center justify-center overflow-hidden text-black duration-300 ease-in-out">
        <div className="mx-auto w-full max-w-[1000px] flex-shrink-0 rounded-xl bg-white p-4">
          <h3 className="pr-6 pl-2 text-xl font-semibold">{t("Categories")}</h3>
          <div className="my-4 grid grid-cols-4 gap-4 border-t bg-white py-2 duration-300">
            {previewCategories &&
              previewCategories
                .filter((cat) => cat.subCategories.length > 0)
                .map((category) => (
                  <div key={category.id + "-column"}>
                    <div className="font-semibold">
                      {category.localized_name[lang]}
                    </div>
                    {category.subCategories
                      .filter(
                        (subCategory) =>
                          subCategory.products_multi_categories.filter(
                            (prod) => prod.active,
                          ).length > 0 || subCategory.subCategories.length > 0,
                      )
                      .map((subCategory) => (
                        <CategoryItem
                          key={subCategory.id}
                          category={subCategory}
                          onClick={() => {}}
                        />
                      ))}
                  </div>
                ))}
            {previewCategories &&
              previewCategories.filter(
                (cat) => cat.subCategories.length == 0,
              ) && (
                <div key={99999} className="grid grid-cols-1">
                  {previewCategories
                    .filter((cat) => cat.subCategories.length == 0)
                    .map((category) => (
                      <div key={category.id + "-column"}>
                        <div className="font-semibold">
                          {category.localized_name[lang]}
                        </div>
                        <div className="flex w-full items-center justify-between px-3 py-2 text-left hover:bg-gray-200">
                          {category.localized_name[lang]}
                        </div>
                        {category.subCategories.map((subCategory) => (
                          <CategoryItem
                            key={subCategory.id}
                            category={subCategory}
                            onClick={() => {}}
                          />
                        ))}
                      </div>
                    ))}
                </div>
              )}
          </div>
        </div>
      </div>
      <Card>
        {categories && (
          <div className="flex w-full flex-col gap-2">
            {categories.map((category, i) => (
              <>
                <div
                  key={category.id}
                  className={`flex w-full flex-row gap-3 rounded-md py-1 ${i % 2 == 0 ? "bg-gray-50" : ""}`}
                >
                  <div className="flex flex-shrink-0 flex-row gap-2 p-2">
                    <div className="flex w-[250px] flex-shrink-0 flex-col gap-2">
                      <div className="w-full">
                        <LocalizedInput
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
                          <option value={null}>
                            {t("no_parent_category")}
                          </option>
                          {categories
                            .filter((cat) => cat.id != category.id)
                            .map((cat) => (
                              <option
                                key={
                                  cat.id + "-" + category.id + "-headCategory"
                                }
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
                <Divider />
              </>
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
      </Card>
    </>
  );
}

CategoriesAdmin.getLayout = function getLayout(children) {
  const { t } = useTranslation("common");
  return (
    <AdminPanelLayout title={t("categories")}>{children}</AdminPanelLayout>
  );
};
