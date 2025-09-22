import { getAllCategoriesFlattened } from "../../api/categories/public/getallcategoriesflattened";
import { getAllCategories } from "../../api/categories/getallcategories";
import { getSuppliers } from "../../api/private/suppliers";
import { fuzzySearch } from "../../api/public/search";
import { getProducts } from "../../api/public/products/getproducts";
import StockLayout from "../../../components/stock/StockLayout";
import ProductCard from "../../../components/stock/ProductCard";
import useTranslation from "next-translate/useTranslation";
import { useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import {
  Pagination,
  PaginationPrevious,
  PaginationList,
  PaginationPage,
  PaginationGap,
  PaginationNext,
} from "../../../components/styled/pagination";
import { FiChevronUp, FiSearch, FiArrowUp } from "react-icons/fi";

interface StockPageProps {
  allProducts: any[];
  totalPages: number;
  currentPage: number;
  currentSearch: string | null;
  currentSort: string;
  currentSortDirection: string;
  currentSupplier: string | number | null;
  currentCategory: string | null;
  allCategories: any[];
  allSuppliers: any[];
  allCategoriesHierarchy: any[];
  showinactive: boolean;
}

export default function Stock(props: StockPageProps) {
  const { t, lang } = useTranslation("common");
  const router = useRouter();
  const {
    allProducts,
    totalPages,
    currentPage,
    currentSearch,
    currentSort,
    currentSortDirection,
    currentSupplier,
    currentCategory,
    allCategories,
    allSuppliers,
    allCategoriesHierarchy,
    showinactive,
  } = props;

  const [tempSearch, setTempSearch] = useState<string>(currentSearch ?? "");
  const inactiveFilter = showinactive === true;
  const activeCategoryId = currentCategory ?? "all";

  const CategoryItem = ({ category }: { category: any }) => {
    const [isHovered, setIsHovered] = useState(false);
    const hasSubCategories =
      category.subCategories && category.subCategories.length > 0;

    return (
      <div className="relative cursor-pointer">
        <div className="flex w-full items-center justify-between text-left hover:bg-gray-200">
          {hasSubCategories ? (
            <>
              <Link
                href={createLink({ category: category.id, page: 1 })}
                className="h-full px-4 py-2 whitespace-nowrap hover:text-blue-400"
              >
                {category?.localized_name?.[lang] ?? category.name}
              </Link>
              <button
                type="button"
                onClick={() => {
                  setIsHovered(!isHovered);
                }}
                className="w-full py-3 pr-4"
              >
                <FiChevronUp
                  className={`ml-auto h-4 w-4 duration-300 ${
                    isHovered ? "rotate-180" : ""
                  }`}
                />
              </button>
            </>
          ) : (
            <Link
              className="h-full w-full px-4 py-2 whitespace-nowrap hover:text-blue-400"
              href={createLink({ category: category.id, page: 1 })}
            >
              {category?.localized_name?.[lang] ?? category.name}
            </Link>
          )}
        </div>
        {hasSubCategories && (
          <div
            className={`transition-max-height overflow-hidden pl-4 duration-300 ease-in-out ${
              isHovered ? "max-h-96" : "max-h-0"
            }`}
          >
            {category.subCategories.map((subCategory: any) => (
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
    showinactive: showInactiveOverride,
  }: {
    page?: number;
    category?: string;
    supplier?: number | string;
    sort?: string;
    sortDirection?: string;
    search?: string;
    showinactive?: boolean;
  }) => {
    let link = "/stock/list/";

    if (category) {
      link += `${category}`;
    } else if (activeCategoryId) {
      link += `${activeCategoryId}`;
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
      link += `&search=${search}&nocache=true`;
    }

    if (supplier === 0 || supplier === "0") {
      // intentionally allow clearing supplier without appending query param
    } else if (supplier) {
      link += `&supplier=${supplier}`;
    } else if (currentSupplier) {
      link += `&supplier=${currentSupplier}`;
    }

    const shouldShowInactive =
      typeof showInactiveOverride === "boolean"
        ? showInactiveOverride
        : inactiveFilter;

    if (shouldShowInactive) {
      link += "&showinactive=true";
    }

    return link;
  };

  const OrderArrow = () => {
    return (
      <Link
        href={
          currentSortDirection == "desc"
            ? createLink({ sortDirection: "asc", page: 1 })
            : createLink({ sortDirection: "desc", page: 1 })
        }
      >
        <FiArrowUp
          color="black"
          className={`duration-200 ${
            currentSortDirection == "asc" ? "rotate-0" : "rotate-180"
          }`}
        />
      </Link>
    );
  };

  const sortOptions = [
    { key: "id", label: t("creation-date") },
    { key: "name", label: t("Name") },
    { key: "internalCode", label: t("code") },
    { key: "supplierCode", label: t("EAN") },
    { key: "value", label: t("Price") },
    { key: "views", label: t("views") },
  ];

  return (
    <>
      <Head>
        <title>{t("Products")}</title>
        <meta name="language" content={lang} />
      </Head>
      <div className="flex w-full flex-col items-center gap-2 p-2">
        <div className="flex w-full flex-col gap-3 rounded-md border-2 border-gray-300 bg-white p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <div className="group relative">
              <div className="mr-1 flex h-full flex-row items-center bg-gray-100 py-3 pr-2 pl-3 font-bold text-black">
                {activeCategoryId && activeCategoryId !== "all"
                  ? (allCategories.find((cat) => cat.id == activeCategoryId)
                      ?.localized_name?.[lang] ?? t("choose_category"))
                  : t("choose_category")}
                <FiChevronUp className="ml-1 h-4 w-4 transform duration-300 group-hover:rotate-180" />
              </div>
              <div className="invisible absolute top-8 -left-5 z-50 mt-4 w-[240px] bg-white py-2 text-gray-500 opacity-0 shadow-lg duration-300 group-hover:visible group-hover:opacity-100">
                <div className="flex w-full cursor-pointer items-center justify-between text-left hover:bg-gray-200">
                  <Link
                    className="h-full w-full px-4 py-2 whitespace-nowrap"
                    href={createLink({ category: "all", page: 1 })}
                  >
                    {t("All")}
                  </Link>
                </div>
                {allCategoriesHierarchy.map((category: any) => (
                  <CategoryItem key={category.id} category={category} />
                ))}
              </div>
            </div>
            <div className="group relative">
              <div className="mr-1 flex h-full flex-row items-center bg-gray-100 py-3 pr-2 pl-3 font-bold text-black">
                {currentSupplier
                  ? allSuppliers.find((sup) => sup.id == currentSupplier)?.name
                  : t("choose_supplier")}
                <FiChevronUp className="ml-1 h-4 w-4 transform duration-300 group-hover:rotate-180" />
              </div>
              <div className="invisible absolute top-8 -left-5 z-50 mt-4 w-[240px] bg-white py-2 text-gray-500 opacity-0 shadow-lg duration-300 group-hover:visible group-hover:opacity-100">
                <div className="flex w-full cursor-pointer items-center justify-between text-left hover:bg-gray-200">
                  <Link
                    className="h-full w-full px-4 py-2 whitespace-nowrap"
                    href={createLink({ supplier: 0, page: 1 })}
                  >
                    {t("All")}
                  </Link>
                </div>
                {allSuppliers.map((sup: any) => (
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
            <Link
              href={createLink({ showinactive: !inactiveFilter })}
              className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-2 shadow-sm"
            >
              <div
                role="switch"
                aria-checked={!inactiveFilter}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                  !inactiveFilter ? "bg-green-500" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    !inactiveFilter ? "translate-x-5" : "translate-x-1"
                  }`}
                />
              </div>
              <span className="text-sm font-medium text-gray-700">
                {!inactiveFilter ? t("Active") : t("Inactive")}
              </span>
            </Link>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                router.push(createLink({ search: tempSearch, page: 1 }));
              }}
              role="search"
              className="flex flex-row items-center rounded-md bg-gray-100 p-2 shadow-sm"
            >
              <label htmlFor="searchInput" className="sr-only">
                {t("Search Products")}
              </label>
              <input
                id="searchInput"
                className="w-full border border-gray-300 px-4 py-2 outline-none"
                value={tempSearch}
                onChange={(e) => setTempSearch(e.target.value)}
                type="text"
                placeholder={t("Search Products")}
                aria-label="Search"
              />
              <button type="submit" className="p-2">
                <FiSearch className="h-6 w-6 text-gray-600" />
              </button>
            </form>
            <Link
              href="/stock/scanner"
              className="flex w-[100px] items-center justify-center rounded-md border-2 border-gray-400 bg-black p-2 font-semibold text-white shadow-sm"
            >
              Scan
            </Link>
            <Link
              href="/api/private/products/generatestocklist"
              target="_blank"
              className="flex w-[100px] items-center justify-center rounded-md border-2 border-gray-400 bg-black p-2 font-semibold text-white shadow-sm"
            >
              Stock List
            </Link>
          </div>
          <div className="flex flex-row items-center gap-3">
            <span className="font-semibold text-gray-700">{t("Sort by")}:</span>
            {sortOptions.map((option) => (
              <div key={option.key} className="flex items-center gap-1">
                <Link
                  href={createLink({ sort: option.key, page: 1 })}
                  className={`text-sm font-medium ${
                    currentSort === option.key
                      ? "text-blue-600"
                      : "text-gray-600"
                  }`}
                >
                  {option.label}
                </Link>
                {currentSort === option.key && <OrderArrow />}
              </div>
            ))}
          </div>
        </div>
        <div className="flex w-full flex-col items-start gap-2">
          {allProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {totalPages > 1 && (
          <div className="w-full">
            <Pagination className="flex w-full justify-center gap-2 rounded-lg border border-zinc-200 bg-white p-4 shadow-sm">
              <PaginationPrevious
                onClick={
                  currentPage > 1
                    ? () => {
                        router.push(createLink({ page: currentPage - 1 }));
                      }
                    : undefined
                }
              >
                <p className="text-black">{t("previous")}</p>
              </PaginationPrevious>
              <PaginationList>
                <PaginationPage
                  onClick={() => {
                    router.push(createLink({ page: 1 }));
                  }}
                  current={currentPage === 1}
                >
                  1
                </PaginationPage>
                {currentPage > 4 && <PaginationGap />}
                {[currentPage - 2, currentPage - 1]
                  .filter((page) => page > 1)
                  .map((page) => (
                    <PaginationPage
                      key={page}
                      onClick={() => {
                        router.push(createLink({ page }));
                      }}
                    >
                      {page}
                    </PaginationPage>
                  ))}
                {currentPage !== 1 && currentPage !== totalPages && (
                  <PaginationPage current>{currentPage}</PaginationPage>
                )}
                {[currentPage + 1, currentPage + 2]
                  .filter((page) => page < totalPages)
                  .map((page) => (
                    <PaginationPage
                      key={page}
                      onClick={() => {
                        router.push(createLink({ page }));
                      }}
                    >
                      {page}
                    </PaginationPage>
                  ))}
                {currentPage < totalPages - 3 && <PaginationGap />}
                {totalPages > 1 && (
                  <PaginationPage
                    onClick={() => {
                      router.push(createLink({ page: totalPages }));
                    }}
                    current={currentPage === totalPages}
                  >
                    {totalPages}
                  </PaginationPage>
                )}
              </PaginationList>
              <PaginationNext
                onClick={
                  currentPage < totalPages
                    ? () => {
                        router.push(createLink({ page: currentPage + 1 }));
                      }
                    : undefined
                }
              >
                <p className="text-black">{t("next")}</p>
              </PaginationNext>
            </Pagination>
          </div>
        )}
      </div>
    </>
  );
}

Stock.getLayout = function getLayout(page: ReactNode) {
  return <StockLayout>{page}</StockLayout>;
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
  const allSuppliers = await getSuppliers({ authToken: req.cookies.j });
  const allCategoriesHierarchy = await getAllCategories();
  const currentSearch = req.query.search ?? null;
  const currentSort = req.query.sort.split(":").at(0);
  const currentSortDirection = req.query.sort.split(":").at(1) ?? "desc";
  req.query.sort = currentSort + ":" + currentSortDirection;

  const rawShowInactiveParam = Array.isArray(req.query.showinactive)
    ? req.query.showinactive[0]
    : req.query.showinactive;
  const showinactive =
    rawShowInactiveParam === "true" || rawShowInactiveParam === true;

  if (showinactive) {
    req.query.showinactive = "true";
  } else {
    delete req.query.showinactive;
  }

  let productsReq;
  let productsData;
  let totalPages = 1;

  if (currentSearch) {
    productsReq = await fuzzySearch({
      search: currentSearch,
      count: 50,
      filter: [
        {
          on: "category",
          value: req.query.category,
        },
        { on: "active", value: !showinactive },
      ],
      sort: "",
    });

    productsData = productsReq.result.filter((result) => !!result.internalCode);
  } else {
    const productsResponse = await getProducts(req);
    productsData = productsResponse.sortedData;
    totalPages = productsResponse.totalPages;
  }

  const allProducts = productsData;

  const currentSupplier = req.query.supplier ?? null;

  const currentPage = Number(req.query.page ?? "1");

  return {
    props: {
      allCategories,
      allSuppliers,
      allCategoriesHierarchy,
      currentSearch,
      allProducts,
      totalPages,
      currentPage,
      currentSortDirection,
      currentSort,
      currentCategory,
      currentSupplier,
      showinactive: showinactive,
    },
  };
}
