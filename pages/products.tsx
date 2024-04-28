import Layout from "../components/public/layout";
import Head from "next/head";
import { useContext, useEffect, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import ProductPreview from "../components/products/product-preview";
import { ArrowUp, ChevronLeft, X } from "react-feather";
import { Product } from "../api/interfaces/product";
import { CategoryContext } from "../api/providers/categoryProvider";
import RangeSlider from "../components/common/rangeSlider";
import { useRouter } from "next/router";
import componentThemes from "../components/componentThemes";

// on currentPage change => scroll to top

export default function Products() {
  const { t, lang } = useTranslation("common");
  const router = useRouter();

  const [pageInitialized, setPageInitialized] = useState<boolean>(false);
  const [fetchQueued, setFetchQueued] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  const getPageNumbers = () => {
    let pages = [];
    let startPage, endPage;

    if (totalPages <= 6) {
      // Less than 6 total pages, show all
      startPage = 1;
      endPage = totalPages;
    } else {
      // More than 6 total pages, calculate start and end pages
      if (currentPage <= 4) {
        startPage = 1;
        endPage = 5;
      } else if (currentPage + 2 >= totalPages) {
        startPage = totalPages - 4;
        endPage = totalPages;
      } else {
        startPage = currentPage - 2;
        endPage = currentPage + 2;
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

  const [minValueFromAPI, setMinValueFromAPI] = useState<number | null>(null);
  const [sliderMin, setSliderMin] = useState<number | null>(null);
  const [maxValueFromAPI, setMaxValueFromAPI] = useState<number | null>(null);
  const [sliderMax, setSliderMax] = useState<number | null>(null);

  const handleSliderChange = (minValue: number, maxValue: number) => {
    setSliderMin(minValue);
    setSliderMax(maxValue);
  };

  const { categories } = useContext(CategoryContext);
  const [allCategories, setCategories] = useState([]);
  const [allCategoriesFlat, setCategoriesFlat] = useState([]);
  const [currentCategory, setCurrentCategory] = useState<number | null>(null);
  const [currentSearch, setCurrentSearch] = useState<string>("");
  const [tempSearch, setTempSearch] = useState<string>("");
  const [currentSort, setCurrentSort] = useState<string | null>("id");
  const [currentSortDirection, setCurrentSortDirection] =
    useState<boolean>(false);

  useEffect(() => {
    if (allCategories.length === 0 && categories.length > 0) {
      setCategories(categories);
    }
  }, [categories]);

  useEffect(() => {
    if (pageInitialized) {
      setSliderMin(null);
      setSliderMax(null);
      setCurrentPage(1);
      setFetchQueued(true);
    }
    if (currentSearch == "") {
      setTempSearch("");
    }
  }, [currentSearch, currentCategory]);

  useEffect(() => {
    if (pageInitialized) {
      setFetchQueued(true);
    }
  }, [currentPage]);

  useEffect(() => {
    if (pageInitialized) {
      setCurrentPage(1);
      setFetchQueued(true);
    }
  }, [currentSort, currentSortDirection]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setTempSearch(value);
    if (value == "") {
      setCurrentSearch(null);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentSearch(tempSearch);
  };

  useEffect(() => {
    if (fetchQueued) {
      fetchProductsFiltered().then(() => setFetchQueued(false));
    }
  }, [fetchQueued]);

  const [allProducts, setAllProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (router.isReady) {
      initPage();
    }
  }, [router.isReady, router.query.search]);

  const initPage = async () => {
    var fetchUrl: string = `/api/products/public/getproducts?page=${router.query.page ? router.query.page : "1"}${
      router.query.category ? `&category=${router.query.category}` : ``
    }${router.query.search ? `&search=${router.query.search}` : ``}`;
    // router.push(
    //   {
    //     pathname: "/products",
    //     query: {
    //       page: router.query.page ?? 1,
    //       category: "",
    //       search: router.query.search ?? "",
    //     },
    //   },
    //   undefined,
    //   { shallow: true },
    // );
    const request = await fetch(fetchUrl);
    const result = await request.json();
    router.query.search && setCurrentSearch(router.query.search as string);
    if (!router.query.search) {
      setCurrentSearch("");
    }
    router.query.category && setCurrentCategory(Number(router.query.category));
    setAllProducts(result.sortedData as Product[]);
    setTotalPages(result.totalPages as number);
    setMinValueFromAPI(result.minValueFromAPI as number);
    setMaxValueFromAPI(result.maxValueFromAPI as number);
    setSliderMin(result.minValueFromAPI as number);
    setSliderMax(result.maxValueFromAPI as number);
    const allCategoriesReq = await fetch(
      "/api/categories/public/getallcategoriesflattened",
    );
    setCategoriesFlat(await allCategoriesReq.json());
    setPageInitialized(true);
  };

  const fetchProductsFiltered = async () => {
    const pageParam = currentPage ?? 1;
    var searchParam = currentSearch ?? null;

    if (currentSearch == "") {
      searchParam = null;
    }

    var fetchUrl: string = `/api/products/public/getproducts?page=${pageParam}${currentCategory ? `&category=${currentCategory}` : ``}${
      sliderMin ? `&minprice=${sliderMin}` : ``
    }${sliderMax ? `&maxprice=${sliderMax}` : ``}${searchParam ? `&search=${searchParam}` : ``}${
      currentSort
        ? `&sort=${currentSort}${currentSortDirection ? ":asc" : ":desc"}`
        : ``
    }`;

    const request = await fetch(fetchUrl);
    const result = await request.json();

    setAllProducts(result.sortedData as Product[]);
    setTotalPages(result.totalPages as number);
    setMinValueFromAPI(result.minValueFromAPI as number);
    setMaxValueFromAPI(result.maxValueFromAPI as number);
  };

  const CategoryItem = ({ category }) => {
    const [isHovered, setisHovered] = useState(false);
    const hasSubCategories =
      category.subCategories && category.subCategories.length > 0;

    return (
      <div className="relative cursor-pointer">
        <div className="focus:overlay-none flex w-full items-center justify-between text-left hover:bg-gray-200">
          {hasSubCategories ? (
            <>
              <div
                className="h-full whitespace-nowrap px-4 py-2"
                onClick={() => {
                  setCurrentCategory(category.id);
                }}
              >
                {t(category.Name)}
              </div>
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
            <div
              className="h-full w-full whitespace-nowrap px-4 py-2"
              onClick={() => {
                setCurrentCategory(category.id);
              }}
            >
              {t(category.Name)}
            </div>
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

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  return (
    <>
      <Layout>
        <Head>
          <title>Horeca Depot</title>
          <meta name="description" content={t("main_description")} />
          <meta name="language" content={lang} />
        </Head>
        <div
          id={t("Products")}
          className="flex w-full flex-col items-start text-[#084E97] lg:flex-row"
        >
          <div className="relative flex w-full flex-col gap-2 px-1 lg:w-[500px]">
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
                      {currentCategory || currentSearch ? (
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
                          {currentCategory ? (
                            <div
                              className="mb-1 pr-3"
                              style={{ cursor: "pointer" }}
                              onClick={() => setCurrentCategory(null)}
                            >
                              {allCategoriesFlat.find(
                                (cat) => cat.id == currentCategory,
                              ) != null
                                ? "x " +
                                  t(
                                    allCategoriesFlat.find(
                                      (cat) => cat.id == currentCategory,
                                    ).Name,
                                  )
                                : currentCategory}
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
                          fetchProductsFiltered();
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
              {currentCategory || currentSearch ? (
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
                  {currentCategory ? (
                    <div
                      className="mb-1 pr-3"
                      style={{ cursor: "pointer" }}
                      onClick={() => setCurrentCategory(null)}
                    >
                      {allCategoriesFlat.find(
                        (cat) => cat.id == currentCategory,
                      ) != null
                        ? "x " +
                          t(
                            allCategoriesFlat.find(
                              (cat) => cat.id == currentCategory,
                            ).Name,
                          )
                        : currentCategory}
                    </div>
                  ) : null}
                </div>
              ) : null}
              <p className="mt-4 border-b pb-1 pl-3 text-lg font-semibold">
                {t("Categories")}
              </p>
              <div className="flex w-full flex-col bg-white py-2 text-gray-500 duration-300">
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
                  className={componentThemes.greenSubmitButton}
                  onClick={() => {
                    fetchProductsFiltered();
                    setIsFilterDrawerOpen(false);
                  }}
                >
                  {t("Filter")}
                </button>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col">
            <div className="grid grid-cols-1 md:grid-cols-3">
              <p className="hidden md:flex"></p>
              <h2 className="mt-2 flex w-full justify-center text-5xl font-bold">
                {t("Products")}
              </h2>
              <div className="my-auto flex h-fit w-full flex-row justify-end gap-2 pl-4 pr-4">
                <ArrowUp
                  height={36}
                  width={36}
                  onClick={() => setCurrentSortDirection(!currentSortDirection)}
                  className={`flex cursor-pointer flex-row items-center border-2 border-blue-500 bg-white p-1 duration-500 ${currentSortDirection ? "rotate-0" : "rotate-180"}`}
                />
                <div
                  className={`flex flex-row items-center border-2 bg-white px-2 py-1 ${currentSort == "id" && "border-blue-500"} cursor-pointer`}
                  onClick={() => setCurrentSort("id")}
                >
                  {t("Date")}
                </div>
                <div
                  className={`flex flex-row items-center border-2 bg-white px-2 py-1 ${currentSort == "value" && "border-blue-500"} cursor-pointer`}
                  onClick={() => setCurrentSort("value")}
                >
                  {t("Price")}
                </div>
                <button
                  onClick={() => {
                    setIsFilterDrawerOpen(!isFilterDrawerOpen);
                  }}
                  className="ml-auto bg-orange-400 px-2 py-1 font-semibold lg:hidden"
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
              <div className="grid w-full grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {allProducts.map((product) => (
                  <div key={product.id} className="mb-2 mt-2 w-full px-4">
                    <ProductPreview product={product} width={"full"} />
                  </div>
                ))}
              </div>
            )}
            {allProducts.length > 0 && (
              <div className="mb-4 flex flex-row justify-center px-6">
                <div className="mt-2">
                  <div className="flex items-center justify-center space-x-1">
                    <button
                      className="border p-2  hover:bg-gray-200"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      name="Previous page"
                      aria-label="Previous page"
                    >
                      <ChevronLeft />
                    </button>
                    {getPageNumbers().map((page, index) =>
                      page === "..." ? (
                        <span key={index} className="p-2">
                          ...
                        </span>
                      ) : (
                        <button
                          key={index}
                          className={`border p-2 hover:bg-gray-200 ${currentPage === page && "bg-gray-300"}`}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      ),
                    )}
                    <button
                      className="border p-2 hover:bg-gray-200"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      name="Next page"
                      aria-label="Next page"
                    >
                      <ChevronLeft className="rotate-180" />
                    </button>
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
