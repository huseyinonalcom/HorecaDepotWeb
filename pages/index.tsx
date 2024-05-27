import CollectionShowcase from "../components/public/collection-showcase";
import { getCollections } from "./api/collections/public/getcollections";
import useTranslation from "next-translate/useTranslation";
import Layout from "../components/public/layout";
import Meta from "../components/public/meta";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { ChevronLeft } from "react-feather";
import { getAllCategoriesFlattened } from "./api/categories/public/getallcategoriesflattened";
import { getWebsite } from "./api/website/public/getwebsite";
import getT from "next-translate/getT";

export default function Index({ mediaGroups, collections }) {
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

  return (
    <Layout>
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
              .image_with_link.map((item) => (
                <Link
                  href={item.linked_url}
                  key={`slider1-${item.order}`}
                  className={`snap-start px-3 2xl:w-1/3`}
                >
                  <div className="border-1 flex h-min flex-shrink-0 flex-col overflow-hidden rounded-xl border border-black/30">
                    <div className="relative z-20 aspect-[320/171] w-[85vw] bg-orange-400 md:w-[42vw] 2xl:w-full">
                      <Image
                        src={
                          "https://hdapi.huseyinonalalpha.com" + item.image.url
                        }
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
                    <Image
                      fill
                      style={{ objectFit: "contain" }}
                      sizes="42vw, (max-width: 640px) 28vw, (max-width: 1024px) 13vw, (nax-width: 1536px) 236px"
                      src={
                        "https://hdapi.huseyinonalalpha.com" +
                        category.image.url
                      }
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
            <Image
              src={
                "https://hdapi.huseyinonalalpha.com" +
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
              <CollectionShowcase collection={collections.at(0)} />
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
            <Image
              src={
                "https://hdapi.huseyinonalalpha.com" +
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
              <CollectionShowcase collection={collections.at(1)} />
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
            <Image
              src={
                "https://hdapi.huseyinonalalpha.com" +
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
    </Layout>
  );
}

export const getStaticProps = async () => {
  let collections = await getCollections();
  const website = await getWebsite();
  let mediaGroups = website.media_groups;

  for (let i = 0; i < mediaGroups.length; i++) {
    if (mediaGroups[i].is_fetched_from_api) {
      if (mediaGroups[i].fetch_from.collection.toLowerCase() == "categories") {
        console.log(mediaGroups[i].fetch_from.ids);
        const allCategoriesRaw = await getAllCategoriesFlattened();
        mediaGroups[i].image_with_link = allCategoriesRaw
          .filter((cat) => mediaGroups[i].fetch_from.ids.includes(cat.id))
          .map((category) => {
            return {
              id: category.id,
              name: category.Name,
              image: category.image,
              linked_url: "/shop/" + category.Name + "?page=1",
            };
          });
      }
      // else if (
      //   mediaGroups[i].fetch_from.collection.toLowerCase() == "collections"
      // ) {
      //   console.log(mediaGroups[i].fetch_from.ids);
      //   const allCategoriesRaw = await getAllCategoriesFlattened();
      //   mediaGroups[i].image_with_link = allCategoriesRaw
      //     .filter((cat) => mediaGroups[i].fetch_from.ids.includes(cat.id))
      //     .map((category) => {
      //       return {
      //         id: category.id,
      //         name: category.Name,
      //         image: category.image,
      //         linked_url: "/shop/" + category.Name + "?page=1",
      //       };
      //     });
      // }
    }
  }

  // const projects = await getProjects();
  return {
    props: {
      mediaGroups,
      collections,
    },
    revalidate: 1800,
  };
};
