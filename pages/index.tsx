import { getAllCategoriesFlattened } from "./api/categories/public/getallcategoriesflattened";
import CollectionShowcase from "../components/public/collection-showcase";
import { getCollections } from "./api/collections/public/getcollections";
import { CategoryBanner } from "../components/banners/CategoryBanner";
import { Check, ChevronLeft, PlusSquare, X } from "react-feather";
import useTranslation from "next-translate/useTranslation";
import ImageWithURL from "../components/common/image";
import { Category } from "../api/interfaces/category";
import Layout from "../components/public/layout";
import Meta from "../components/public/meta";
import { useEffect, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { getHomePage } from "./api/website/public/gethomepage";
import { PromoBanner } from "../components/banners/PromoBanner";
import { getBanners } from "./api/website/public/getbanners";
import InputOutlined from "../components/inputs/outlined";
import { uploadFileToAPI } from "./api/files/uploadfile";
import TextareaOutlined from "../components/inputs/textarea_outlined";
import { PiPencil } from "react-icons/pi";
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";

export default function Index({
  homePage,
  collections,
  onEdit,
  categories,
  banners,
  allCategories,
}: {
  homePage;
  collections;
  onEdit?: (homePage) => void;
  categories: Category[];
  allCategories?: Category[];
  banners;
}) {
  const { t, lang } = useTranslation("common");

  const handleScrollSlider = (direction) => {
    const slider = document.getElementById("slider-1");
    const maxScrollLeft = slider.scrollWidth - slider.clientWidth;

    let scrollAmount = 350;
    if (direction === "left") {
      scrollAmount = -scrollAmount;
    }

    const newScrollLeft = slider.scrollLeft + scrollAmount;
    const finalScrollLeft = Math.max(0, Math.min(newScrollLeft, maxScrollLeft));

    slider.scrollTo({
      left: finalScrollLeft,
      behavior: "smooth",
    });
  };

  let debounceTimer;

  const [shownPromoBannerModal, setShownPromoBannerModal] = useState<
    "1" | "3" | "4" | "5" | null
  >(null);

  const BannerModal = ({ order }: { order: "1" | "3" | "4" | "5" }) => {
    return (
      <>
        {order == "1" && (
          <PlusSquare
            className="m-auto flex-shrink-0"
            size={64}
            onClick={() => {
              setShownPromoBannerModal(order);
            }}
          />
        )}
        {order != "1" && (
          <PiPencil
            className="m-auto flex-shrink-0"
            size={64}
            onClick={() => {
              setShownPromoBannerModal(order);
            }}
          />
        )}
        <div
          className={`fixed inset-0 z-50 m-12 flex items-center justify-center bg-white ${shownPromoBannerModal == order ? "" : "hidden"}`}
        >
          <button
            onClick={() => {
              setShownPromoBannerModal(null);
            }}
            type="button"
            className="absolute left-4 top-4"
          >
            <X color="red" size={64} />
          </button>
          <div className="flex flex-wrap items-center justify-center gap-12 p-4">
            <div className="flex h-[50vh] w-[420px] flex-col gap-2 overflow-y-auto">
              {banners
                .filter((banner) => {
                  if (typeof homePage.layout[order].content == "number") {
                    return homePage.layout[order].content != banner.id;
                  } else {
                    return !homePage.layout[order].content.includes(banner.id);
                  }
                })
                .map((banner) => (
                  <button
                    type="button"
                    key={banner.id}
                    onClick={() => {
                      if (order == "1") {
                        onEdit({
                          ...homePage,
                          layout: {
                            ...homePage.layout,
                            [order]: {
                              ...homePage.layout[order],
                              content: [
                                ...homePage.layout[order].content,
                                banner.id,
                              ],
                            },
                          },
                        });
                      } else {
                        onEdit({
                          ...homePage,
                          layout: {
                            ...homePage.layout,
                            [order]: {
                              ...homePage.layout[order],
                              content: banner.id,
                            },
                          },
                        });
                      }
                      setShownPromoBannerModal(null);
                    }}
                  >
                    <PromoBanner disabled banner={banner} homePage={homePage} />
                  </button>
                ))}
            </div>
            {["en", "nl", "fr", "de"].map((lang) => (
              <div className="flex flex-col gap-2" key={lang}>
                <InputOutlined
                  label={t("image") + " " + lang}
                  type="file"
                  name="image"
                  onChange={async (e) => {
                    if (!e.target.files.item(0)) {
                      return;
                    } else {
                      uploadFileToAPI({
                        file: e.target.files.item(0),
                      }).then((res) => {
                        let tBanner = { ...newBanner };
                        tBanner.images.find((img) => img.locale == lang).image =
                          res;
                        newBanner = tBanner;
                      });
                    }
                  }}
                />
                {newBanner.images.find((img) => img.locale == lang).image
                  ?.url && (
                  <ImageWithURL
                    width={350}
                    height={350}
                    style={{ objectFit: "contain" }}
                    src={
                      newBanner.images.find((img) => img.locale == lang).image
                        .url
                    }
                    alt={newBanner.localized_title[lang]}
                  />
                )}
                <InputOutlined
                  key={`title-${lang}`}
                  label={t("title") + " " + lang}
                  type="text"
                  name="title"
                  onChange={(e) => {
                    let tBanner = { ...newBanner };
                    tBanner.localized_title[lang] = e.target.value;
                    tBanner.images.find((img) => img.locale == lang).name =
                      e.target.value;
                    newBanner = tBanner;
                  }}
                />
                <TextareaOutlined
                  label={t("description") + " " + lang}
                  type="text"
                  name="description"
                  onChange={(e) => {
                    let tBanner = { ...newBanner };
                    tBanner.localized_description[lang] = e.target.value;
                    tBanner.images.find(
                      (img) => img.locale == lang,
                    ).description = e.target.value;
                    newBanner = tBanner;
                  }}
                />
                <InputOutlined
                  label={t("url") + " " + lang}
                  type="text"
                  name="url"
                  onChange={(e) => {
                    let tBanner = { ...newBanner };
                    tBanner.images.find(
                      (img) => img.locale == lang,
                    ).linked_url = e.target.value;
                    newBanner = tBanner;
                  }}
                />
              </div>
            ))}
          </div>
          <button
            type="button"
            className="absolute bottom-4 right-4"
            onClick={() => {
              if (!newBanner.images.find((img) => img?.image)) {
                alert("Please add an image");
                return;
              }
              if (newBanner.images.find((img) => !img?.image)) {
                const firstImageWithImage = newBanner.images.find(
                  (img) => img.image,
                );

                newBanner.images = newBanner.images.map((img) =>
                  img.image
                    ? img
                    : { ...img, image: firstImageWithImage.image },
                );
              }
              if (newBanner.images.find((img) => !img.name)) {
                newBanner.images.forEach((img) => {
                  if (!img.name) {
                    img.name =
                      newBanner.images.find((img) => img.name)?.name ?? "";
                  }
                });
              }
              if (newBanner.images.find((img) => !img.alt)) {
                newBanner.images.forEach((img) => {
                  if (!img.alt) {
                    img.alt =
                      newBanner.images.find((img) => img.alt)?.alt ?? "";
                  }
                });
              }
              if (newBanner.images.find((img) => !img.description)) {
                newBanner.images.forEach((img) => {
                  if (!img.description) {
                    img.description =
                      newBanner.images.find((img) => img.description)
                        ?.description ?? "";
                  }
                });
              }

              const fillEmptyFields = (field) => {
                let firstFilledValue = null;
                for (const locale in field) {
                  if (field[locale]) {
                    firstFilledValue = field[locale];
                    break;
                  }
                }

                if (firstFilledValue) {
                  for (const locale in field) {
                    if (!field[locale]) {
                      field[locale] = firstFilledValue;
                    }
                  }
                }
              };

              fillEmptyFields(newBanner.localized_title);

              fillEmptyFields(newBanner.localized_description);

              delete newBanner.id;
              fetch(`/api/universal/admin/posttoapi?collectiontopost=banners`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(newBanner),
              }).then((res) => {
                window.location.reload();
              });
            }}
          >
            <Check color="green" size={64} />
          </button>
        </div>
      </>
    );
  };

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.keyCode === 37 || e.keyCode === 39) {
        if (debounceTimer) {
          clearTimeout(debounceTimer);
        }

        debounceTimer = setTimeout(() => {
          const slider = document.getElementById("slider-1");
          const collection1 = document.getElementById("col-1");
          const collection2 = document.getElementById("col-2");

          const screenMiddle = window.innerHeight / 2;
          const sliderDistance = Math.abs(
            slider.getBoundingClientRect().top +
              slider.clientHeight / 2 -
              screenMiddle,
          );
          const collection1Distance = Math.abs(
            collection1.getBoundingClientRect().top +
              collection1.clientHeight / 2 -
              screenMiddle,
          );
          const collection2Distance = Math.abs(
            collection2.getBoundingClientRect().top +
              collection2.clientHeight / 2 -
              screenMiddle,
          );

          const closestDistance = Math.min(
            sliderDistance,
            collection1Distance,
            collection2Distance,
          );

          let elementToScroll;
          if (closestDistance === sliderDistance) {
            elementToScroll = slider;
          } else if (closestDistance === collection1Distance) {
            elementToScroll = collection1;
          } else {
            elementToScroll = collection2;
          }

          if (e.keyCode === 37) {
            elementToScroll.scrollBy({
              left: -50,
              behavior: "smooth",
            });
          } else if (e.keyCode === 39) {
            elementToScroll.scrollBy({
              left: 50,
              behavior: "smooth",
            });
          }
        }, 100);
      }
    }
    document.addEventListener("keydown", handleKeyDown);

    return function cleanup() {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const emptyBanner = {
    id: "new",
    localized_title: {
      en: "",
      nl: "",
      fr: "",
      de: "",
    },
    localized_description: {
      en: "",
      nl: "",
      fr: "",
      de: "",
    },
    images: [
      {
        locale: "en",
        linked_url: "",
        name: "",
        description: "",
        image: null,
      },
      {
        locale: "nl",
        linked_url: "",
        name: "",
        description: "",
        image: null,
      },
      {
        locale: "fr",
        linked_url: "",
        name: "",
        description: "",
        image: null,
      },
      {
        locale: "de",
        linked_url: "",
        name: "",
        description: "",
        image: null,
      },
    ],
  };

  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  let newBanner = JSON.parse(JSON.stringify(emptyBanner));

  const content = (
    <>
      <Head>
        <Meta />
        <title>Horeca Depot</title>
        <meta name="description" content={t("main_description")} />
        <meta name="language" content={lang} />
      </Head>
      <div
        className={`mx-auto flex w-full flex-col items-center justify-center gap-8 overflow-hidden py-8`}
      >
        <div className="flex w-full flex-col items-center">
          <div
            id="slider-1"
            className={`no-scrollbar flex w-full snap-x snap-mandatory flex-row overflow-x-scroll`}
          >
            <DndContext
              sensors={[
                useSensor(PointerSensor, {
                  activationConstraint: { distance: 10 },
                }),
              ]}
              autoScroll={{ enabled: false }}
              collisionDetection={closestCenter}
              onDragEnd={(e) => {
                const { active, over } = e;

                let items = homePage.layout["1"].content;

                const activeIndex = items.indexOf(active.id);
                const overIndex = items.indexOf(over.id);

                if (activeIndex === overIndex) {
                  return;
                }

                items = arrayMove(items, activeIndex, overIndex);

                if (active.id !== over.id) {
                  onEdit({
                    ...homePage,
                    layout: {
                      ...homePage.layout,
                      "1": {
                        ...homePage.layout["1"],
                        content: items,
                      },
                    },
                  });
                }
              }}
            >
              <SortableContext
                disabled={!onEdit}
                strategy={horizontalListSortingStrategy}
                items={homePage.layout["1"].content}
              >
                {homePage.layout["1"].content.map((banner) => (
                  <PromoBanner
                    key={banner.id}
                    onEdit={onEdit}
                    homePage={homePage}
                    banner={banners.find((b) => b.id == banner)}
                  />
                ))}
              </SortableContext>
            </DndContext>
            {onEdit && (
              <>
                <BannerModal order={"1"} />
              </>
            )}
          </div>
          <div className="ml-4 mt-2 flex w-[90vw] max-w-screen-2xl flex-row justify-start gap-2 2xl:hidden">
            <ChevronLeft
              onClick={() => handleScrollSlider("left")}
              className="h-8 w-8"
            />
            <ChevronLeft
              onClick={() => handleScrollSlider("right")}
              className="h-8 w-8 rotate-180"
            />
          </div>
        </div>

        <div className="grid w-full grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <CategoryBanner
              key={category.id}
              category={category}
              onRemoveCategory={
                onEdit
                  ? () =>
                      onEdit({
                        ...homePage,
                        layout: {
                          ...homePage.layout,
                          "2": {
                            ...homePage.layout["2"],
                            content: homePage.layout["2"].content.filter(
                              (cat) => cat !== category.id,
                            ),
                          },
                        },
                      })
                  : undefined
              }
            />
          ))}
          {onEdit && (
            <>
              <PlusSquare
                className="m-auto"
                size={64}
                onClick={() => {
                  setShowAddCategoryModal(true);
                }}
              />
              <div
                className={`fixed inset-0 z-50 m-12 flex items-center justify-center bg-white bg-opacity-80 backdrop-blur-sm ${showAddCategoryModal ? "" : "hidden"}`}
              >
                <button
                  onClick={() => setShowAddCategoryModal(false)}
                  type="button"
                  className="absolute left-4 top-4"
                >
                  <X color="red" size={64} />
                </button>
                <div className="flex flex-wrap items-center justify-center gap-12 p-4">
                  {allCategories
                    .filter((cat) => !categories.find((c) => c.id == cat.id))
                    .map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        className="h-36 w-36"
                        onClick={() => {
                          onEdit({
                            ...homePage,
                            layout: {
                              ...homePage.layout,
                              "2": {
                                ...homePage.layout["2"],
                                content: [
                                  ...homePage.layout["2"].content,
                                  category.id,
                                ],
                              },
                            },
                          });
                          setShowAddCategoryModal(false);
                        }}
                      >
                        <CategoryBanner disabled category={category} />
                      </button>
                    ))}
                </div>
              </div>
            </>
          )}
        </div>

        {onEdit && (
          <>
            <BannerModal order={"3"} />
          </>
        )}
        {banners.find(
          (banner) => banner.id == homePage.layout["3"].content,
        ) && (
          <Link
            href={
              banners
                .find((banner) => banner.id == homePage.layout["3"].content)
                .images.find((img) => img.locale == lang).linked_url
            }
            className="relative aspect-[21/9] w-full overflow-hidden rounded-xl md:aspect-[205/7] lg:aspect-[205/78]"
          >
            <ImageWithURL
              src={
                banners
                  .find((banner) => banner.id == homePage.layout["3"].content)
                  .images.find((img) => img.locale == lang).image.url
              }
              alt={
                banners.find(
                  (banner) => banner.id == homePage.layout["3"].content,
                ).localized_title[lang]
              }
              sizes="90vw, (max-width: 1536px) 1536px"
              fill
              style={{ objectFit: "cover" }}
            />
          </Link>
        )}

        <div className="flex w-full flex-col items-center">
          {collections && (
            <div key={"collection1"} className="w-full">
              <CollectionShowcase collection={collections.at(0)} id="col-1" />
            </div>
          )}
        </div>

        {onEdit && (
          <>
            <BannerModal order={"4"} />
          </>
        )}
        {banners.find(
          (banner) => banner.id == homePage.layout["4"].content,
        ) && (
          <Link
            href={
              banners
                .find((banner) => banner.id == homePage.layout["4"].content)
                .images.find((img) => img.locale == lang).linked_url
            }
            className="relative aspect-[21/9] w-full overflow-hidden rounded-xl md:aspect-[205/7] lg:aspect-[205/78]"
          >
            <ImageWithURL
              src={
                banners
                  .find((banner) => banner.id == homePage.layout["4"].content)
                  .images.find((img) => img.locale == lang).image.url
              }
              alt={
                banners.find(
                  (banner) => banner.id == homePage.layout["4"].content,
                ).localized_title[lang]
              }
              sizes="90vw, (max-width: 1536px) 1536px"
              fill
              style={{ objectFit: "cover" }}
            />
          </Link>
        )}

        <div className="flex w-full flex-col items-center">
          {collections.length > 1 && (
            <div key={"collection2"} className="w-full">
              <CollectionShowcase collection={collections.at(1)} id="col-2" />
            </div>
          )}
        </div>

        {onEdit && (
          <>
            <BannerModal order={"5"} />
          </>
        )}
        {banners.find(
          (banner) => banner.id == homePage.layout["5"].content,
        ) && (
          <Link
            href={
              banners
                .find((banner) => banner.id == homePage.layout["5"].content)
                .images.find((img) => img.locale == lang).linked_url
            }
            className="relative aspect-[21/9] w-full overflow-hidden rounded-xl md:aspect-[205/7] lg:aspect-[205/78]"
          >
            <ImageWithURL
              src={
                banners
                  .find((banner) => banner.id == homePage.layout["5"].content)
                  .images.find((img) => img.locale == lang).image.url
              }
              alt={
                banners.find(
                  (banner) => banner.id == homePage.layout["5"].content,
                ).localized_title[lang]
              }
              sizes="90vw, (max-width: 1536px) 1536px"
              fill
              style={{ objectFit: "cover" }}
            />
          </Link>
        )}
      </div>
    </>
  );
  return onEdit ? content : <Layout>{content}</Layout>;
}

export const getStaticProps = async () => {
  const homePage = await getHomePage();

  const allCategories = await getAllCategoriesFlattened();
  const categories = allCategories.filter((cat) =>
    homePage.layout["2"].content.includes(cat.id),
  );

  const allCollections = await getCollections({});
  const collections = allCollections.filter((coll) => coll.featured);

  const allBanners = await getBanners({});
  const banners = allBanners;

  return {
    props: {
      homePage,
      categories,
      collections,
      banners,
    },
    revalidate: 1800,
  };
};
