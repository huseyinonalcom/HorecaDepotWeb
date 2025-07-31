import { LocalizedInput } from "../../../components/inputs/localized_input";
import AdminPanelLayout from "../../../components/admin/AdminPanelLayout";
import { uploadFileToAPI } from "../../api/private/files/uploadfile";
import componentThemes from "../../../components/componentThemes";
import InputOutlined from "../../../components/inputs/outlined";
import { Divider } from "../../../components/styled/divider";
import ImageWithURL from "../../../components/common/image";
import useTranslation from "next-translate/useTranslation";
import { Fragment, useEffect, useState } from "react";
import Card from "../../../components/universal/Card";
import { FiChevronLeft } from "react-icons/fi";
import { useRouter } from "next/router";
import Head from "next/head";

const CategoryItem = ({ category, onClick }) => {
  const { lang } = useTranslation("common");
  const [isHovered, setisHovered] = useState(false);
  const hasSubCategories =
    category.subCategories && category.subCategories.length > 0;

  return (
    <div
      key={category.localized_name[lang]}
      className="relative cursor-pointer hover:bg-gray-200"
      onMouseEnter={() => {
        setisHovered(true);
      }}
      onMouseLeave={() => {
        setisHovered(false);
      }}
    >
      <button
        className="flex w-full flex-row items-center justify-between px-3 py-2 text-left"
        onClick={() => onClick(category)}
        type="button"
      >
        {category.localized_name[lang]}
        {hasSubCategories && (
          <FiChevronLeft
            className={`h-4 w-4 duration-300 ${isHovered ? "rotate-180" : ""}`}
          />
        )}
      </button>
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
                onClick={onClick}
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
  const [previewCategories, setPreviewCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

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

  const putCategory = async () => {
    const putWebsiteRequest = await fetch("/api/private/categories", {
      method: "PUT",
      body: JSON.stringify(selectedCategory),
    });
    if (putWebsiteRequest.ok) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    if (!categories) {
      const fetchAndSetCategories = async () => {
        await fetchCategories().then((res) => {
          setCategories(res);
          return res;
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
          <h3 className="pl-2 text-xl font-semibold">{t("Categories")}</h3>
          <div className="my-4 grid grid-cols-4 gap-4 border-t py-2 duration-300">
            {previewCategories &&
              previewCategories
                .filter((cat) => cat.subCategories.length > 0)
                .map((category) => (
                  <div key={category.id + "-column"}>
                    <button
                      type="button"
                      className="font-semibold"
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category.localized_name[lang]}
                    </button>
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
                          onClick={(sc) => {
                            setSelectedCategory(sc);
                          }}
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
                        <button
                          type="button"
                          className="font-semibold"
                          onClick={() => setSelectedCategory(category)}
                        >
                          {category.localized_name[lang]}
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedCategory(category)}
                          className="flex w-full items-center justify-between px-3 py-2 text-left hover:bg-gray-200"
                        >
                          {category.localized_name[lang]}
                        </button>
                      </div>
                    ))}
                </div>
              )}
          </div>
        </div>
      </div>
      <Card>
        {false && categories && (
          <div className="flex w-full flex-col gap-2">
            {categories.map((category, i) => (
              <Fragment key={category.id}>
                <div
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
              </Fragment>
            ))}
          </div>
        )}
        {selectedCategory && (
          <div className="flex w-full flex-col gap-2" key={selectedCategory.id}>
            <div className="flex w-full flex-row gap-3 rounded-md py-1">
              <div className="flex flex-shrink-0 flex-row gap-2 p-2">
                <div className="flex w-[250px] flex-shrink-0 flex-col gap-2">
                  <div className="w-full">
                    <LocalizedInput
                      value={
                        selectedCategory.localized_name ?? {
                          nl: selectedCategory?.Name,
                          en: selectedCategory?.Name,
                          fr: selectedCategory?.Name,
                          de: selectedCategory?.Name,
                        }
                      }
                      onChange={(value) => {
                        setSelectedCategory((prev) => {
                          const newMediaGroups = [...prev];
                          newMediaGroups.find(
                            (mg) => mg.id == selectedCategory.id,
                          ).localized_name = value;
                          return newMediaGroups;
                        });
                      }}
                    />
                  </div>
                  <InputOutlined
                    label="order"
                    value={selectedCategory.priority}
                    onChange={(e) => {
                      setCategories((prev) => {
                        const newCategories = [...prev];
                        newCategories.find(
                          (cat) => cat.id == selectedCategory.id,
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
                      value={selectedCategory.headCategory?.id ?? null}
                      name="headCategory"
                      id={`${selectedCategory.id}-headCategory`}
                      onChange={(e) => {
                        setCategories((prev) => {
                          const newCategories = [...prev];
                          newCategories.find(
                            (cat) => cat.id == selectedCategory.id,
                          ).headCategory = newCategories.find(
                            (cat) => cat.id == e.target.value,
                          );
                          return newCategories;
                        });
                      }}
                    >
                      <option value={null}>{t("no_parent_category")}</option>
                      {categories
                        .filter((cat) => cat.id != selectedCategory.id)
                        .map((cat) => (
                          <option
                            key={
                              cat.id +
                              "-" +
                              selectedCategory.id +
                              "-headCategory"
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
                              (mg) => mg.id == selectedCategory.id,
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
                        (mg) => mg.id == selectedCategory.id,
                      ).image = null;
                      return newMediaGroups;
                    });
                  }}
                >
                  {t("delete_image")}
                </button>
                {selectedCategory.image && (
                  <ImageWithURL
                    src={selectedCategory.image.url}
                    alt={selectedCategory.image.alt}
                    height={500}
                    width={500}
                    className="h-[250px] w-auto"
                  />
                )}
              </div>
            </div>
            <button
              onClick={async () => {
                const response = await putCategory();
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
