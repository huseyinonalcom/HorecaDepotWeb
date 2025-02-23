import { getAllCategoriesFlattened } from "../../api/categories/public/getallcategoriesflattened";
import { formatCurrency } from "../../../api/utils/formatters/formatcurrency";
import { ChevronLeft, ChevronRight, ChevronUp, Search } from "react-feather";
import { fetchProducts } from "../../api/products/admin/fetchProducts";
import StockLayout from "../../../components/stock/StockLayout";
import ImageWithURL from "../../../components/common/image";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";
import Head from "next/head";

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

    if (search) {
      link += `&search=${search}`;
    } else if (tempSearch) {
      link += `&search=${tempSearch}`;
    } else if (currentSearch) {
      link += `&search=${currentSearch}`;
    }

    return link;
  };

  const [productForPreview, setProductForPreview] = useState<any>();
  const [focusedImageIndex, setFocusedImageId] = useState<number>();

  return (
    <>
      <Head>
        <title>{t("Products")}</title>
        <meta name="language" content={lang} />
      </Head>
      <div className="flex w-full flex-row items-center">
        <div className="flex w-full flex-col items-center pb-1 pt-1">
          <div className="my-2 flex w-full flex-wrap items-center gap-2 rounded-md bg-white p-4 shadow-sm">
            <div className="group relative h-full">
              <div className="mr-1 flex h-full flex-row items-center bg-gray-100 py-4 pl-3 pr-2 font-bold text-black">
                {t(
                  currentCategory
                    ? allCategories.find((cat) => cat.id == currentCategory)
                        ?.localized_name[lang] ?? t("choose_category")
                    : t("choose_category"),
                )}
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
              </div>
            </div>
            <div className="group relative h-full">
              <div className="invisible absolute -left-5 top-8 z-50 mt-4 w-[240px] bg-white py-2 text-gray-500 opacity-0 shadow-lg duration-300 group-hover:visible group-hover:opacity-100">
                <div className="flex w-full cursor-pointer items-center justify-between text-left hover:bg-gray-200">
                  <Link
                    className="h-full w-full whitespace-nowrap px-4 py-2"
                    href={createLink({ page: 1 })}
                  >
                    {t("All")}
                  </Link>
                </div>
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
          </div>
          <div className="flex w-full flex-col items-start gap-2">
            {allProducts?.map((product) => (
              <div
                key={product.id}
                className="w-full rounded-md border-2 border-gray-300 bg-white p-2 shadow-md"
              >
                <div className="flex h-24 w-full flex-row items-center gap-2">
                  {product.images?.map((image) => (
                    <button
                      key={image.id}
                      style={{ height: 96, width: 96 }}
                      onClick={() => {
                        setProductForPreview(product);
                        setFocusedImageId(image.id);
                      }}
                    >
                      <ImageWithURL
                        height={96}
                        width={96}
                        src={image.url}
                        alt={product.name}
                        style={{ objectFit: "contain", height: 96, width: 96 }}
                      />
                    </button>
                  ))}
                </div>
                <h2>{product.name}</h2>
                <p>
                  Catégorie:{" "}
                  {product.categories
                    .map((cat) => cat.localized_name[lang])
                    .join(", ")}
                </p>
                <p>{formatCurrency(product.value)}</p>
                <p>
                  {product.product_extra.EAN ??
                    product.product_extra.supplierCode}
                </p>
                <p>
                  Dimensions (cm): {product.height} x {product.width} x{" "}
                  {product.depth}
                </p>
                <p>
                  Dimensions de la boîte:{" "}
                  {product.product_extra.packaged_dimensions}
                </p>
                <p>Couleur: {product.product_color?.name ?? ""}</p>
                <p>Matériau: {product.material}</p>
                <p>Lien vers le PDF du produit: Voir le PDF</p>
                <p>
                  Total Stock:{" "}
                  {product.shelves.reduce((acc, shelf) => acc + shelf.stock, 0)}
                </p>
                <p>
                  Réservé:{" "}
                  {product.reservations.reduce(
                    (acc, res) => acc + res.amount,
                    0,
                  )}
                </p>
              </div>
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
      category: req.query.category,
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
