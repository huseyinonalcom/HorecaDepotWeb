import { getAllCategoriesFlattened } from "./api/categories/public/getallcategoriesflattened";
import CollectionShowcase from "../components/public/collection-showcase";
import { getCollections } from "./api/collections/public/getcollections";
import { CategoryBanner } from "../components/banners/CategoryBanner";
import { getWebsite } from "./api/website/public/getwebsite";
import useTranslation from "next-translate/useTranslation";
import ImageWithURL from "../components/common/image";
import { Category } from "../api/interfaces/category";
import Layout from "../components/public/layout";
import Meta from "../components/public/meta";
import { ChevronLeft, PlusSquare } from "react-feather";
import getT from "next-translate/getT";
import { useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { getHomePage } from "./api/website/public/gethomepage";
import { PromoBanner } from "../components/banners/PromoBanner";
import { getBanners } from "./api/website/public/getbanners";

export default function Index({
  homePage,
  collections,
  categories,
  banners,
  developmentMode,
  onRemoveCategory,
  onClickAddCategory,
}: {
  homePage;
  collections;
  categories: Category[];
  banners;
  developmentMode?: boolean;
  onRemoveCategory?: (category: Category) => void;
  onClickAddCategory?: () => void;
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
            {banners
              .filter((banner) =>
                homePage.layout["1"].content.includes(banner.id),
              )
              .map((banner) => (
                <PromoBanner banner={banner} />
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
          {categories.map((category) => (
            <CategoryBanner
              category={category}
              onRemoveCategory={onRemoveCategory}
            />
          ))}
          {developmentMode && onClickAddCategory && (
            <PlusSquare
              className="m-auto"
              size={64}
              onClick={() => {
                onClickAddCategory();
              }}
            />
          )}
        </div>
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
  return developmentMode ? content : <Layout>{content}</Layout>;
}

export const getStaticProps = async () => {
  const homePage = await getHomePage();

  const allCategories = await getAllCategoriesFlattened();
  const categories = allCategories.filter((cat) =>
    homePage.layout["2"].content.includes(cat.id),
  );

  const allCollections = await getCollections();
  const collections = allCollections.filter((coll) => coll.featured);

  const allBanners = await getBanners();
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
