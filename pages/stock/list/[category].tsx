import { getAllCategoriesFlattened } from "../../api/categories/public/getallcategoriesflattened";
import { ChevronLeft, ChevronRight, Search } from "react-feather";
import StockLayout from "../../../components/stock/StockLayout";
import ProductCard from "../../../components/stock/ProductCard";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { fetchProducts } from "../../api/private/products/fetchProducts";

export default function Stock(props) {
  const { t, lang } = useTranslation("common");
  const router = useRouter();
  const allProducts = props.allProducts;
  const totalPages = props.totalPages;
  const currentPage = props.currentPage;
  const currentSearch = props.currentSearch;
  const [tempSearch, setTempSearch] = useState<string | null>(
    currentSearch ?? "",
  );
  const currentCategory = props.currentCategory ?? "all";
  const allCategories = props.allCategories;

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

  const createLink = ({
    category,
    search,
    page,
  }: {
    category?: string;
    search?: string;
    page?: number;
  }) => {
    let link = "/stock/list/";

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

    if (search) {
      link += `&search=${search}`;
    } else if (tempSearch) {
      link += `&search=${tempSearch}`;
    }

    return link;
  };

  return (
    <>
      <Head>
        <title>{t("Products")}</title>
        <meta name="language" content={lang} />
      </Head>
      <div className="flex w-full flex-col items-center gap-1">
        <div className="flex w-full flex-col items-start gap-1 rounded-md border-2 border-gray-300 bg-white p-4 shadow-sm">
          <div className="flex h-full flex-row items-center px-6 py-4 font-bold text-black">
            {t("Category")}:{" "}
            {t(
              currentCategory
                ? allCategories.find((cat) => cat.id == currentCategory)
                    ?.localized_name[lang] ?? t("All")
                : t("All"),
            )}
          </div>
          <div
            className="min-w-[280px]"
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
        </div>
        <div className="flex w-full flex-col items-start gap-2">
          {allProducts?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <>
          {allProducts.length > 0 ? (
            <div className="mt-2 flex w-full flex-row justify-center p-2 px-6">
              <div className="flex items-center justify-center space-x-1">
                <Link
                  href={
                    currentPage == 1
                      ? "#"
                      : createLink({ page: currentPage - 1 })
                  }
                  className="border bg-white p-2 hover:bg-gray-200"
                >
                  <ChevronLeft size={36} />
                </Link>
                {getPageNumbers().map((page, index) =>
                  page === "..." ? (
                    <span key={index} className="p-2">
                      ...
                    </span>
                  ) : (
                    <Link
                      key={index}
                      className={`border p-2 text-3xl hover:bg-gray-200 ${
                        currentPage === page ? "bg-gray-300" : "bg-white"
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
                  className="border bg-white p-2 hover:bg-gray-200"
                >
                  <ChevronRight size={36} />
                </Link>
              </div>
            </div>
          ) : (
            <p></p>
          )}
        </>
      </div>
    </>
  );
}

Stock.getLayout = function getLayout(page) {
  return <StockLayout>{page}</StockLayout>;
};

export async function getServerSideProps(context) {
  const req = context.req;
  req.query = context.query;
  const currentCategory = req.query.category ?? null;
  const currentSearch = req.query.search ?? null;

  if (req.query.category == "all") {
    delete req.query.category;
  }
  let allCategories = [];
  let currentPage = 1;
  let totalPages = 1;
  let allProducts = [];

  try {
    const productsData = await fetchProducts({
      authToken: req.cookies.j,
      category: req.query.category != `all` ? req.query.category : null,
      page: Number((req.query.page ?? "1") as string),
      search: req.query.search as string,
    });
    allProducts = productsData.data;
    currentPage = productsData.meta.pagination.page;
    allCategories = await getAllCategoriesFlattened();
    totalPages = productsData.meta.pagination.pageCount;
  } catch (error) {
    console.error(error);
  }

  return {
    props: {
      allCategories,
      currentSearch,
      allProducts,
      currentPage,
      totalPages,
      currentCategory,
    },
  };
}
