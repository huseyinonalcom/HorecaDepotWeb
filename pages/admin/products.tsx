import React, { useState, useEffect, useContext } from "react";
import useTranslation from "next-translate/useTranslation";
import AdminLayout from "../../components/admin/adminLayout";
import { Product } from "../../api/interfaces/product";
import {
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Download,
  PlusCircle,
  Search,
} from "react-feather";
import Link from "next/link";
import { CategoryContext } from "../../api/providers/categoryProvider";
import { utils, write } from "xlsx";
import { formatCurrency } from "../../api/utils/formatters/formatcurrency";
import { LuDot } from "react-icons/lu";
import Head from "next/head";

export default function Products() {
  const { t, lang } = useTranslation("common");
  const [allCategories, setAllCategories] = useState([]);
  const { categories } = useContext(CategoryContext);
  const [allCategoriesHierarchy, setAllCategoriesHierarchy] = useState([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [tempSearch, setTempSearch] = useState<string | null>("");
  const [currentSearch, setCurrentSearch] = useState<string | null>(null);
  const [currentSort, setCurrentSort] = useState<string | null>("id");
  const [currentSortDirection, setCurrentSortDirection] =
    useState<boolean>(false);
  const [currentCategory, setCurrentCategory] = useState(0);

  const buttonClass =
    "flex flex-row items-center justify-start py-2 shadow-lg hover:bg-orange-400 overflow-hidden duration-500 cursor-pointer";
  const navIconDivClass = "flex flex-row justify-center flex-shrink-0 w-[35px]";
  const iconClass = "flex-shrink-0";
  const textClass = "mx-2 font-bold text-left";

  const getPageNumbers = () => {
    let pages = [];
    let startPage, endPage;

    if (totalPages <= 6) {
      startPage = 1;
      endPage = totalPages;
    } else {
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

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push("...");
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push("...");
      }
      pages.push(totalPages);
    }

    return pages;
  };

  const CategoryItem = ({ category }) => {
    const [isHovered, setisHovered] = useState(false);
    const hasSubCategories =
      category.subCategories && category.subCategories.length > 0;

    return (
      <div className="relative cursor-pointer">
        <div className="flex w-full items-center justify-between text-left hover:bg-gray-200">
          {hasSubCategories ? (
            <>
              <div
                className="h-full whitespace-nowrap px-4 py-2"
                // onClick={() => {
                //   setCurrentCategory(category.id);
                // }}
                onClick={() => {
                  setisHovered(!isHovered);
                }}
              >
                {t(category?.Name)}
              </div>
              <div
                onClick={() => {
                  setisHovered(!isHovered);
                }}
                className="w-full py-3 pr-4"
                // onClick={() => {
                //   setisHovered(!isHovered);
                // }}
              >
                <ChevronUp
                  className={
                    "ml-auto h-4 w-4 duration-300 " +
                    (isHovered ? "rotate-180" : "")
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
              {t(category?.Name)}
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
    if (allCategoriesHierarchy.length === 0 && categories.length > 0) {
      setAllCategoriesHierarchy(categories);
    }
  }, [categories]);

  useEffect(() => {
    if (tempSearch == "") {
      setCurrentSearch(null);
    }
  }, [tempSearch]);

  useEffect(() => {
    if (currentPage == 1) {
      fetchProducts();
    } else {
      setCurrentPage(1);
    }
  }, [currentCategory, currentSearch]);

  const fetchProducts = async () => {
    const answer = await fetch(
      `/api/products/admin/getallproducts?page=${currentPage}&sort=${currentSort}:${
        !currentSortDirection ? "desc" : "asc"
      }${currentSearch ? `&search=${currentSearch}` : ""}${
        currentCategory ? `&category=${currentCategory}` : ""
      }`,
    );
    const data = await answer.json();
    setAllProducts(data["data"]);
    setTotalPages(data["meta"]["pagination"]["pageCount"]);
  };

  const fetchCategories = async () => {
    const answer = await fetch(
      `/api/categories/public/getallcategoriesflattened`,
    );
    const data = await answer.json();
    setAllCategories(data.filter((cat) => cat.subCategories.length == 0));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, currentSort, currentSortDirection]);

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const getAllProductsByCategories = async () => {
    const answer = await fetch(
      `/api/products/admin/getallproducts?page=1&count=19999&sort=${currentSort}:${
        !currentSortDirection ? "desc" : "asc"
      }`,
    );
    const data = await answer.json();
    let groupedData = {};

    data.data.forEach((prod) => {
      const categoryName = prod.category?.Name;

      if (!groupedData.hasOwnProperty(categoryName)) {
        groupedData[categoryName] = [];
      }

      groupedData[categoryName].push(prod);
    });

    return groupedData;
  };

  const generateXlsx = async () => {
    function s2ab(s) {
      const buf = new ArrayBuffer(s.length);
      const view = new Uint8Array(buf);
      for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
      return buf;
    }
    const now = new Date();
    const timestamp =
      now.getFullYear() +
      "_" +
      (now.getMonth() + 1).toString().padStart(2, "0") +
      "_" +
      now.getDate().toString().padStart(2, "0") +
      "_" +
      now.getHours().toString().padStart(2, "0") +
      "_" +
      now.getMinutes().toString().padStart(2, "0");
    const wb = utils.book_new();

    const productsToWrite = await getAllProductsByCategories();

    const sortedCategories = Object.keys(productsToWrite).sort();

    for (const category of sortedCategories) {
      const products = productsToWrite[category];

      const customProducts = products.map((product) => ({
        EAN: product.supplierCode,
        "Code Model": product.internalCode,
        Nom: product.name,
        Couleur: product.color,
        Matériel: product.material,
        "Stock Depot":
          product.shelves.find((shelf) => shelf.establishment.id == 3)?.stock ||
          0,
        "Stock Magasin":
          product.shelves.find((shelf) => shelf.establishment.id == 1)?.stock ||
          0,
        Réservé: 0,
        "Prix Avant Remise": product.priceBeforeDiscount,
        "Prix de vente": product.value,
        Poids: product.product_extra.weight,
        "Poids Colis Net": product.product_extra.packaged_weight_net,
        "Poids Colis Brut": product.product_extra.packaged_weight,
        "Dimensions Du Colis": product.product_extra.packaged_dimensions,
        "Par Boîte": product.product_extra.per_box,
        "Hauteur d'assise": product.product_extra.seat_height,
        Hauteur: product.height,
        Largeur: product.width,
        Longueur: product.depth,
        "Hauteur Accoudoir": product.product_extra.armrest_height,
        Diamètre: product.product_extra.diameter,
      }));

      const worksheet = utils.json_to_sheet(
        customProducts.sort((a, b) => a.Nom.localeCompare(b.Nom)),
      );

      utils.book_append_sheet(wb, worksheet, category);
    }

    const wbout = write(wb, { bookType: "xlsx", type: "binary" });

    const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.href = url;
    a.download = timestamp + ".xlsx";
    a.click();

    setTimeout(() => {
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, 0);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentSearch(tempSearch);
  };

  return (
    <AdminLayout>
      <Head>
        <title>Produits</title>
        <meta name="language" content={lang} />
      </Head>
      <div className="flex w-full flex-row items-center">
        <div className="flex w-full flex-col items-center pb-1 pt-1">
          <div className="mb-1 grid grid-cols-1 items-center gap-2 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-row">
              <div className="group relative h-full">
                <div className="mr-1 flex h-full flex-row items-center bg-gray-100 py-4 pl-3 pr-2 font-bold text-black">
                  {t(
                    currentCategory
                      ? allCategories.find((cat) => cat.id == currentCategory)
                          ?.Name
                      : "Tout",
                  )}
                  <ChevronUp className="ml-1 h-4 w-4 transform duration-300 group-hover:rotate-180" />
                </div>
                <div className="invisible absolute -left-5 top-8 z-50 mt-4 w-[240px] bg-white py-2 text-gray-500 opacity-0 shadow-lg duration-300 group-hover:visible group-hover:opacity-100">
                  <div className="flex w-full cursor-pointer items-center justify-between text-left hover:bg-gray-200">
                    <div
                      className="h-full w-full whitespace-nowrap px-4 py-2"
                      onClick={() => {
                        setCurrentCategory(null);
                      }}
                    >
                      {t("All")}
                    </div>
                  </div>
                  {allCategoriesHierarchy.map((category) => (
                    <CategoryItem key={category.id} category={category} />
                  ))}
                </div>
              </div>
              <div
                style={{
                  borderRadius: "0.25rem",
                  boxShadow:
                    "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  backgroundColor: "#f3f4f6",
                  padding: "8px",
                }}
              >
                <form
                  style={{ position: "relative" }}
                  onSubmit={handleSearchSubmit}
                  role="search"
                >
                  <label htmlFor="searchInput" style={{ display: "none" }}>
                    {t("Search Products")}
                  </label>
                  <input
                    id="searchInput"
                    className="placeholder-blue"
                    value={tempSearch}
                    onChange={(e) => setTempSearch(e.target.value)}
                    onSubmit={handleSearchSubmit}
                    type="text"
                    style={{
                      width: "100%",
                      paddingLeft: "16px",
                      paddingRight: "16px",
                      paddingTop: "8px",
                      paddingBottom: "8px",
                      border: "2px solid",
                      borderColor: "rgba(0, 0, 0, 0.1)",
                      outline: "none",
                    }}
                    placeholder={t("Search Products")}
                    aria-label="Search"
                  />
                  <div
                    onSubmit={handleSearchSubmit}
                    style={{
                      cursor: "pointer",
                      position: "absolute",
                      top: 0,
                      right: 0,
                      bottom: 0,
                    }}
                    role="button"
                    aria-label="Submit search"
                  >
                    <Search
                      style={{
                        height: "100%",
                        width: "28px",
                        margin: "auto 8px",
                      }}
                    />
                  </div>
                </form>
              </div>
            </div>
            <div className="flex flex-row">
              <div className="flex flex-row gap-2 bg-gray-100 p-2 shadow-lg">
                <ArrowUp
                  height={36}
                  width={36}
                  onClick={() => setCurrentSortDirection(!currentSortDirection)}
                  className={` border-2 border-blue-500 bg-white p-1 duration-500 ${
                    currentSortDirection ? "rotate-0" : "rotate-180"
                  }`}
                />
                <div
                  className={` border-2 bg-white px-2 py-1 ${
                    currentSort == "id" ? "border-blue-500" : ""
                  }`}
                  onClick={() => setCurrentSort("id")}
                >
                  {t("Date")}
                </div>
                <div
                  className={` border-2 bg-white px-2 py-1 ${
                    currentSort == "value" ? "border-blue-500" : ""
                  }`}
                  onClick={() => setCurrentSort("value")}
                >
                  {t("Price")}
                </div>
              </div>
              <button
                className={buttonClass + " flex-shrink-0 bg-green-400"}
                onClick={() => generateXlsx()}
              >
                <div className={navIconDivClass}>
                  <Download className={iconClass} />
                </div>
                <span className={textClass}>{t("Download Excel")}</span>
              </button>
            </div>
            <div className="flex flex-row">
              <Link
                className={buttonClass}
                href={"/admin/products/0"}
              >
                <div className={navIconDivClass}>
                  <PlusCircle className={iconClass} />
                </div>
                <span className={textClass}>{t("Create New Product")}</span>
              </Link>
            </div>
          </div>
          <div className="flex-shrink-1 flex w-full flex-col items-center overflow-y-auto pt-1">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {allProducts?.map((product) => (
                <Link
                  type="button"
                  href={"/admin/products/" + product.id}
                  key={product.id}
                  className="relative h-[300px] w-[190px] bg-slate-200"
                >
                  <LuDot
                    className="absolute right-0 top-0 -mr-6 -mt-6"
                    size={80}
                    color={product.active ? "green" : "red"}
                  />
                  <img
                    src={
                      "https://hdapi.huseyinonalalpha.com" +
                      product.images?.at(0).url
                    }
                    alt={product.name}
                    className="aspect-square w-full object-cover"
                  />
                  <div className="flex flex-col">
                    <div className="flex flex-col p-2">
                      <div className="font-bold">{product.name}</div>
                      <div>{product.color}</div>
                      <div>{formatCurrency(product.value)}</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <>
              {allProducts.length > 0 ? (
                <div className="mb-2 mt-2 flex flex-row justify-center px-6">
                  <div className="flex items-center justify-center space-x-1">
                    <button
                      className="border p-2 hover:bg-gray-200"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
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
                          className={`border p-2 hover:bg-gray-200 ${
                            currentPage === page ? "bg-gray-300" : ""
                          }`}
                          onClick={() => goToPage(page)}
                        >
                          {page}
                        </button>
                      ),
                    )}
                    <button
                      className="border p-2 hover:bg-gray-200"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight />
                    </button>
                  </div>
                </div>
              ) : (
                <p></p>
              )}
            </>
          </div>
        </div>
      </div>
      {/* <button onClick={() => missingPictures()}>missing pics</button> */}
    </AdminLayout>
  );
}
