import { getAllCategoriesFlattened } from "../../api/categories/public/getallcategoriesflattened";
import { formatCurrency } from "../../../api/utils/formatters/formatcurrency";
import { getAllSuppliers } from "../../api/suppliers/admin/getallsuppliers";
import { getAllCategories } from "../../api/categories/getallcategories";
import { getAllProducts } from "../../api/products/admin/getallproducts";
import { getCoverImageUrl } from "../../../api/utils/getprodcoverimage";
import AdminLayout from "../../../components/admin/adminLayout";
import ImageWithURL from "../../../components/common/image";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useState } from "react";
import { LuDot } from "react-icons/lu";
import { utils, write } from "xlsx";
import Link from "next/link";
import Head from "next/head";
import {
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Download,
  PlusCircle,
  Search,
} from "react-feather";

export default function Products(props) {
  const { t, lang } = useTranslation("common");
  const router = useRouter();
  const allProducts = props.allProducts;
  const totalPages = props.totalPages;
  const currentPage = props.currentPage;
  const currentSearch = props.currentSearch;
  const [tempSearch, setTempSearch] = useState<string | null>(
    currentSearch ?? "",
  );
  const currentSort = props.currentSort;
  const currentSortDirection = props.currentSortDirection ?? "desc";
  const currentSupplier = props.currentSupplier;
  const currentCategory = props.currentCategory ?? "all";
  const allCategories = props.allCategories;
  const allSuppliers = props.allSuppliers;
  const allCategoriesHierarchy = props.allCategoriesHierarchy;
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
                {category?.localized_name[lang]}
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
            <Link
              className="h-full w-full whitespace-nowrap px-4 py-2"
              href={createLink({ category: category.id, page: 1 })}
            >
              {category?.localized_name[lang]}
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

  const createLink = ({
    page,
    category,
    supplier,
    sort,
    sortDirection,
    search,
  }: {
    page?: number;
    category?: string;
    supplier?: number;
    sort?: string;
    sortDirection?: string;
    search?: string;
  }) => {
    let link = "/admin/stock/";

    if (category) {
      link += `${category}`;
    } else if (currentCategory) {
      link += `${currentCategory}`;
    } else {
      link += `all`;
    }

    if (page) {
      link += `?page=${page}`;
    } else if (currentPage) {
      link += `?page=${currentPage}`;
    } else {
      link += `?page=1`;
    }

    if (sort) {
      link += `&sort=${sort}`;
    } else if (currentSort) {
      link += `&sort=${currentSort}`;
    } else {
      link += `&sort=id`;
    }

    if (sortDirection) {
      link += `:${sortDirection}`;
    } else if (currentSortDirection) {
      link += `:${currentSortDirection}`;
    } else {
      link += `:desc`;
    }

    if (search) {
      link += `&search=${search}`;
    } else if (tempSearch) {
      link += `&search=${tempSearch}`;
    } else if (currentSearch) {
      link += `&search=${currentSearch}`;
    }

    if (supplier == 0) {
    } else if (supplier) {
      link += `&supplier=${supplier}`;
    } else if (currentSupplier) {
      link += `&supplier=${currentSupplier}`;
    }
    return link;
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
      const categoryName = prod.category?.localized_name[lang];

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
        Image: product.images != null && product.images.length > 0 ? "V" : "X",
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
  return (
    <>
      <Head>
        <title>{t("stock")}</title>
      </Head>
      <div className="flex w-full flex-row items-center">
        <div className="flex w-full flex-col items-center pb-1 pt-1">
          <div className="my-2 flex w-full flex-wrap items-center gap-2 rounded-md bg-white p-4 shadow-sm">
            <div className="group relative h-full">
              <div className="mr-1 flex h-full flex-row items-center bg-gray-100 py-4 pl-3 pr-2 font-bold text-black">
                {currentCategory
                  ? allCategories.find((cat) => cat.id == currentCategory)
                      ?.localized_name[lang] ?? t("choose_category")
                  : t("choose_category")}
                <ChevronUp className="ml-1 h-4 w-4 transform duration-300 group-hover:rotate-180" />
              </div>
              <div className="invisible absolute -left-5 top-8 z-50 mt-4 w-[240px] bg-white py-2 text-gray-500 opacity-0 shadow-lg duration-300 group-hover:visible group-hover:opacity-100">
                <div className="flex w-full cursor-pointer items-center justify-between text-left hover:bg-gray-200">
                  <Link
                    className="h-full w-full whitespace-nowrap px-4 py-2"
                    href={createLink({ category: "all", page: 1 })}
                  >
                    {t("All")}
                  </Link>
                </div>
                {allCategoriesHierarchy.map((category) => (
                  <CategoryItem key={category.id} category={category} />
                ))}
              </div>
            </div>
            <div className="group relative h-full">
              <div className="mr-1 flex h-full flex-row items-center bg-gray-100 py-4 pl-3 pr-2 font-bold text-black">
                {currentSupplier
                  ? allSuppliers.find((sup) => sup.id == currentSupplier)?.name
                  : t("choose_supplier")}
                <ChevronUp className="ml-1 h-4 w-4 transform duration-300 group-hover:rotate-180" />
              </div>
              <div className="invisible absolute -left-5 top-8 z-50 mt-4 w-[240px] bg-white py-2 text-gray-500 opacity-0 shadow-lg duration-300 group-hover:visible group-hover:opacity-100">
                <div className="flex w-full cursor-pointer items-center justify-between text-left hover:bg-gray-200">
                  <Link
                    className="h-full w-full whitespace-nowrap px-4 py-2"
                    href={createLink({ supplier: 0, page: 1 })}
                  >
                    {t("All")}
                  </Link>
                </div>
                {allSuppliers.map((sup) => (
                  <Link
                    key={sup.id}
                    className="flex w-full cursor-pointer items-center justify-between px-4 py-2 text-left hover:bg-gray-200"
                    href={createLink({ supplier: sup.id, page: 1 })}
                  >
                    {sup.name}
                  </Link>
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
                onSubmit={(e) => {
                  e.preventDefault();
                  router.push(createLink({ search: tempSearch, page: 1 }));
                }}
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
                  onSubmit={(e) => {
                    e.preventDefault();
                    router.push(createLink({ search: tempSearch, page: 1 }));
                  }}
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
                <Link
                  href={createLink({ search: tempSearch, page: 1 })}
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
                </Link>
              </form>
            </div>
            <div className="flex flex-row gap-2 bg-gray-100 p-2 shadow-lg">
              <Link
                href={
                  currentSortDirection == "desc"
                    ? createLink({ sortDirection: "asc", page: 1 })
                    : createLink({ sortDirection: "desc", page: 1 })
                }
              >
                <ArrowUp
                  height={36}
                  width={36}
                  className={` border-2 border-blue-500 bg-white p-1 duration-500 ${
                    currentSortDirection == "asc" ? "rotate-0" : "rotate-180"
                  }`}
                />
              </Link>
              <Link
                className={` border-2 bg-white px-2 py-1 ${
                  currentSort == "id" ? "border-blue-500" : ""
                }`}
                href={createLink({ sort: "id", page: 1 })}
              >
                {t("Date")}
              </Link>
              <Link
                className={` border-2 bg-white px-2 py-1 ${
                  currentSort == "value" ? "border-blue-500" : ""
                }`}
                href={createLink({ sort: "value", page: 1 })}
              >
                {t("Price")}
              </Link>
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
            <Link className={buttonClass} href={"/admin/products/0"}>
              <div className={navIconDivClass}>
                <PlusCircle className={iconClass} />
              </div>
              <span className={textClass}>{t("Create New Product")}</span>
            </Link>
          </div>
          <div className="flex w-full flex-col items-center overflow-x-auto rounded-md bg-white p-4 shadow-sm">
            <table className="w-full gap-2">
              <thead>
                <tr>
                  <th></th>
                  <th>{t("Name")}</th>
                  <th>{t("Code")}</th>
                  <th>{t("EAN")}</th>
                  <th>{t("Price")}</th>
                  <th>{t("Stock")}</th>
                  <th>{t("Active")}</th>
                </tr>
              </thead>
              <tbody>
                {allProducts?.map((product) => (
                  <tr
                    key={product.id}
                    onClick={() =>
                      router.push(
                        "/admin/products/" +
                          product.id +
                          "?return=" +
                          encodeURIComponent(router.asPath),
                      )
                    }
                    className="relative cursor-pointer odd:bg-blue-50 hover:bg-blue-100"
                  >
                    <td className="relative">
                      <ImageWithURL
                        height={80}
                        width={80}
                        src={
                          product.images != null
                            ? getCoverImageUrl(product)
                            : "/uploads/placeholder_9db455d1f1.webp"
                        }
                        alt={product.name}
                        className="aspect-square h-[80px] flex-shrink-0 object-cover"
                      />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.internalCode}</td>
                    <td>{product.supplierCode}</td>
                    <td>{formatCurrency(product.value)}</td>
                    <td>
                      {product.shelves.reduce(
                        (acc, shelf) => acc + shelf.stock,
                        0,
                      )}
                    </td>
                    <td>
                      <LuDot
                        size={80}
                        color={product.active ? "green" : "red"}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <>
              {allProducts.length > 0 ? (
                <div className="mb-2 mt-2 flex flex-row justify-center px-6">
                  <div className="flex items-center justify-center space-x-1">
                    <Link
                      href={
                        currentPage == 1
                          ? "#"
                          : createLink({ page: currentPage - 1 })
                      }
                      className="border p-2 hover:bg-gray-200"
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
                          className={`border p-2 hover:bg-gray-200 ${
                            currentPage === page ? "bg-gray-300" : ""
                          }`}
                          href={createLink({ page: page })}
                        >
                          {page}
                        </Link>
                      ),
                    )}
                    <Link
                      href={
                        currentPage == totalPages
                          ? "#"
                          : createLink({ page: currentPage + 1 })
                      }
                      className="border p-2 hover:bg-gray-200"
                    >
                      <ChevronRight />
                    </Link>
                  </div>
                </div>
              ) : (
                <p></p>
              )}
            </>
          </div>
        </div>
      </div>
    </>
  );
}

Products.getLayout = function getLayout(page) {
  return <AdminLayout>{page}</AdminLayout>;
};

export async function getServerSideProps(context) {
  const req = context.req;
  req.query = context.query;
  const currentCategory = req.query.category ?? null;
  if (req.query.category == "all") {
    delete req.query.category;
  }
  if (!req.query.sort) {
    req.query.sort = "id";
  }
  const allCategories = await getAllCategoriesFlattened();
  const allSuppliers = await getAllSuppliers(req);
  const allCategoriesHierarchy = await getAllCategories();
  const currentSearch = req.query.search ?? null;
  const currentSort = req.query.sort.split(":").at(0) ?? "id";
  const currentSortDirection = req.query.sort.split(":").at(1) ?? "desc";
  req.query.sort = currentSort + ":" + currentSortDirection;
  const productsData = await getAllProducts(req);
  const allProducts = productsData.data;
  const currentPage = productsData.meta.pagination.page;
  const totalPages = productsData.meta.pagination.pageCount;
  const currentSupplier = req.query.supplier ?? null;

  return {
    props: {
      allCategories,
      allSuppliers,
      allCategoriesHierarchy,
      currentSearch,
      allProducts,
      currentPage,
      totalPages,
      currentSortDirection,
      currentSort,
      currentCategory,
      currentSupplier,
    },
  };
}
