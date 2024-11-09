import { getAllCategoriesFlattened } from "../api/categories/public/getallcategoriesflattened";
import ProductPreview2 from "../../components/products/product-preview2";
import { getProducts } from "../api/products/public/getproducts";
import useTranslation from "next-translate/useTranslation";
import { ArrowUp, ChevronLeft, X } from "react-feather";
import { Product } from "../../api/interfaces/product";
import { ReactElement, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import ImageWithURL from "../../components/common/image";
import ShopLayout from "../../components/shoplayout";
import Layout from "../../components/public/layout";

export default function Products(props) {
  const { t, lang } = useTranslation("common");

  const currentPage = props.currentPage;
  const totalPages = props.totalPages;
  const allProducts = props.products;
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
                href={`/${lang}/shop/${encodeURIComponent(t(category.localized_name[lang]))}?page=1`}
                className="h-full whitespace-nowrap px-4 py-2"
              >
                {t(category.localized_name[lang])}
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
              href={`/${lang}/shop/${encodeURIComponent(t(category.localized_name[lang]))}?page=1`}
              className="h-full w-full whitespace-nowrap px-4 py-2"
            >
              {t(category.localized_name[lang])}
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

  const createLink = (props) => {
    let link = "/shop/";
    if (props.currentCategory) {
      link += t(props.currentCategory.localized_name[lang]) + "?";
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
    <Layout>
      <ShopLayout>
      <Head>
        <title>Horeca Depot</title>
        <meta name="description" content={t("main_description")} />
        <meta name="language" content={lang} />
      </Head>
      <div
        id={t("Shop")}
        className="flex w-full flex-col items-start text-black lg:flex-row"
      >
        <div className="flex w-full flex-col">
          {currentCategory?.subCategories &&
            currentCategory.subCategories.length > 0 && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {currentCategory.subCategories.map((category) => (
                  <div key={`grid1-${category.id}`} className={``}>
                    <Link
                      href={`/shop/${t(category.localized_name[lang])}?page=1`}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className="relative aspect-[15/14] w-full overflow-hidden rounded-xl">
                        <ImageWithURL
                          fill
                          style={{ objectFit: "contain" }}
                          sizes="95vw, (max-width: 640px) 80vw, (max-width: 1024px) 50vw, (nax-width: 1536px) 25vw"
                          src={
                            category.image != null
                              ? category.image.url
                              : "/uploads/placeholder_9db455d1f1.webp"
                          }
                          alt={t(category.localized_name[lang]) + " image"}
                        />
                      </div>
                      <p className="font-semibold">
                        {t(category.localized_name[lang])}
                      </p>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          <div className="flex flex-col md:flex-row">
            <h2 className="mt-2 flex w-full justify-center text-5xl font-bold">
              {t(currentCategory?.localized_name[lang] ?? "Shop")}
            </h2>
            <div className="my-auto flex h-fit flex-row gap-2 pl-4 pr-4">
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
      </ShopLayout>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const categoriesFlat = await getAllCategoriesFlattened();

  const currentSort = context.query?.sort?.split(":").at(0) ?? "value";
  const currentSortDirection = context.query?.sort?.split(":").at(1) ?? "asc";

  context.query.sort = currentSort + ":" + currentSortDirection;

  const productsReq = await getProducts({
    query: context.query,
  });

  const products = (productsReq?.sortedData as Product[]) ?? [];
  const totalPages = (productsReq?.totalPages as number) ?? [];
  const currentPage = context.query.page ?? 1;
  const currentCategory =
    categoriesFlat.find((cat) => cat.id == productsReq?.currentCategoryID) ??
    null;

  return {
    props: {
      products,
      totalPages,
      currentPage,
      currentCategory,
      currentSort,
      currentSortDirection,
    },
  };
}

