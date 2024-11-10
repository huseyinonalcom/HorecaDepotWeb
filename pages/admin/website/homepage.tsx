import { useEffect, useState } from "react";
import Head from "next/head";
import useTranslation from "next-translate/useTranslation";
import AdminLayout from "../../../components/admin/adminLayout";
import componentThemes from "../../../components/componentThemes";
import InputOutlined from "../../../components/inputs/outlined";
import { uploadFileToAPI } from "../../api/files/uploadfile";
import ImageWithURL from "../../../components/common/image";
import { useRouter } from "next/router";
import Index from "../..";
import { getCollections } from "../../api/collections/public/getcollections";
import { getWebsite } from "../../api/website/public/getwebsite";
import { getAllCategoriesFlattened } from "../../api/categories/public/getallcategoriesflattened";
import getT from "next-translate/getT";

export default function HomePageAdmin({
  collectionsFromAPI,
  mediaGroupsFromAPI,
}) {
  const router = useRouter();
  const { t, lang } = useTranslation("common");
  const [categories, setCategories] = useState(null);
  const [mediaGroups, setMediaGroups] = useState(mediaGroupsFromAPI);
  const [collections, setCollectons] = useState(collectionsFromAPI);

  const putMediagroups = async () => {
    for (let i = 0; i < mediaGroups.length; i++) {
      mediaGroups[i].name = `${i}${Date.now()}`;
    }
    const putWebsiteRequest = await fetch("/api/website/admin/putwebsite", {
      method: "PUT",
      body: JSON.stringify(mediaGroups),
    });
    if (putWebsiteRequest.ok) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <AdminLayout>
      <Head>
        <title>Website</title>
        <meta name="language" content={lang} />
      </Head>
      <div className="mx-auto flex w-[95%] flex-col items-center p-2">
        {mediaGroups && (
          <div className="grid w-full grid-cols-1 gap-2">
            {mediaGroups.map((mediaGroup) => (
              <div
                key={mediaGroup.id}
                className="flex w-full flex-row gap-3 border-b-2 py-1"
              >
                <div className="flex flex-shrink-0 flex-col gap-2">
                  <InputOutlined
                    label="description"
                    value={mediaGroup.description ?? ""}
                    onChange={(e) => {
                      setMediaGroups((prev) => {
                        const newMediaGroups = [...prev];
                        newMediaGroups.find(
                          (mg) => mg.id == mediaGroup.id,
                        ).description = e.target.value;
                        return newMediaGroups;
                      });
                    }}
                    name="description"
                    type="text"
                  />
                </div>
                {!mediaGroup.is_fetched_from_api ? (
                  <div className="flex flex-row gap-2">
                    <div className="w-[250px]">
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
                                setMediaGroups((prev) => {
                                  const newMediaGroups = [...prev];
                                  newMediaGroups
                                    .find((mg) => mg.id == mediaGroup.id)
                                    .image_with_link.push({
                                      name: "",
                                      description: "",
                                      linked_url: "",
                                      order: 1,
                                      image: {
                                        id: res.id,
                                        url: res.url,
                                        alt: "",
                                      },
                                    });
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
                    <div className="flex w-full flex-wrap gap-2">
                      {mediaGroup.image_with_link.map((img, i) => (
                        <div
                          key={i}
                          className="flex max-w-[300px] flex-col gap-2 border p-1"
                        >
                          <div className="flex flex-row">
                            <button
                              className={
                                "bg-red-500 px-2 py-1 font-bold hover:bg-red-300"
                              }
                              onClick={() =>
                                setMediaGroups((prev) => {
                                  const newMediaGroups = [...prev];
                                  newMediaGroups.find(
                                    (mg) => mg.id == mediaGroup.id,
                                  ).image_with_link = newMediaGroups
                                    .find((mg) => mg.id == mediaGroup.id)
                                    .image_with_link.filter(
                                      (il) => il.image.url != img.image.url,
                                    );

                                  return newMediaGroups;
                                })
                              }
                            >
                              X
                            </button>
                          </div>
                          <ImageWithURL
                            height={500}
                            width={500}
                            className="h-24 w-auto"
                            src={img.image.url}
                            alt=""
                          />
                          <InputOutlined
                            label="name"
                            type="text"
                            name="image with link name"
                            value={img.name}
                            onChange={(e) =>
                              setMediaGroups((prev) => {
                                const newMediaGroups = [...prev];
                                newMediaGroups
                                  .find((mg) => mg.id == mediaGroup.id)
                                  .image_with_link.find(
                                    (il) => il.id == img.id,
                                  ).name = e.target.value;
                                return newMediaGroups;
                              })
                            }
                          />
                          <InputOutlined
                            label="description"
                            type="text"
                            name="image with link description"
                            value={img.description ?? ""}
                            onChange={(e) =>
                              setMediaGroups((prev) => {
                                const newMediaGroups = [...prev];
                                newMediaGroups
                                  .find((mg) => mg.id == mediaGroup.id)
                                  .image_with_link.find(
                                    (il) => il.id == img.id,
                                  ).description = e.target.value;
                                return newMediaGroups;
                              })
                            }
                          />
                          <InputOutlined
                            label="linked_url"
                            type="text"
                            name="image with link linked_url"
                            value={img.linked_url}
                            onChange={(e) =>
                              setMediaGroups((prev) => {
                                const newMediaGroups = [...prev];
                                newMediaGroups
                                  .find((mg) => mg.id == mediaGroup.id)
                                  .image_with_link.find(
                                    (il) => il.id == img.id,
                                  ).linked_url = e.target.value;
                                return newMediaGroups;
                              })
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-row gap-2">
                    {categories && (
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex h-[250px] flex-col overflow-y-auto">
                          {categories
                            .filter(
                              (cat) =>
                                !mediaGroups
                                  .find((mg) => mg.id == mediaGroup.id)
                                  .fetch_from.ids.includes(cat.id),
                            )
                            .map((category) => (
                              <button
                                key={category.id + "-add"}
                                className="flex w-full flex-row hover:bg-slate-200"
                                onClick={() =>
                                  setMediaGroups((prev) => {
                                    const newMediaGroups = [...prev];
                                    newMediaGroups.find(
                                      (mg) => mg.id == mediaGroup.id,
                                    ).fetch_from.ids = [
                                      ...newMediaGroups.find(
                                        (mg) => mg.id == mediaGroup.id,
                                      ).fetch_from.ids,
                                      category.id,
                                    ];

                                    return newMediaGroups;
                                  })
                                }
                              >
                                {"+ "}
                                {category.localized_name[lang]}
                              </button>
                            ))}
                        </div>
                        <div className="flex h-[250px] flex-col overflow-y-auto">
                          {categories
                            .filter((cat) =>
                              mediaGroups
                                .find((mg) => mg.id == mediaGroup.id)
                                .fetch_from.ids.includes(cat.id),
                            )
                            .map((category) => (
                              <button
                                key={category.id + "-remove"}
                                className="flex w-full flex-row hover:bg-slate-200"
                                onClick={() =>
                                  setMediaGroups((prev) => {
                                    const newMediaGroups = [...prev];
                                    newMediaGroups.find(
                                      (mg) => mg.id == mediaGroup.id,
                                    ).fetch_from.ids = newMediaGroups
                                      .find((mg) => mg.id == mediaGroup.id)
                                      .fetch_from.ids.filter(
                                        (cat) => cat != category.id,
                                      );

                                    return newMediaGroups;
                                  })
                                }
                              >
                                {"- "}
                                {category.localized_name[lang]}
                              </button>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            <button
              onClick={async () => {
                const response = await putMediagroups();
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
        {mediaGroups && (
          <Index
            mediaGroups={mediaGroups}
            collections={collections}
            developmentMode
          />
        )}
      </div>
    </AdminLayout>
  );
}

export const getServerSideProps = async ({ locale }) => {
  const t = await getT(locale, "common");
  let collectionsFromAPI = await getCollections();

  for (let i = 0; i < collectionsFromAPI.length; i++) {
    collectionsFromAPI[i].products = collectionsFromAPI[i].products.filter(
      (p) => p.active,
    );
  }

  const website = await getWebsite();
  let mediaGroupsFromAPI = website.media_groups;

  for (let i = 0; i < mediaGroupsFromAPI.length; i++) {
    if (mediaGroupsFromAPI[i].is_fetched_from_api) {
      if (
        mediaGroupsFromAPI[i].fetch_from.collection.toLowerCase() ==
        "categories"
      ) {
        const allCategoriesRaw = await getAllCategoriesFlattened();
        mediaGroupsFromAPI[i].image_with_link = allCategoriesRaw
          .filter((cat) =>
            mediaGroupsFromAPI[i].fetch_from.ids.includes(cat.id),
          )
          .map((category) => {
            return {
              id: category.id,
              name: category.localized_name[locale],
              image: category.image,
              linked_url:
                "/shop/" + t(category.localized_name[locale]) + "?page=1",
            };
          });
      }
    } else {
      mediaGroupsFromAPI[i].image_with_link = mediaGroupsFromAPI[
        i
      ].image_with_link.map((item) => {
        const url = item.linked_url;
        const category = url.split("/").pop();
        const translatedCategory = t(
          decodeURIComponent(category.split("?")[0]),
        );
        return {
          ...item,
          linked_url: `/shop/${translatedCategory}?page=1`,
        };
      });
    }
  }

  return {
    props: {
      collectionsFromAPI,
      mediaGroupsFromAPI,
    },
  };
};
