import { getAllCategoriesFlattened } from "../api/categories/public/getallcategoriesflattened";
import ProductPreview2 from "../../components/products/product-preview2";
import { getAllCategories } from "../api/categories/getallcategories";
import { getProducts } from "../api/products/public/getproducts";
import componentThemes from "../../components/componentThemes";
import RangeSlider from "../../components/common/rangeSlider";
import useTranslation from "next-translate/useTranslation";
import { ArrowUp, ChevronLeft, X } from "react-feather";
import { Product } from "../../api/interfaces/product";
import Layout from "../../components/public/layout";
import { useState } from "react";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";

export default function Products(props) {
  const { t, lang } = useTranslation("common");

  const currentPage = props.currentPage;
  const totalPages = props.totalPages;
  const allProducts = props.products;
  const minValueFromAPI = props.minValueFromAPI;
  const maxValueFromAPI = props.maxValueFromAPI;
  const allCategories = props.categories;
  const currentCategory = props.currentCategory;
  const currentSort = props.currentSort;
  const currentSortDirection = props.currentSortDirection;

  const getPageNumbers = () => {
    let pages = [];
    let startPage, endPage;

    if (totalPages <= 6) {
      // Less than 6 total pages, show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // More than 6 total pages, calculate start and end pages
      if (Number(currentPage) <= 4) {
        startPage = 1;
        endPage = 5;
      } else if (Number(currentPage) + 2 >= totalPages) {
        startPage = totalPages - 4;
        endPage = totalPages;
      } else {
        startPage = Number(currentPage) - 2;
        endPage = Number(currentPage) + 2;
      }
    }

    // Add first page and ellipsis
    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push("...");
      }
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add last page and ellipsis
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push("...");
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const [sliderMin, setSliderMin] = useState<number | null>(
    props.minValueFromAPI,
  );
  const [sliderMax, setSliderMax] = useState<number | null>(
    props.maxValueFromAPI,
  );

  const handleSliderChange = (minValue: number, maxValue: number) => {
    setSliderMin(minValue);
    setSliderMax(maxValue);
  };

  const [currentSearch, setCurrentSearch] = useState<string>("");
  const CategoryItem = ({ category }) => {
    const [isHovered, setisHovered] = useState(false);
    const hasSubCategories =
      category.subCategories && category.subCategories.length > 0;

    return (
      <div className="relative cursor-pointer">
        <div className="focus:overlay-none flex w-full items-center justify-between text-left hover:bg-gray-200">
          {hasSubCategories ? (
            <>
              <Link
                href={`/${lang}/shop/${encodeURIComponent(t(category.Name))}?page=1`}
                className="h-full whitespace-nowrap px-4 py-2"
              >
                {t(category.Name)}
              </Link>
              <div
                className="w-full py-3 pr-4"
                onClick={() => {
                  setisHovered(!isHovered);
                }}
              >
                <ChevronLeft
                  className={
                    "ml-auto h-4 w-4 duration-300 " +
                    (isHovered ? "rotate-270" : "rotate-90")
                  }
                />
              </div>
            </>
          ) : (
            <Link
              href={`/${lang}/shop/${encodeURIComponent(t(category.Name))}?page=1`}
              className="h-full w-full whitespace-nowrap px-4 py-2"
            >
              {t(category.Name)}
            </Link>
          )}
        </div>
        {hasSubCategories && (
          <div
            className={
              "transition-max-height overflow-hidden pl-4 duration-300 ease-in-out " +
              (isHovered ? "max-h-96" : "max-h-0")
            }
          >
            {category.subCategories.map((subCategory) => (
              <CategoryItem key={subCategory.id} category={subCategory} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const createLink = (props) => {
    let link = "/shop/";
    if (props.currentCategory) {
      link += t(props.currentCategory.Name) + "?";
    } else {
      link += "tous?";
    }
    if (props.page) {
      link += "page=" + props.page;
    }
    if (props.currentSort && props.currentSortDirection) {
      link += "&sort=" + props.currentSort + ":" + props.currentSortDirection;
    }
    if (props.search) {
      link += "&search=" + props.search;
    }
    return link;
  };

  return (
    <>
      <Layout>
        <Head>
          <title>Horeca Depot</title>
          <meta name="description" content={t("main_description")} />
          <meta name="language" content={lang} />
        </Head>
        <div
          id={t("Shop")}
          className="flex w-full flex-col items-start text-black lg:flex-row"
        >
          <div className="relative flex w-full flex-col gap-2 px-1 lg:w-[350px]">
            <div
              className={`fixed bottom-0 z-50 flex w-full flex-col duration-700 lg:hidden ${isFilterDrawerOpen ? "left-0" : "left-[-100%]"}`}
            >
              <div className="flex h-[100dvh] w-full flex-row">
                <div className="flex h-full w-fit flex-col justify-between">
                  <button
                    onClick={() => setIsFilterDrawerOpen(false)}
                    className="flex w-full flex-shrink-0 flex-row justify-end bg-slate-300 px-3 py-2"
                  >
                    <X />
                  </button>
                  <div className="flex h-full w-full flex-col justify-end bg-white ">
                    <div>
                      {currentSearch ? (
                        <div
                          className={`overflow-hidden bg-gray-100 p-4 shadow-lg`}
                        >
                          {currentSearch ? (
                            <div
                              style={{ cursor: "pointer" }}
                              className="mb-1 pr-3"
                              onClick={() => setCurrentSearch("")}
                            >
                              x {currentSearch}
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </div>
                    <p className="mt-4 border-b pb-1 pl-3 text-lg font-semibold">
                      {t("Categories")}
                    </p>
                    <div className="mb-4 flex w-full flex-col border-b bg-white py-2 text-gray-500 duration-300">
                      {allCategories.map((category) => (
                        <CategoryItem key={category.id} category={category} />
                      ))}
                    </div>
                    <p className="mt-4 border-b pb-1 pl-3 text-lg font-semibold">
                      {t("Price")}
                    </p>
                    <div className={`mb-4 overflow-hidden px-4 pt-2`}>
                      <RangeSlider
                        minGap={20}
                        initialMin={sliderMin}
                        initialMax={sliderMax}
                        min={minValueFromAPI}
                        max={maxValueFromAPI}
                        onChange={handleSliderChange}
                        prefix="€"
                        label="Price"
                      />
                    </div>
                    <div className="flex flex-row justify-between">
                      <button
                        className={componentThemes.greenSubmitButton}
                        onClick={() => {
                          setIsFilterDrawerOpen(false);
                        }}
                      >
                        {t("Filter")}
                      </button>
                    </div>
                  </div>
                </div>
                <div
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className={`h-full w-full`}
                ></div>
              </div>
            </div>
            <div className="hidden w-full flex-col duration-700 lg:flex">
              {currentSearch ? (
                <div className="bg-gray-100 p-4">
                  {currentSearch ? (
                    <div
                      style={{ cursor: "pointer" }}
                      className="mb-1 pr-3"
                      onClick={() => setCurrentSearch("")}
                    >
                      x {currentSearch}
                    </div>
                  ) : null}
                </div>
              ) : null}
              <p className="mt-4 border-b pb-1 pl-3 text-lg font-semibold text-black">
                {t("Categories")}
              </p>
              <div className="flex w-full flex-col bg-white py-2 text-gray-700 duration-300">
                {allCategories.map((category) => (
                  <CategoryItem key={category.id} category={category} />
                ))}
              </div>
              <p className="mt-4 border-b pb-1 pl-3 text-lg font-semibold">
                {t("Price")}
              </p>
              <div className={`overflow-hidden px-4 pt-2`}>
                <RangeSlider
                  minGap={20}
                  initialMin={sliderMin}
                  initialMax={sliderMax}
                  min={minValueFromAPI}
                  max={maxValueFromAPI}
                  onChange={handleSliderChange}
                  prefix="€"
                  label="Price"
                />
              </div>
              <div className="flex flex-row justify-between">
                <button
                  className={componentThemes.outlinedButton}
                  onClick={() => {
                    setIsFilterDrawerOpen(false);
                  }}
                >
                  {t("Filter")}
                </button>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col">
            {currentCategory?.subCategories &&
              currentCategory.subCategories.length > 0 && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                  {currentCategory.subCategories.map((category) => (
                    <div key={`grid1-${category.id}`} className={``}>
                      <Link
                        href={`/shop/${t(category.Name)}?page=1`}
                        className="flex flex-col items-center gap-2"
                      >
                        <div className="relative aspect-[15/14] w-full overflow-hidden rounded-xl">
                          <Image
                            fill
                            style={{ objectFit: "contain" }}
                            sizes="42vw, (max-width: 640px) 28vw, (max-width: 1024px) 13vw, (nax-width: 1536px) 236px"
                            src={
                              category.image != null
                                ? "https://hdapi.huseyinonalalpha.com" +
                                  category.image.url
                                : "/assets/img/placeholder.png"
                            }
                            alt={t(category.Name) + " image"}
                          />
                        </div>
                        <p className="font-semibold">{t(category.Name)}</p>
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            <div className="grid grid-cols-1 md:grid-cols-3">
              <p className="hidden md:flex"></p>
              <h2 className="mt-2 flex w-full justify-center text-5xl font-bold">
                {t(currentCategory?.Name ?? "Shop")}
              </h2>
              <div className="my-auto flex h-fit w-full flex-row gap-2 pl-4 pr-4">
                <Link
                  href={createLink({
                    ...props,
                    page: 1,
                    currentSortDirection:
                      currentSortDirection == "asc" ? "desc" : "asc",
                  })}
                >
                  <ArrowUp
                    height={36}
                    width={36}
                    className={`flex cursor-pointer flex-row items-center border-2 border-black bg-white p-1 duration-500 ${currentSortDirection == "asc" ? "rotate-0" : "rotate-180"}`}
                  />
                </Link>
                <Link
                  href={createLink({
                    ...props,
                    page: 1,
                    currentSort: "id",
                  })}
                  className={`flex flex-row items-center border-2 bg-white px-2 py-1 ${currentSort == "id" && "border-black"} cursor-pointer`}
                >
                  {t("Date")}
                </Link>
                <Link
                  href={createLink({
                    ...props,
                    page: 1,
                    currentSort: "value",
                  })}
                  className={`flex flex-row items-center border-2 bg-white px-2 py-1 ${currentSort == "value" && "border-black"} cursor-pointer`}
                >
                  {t("Price")}
                </Link>
                <button
                  onClick={() => {
                    setIsFilterDrawerOpen(!isFilterDrawerOpen);
                  }}
                  className="border-2 px-2 py-1 font-semibold lg:hidden"
                >
                  {t("Filters")}
                </button>
              </div>
            </div>
            {allProducts.length <= 0 ? (
              <h3 className="flex w-full justify-center text-xl font-bold text-red-700">
                {t("No products matching")}
              </h3>
            ) : (
              <div className="grid w-full grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {allProducts.map((product) => (
                  <div key={product.id} className="mb-2 mt-2 w-full px-4">
                    <ProductPreview2 product={product} />
                  </div>
                ))}
              </div>
            )}
            {allProducts.length > 0 && (
              <div className="mb-4 flex flex-row justify-center px-6">
                <div className="mt-2">
                  <div className="flex items-center justify-center space-x-1">
                    <Link
                      href={
                        currentPage == 1
                          ? "#"
                          : createLink({
                              ...props,
                              page: Number(currentPage) - 1,
                            })
                      }
                      className="border p-2 hover:bg-gray-200"
                      aria-label="Previous page"
                    >
                      <ChevronLeft />
                    </Link>
                    {getPageNumbers().map((page, index) =>
                      page === "..." ? (
                        <span key={index} className="p-2">
                          ...
                        </span>
                      ) : (
                        <Link
                          key={index}
                          className={`border p-2 hover:bg-gray-200 ${currentPage == page && "bg-gray-300"}`}
                          href={createLink({ ...props, page })}
                        >
                          {page}
                        </Link>
                      ),
                    )}
                    <Link
                      href={
                        currentPage == totalPages
                          ? "#"
                          : createLink({
                              ...props,
                              page: Number(currentPage) + 1,
                            })
                      }
                      className="border p-2 hover:bg-gray-200"
                      aria-label="Next page"
                    >
                      <ChevronLeft className="rotate-180" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}

export async function getServerSideProps(context) {
  const productsReq = await getProducts({
    query: context.query,
  });

  const products = (productsReq?.sortedData as Product[]) ?? [];
  const totalPages = (productsReq?.totalPages as number) ?? [];
  const minValueFromAPI = productsReq?.minValueFromAPI as number ?? 0;
  const maxValueFromAPI = productsReq?.maxValueFromAPI as number ?? 0;

  const categories = await getAllCategories();
  const categoriesFlat = await getAllCategoriesFlattened();

  const currentCategory = categoriesFlat.find(
    (cat) => cat.id == productsReq?.currentCategoryID ?? 0
  ) ?? null;
  const currentSort = context.query?.sort?.split(":").at(0) ?? "id";
  const currentSortDirection = context.query?.sort?.split(":").at(1) ?? "desc";

  const currentPage = context.query.page ?? 1;

  return {
    props: {
      products,
      totalPages,
      currentPage,
      minValueFromAPI,
      maxValueFromAPI,
      categories,
      currentCategory,
      currentSort,
      currentSortDirection,
    },
  };
}
