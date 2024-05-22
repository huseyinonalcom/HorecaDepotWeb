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

export default function Index({ mediaGroups }) {
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

  const images = [
    {
      id: 1,
      url: "/assets/homepage/1.jpg",
      link: `/products?page=1&category=${encodeURIComponent("Chaises Extérieur")}`,
      alt: "Terrace Chair",
      title: "Terrace",
      text: "New terrace collection",
    },
    {
      id: 2,
      url: "/assets/homepage/2.jpg",
      link: `/products?page=1&category=${encodeURIComponent("Tables")}`,
      alt: "Terrace Table",
      title: "Terrace",
      text: "New terrace collection",
    },
    {
      id: 3,
      url: "/assets/homepage/3.jpg",
      link: `/products?page=1&category=${encodeURIComponent("Banquettes")}`,
      alt: "Banquette",
      title: "Banquette",
      text: "Banquette Promos",
    },
  ];

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
                        alt={item.name}
                        sizes="90vw, md:42vw, 2xl:30vw"
                        fill
                        priority
                        className="z-20"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className="flex h-[150px] w-full flex-col gap-2 p-4">
                      <p className="text-xl font-semibold">{item.name}</p>
                      <p>{item.description}</p>
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

        {/* <div className="grid w-full grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {allCategories.length > 0 &&
            allCategories?.map((category) => (
              <div key={`grid1-${category.id}`} className={``}>
                <Link
                  href={
                    "/products?page=1&category=" +
                    encodeURIComponent(category.Name)
                  }
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
                      alt={category.Name + " image"}
                    />
                  </div>
                  <p className="font-semibold">{t(category.Name)}</p>
                </Link>
              </div>
            ))}
        </div> */}

        <Link
          href={`/products?page=1&category=${encodeURIComponent("Chaises Extérieur")}`}
          className="relative aspect-[21/9] w-full overflow-hidden rounded-xl md:aspect-[205/7] lg:aspect-[205/78]"
        >
          <Image
            src={
              "https://hdapi.huseyinonalalpha.com/uploads/banner_5083e5ad1d.jpg"
            }
            alt="terrace promo"
            sizes="90vw, (max-width: 1536px) 1536px"
            fill
            style={{ objectFit: "cover" }}
          />
        </Link>

        {/* <div className="flex w-full flex-col items-center">
          {collections && (
            <div key={"collection1"} className="w-full">
              <CollectionShowcase collection={collections.at(0)} />
            </div>
          )}
        </div> */}
        {/* 
        <div className="grid w-[90vw] max-w-screen-2xl grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={`grid2-${item}`} className={``}>
              <div className="flex flex-col items-center gap-2">
                <div className="aspect-[15/14] w-full overflow-hidden rounded-xl bg-orange-400"></div>
                <p className="font-semibold">Başlık</p>
              </div>
            </div>
          ))}
        </div> */}

        <Link
          href={"/products?page=1"}
          className="relative aspect-[17/9] w-full overflow-hidden rounded-xl md:aspect-[32/9] lg:aspect-[32/9]"
        >
          <Image
            src={
              "https://hdapi.huseyinonalalpha.com/uploads/web_2_b54f79691c.jpg"
            }
            alt="best furniture design"
            sizes="90vw, (max-width: 1536px) 1536px"
            fill
            style={{ objectFit: "cover" }}
          />
        </Link>

        {/* <div className="flex w-full flex-col items-center">
          {collections.length > 1 && (
            <div key={"collection2"} className="w-full">
              <CollectionShowcase collection={collections.at(1)} />
            </div>
          )}
        </div> */}

        <Link
          href={"/products?page=1"}
          className="relative aspect-[18/9] w-full overflow-hidden rounded-xl md:aspect-[16/7] lg:aspect-[19/5]"
        >
          <Image
            src={
              "https://hdapi.huseyinonalalpha.com/uploads/cargo_9093a8c9b5.jpg"
            }
            alt="speedy delivery"
            sizes="90vw, (max-width: 1536px) 1536px"
            fill
            style={{ objectFit: "cover" }}
          />
        </Link>

        {/* <div className="grid w-[90vw] max-w-screen-2xl grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={`grid3-${item}`} className={``}>
              <div className="flex flex-col items-center gap-2">
                <div className="aspect-[15/14] w-full overflow-hidden rounded-xl bg-orange-400"></div>
                <p className="font-semibold">Başlık</p>
              </div>
            </div>
          ))}
        </div> */}

        {/* <div className="flex w-[90vw] max-w-screen-2xl flex-col items-center">
          {collections && (
            <div key={"collection1"} className="w-full">
              <CollectionShowcase collection={collections.at(0)} />
            </div>
          )}
        </div> */}
        {/* 
        <div className="flex w-[90vw] max-w-screen-2xl flex-col items-center">
          {collections.length > 1 && (
            <div key={"collection3"} className="w-full">
              <CollectionShowcase collection={collections.at(0)} />
            </div>
          )}
        </div> */}
      </div>
    </Layout>
  );
}

export const getStaticProps = async ({ locale }) => {
  const t = await getT(locale, "common");
  let collections = await getCollections();
  const allCategoriesRaw = await getAllCategoriesFlattened();
  const website = await getWebsite();
  let mediaGroups = [];

  for (let i = 0; i < website.media_groups.length; i++) {
    if (!website.media_groups[i].is_fetched_from_api) {
      console.log(website.media_groups[i].image_with_link[0].linked_url);
      for (let j = 0; j < website.media_groups[i].image_with_link.length; j++) {
        console.log(website.media_groups[i].image_with_link[j].linked_url);
        const evaluated = new Function(
          "t",
          "encodeURIComponent",
          `return ${website.media_groups[i].image_with_link[j].linked_url}`,
        )(t, encodeURIComponent);
        console.log(evaluated);
        website.media_groups[i].image_with_link[j].linked_url = evaluated;
      }
      mediaGroups.push({
        key: i,
        order: website.media_groups[i].order,
        image_with_link: website.media_groups[i].image_with_link,
      });
      continue;
    } else {
      console.log(!website.media_groups[i].fetch_from);
    }
    mediaGroups.push(website.media_groups.find((mg) => mg.order == i));
  }

  let allCategories = [];
  allCategories.push(allCategoriesRaw.find((cat) => cat.id === 3));
  allCategories.push(allCategoriesRaw.find((cat) => cat.id === 2));
  allCategories.push(allCategoriesRaw.find((cat) => cat.id === 6));
  allCategories.push(allCategoriesRaw.find((cat) => cat.id === 10));
  allCategories.push(allCategoriesRaw.find((cat) => cat.id === 11));
  allCategories.push(allCategoriesRaw.find((cat) => cat.id === 17));
  // const projects = await getProjects();
  return {
    props: {
      mediaGroups,
    },
    revalidate: 1800,
  };
};
