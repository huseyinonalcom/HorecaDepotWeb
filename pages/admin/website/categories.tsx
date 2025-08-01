import { LocalizedInput } from "../../../components/inputs/localized_input";
import AdminPanelLayout from "../../../components/admin/AdminPanelLayout";
import { FiChevronLeft, FiCopy, FiPlus, FiTrash } from "react-icons/fi";
import { Switch, SwitchField } from "../../../components/styled/switch";
import { uploadFileToAPI } from "../../api/private/files/uploadfile";
import { Field, Label } from "../../../components/styled/fieldset";
import InputOutlined from "../../../components/inputs/outlined";
import StyledForm from "../../../components/form/StyledForm";
import ImageWithURL from "../../../components/common/image";
import { Category } from "../../../api/interfaces/category";
import useTranslation from "next-translate/useTranslation";
import { Button } from "../../../components/styled/button";
import { Select } from "../../../components/styled/select";
import { Input } from "../../../components/styled/input";
import { useEffect, useState } from "react";
import Head from "next/head";
import { InputImage } from "../../../components/form/InputImage";

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

export const hierarchizeCategories = (categories, preserveEmpty = false) => {
  const isCategoryActive = (category) => {
    const products = category.products_multi_categories;
    return Array.isArray(products) && products.some((p) => p.active);
  };

  const categoriesToHandle = structuredClone(
    categories.map((cat) => ({ ...cat, subCategories: [] })),
  );

  const categoryMap = new Map(categoriesToHandle.map((cat) => [cat.id, cat]));

  categoriesToHandle.forEach((category) => {
    if (category.headCategory) {
      const parent = categoryMap.get(category.headCategory.id) as Category;
      if (parent) {
        parent.subCategories.push(category);
      }
    }
  });

  const rootCategories = categoriesToHandle.filter((cat) => !cat.headCategory);

  if (preserveEmpty) {
    return rootCategories;
  }

  const stack = [...categoriesToHandle];
  const visited = new Set();

  while (stack.length > 0) {
    const current = stack.pop();

    if (!current) continue;

    if (visited.has(current.id)) {
      current.subCategories = current.subCategories.filter((sub) => sub._keep);
      current._keep =
        isCategoryActive(current) || current.subCategories.length > 0;
    } else {
      stack.push(current);
      visited.add(current.id);
      for (const sub of current.subCategories) {
        stack.push(sub);
      }
    }
  }

  return rootCategories.filter((cat) => cat._keep);
};

