import Layout from "../components/public/layout";
import Head from "next/head";
import { useContext, useEffect, useRef, useState } from "react";
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
  const [currentSortDirection, setCurrentSortDirection] = useState<boolean>(false);

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
    router.push(
      {
        pathname: "/products",
        query: {
          page: router.query.page ?? 1,
          category: "",
          search: router.query.search ?? "",
        },
      },
      undefined,
      { shallow: true }
    );
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
    const allCategoriesReq = await fetch("/api/categories/public/getallcategoriesflattened");
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
      currentSort ? `&sort=${currentSort}${currentSortDirection ? ":asc" : ":desc"}` : ``
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
    const hasSubCategories = category.subCategories && category.subCategories.length > 0;

    return (
      <div className="relative cursor-pointer">
        <div className="w-full focus:overlay-none text-left flex justify-between items-center min-w-[242px] hover:bg-gray-200">
          {hasSubCategories ? (
            <>
              <div
                className="whitespace-nowrap h-full py-2 px-4"
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
                <ChevronLeft className={"ml-auto w-4 h-4 duration-300 " + (isHovered ? "rotate-270" : "rotate-90")} />
              </div>
            </>
          ) : (
            <div
              className="whitespace-nowrap w-full h-full px-4 py-2"
              onClick={() => {
                setCurrentCategory(category.id);
              }}
            >
              {t(category.Name)}
            </div>
          )}
        </div>
        {hasSubCategories && (
          <div className={"pl-4 overflow-hidden transition-max-height duration-300 ease-in-out " + (isHovered ? "max-h-96" : "max-h-0")}>
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
        <div id={t("Products")} className="w-full items-start flex flex-col lg:flex-row text-[#084E97]">
          <div className="relative flex flex-col w-full lg:w-[500px] px-1 gap-2">
            <div className="shadow-lg sticky w-full bg-gray-100 p-2 flex flex-row gap-2">
              <ArrowUp
                height={36}
                width={36}
                onClick={() => setCurrentSortDirection(!currentSortDirection)}
                className={` bg-white border-2 flex flex-row items-center duration-500 border-blue-500 p-1 ${currentSortDirection ? "rotate-0" : "rotate-180"}`}
              />
              <div
                className={` flex flex-row items-center px-2 py-1 bg-white border-2 ${currentSort == "id" ? "border-blue-500" : ""}`}
                onClick={() => setCurrentSort("id")}
              >
                {t("Date")}
              </div>
              <div
                className={` flex flex-row items-center px-2 py-1 bg-white border-2 ${currentSort == "value" ? "border-blue-500" : ""}`}
                onClick={() => setCurrentSort("value")}
              >
                {t("Price")}
              </div>
              <button
                onClick={() => {
                  setIsFilterDrawerOpen(!isFilterDrawerOpen);
                }}
                className="ml-auto bg-orange-400 lg:hidden font-semibold py-1 px-2"
              >
                {t("Filters")}
              </button>
            </div>
            <div className={`fixed lg:hidden bottom-0 z-40 duration-700 w-full flex flex-col ${isFilterDrawerOpen ? "bottom-0" : "bottom-[-100%]"}`}>
              <div onClick={() => setIsFilterDrawerOpen(false)} className={`bg-transparent ${isFilterDrawerOpen ? "h-screen" : "h-0"}`}></div>
              <div className="flex flex-row bg-slate-300 justify-end flex-shrink-0 py-2 px-3">
                <button onClick={() => setIsFilterDrawerOpen(false)}>
                  <X />
                </button>
              </div>
              <div className="flex flex-col bg-slate-300 w-full">
                <div>
                  {currentCategory || currentSearch ? (
                    <div className={`overflow-hidden shadow-lg bg-gray-100 p-4`}>
                      {currentSearch ? (
                        <div style={{ cursor: "pointer" }} className="mb-1 pr-3" onClick={() => setCurrentSearch("")}>
                          x {currentSearch}
                        </div>
                      ) : null}
                      {currentCategory ? (
                        <div className="mb-1 pr-3" style={{ cursor: "pointer" }} onClick={() => setCurrentCategory(null)}>
                          {allCategoriesFlat.find((cat) => cat.id == currentCategory) != null
                            ? "x " + t(allCategoriesFlat.find((cat) => cat.id == currentCategory).Name)
                            : currentCategory}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
                <div className="flex flex-col w-full py-2 text-gray-500 w-[240px] duration-300 bg-white shadow-lg">
                  {allCategories.map((category) => (
                    <CategoryItem key={category.id} category={category} />
                  ))}
                </div>
                <div className={`overflow-hidden shadow-lg bg-gray-100 p-4`}>
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
            </div>

            <div className={`hidden lg:flex duration-700 bg-slate-300 p-2 flex-row-reverse`}>
              <div className="flex flex-col bg-slate-300 w-full">
                <div>
                  {currentCategory || currentSearch ? (
                    <div className={` shadow-lg bg-gray-100 p-4`}>
                      {currentSearch ? (
                        <div style={{ cursor: "pointer" }} className="mb-1 pr-3" onClick={() => setCurrentSearch("")}>
                          x {currentSearch}
                        </div>
                      ) : null}
                      {currentCategory ? (
                        <div className="mb-1 pr-3" style={{ cursor: "pointer" }} onClick={() => setCurrentCategory(null)}>
                          {allCategoriesFlat.find((cat) => cat.id == currentCategory) != null
                            ? "x " + t(allCategoriesFlat.find((cat) => cat.id == currentCategory).Name)
                            : currentCategory}
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
                <div className="flex flex-col w-full py-2 text-gray-500 w-[240px] duration-300 bg-white shadow-lg">
                  {allCategories.map((category) => (
                    <CategoryItem key={category.id} category={category} />
                  ))}
                </div>
                <div className={`shadow-lg bg-gray-100 p-4`}>
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
            </div>
          </div>

          <div className="flex flex-col w-full">
            <h2 className="text-5xl justify-center w-full flex font-bold mt-2">{t("Products")}</h2>
            {allProducts.length <= 0 ? (
              <h3 className="text-xl justify-center text-red-700 w-full flex font-bold">{t("No products matching")}</h3>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 w-full">
                {allProducts.map((product) => (
                  <div key={product.id} className="w-full px-4 mt-2 mb-2">
                    <ProductPreview product={product} width={"full"} />
                  </div>
                ))}
              </div>
            )}
            {allProducts.length > 0 ? (
              <div className="flex flex-row px-6 justify-center mb-4">
                <div className="mt-2">
                  <div className="flex justify-center items-center space-x-1">
                    <button
                      className="p-2 border  hover:bg-gray-200"
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
                          className={`p-2 border  hover:bg-gray-200 ${currentPage === page ? "bg-gray-300" : ""}`}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </button>
                      )
                    )}
                    <button
                      className="p-2 border  hover:bg-gray-200"
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
            ) : (
              <p></p>
            )}
          </div>
        </div>
      </Layout>
    </>
  );
}
