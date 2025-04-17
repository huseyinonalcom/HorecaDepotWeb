import { FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import StockLayout from "../../../components/stock/StockLayout";
import ProductCard from "../../../components/stock/ProductCard";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";

export default function Stock() {
  const { t, lang } = useTranslation("common");
  const router = useRouter();
  const {
    category = "all",
    search = "",
    page = "1",
  } = router.query as {
    category?: string;
    search?: string;
    page?: string;
  };
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [tempSearch, setTempSearch] = useState(search);
  const [currentCategory, setCurrentCategory] = useState<any>();
  const currentPage = Number(page);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categories, productsData] = await Promise.all([
          (
            await fetch("/api/public/categories/getallcategories?flat=true")
          ).json(),
          (
            await fetch(
              `/api/private/products/fetchproducts?page=${page}&category=${category !== "all" ? category : null}&search=${search}`,
            )
          ).json(),
        ]);

        setCurrentCategory(
          categories.find((cat) => cat.id == category) ?? "all",
        );
        setAllProducts(productsData.data);
        setTotalPages(productsData.meta.pagination.pageCount);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [category, search, currentPage]);

  const createLink = ({
    category,
    search,
    page,
  }: {
    category?: string;
    search?: string;
    page?: number;
  }) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (page) params.set("page", page.toString());

    return `/stock/list/${category ?? "all"}${params.size ? `?${params.toString()}` : ""}`;
  };

  const getPageNumbers = () => {
    let pages: (number | string)[] = [];
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
      if (startPage > 2) pages.push("...");
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <>
      <Head>
        <title>{t("Products")}</title>
        <meta name="language" content={lang} />
      </Head>
      <div className="flex w-full flex-col items-center gap-1 p-2">
        <div className="flex w-full flex-col items-start gap-2 rounded-md border-2 border-gray-300 bg-white p-4 shadow-sm">
          <div className="flex h-full flex-row items-center pl-4 font-bold text-black">
            {t("Category")}:{" "}
            {t(currentCategory?.localized_name?.[lang] ?? "All")}
          </div>
          <div className="flex flex-row items-center gap-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                router.push(createLink({ search: tempSearch, page: 1 }));
              }}
              role="search"
              className="flex flex-row items-center rounded-md bg-gray-100 p-2 shadow-sm"
            >
              <input
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
            <a
              href="/api/private/products/generatestocklist"
              target="_blank"
              className="flex w-[100px] items-center justify-center rounded-md border-2 border-gray-400 bg-black p-2 font-semibold text-white shadow-sm"
            >
              Stock List
            </a>
          </div>
        </div>
        <div className="flex w-full flex-col items-start gap-2">
          {allProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {allProducts.length > 0 && (
          <div className="mt-2 flex w-full flex-row justify-center p-2 px-6">
            <div className="flex items-center justify-center space-x-1">
              <Link
                href={
                  currentPage === 1
                    ? "#"
                    : createLink({
                        category: category ?? "all",
                        page: currentPage - 1,
                        search,
                      })
                }
                className="border bg-white p-2 hover:bg-gray-200"
              >
                <FiChevronLeft size={36} />
              </Link>
              {getPageNumbers().map((p, index) =>
                p === "..." ? (
                  <span key={index} className="p-2">
                    ...
                  </span>
                ) : (
                  <Link
                    key={index}
                    className={`border p-2 text-3xl hover:bg-gray-200 ${p == page ? "bg-gray-300" : "bg-white"}`}
                    href={createLink({
                      category: category ?? "all",
                      page: p as number,
                      search,
                    })}
                  >
                    {p}
                  </Link>
                ),
              )}
              <Link
                href={
                  currentPage === totalPages
                    ? "#"
                    : createLink({
                        category: category ?? "all",
                        page: currentPage + 1,
                        search,
                      })
                }
                className="border bg-white p-2 hover:bg-gray-200"
              >
                <FiChevronRight size={36} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

Stock.getLayout = function getLayout(page: React.ReactNode) {
  return <StockLayout>{page}</StockLayout>;
};
