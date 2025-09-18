import { getAllCategoriesFlattened } from "../../api/categories/public/getallcategoriesflattened";
import { formatCurrency } from "../../../api/utils/formatters/formatcurrency";
import AdminPanelLayout from "../../../components/admin/AdminPanelLayout";
import { getAllCategories } from "../../api/categories/getallcategories";
import { getCoverImageUrl } from "../../../api/utils/getprodcoverimage";
import ImageWithURL from "../../../components/common/image";
import useTranslation from "next-translate/useTranslation";
import { getSuppliers } from "../../api/private/suppliers";
import { Button } from "../../../components/styled/button";
import { Link } from "../../../components/styled/link";
import { fuzzySearch } from "../../api/public/search";
import {
  Pagination,
  PaginationPrevious,
  PaginationList,
  PaginationPage,
  PaginationGap,
  PaginationNext,
} from "../../../components/styled/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/styled/table";
import { useRouter } from "next/router";
import { LuDot } from "react-icons/lu";
import { utils, write } from "xlsx";
import { useState } from "react";
import Head from "next/head";
import {
  FiChevronUp,
  FiSearch,
  FiArrowUp,
  FiDownload,
  FiPlusCircle,
} from "react-icons/fi";
import { getProducts } from "../../api/products/public/getproducts";

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
  const inactiveFilter = props.showinactive === true;

  const CategoryItem = ({ category }) => {
    const [isHovered, setisHovered] = useState(false);
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
                {category?.localized_name[lang]}
              </Link>
              <div
                onClick={() => {
                  setisHovered(!isHovered);
                }}
                className="w-full py-3 pr-4"
              >
                <FiChevronUp
                  className={
                    "ml-auto h-4 w-4 duration-300 " +
                    (isHovered ? "rotate-180" : "")
                  }
                />
              </div>
            </>
          ) : (
            <Link
              className="h-full w-full px-4 py-2 whitespace-nowrap hover:text-blue-400"
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
    showinactive,
  }: {
    page?: number;
    category?: string;
    supplier?: number;
    sort?: string;
    sortDirection?: string;
    search?: string;
    showinactive?: boolean;
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
      link += `&search=${search}&nocache=true`;
    }

    if (supplier == 0) {
    } else if (supplier) {
      link += `&supplier=${supplier}`;
    } else if (currentSupplier) {
      link += `&supplier=${currentSupplier}`;
    }

    const shouldShowInactive =
      typeof showinactive === "boolean" ? showinactive : inactiveFilter;

    if (shouldShowInactive) {
      link += "&showinactive=true";
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

      const customProducts = products.map((product) => {
        const coverPath = getCoverImageUrl(product);
        const imageUrl = coverPath.startsWith("http")
          ? coverPath
          : `https://hdcdn.hocecomv1.com${coverPath}`;

        return {
          Image: imageUrl,
          EAN: product.supplierCode,
          "Code Model": product.internalCode,
          Nom: product.name,
          Couleur: product.color,
          Matériel: product.material,
          "Stock Depot":
            product.shelves.find((shelf) => shelf.establishment.id == 3)
              ?.stock || 0,
          "Stock Magasin":
            product.shelves.find((shelf) => shelf.establishment.id == 1)
              ?.stock || 0,
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
        };
      });

      const sortedProducts = customProducts.sort((a, b) =>
        a.Nom.localeCompare(b.Nom),
      );

      const worksheet = utils.json_to_sheet(sortedProducts);

      const rangeRef = worksheet["!ref"];
      if (rangeRef) {
        const range = utils.decode_range(rangeRef);
        for (let row = range.s.r + 1; row <= range.e.r; row++) {
          const cellAddress = utils.encode_cell({ r: row, c: 0 });
          const cell = worksheet[cellAddress];

          if (!cell || typeof cell.v !== "string" || cell.v.length === 0) {
            continue;
          }

          const escapedUrl = cell.v.replace(/"/g, '""');

          worksheet[cellAddress] = {
            f: `_xlfn.IMAGE("${escapedUrl}")`,
          };
        }

        worksheet["!rows"] = Array.from({ length: range.e.r + 1 }, (_, idx) => {
          if (idx < range.s.r) {
            return undefined;
          }

          if (idx === range.s.r) {
            return { hpt: 24 };
          }

          return { hpx: 120 };
        });

        const columnWidths = worksheet["!cols"] ?? [];
        columnWidths[0] = { wpx: 120 };
        worksheet["!cols"] = columnWidths;
      }

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

  return (
    <>
      <Head>
        <title>{t("stock")}</title>
      </Head>
      <div className="flex w-full flex-row items-center">
        <div className="flex w-full flex-col items-center pt-1 pb-1">
          <div className="my-2 flex w-full flex-wrap items-center gap-2 rounded-md bg-white p-4 shadow-sm">
            <div className="group relative h-full">
              <div className="mr-1 flex h-full flex-row items-center bg-gray-100 py-4 pr-2 pl-3 font-bold text-black">
                {currentCategory
                  ? (allCategories.find((cat) => cat.id == currentCategory)
                      ?.localized_name[lang] ?? t("choose_category"))
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
                {allCategoriesHierarchy.map((category) => (
                  <CategoryItem key={category.id} category={category} />
                ))}
              </div>
            </div>
            <div className="group relative h-full">
              <div className="mr-1 flex h-full flex-row items-center bg-gray-100 py-4 pr-2 pl-3 font-bold text-black">
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
                  <FiSearch
                    style={{
                      height: "100%",
                      width: "28px",
                      margin: "auto 8px",
                    }}
                  />
                </Link>
              </form>
            </div>
            <Button onClick={() => generateXlsx()}>
              <FiDownload />
              <span>{t("Download Excel")}</span>
            </Button>
            <Link href="/admin/products/0">
              <Button color="white">
                <FiPlusCircle />
                <span>{t("Create New Product")}</span>
              </Button>
            </Link>
          </div>
          <div className="w-full rounded-md bg-white p-4 shadow-sm">
            <Table striped>
              <TableHead>
                <TableRow>
                  <TableHeader>
                    <div className="flex flex-row items-center gap-2">
                      <Link href={createLink({ sort: "id", page: 1 })}>
                        {t("creation-date")}
                      </Link>
                      {currentSort == "id" && <OrderArrow />}
                    </div>
                  </TableHeader>
                  <TableHeader>
                    <div className="flex flex-row items-center gap-2">
                      <Link href={createLink({ sort: "name", page: 1 })}>
                        {t("Name")}
                      </Link>
                      {currentSort == "name" && <OrderArrow />}
                    </div>
                  </TableHeader>
                  <TableHeader>
                    <div className="flex flex-row items-center gap-2">
                      <Link
                        href={createLink({ sort: "internalCode", page: 1 })}
                      >
                        {t("code")}
                      </Link>
                      {currentSort == "internalCode" && <OrderArrow />}
                    </div>
                  </TableHeader>
                  <TableHeader>
                    <div className="flex flex-row items-center gap-2">
                      <Link
                        href={createLink({ sort: "supplierCode", page: 1 })}
                      >
                        {t("EAN")}
                      </Link>
                      {currentSort == "supplierCode" && <OrderArrow />}
                    </div>
                  </TableHeader>
                  <TableHeader>
                    <div className="flex flex-row items-center gap-2">
                      <Link href={createLink({ sort: "value", page: 1 })}>
                        {t("Price")}
                      </Link>
                      {currentSort == "value" && <OrderArrow />}
                    </div>
                  </TableHeader>
                  <TableHeader>{t("Stock")}</TableHeader>
                  <TableHeader>
                    <div className="flex flex-row items-center gap-2">
                      <Link href={createLink({ sort: "views", page: 1 })}>
                        {t("views")}
                      </Link>
                      {currentSort == "views" && <OrderArrow />}
                    </div>
                  </TableHeader>
                  <TableHeader>{t("Active")}</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {allProducts?.map((product) => {
                  return (
                    <TableRow
                      href={`/admin/products/${product.id}?return=${encodeURIComponent(
                        router.asPath,
                      )}`}
                      key={product.id}
                    >
                      <TableCell className="relative">
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
                      </TableCell>
                      <TableCell>
                        {product.localized_name
                          ? product.localized_name[lang]
                          : product.name}
                      </TableCell>
                      <TableCell>{product.internalCode}</TableCell>
                      <TableCell>{product.supplierCode}</TableCell>
                      <TableCell>{formatCurrency(product.value)}</TableCell>
                      <TableCell>{product.currentstock}</TableCell>
                      <TableCell>{product.views}</TableCell>
                      <TableCell>
                        <LuDot
                          size={80}
                          color={product.active ? "green" : "red"}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <Pagination className="sticky bottom-0 -mt-1 flex w-full rounded-lg rounded-t-none border-1 border-zinc-950/10 bg-white p-4">
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
        </div>
      </div>
    </>
  );
}

Products.getLayout = function getLayout(page) {
  const { t } = useTranslation("common");
  return <AdminPanelLayout title={t("stock")}>{page}</AdminPanelLayout>;
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
    productsData = (await getProducts(req)).sortedData;
    totalPages = (await getProducts(req)).totalPages;
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
