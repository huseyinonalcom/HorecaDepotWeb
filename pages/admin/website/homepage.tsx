import { use, useEffect, useState } from "react";
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
import { getHomePage } from "../../api/website/public/gethomepage";
import { getBanners } from "../../api/website/public/getbanners";

export default function HomePageAdmin({
  homePageFromAPI,
  collectionsFromAPI,
  bannersFromAPI,
  allCategories,
}) {
  const [homePage, setHomePage] = useState(homePageFromAPI);
  const router = useRouter();
  const { t, lang } = useTranslation("common");
  const [banners, setBanners] = useState(bannersFromAPI);
  const [collections, setCollectons] = useState(collectionsFromAPI);

  return (
    <AdminLayout>
      <Head>
        <title>Website</title>
        <meta name="language" content={lang} />
      </Head>
      <div className="mx-auto flex w-[95%] flex-col items-center p-2">
        {/* {mediaGroups && (
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
                    {allCategories && (
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex h-[250px] flex-col overflow-y-auto">
                          {allCategories
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
                          {allCategories
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
                alert("work in progress");
              }}
              className={componentThemes.outlinedButton}
            >
              {t("save")}
            </button>
          </div>
        )} */}
        {banners && (
          <Index
            banners={banners}
            homePage={homePage}
            collections={collections}
            categories={allCategories.filter((cat) =>
              homePage.layout["2"].content.includes(cat.id),
            )}
            onRemoveCategory={(category) => {
              let currentCategories = homePage.layout["2"].content;

              let newCategories = currentCategories.filter(
                (cat) => cat !== category.id,
              );

              let newHomePage = {
                ...homePage,
                layout: {
                  ...homePage.layout,
                  "2": {
                    ...homePage.layout["2"],
                    content: newCategories,
                  },
                },
              };

              setHomePage(newHomePage);
            }}
            onClickAddCategory={() => {
              alert("show categories modal");
            }}
            developmentMode
          />
        )}
      </div>
    </AdminLayout>
  );
}

export const getServerSideProps = async ({ locale }) => {
  const homePageFromAPI = await getHomePage();

  const allCategories = await getAllCategoriesFlattened();

  const collectionsFromAPI = await getCollections();

  const bannersFromAPI = await getBanners();

  return {
    props: {
      homePageFromAPI,
      collectionsFromAPI,
      allCategories,
      bannersFromAPI,
    },
  };
};
