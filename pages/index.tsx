import CollectionShowcase from "../components/public/collection-showcase";
import { getCollections } from "./api/collections/public/getcollections";
import useTranslation from "next-translate/useTranslation";
import Layout from "../components/public/layout";
import Meta from "../components/public/meta";
import Head from "next/head";
import Link from "next/link";
import { ChevronLeft } from "react-feather";
import { getAllCategoriesFlattened } from "./api/categories/public/getallcategoriesflattened";
import { getWebsite } from "./api/website/public/getwebsite";
import getT from "next-translate/getT";
import { useEffect } from "react";
import ImageWithURL from "../components/common/image";

export default function Index({
  mediaGroups,
  collections,
  developmentMode,
}: {
  mediaGroups: any;
  collections: any;
  developmentMode?: boolean;
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
            {mediaGroups
              .find((mg) => mg.order == 1)
              .image_with_link.map((item, index) => (
                <Link
                  href={item.linked_url}
                  key={`slider1-${index}`}
                  className={`snap-start px-3 2xl:w-1/3`}
                >
                  <div className="border-1 flex h-min flex-shrink-0 flex-col overflow-hidden rounded-xl border border-black/30">
                    <div className="relative z-20 aspect-[320/171] w-[85vw] bg-orange-400 md:w-[42vw] 2xl:w-full">
                      <ImageWithURL
                        src={item.image.url}
                        alt={t(item.name)}
                        sizes="90vw, md:42vw, 2xl:30vw"
                        fill
                        priority
                        className="z-20"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className="flex h-[150px] w-full flex-col gap-2 p-4">
                      <p className="text-xl font-semibold">{t(item.name)}</p>
                      <p>{t(item.description)}</p>
                    </div>
                  </div>
                </Link>
              ))}
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
          {mediaGroups
            .find((mg) => mg.order == 2)
            .image_with_link.map((category) => (
              <div key={`grid1-${category.id}`} className={``}>
                <Link
                  href={category.linked_url}
                  className="flex flex-col items-center gap-2"
                >
                  <div className="relative aspect-[15/14] w-full overflow-hidden rounded-xl">
                    <ImageWithURL
                      fill
                      style={{ objectFit: "contain" }}
                      sizes="42vw, (max-width: 640px) 28vw, (max-width: 1024px) 13vw, (nax-width: 1536px) 236px"
                      src={category.image.url}
                      alt={category.name + " image"}
                    />
                  </div>
                  <p className="font-semibold">{t(category.name)}</p>
                </Link>
              </div>
            ))}
        </div>
        {mediaGroups.find((mg) => mg.order == 3) && (
          <Link
            href={
              mediaGroups.find((mg) => mg.order == 3).image_with_link[0]
                .linked_url
            }
            className="relative aspect-[21/9] w-full overflow-hidden rounded-xl md:aspect-[205/7] lg:aspect-[205/78]"
          >
            <ImageWithURL
              src={
                mediaGroups.find((mg) => mg.order == 3).image_with_link[0].image
                  .url
              }
              alt={
                mediaGroups.find((mg) => mg.order == 3).image_with_link[0].name
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
        {mediaGroups.find((mg) => mg.order == 4) && (
          <Link
            href={
              mediaGroups.find((mg) => mg.order == 4).image_with_link[0]
                .linked_url
            }
            className="relative aspect-[17/9] w-full overflow-hidden rounded-xl md:aspect-[32/9] lg:aspect-[32/9]"
          >
            <ImageWithURL
              src={
                mediaGroups.find((mg) => mg.order == 4).image_with_link[0].image
                  .url
              }
              alt={
                mediaGroups.find((mg) => mg.order == 4).image_with_link[0].name
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

        {mediaGroups.find((mg) => mg.order == 5) && (
          <Link
            href={
              mediaGroups.find((mg) => mg.order == 5).image_with_link[0]
                .linked_url
            }
            className="relative aspect-[18/9] w-full overflow-hidden rounded-xl md:aspect-[16/7] lg:aspect-[19/5]"
          >
            <ImageWithURL
              src={
                mediaGroups.find((mg) => mg.order == 5).image_with_link[0].image
                  .url
              }
              alt={
                mediaGroups.find((mg) => mg.order == 5).image_with_link[0].name
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
  return developmentMode ? content : <Layout>{content}</Layout>;
}

export const getStaticProps = async ({ locale }) => {
  const t = await getT(locale, "common");
  let collections = await getCollections();
  const website = await getWebsite();
  let mediaGroups = website.media_groups;

  for (let i = 0; i < collections.length; i++) {
    collections[i].products = collections[i].products.filter((p) => p.active);
  }

  for (let i = 0; i < mediaGroups.length; i++) {
    if (mediaGroups[i].is_fetched_from_api) {
      if (mediaGroups[i].fetch_from.collection.toLowerCase() == "categories") {
        const allCategoriesRaw = await getAllCategoriesFlattened();
        mediaGroups[i].image_with_link = allCategoriesRaw
          .filter((cat) => mediaGroups[i].fetch_from.ids.includes(cat.id))
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
      mediaGroups[i].image_with_link = mediaGroups[i].image_with_link.map(
        (item) => {
          const url = item.linked_url;
          const category = url.split("/").pop();
          const translatedCategory = t(
            decodeURIComponent(category.split("?")[0]),
          );
          return {
            ...item,
            linked_url: `/shop/${translatedCategory}?page=1`,
          };
        },
      );
    }
  }

  return {
    props: {
      mediaGroups,
      collections,
    },
    revalidate: 1800,
  };
};