export default function CategoriesAdmin() {
  const { t, lang } = useTranslation("common");
  const [categories, setCategories] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [hideEmptyCategories, setHideEmptyCategories] = useState(true);

  let previewCategories = [];

  if (categories) {
    previewCategories = hierarchizeCategories(categories, hideEmptyCategories);
  }

  const fetchCategories = async () => {
    const fetchWebsiteRequest = await fetch("/api/private/categories", {
      method: "GET",
    });
    if (fetchWebsiteRequest.ok) {
      const fetchWebsiteRequestAnswer = await fetchWebsiteRequest.json();
      return fetchWebsiteRequestAnswer;
    } else {
      return null;
    }
  };

  useEffect(() => {
    fetchAndSetCategories();
  }, [selectedCategory?.id]);

  const postCategory = async () => {
    if (!selectedCategory.Name) {
      selectedCategory.Name = selectedCategory.localized_name["en"];
    }

    const postWebsiteRequest = await fetch("/api/private/categories", {
      method: "POST",
      body: JSON.stringify(selectedCategory),
    });
    if (postWebsiteRequest.ok) {
      const answer = await postWebsiteRequest.json();
      if (answer.error) {
        alert(answer.error);
        return false;
      }

      setSelectedCategory(null);
      return true;
    } else {
      return false;
    }
  };

  const putCategory = async () => {
    const putWebsiteRequest = await fetch(
      "/api/private/categories?id=" + selectedCategory.id,
      {
        method: "PUT",
        body: JSON.stringify(selectedCategory),
      },
    );
    if (putWebsiteRequest.ok) {
      const answer = await putWebsiteRequest.json();
      if (answer.error) {
        alert(answer.error);
        return false;
      }

      setSelectedCategory(null);
      return true;
    } else {
      return false;
    }
  };

  const deleteCategory = async () => {
    if (!confirm(t("confirm_delete"))) {
      return;
    }

    const deleteCategoryRequest = await fetch(
      "/api/private/categories?id=" + selectedCategory.id,
      {
        method: "DELETE",
      },
    );
    if (deleteCategoryRequest.ok) {
      setSelectedCategory(null);
      return true;
    } else {
      return false;
    }
  };

  const fetchAndSetCategories = async () => {
    await fetchCategories().then((res) => {
      setCategories(res);
    });
  };

  useEffect(() => {
    if (!categories) {
      fetchAndSetCategories();
    }
  }, []);

  useEffect(() => {
    if (
      selectedCategory &&
      selectedCategory?.id != 0 &&
      categories &&
      categories.length > 0
    ) {
      setCategories((prev) => {
        let newCategories = prev;
        newCategories[
          newCategories.findIndex((cat) => cat.id == selectedCategory.id)
        ] = selectedCategory;
        return newCategories;
      });
    }
  }, [selectedCategory]);

  const handleSubmit = () => {
    if (selectedCategory.id != 0) {
      putCategory();
    } else {
      postCategory();
    }
  };

  return (
    <>
      <Head>
        <title>{t("categories")}</title>
      </Head>
      <div className="mx-auto mb-6 flex h-fit max-w-screen-2xl flex-col items-center justify-center overflow-hidden text-black duration-300 ease-in-out">
        <div className="mx-auto w-full max-w-[1000px] flex-shrink-0 rounded-xl bg-white p-4">
          <div className="flex flex-row justify-between">
            <h3 className="pl-2 text-xl font-semibold">{t("categories")}</h3>
            <SwitchField className="flex flex-row items-start">
              <Label>{t("show-empty-categories")}</Label>
              <Switch
                checked={hideEmptyCategories}
                color="green"
                onChange={(e) => {
                  setHideEmptyCategories(e);
                }}
              />
            </SwitchField>
          </div>
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
                    {category.subCategories.map((subCategory) => (
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
      <Button
        type="button"
        className="mb-4"
        onClick={() =>
          setSelectedCategory({
            id: 0,
          })
        }
      >
        <div className="p-2">
          <FiPlus />
        </div>
      </Button>
      {selectedCategory && (
        <StyledForm
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          bottomBarChildren={
            selectedCategory.id != 0 && (
              <>
                <Button type="button" color="red" onClick={deleteCategory}>
                  <div className="p-2">
                    <FiTrash />
                  </div>
                </Button>
                <Button
                  type="button"
                  color="white"
                  onClick={() =>
                    setSelectedCategory((sc) => ({
                      ...sc,
                      id: 0,
                    }))
                  }
                >
                  <div className="p-2">
                    <FiCopy />
                  </div>
                </Button>
              </>
            )
          }
          key={selectedCategory.id}
        >
          <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
            <div className="flex flex-col">
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
                  setSelectedCategory((prev) => ({
                    ...prev,
                    localized_name: value,
                  }));
                }}
              />
            </div>
            <div className="flex flex-col">
              <Input
                label={t("order")}
                value={selectedCategory.priority}
                onChange={(e) => {
                  setSelectedCategory((sc) => {
                    const newCategory = { ...sc };
                    newCategory.priority = e.target.value;
                    return newCategory;
                  });
                }}
                name="priority"
                min={1}
                type="number"
              />
              <Field>
                <Label>{t("parent-category")}</Label>
                <Select
                  name="categories"
                  value={selectedCategory.headCategory?.id ?? null}
                  onChange={(e) => {
                    setSelectedCategory({
                      ...selectedCategory,
                      headCategory: categories.find(
                        (cat) => cat.id == e.target.value,
                      ),
                    });
                  }}
                >
                  <option>{t("no-parent-category")}</option>
                  {categories
                    .filter((cat) => cat.id != selectedCategory.id)
                    .map((cat) => {
                      const isSubcategory = !!cat.headCategory;
                      const hasHeadParent =
                        isSubcategory &&
                        !!categories.find(
                          (parent) => parent.id === cat.headCategory?.id,
                        )?.headCategory;

                      const prefix = isSubcategory
                        ? hasHeadParent
                          ? "--"
                          : "-"
                        : "";

                      return (
                        <option key={`${cat.id}-cat`} value={cat.id}>
                          {prefix}
                          {cat.localized_name[lang]}
                        </option>
                      );
                    })}
                </Select>
              </Field>

              <InputImage
                height={160}
                width={160}
                url={selectedCategory.image?.url}
                onChange={async (e) => {
                  if (!e.target.files.item(0)) {
                    return;
                  } else {
                    uploadFileToAPI({
                      file: e.target.files.item(0),
                    })
                      .then((res) => {
                        setSelectedCategory((sc) => ({
                          ...sc,
                          image: {
                            id: res.id,
                            url: res.url,
                            alt: "",
                          },
                        }));
                      })
                      .then(() => {
                        e.target.value = "";
                      });
                  }
                }}
                onDelete={() => {
                  setSelectedCategory((sc) => ({
                    ...sc,
                    image: null,
                  }));
                }}
              ></InputImage>
            </div>
          </div>
        </StyledForm>
      )}
    </>
  );
}

CategoriesAdmin.getLayout = function getLayout(children) {
  const { t } = useTranslation("common");
  return (
    <AdminPanelLayout title={t("categories")}>{children}</AdminPanelLayout>
  );
};
