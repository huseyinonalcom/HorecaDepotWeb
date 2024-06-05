import React, { useState, useEffect, useContext } from "react";
import Head from "next/head";
import useTranslation from "next-translate/useTranslation";
import AdminLayout from "../../components/admin/adminLayout";
import { Product } from "../../api/interfaces/product";
import {
  ArrowUp,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Copy,
  Download,
  PlusCircle,
  Search,
  Upload,
  X,
} from "react-feather";
import Image from "next/image";
import Link from "next/link";
import componentThemes from "../../components/componentThemes";
import BarcodeToPng from "../../components/common/barcodepng";
import { CategoryContext } from "../../api/providers/categoryProvider";
import ButtonShadow1 from "../../components/buttons/shadow_1";
import { utils, write } from "xlsx";
import validateInteger from "../../api/utils/input_validators/validate_integer";
import validateEmpty from "../../api/utils/input_validators/validate_empty";
import validateDecimal from "../../api/utils/input_validators/validate_decimal";
import { formatCurrency } from "../../api/utils/formatters/formatcurrency";
import InputOutlined from "../../components/inputs/outlined";
import MultiSelectionInput from "../../components/inputs/MultiSelectionInput";
import { LuDot } from "react-icons/lu";
import { Router } from "next/router";

export default function Products() {
  const { t, lang } = useTranslation("common");
  const [allCategories, setAllCategories] = useState([]);
  const { categories } = useContext(CategoryContext);
  const [allCategoriesHierarchy, setAllCategoriesHierarchy] = useState([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [newProduct, setNewProduct] = useState<boolean>(false);
  const [chosenProductID, setChosenProductID] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [tempSearch, setTempSearch] = useState<string | null>("");
  const [currentSearch, setCurrentSearch] = useState<string | null>(null);
  const [inProgress, setInProgress] = useState(false);
  const [currentSort, setCurrentSort] = useState<string | null>("id");
  const [currentSortDirection, setCurrentSortDirection] =
    useState<boolean>(false);
  const [currentCategory, setCurrentCategory] = useState(0);

  const buttonClass =
    "flex flex-row items-center justify-start py-2 shadow-lg hover:bg-orange-400 overflow-hidden duration-500 cursor-pointer";
  const navIconDivClass = "flex flex-row justify-center flex-shrink-0 w-[35px]";
  const iconClass = "flex-shrink-0";
  const textClass = "mx-2 font-bold text-left";
  const inputDivClass =
    "flex flex-col items-center shadow-lg gap-2 w-[230px] bg-neutral-300 p-1 h-min";

  useEffect(() => {
    if (currentProduct && currentProduct?.id != 0) {
      setNewProduct(false);
    }
  }, [currentProduct]);

  const toggleProductActive = () => {
    const toggleActive = async () => {
      try {
        const request = await fetch(
          `/api/universal/admin/puttoapi?collectiontoput=products&idtoput=${currentProduct.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ active: !currentProduct.active }),
          },
        );
        if (!request.ok) {
        } else {
          setCurrentProduct({
            ...currentProduct,
            active: !currentProduct.active,
          });
        }
      } catch {}
    };

    toggleActive();
  };

  const toggleProductNew = () => {
    const toggleNew = async () => {
      try {
        const request = await fetch(
          `/api/products/admin/togglenew?id=` + currentProduct.product_extra.id,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ new: !currentProduct.product_extra.new }),
          },
        );
        const answer = await request.json();
        if (!request.ok) {
        } else {
          setCurrentProduct((prevProduct) => ({
            ...prevProduct,
            product_extra: {
              ...prevProduct.product_extra,
              new: answer,
            },
          }));
        }
      } catch {}
    };

    toggleNew();
  };

  const deleteProduct = () => {
    const deleteProd = async () => {
      try {
        const request = await fetch(
          `/api/products/admin/deleteproduct?id=` + currentProduct.id,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );
        if (!request.ok) {
        } else {
          window.location.reload();
        }
      } catch {}
    };

    let confirmDelete = confirm(
      t("Are you sure you want to delete this product?"),
    );

    if (confirmDelete) {
      deleteProd();
    }
  };

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

  useEffect(() => {
    if (newProduct) {
      setCurrentProduct({
        id: 0,
        width: 0,
        height: 0,
        depth: 0,
        categories: [],
        product_extra: {
          weight: 0,
          armrest_height: 0,
          seat_height: 0,
          packaged_weight: 0,
          per_box: 0,
          diameter: 0,
        },
      });
      setChosenProductID(null);
      setErrors({
        internalCode: "Champs requis",
        name: "Champs requis",
        value: "Champs requis",
        barcode: "Champs requis",
      });
    }
  }, [newProduct]);

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

  const fetchProductByID = async (): Promise<boolean> => {
    if (chosenProductID && chosenProductID != 0) {
      const answer = await fetch(
        `/api/products/admin/getproductbyid?id=${chosenProductID}`,
      );
      const data = await answer.json();
      setErrors({});
      setCurrentProduct(data);
      setNewProduct(false);
      return true;
    }
    return false;
  };

  useEffect(() => {
    if (chosenProductID && chosenProductID != 0) {
      fetchProductByID();
    }
  }, [chosenProductID]);

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const uploadFiles = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.target.files && e.target.files[0]) {
      const files = e.target.files;
      await sendFile(files).then((res) => (e.target.value = ""));
    }
  };

  const sendFile = async (files: File[]) => {
    const imgIDs: number[] = [
      ...(currentProduct.images?.map((img) => img.id) ?? []),
    ];

    for (let i = 0; i < files.length; i++) {
      const formData = new FormData();
      formData.append("file", files[i]);
      try {
        const request = await fetch("/api/files/admin/sendfile", {
          method: "POST",
          body: formData,
        });

        if (request.status == 201) {
          const result = await request.json();
          imgIDs.push(result.id);
        }
      } catch (error) {}
    }

    const json = {
      data: {
        images: imgIDs.map((id) => ({ id: id })),
      },
    };

    const request2 = await fetch(
      "/api/products/admin/putproductimages?id=" + currentProduct.id,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(json),
      },
    );

    if (request2.status == 200) {
      await fetchProductByID();
    } else {
    }
  };

  const handleImageDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Starting from the target, move up the DOM tree to find the common parent
    let currentElement = e.target;
    while (
      currentElement &&
      !currentElement.classList.contains("image_parent")
    ) {
      currentElement = currentElement.parentElement;
    }

    // Once the common parent is found, look for the image within it
    if (currentElement) {
      const imageElement = currentElement.querySelector("img");

      if (imageElement && imageElement.id) {
        const deleteRequest = await fetch(
          `/api/files/admin/deletefilebyid?id=${imageElement.id}`,
          { method: "DELETE" },
        );
        fetchProductByID();
      } else {
      }
    } else {
    }
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

  const submitStock = async (id) => {
    const shelf = currentProduct.shelves.find(
      (shelf) => shelf.establishment.id == id,
    );
    const putStock = await fetch(
      `/api/shelves/admin/putshelfstock?id=${shelf.id}`,
      {
        method: "PUT",
        body: JSON.stringify({ stock: shelf.stock }),
      },
    );
  };
  const [submitError, setSubmitError] = useState(null);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    if (inProgress) return;
    setInProgress(true);

    currentProduct.supplierCode = currentProduct.product_extra.barcode;
    console.log(errors);
    if (
      Object.values(errors).some((error) => error != null && error != "") ||
      currentProduct.categories.length == 0
    ) {
      setSubmitError(t("Fill all the required fields correctly!"));
      setInProgress(false);
    } else {
      if (
        allProducts.filter((prod) => prod.id == currentProduct.id).length > 0
      ) {
        try {
          const request = await fetch(
            `/api/products/admin/putproduct?id=` +
              currentProduct.id +
              "&extraid=" +
              currentProduct.product_extra.id,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(currentProduct),
            },
          );
          if (!request.ok) {
            setSubmitError(t("An error occurred while modifying the product!"));
          } else {
            fetchProducts();
            setChosenProductID(null);
          }
        } catch {
          setSubmitError(t("An error occurred while modifying the product!"));
        }
      } else {
        try {
          const request = await fetch("/api/products/admin/postproduct", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(currentProduct),
          });
          if (!request.ok) {
            setSubmitError(t("An error occurred during the product creation!"));
          } else {
            fetchProducts();
            setNewProduct(false);
            setChosenProductID(null);
          }
        } catch {
          setSubmitError(t("An error occurred during the product creation!"));
        }
      }
      setInProgress(false);
      setCurrentProduct(null);
    }
  };

  // Unified change handler
  const handleChange = (
    field: string,
    value: string,
    isSubObject = false,
    validators = [],
  ) => {
    let errorMsg = "";
    for (const validator of validators) {
      // Validate the original value as entered by the user
      errorMsg = validator(value);
      if (errorMsg) break;
    }

    // Update the errors state
    setErrors({ ...errors, [field]: errorMsg });

    // Update the field value regardless of validation result
    const updatedValue = isSubObject
      ? {
          ...currentProduct,
          product_extra: { ...currentProduct.product_extra, [field]: value },
        }
      : { ...currentProduct, [field]: value };

    setCurrentProduct(updatedValue);
  };

  const [newReservation, setNewReservation] = useState({
    client_name: "",
    amount: 1,
  });

  const sendNewReservation = async () => {
    const request = await fetch(
      `/api/products/admin/postreservation?id=` + currentProduct.id,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currProd: currentProduct,
          newRes: newReservation,
        }),
      },
    );
    if (!request.ok) {
      setSubmitError(t("An error occurred while modifying the product!"));
    } else {
      fetchProducts();
      fetchProductByID();
      setNewReservation({
        client_name: "",
        amount: 1,
      });
    }
  };

  const deleteReservation = async (id) => {
    const newProd = currentProduct;
    newProd.reservations = currentProduct.reservations.filter(
      (res) => res.id != id,
    );
    const request = await fetch(
      `/api/products/admin/postreservation?id=` + currentProduct.id,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currProd: currentProduct,
          newRes: null,
        }),
      },
    );
    if (!request.ok) {
      setSubmitError(t("An error occurred while modifying the product!"));
    } else {
      fetchProducts();
      fetchProductByID();
      setNewReservation({
        client_name: "",
        amount: 1,
      });
    }
  };

  // Component state for errors
  type FormErrors = {
    internalCode?: string;
    category?: string;
    supplierCode?: string;
    name?: string;
    priceBeforeDiscount?: string;
    value?: string;
    // material?: string;
    // color?: string;
    weight?: string;
    packaged_weight_net?: string;
    packaged_weight?: string;
    // packaged_dimensions?: string;
    per_box?: string;
    seat_height?: string;
    height?: string;
    width?: string;
    depth?: string;
    diameter?: string;
    barcode?: string;
    armrest_height?: string;
    stock_depot?: string;
    stock_store?: string;
  };

  const [errors, setErrors] = useState<FormErrors>({
    internalCode: "Champs requis",
    name: "Champs requis",
    value: "Champs requis",
  });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentSearch(tempSearch);
  };

  const missingPictures = async () => {
    const answer = await fetch(
      `/api/products/public/getproducts?page=${currentPage}&count=19999`,
    );
    const data = await answer.json();
    const imagelessSorted = data.sortedData.filter((prod) => !prod.images);
    console.log(
      imagelessSorted.map(
        (imgl) => imgl.internalCode + "," + imgl.name + "," + imgl.color,
      ),
    );
  };

  const calculateReserved = (reservations) => {
    var reserved = 0;

    if (reservations && reservations.length > 0) {
      for (let i = 0; i < reservations.length; i++) {
        if (!reservations[i].is_deleted) {
          reserved += reservations[i].amount;
        }
      }
    }

    return reserved;
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
              <button
                className={buttonClass}
                onClick={() => setNewProduct(true)}
              >
                <div className={navIconDivClass}>
                  <PlusCircle className={iconClass} />
                </div>
                <span className={textClass}>{t("Create New Product")}</span>
              </button>
            </div>
          </div>
          <div className="flex-shrink-1 flex w-full flex-col items-center overflow-y-auto pt-1">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {allProducts?.map((product) => (
                <button
                  type="button"
                  onClick={() => {
                    setChosenProductID(product.id);
                  }}
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
                </button>
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

        <div
          className={`fixed top-0 overflow-y-auto p-2 shadow-md transition-transform duration-500 ${currentProduct || newProduct ? "h-full bg-gray-400" : "h-0"}`}
        >
          {(currentProduct || newProduct) && (
            <div className={`flex flex-col`}>
              <form
                className={`flex flex-col items-center justify-center gap-2 overflow-hidden`}
                onSubmit={handleFormSubmit}
              >
                <div className="mb-2 flex flex-row items-center justify-end gap-2">
                  <div className="flex flex-row gap-2">
                    {
                      <div
                        className={`border-1 flex cursor-pointer flex-col items-center justify-center border-black bg-red-600 p-1`}
                        onClick={deleteProduct}
                      >
                        {t("Delete")}
                      </div>
                    }
                    {currentProduct && currentProduct.id != 0 ? (
                      currentProduct.product_extra.new ? (
                        <div
                          className={`border-1 flex cursor-pointer flex-col items-center justify-center border-black bg-green-300 p-1`}
                          onClick={toggleProductNew}
                        >
                          {t("Featured")}
                        </div>
                      ) : (
                        <div
                          className={`border-1 flex cursor-pointer flex-col items-center justify-center border-black bg-red-300 p-1`}
                          onClick={toggleProductNew}
                        >
                          {t("Not Featured")}
                        </div>
                      )
                    ) : null}
                    {currentProduct && currentProduct.id != 0 ? (
                      currentProduct.active ? (
                        <div
                          className={`border-1 flex cursor-pointer flex-col items-center justify-center border-black bg-green-300 p-1`}
                          onClick={toggleProductActive}
                        >
                          {t("Active")}
                        </div>
                      ) : (
                        <div
                          className={`border-1 flex cursor-pointer flex-col items-center justify-center border-black bg-red-300 p-1`}
                          onClick={toggleProductActive}
                        >
                          {t("Inactive")}
                        </div>
                      )
                    ) : null}
                  </div>
                  <ButtonShadow1
                    type="button"
                    onClick={() => {
                      currentProduct.id = 0;
                      setCurrentProduct((pr) => ({
                        ...pr,
                        id: 0,
                        supplierCode: "0",
                        product_extra: {
                          ...pr.product_extra,
                          barcode: "0",
                        },
                      }));
                    }}
                  >
                    <div className="bg-white p-2">
                      <Copy />
                    </div>
                  </ButtonShadow1>
                  {submitError && (
                    <p className="bg-white p-1 text-red-400">{submitError}</p>
                  )}
                  <ButtonShadow1 type="submit">
                    <div className="bg-white p-2">
                      <Check color="green" />
                    </div>
                  </ButtonShadow1>
                  <ButtonShadow1
                    onClick={() => {
                      setNewProduct(false);
                      setCurrentProduct(null);
                      setChosenProductID(null);
                      setSubmitError(null);
                    }}
                  >
                    <div className="bg-white p-2">
                      <X color="red" />
                    </div>
                  </ButtonShadow1>
                </div>
                <div className="flex flex-row">
                  {currentProduct && currentProduct.id != 0 && !newProduct && (
                    <div onDrop={uploadFiles}>
                      <label
                        htmlFor="uploadimg"
                        className={
                          "hover:bg flex cursor-pointer flex-row items-center justify-start overflow-hidden bg-white py-2 shadow-lg duration-500"
                        }
                      >
                        <div className={navIconDivClass}>
                          <Upload className={iconClass} />
                        </div>
                        <span className={textClass}>{t("Upload Image")}</span>
                      </label>
                      <input
                        title={t("Upload Image")}
                        className="absolute h-0 w-0 opacity-0"
                        placeholder={t("Upload Image")}
                        type="file"
                        name="uploadimg"
                        multiple={true}
                        id="uploadimg"
                        onDrop={uploadFiles}
                        onChange={uploadFiles}
                      ></input>
                    </div>
                  )}
                  {currentProduct &&
                    currentProduct.id != 0 &&
                    currentProduct.images?.map((img) => (
                      <div className="image_parent relative" key={img.id}>
                        <Image
                          alt={""}
                          src={"https://hdapi.huseyinonalalpha.com" + img.url}
                          id={img.id.toString()}
                          width={160}
                          height={160}
                        />
                        <div
                          className="absolute right-2 top-2 z-50"
                          onClick={handleImageDelete}
                        >
                          <X className="h-4 w-4" color="red" />
                        </div>
                        <Link
                          target="_blank"
                          className="absolute right-2 top-6"
                          href={"https://hdapi.huseyinonalalpha.com" + img.url}
                        >
                          <Download className="h-4 w-4" color="green" />
                        </Link>
                      </div>
                    ))}
                </div>
                <div className="flex w-full flex-row text-3xl font-semibold">
                  {t("Primary Details")}
                </div>
                <div className="flex w-full flex-wrap items-center justify-start gap-2">
                  <div className="w-[200px]">
                    <InputOutlined
                      label={t("Name")}
                      type="text"
                      error={errors.name}
                      value={currentProduct?.name ?? ""}
                      onChange={(e) =>
                        handleChange("name", e.target.value, false, [
                          validateEmpty,
                        ])
                      }
                    />
                  </div>
                  <div className="w-[200px]">
                    <InputOutlined
                      label={t("Code Model")}
                      type="text"
                      error={errors.internalCode}
                      value={currentProduct?.internalCode ?? ""}
                      onChange={(e) =>
                        handleChange("internalCode", e.target.value, false, [
                          validateEmpty,
                        ])
                      }
                    />
                  </div>
                  <div className="w-[200px]">
                    <InputOutlined
                      label={t("EAN")}
                      type="number"
                      error={errors.barcode}
                      value={currentProduct?.product_extra.barcode ?? ""}
                      onChange={(e) =>
                        handleChange("barcode", e.target.value, true, [
                          validateEmpty,
                        ])
                      }
                    />
                  </div>
                  <div className="hidden w-[200px]">
                    <InputOutlined
                      label={t("Supplier Code")}
                      type="number"
                      error={errors.supplierCode}
                      value={currentProduct?.supplierCode ?? ""}
                      onChange={(e) =>
                        handleChange("supplierCode", e.target.value, false, [])
                      }
                    />
                  </div>
                  <div className="w-[200px]">
                    <InputOutlined
                      label={t("Price Before Discount")}
                      type="number"
                      error={errors.priceBeforeDiscount}
                      value={currentProduct?.priceBeforeDiscount ?? ""}
                      onChange={(e) =>
                        handleChange(
                          "priceBeforeDiscount",
                          e.target.value,
                          false,
                          [validateDecimal],
                        )
                      }
                    />
                  </div>
                  <div className="w-[200px]">
                    <InputOutlined
                      label={t("Selling Price")}
                      type="number"
                      value={currentProduct?.value ?? ""}
                      error={errors.value}
                      onChange={(e) =>
                        handleChange("value", e.target.value, false, [
                          validateDecimal,
                          validateEmpty,
                        ])
                      }
                    />
                  </div>
                </div>
                <div className="w-full flex-row">
                  {!newProduct && (
                    <BarcodeToPng value={currentProduct.supplierCode} />
                  )}
                </div>
                <div className="flex w-full flex-row text-3xl font-semibold">
                  {t("Categories")}
                </div>
                <MultiSelectionInput
                  selectionList={allCategories}
                  selectableList={allCategories.map((cat) => cat.id)}
                  selectedList={
                    currentProduct?.categories?.map((cat) => cat.id) ?? []
                  }
                  onClickAdd={(id) => {
                    const category = allCategories.find((cat) => cat.id === id);
                    if (category) {
                      setCurrentProduct({
                        ...currentProduct,
                        categories: [...currentProduct.categories, category],
                      });
                    }
                  }}
                  onClickRemove={(id) => {
                    setCurrentProduct({
                      ...currentProduct,
                      categories: currentProduct.categories.filter(
                        (cat) => cat.id !== id,
                      ),
                    });
                  }}
                  labelKey="Name"
                  valueKey="id"
                />
                <div className="flex w-full flex-row text-3xl font-semibold">
                  {t("Secondary Details")}
                </div>
                <div className="flex w-full flex-wrap items-center justify-start gap-2">
                  <div className="w-[200px]">
                    <InputOutlined
                      label={t("Material")}
                      type="text"
                      value={currentProduct?.material ?? ""}
                      onChange={(e) => handleChange("material", e.target.value)}
                    />
                  </div>
                  <div className="w-[200px]">
                    <InputOutlined
                      label={t("Color")}
                      type="text"
                      value={currentProduct?.color ?? ""}
                      onChange={(e) => handleChange("color", e.target.value)}
                    />
                  </div>
                  <div className="w-[200px]">
                    <InputOutlined
                      label={t("Weight")}
                      type="number"
                      value={currentProduct?.product_extra?.weight ?? ""}
                      error={errors.weight}
                      onChange={(e) =>
                        handleChange("weight", e.target.value, true, [
                          validateInteger,
                        ])
                      }
                    />
                  </div>
                  <div className="w-[200px]">
                    <InputOutlined
                      label={t("Packaged Weight Net")}
                      type="number"
                      error={errors.packaged_weight_net}
                      value={
                        currentProduct?.product_extra?.packaged_weight_net ?? ""
                      }
                      onChange={(e) =>
                        handleChange(
                          "packaged_weight_net",
                          e.target.value,
                          true,
                          [validateDecimal],
                        )
                      }
                    />
                  </div>
                  <div className="w-[200px]">
                    <InputOutlined
                      label={t("Packaged Weight")}
                      type="number"
                      error={errors.packaged_weight}
                      value={
                        currentProduct?.product_extra?.packaged_weight ?? ""
                      }
                      onChange={(e) =>
                        handleChange("packaged_weight", e.target.value, true, [
                          validateDecimal,
                        ])
                      }
                    />
                  </div>
                  <div className="w-[200px]">
                    <InputOutlined
                      label={t("Packaged Dimensions")}
                      type="text"
                      value={
                        currentProduct?.product_extra?.packaged_dimensions ?? ""
                      }
                      onChange={(e) =>
                        handleChange("packaged_dimension", e.target.value, true)
                      }
                    />
                  </div>
                  <div className="w-[200px]">
                    <InputOutlined
                      label={t("Per Box")}
                      type="number"
                      error={errors.per_box}
                      value={currentProduct?.product_extra?.per_box ?? ""}
                      onChange={(e) =>
                        handleChange("per_box", e.target.value, true, [
                          validateInteger,
                        ])
                      }
                    />
                  </div>
                  <div className="w-[200px]">
                    <InputOutlined
                      label={t("Height")}
                      type="number"
                      error={errors.height}
                      value={currentProduct?.height ?? ""}
                      onChange={(e) =>
                        handleChange("height", e.target.value, false, [
                          validateInteger,
                        ])
                      }
                    />
                  </div>
                  <div className="w-[200px]">
                    <InputOutlined
                      label={t("Width")}
                      type="number"
                      error={errors.width}
                      value={currentProduct?.width ?? ""}
                      onChange={(e) =>
                        handleChange("width", e.target.value, false, [
                          validateInteger,
                        ])
                      }
                    />
                  </div>
                  <div className="w-[200px]">
                    <InputOutlined
                      label={t("Depth")}
                      type="number"
                      error={errors.depth}
                      value={currentProduct?.depth ?? ""}
                      onChange={(e) =>
                        handleChange("depth", e.target.value, false, [
                          validateInteger,
                        ])
                      }
                    />
                  </div>
                  <div className="w-[200px]">
                    <InputOutlined
                      label={t("Diameter")}
                      type="number"
                      error={errors.diameter}
                      value={currentProduct?.product_extra?.diameter ?? ""}
                      onChange={(e) =>
                        handleChange("diameter", e.target.value, true, [
                          validateInteger,
                        ])
                      }
                    />
                  </div>
                  <div className="w-[200px]">
                    <InputOutlined
                      label={t("Seat Height")}
                      type="number"
                      error={errors.seat_height}
                      value={currentProduct?.product_extra?.seat_height ?? ""}
                      onChange={(e) =>
                        handleChange("seat_height", e.target.value, true, [
                          validateInteger,
                        ])
                      }
                    />
                  </div>
                  <div className="w-[200px]">
                    <InputOutlined
                      label={t("Armrest Height")}
                      type="number"
                      error={errors.armrest_height}
                      value={
                        currentProduct?.product_extra?.armrest_height ?? ""
                      }
                      onChange={(e) =>
                        handleChange("armrest_height", e.target.value, true, [
                          validateInteger,
                        ])
                      }
                    />
                  </div>
                </div>

                <div className="flex w-full flex-wrap items-center justify-start gap-2">
                  <div
                    className={
                      "flex h-[250px] w-[350px] flex-col items-center gap-2 bg-neutral-300 p-1 shadow-lg"
                    }
                  >
                    <p>{t("Tags")}</p>
                    <textarea
                      className="h-full w-full"
                      value={currentProduct?.product_extra?.tags ?? ""}
                      onChange={(e) =>
                        handleChange("tags", e.target.value, true, [])
                      }
                      placeholder={t("Tags")}
                    />
                  </div>
                  <div
                    className={
                      "flex h-[250px] w-[350px] flex-col items-center gap-2 bg-neutral-300 p-1 shadow-lg"
                    }
                  >
                    <p>{t("Description")}</p>
                    <textarea
                      className="h-full w-full"
                      value={currentProduct?.description ?? ""}
                      onChange={(e) =>
                        handleChange("description", e.target.value, false, [])
                      }
                      placeholder={t("Description")}
                    />
                  </div>
                  {chosenProductID != 0 && chosenProductID != null && (
                    <>
                      <div className={inputDivClass}>
                        <div className="flex flex-row items-center gap-2">
                          <p className="whitespace-nowrap">
                            {t("Stock Warehouse")}
                          </p>
                          <button
                            onClick={() => submitStock(3)}
                            className={componentThemes.greenSubmitButton}
                          >
                            {t("Save")}
                          </button>
                        </div>
                        <input
                          type="number"
                          value={
                            currentProduct?.shelves?.find(
                              (shelf) => shelf.establishment.id == 3,
                            ).stock
                          }
                          onSubmit={(e) => {
                            e.preventDefault();
                            submitStock(3);
                          }}
                          onChange={(e) => {
                            if (validateInteger(e.target.value) == "") {
                              const updatedProduct = { ...currentProduct };
                              const shelfIndex =
                                updatedProduct.shelves.findIndex(
                                  (shelf) => shelf.establishment.id === 3,
                                );
                              if (shelfIndex !== -1) {
                                updatedProduct.shelves[shelfIndex].stock =
                                  Number(e.target.value);
                                setCurrentProduct(updatedProduct);
                              }
                              errors.stock_depot = "";
                            } else {
                              errors.stock_depot = validateInteger(
                                e.target.value,
                              );
                            }
                          }}
                          placeholder={t("Stock Warehouse")}
                        />
                        {errors.stock_depot && (
                          <div className="error-message">
                            {errors.stock_depot}
                          </div>
                        )}
                      </div>
                      <div className={inputDivClass}>
                        <div className="flex flex-row items-center gap-2">
                          <p className="whitespace-nowrap">
                            {t("Stock Store")}
                          </p>
                          <button
                            onClick={() => submitStock(1)}
                            className={componentThemes.greenSubmitButton}
                          >
                            {t("Save")}
                          </button>
                        </div>
                        <input
                          type="number"
                          value={
                            currentProduct?.shelves?.find(
                              (shelf) => shelf.establishment.id == 1,
                            ).stock
                          }
                          onSubmit={(e) => {
                            e.preventDefault();
                            submitStock(1);
                          }}
                          onChange={(e) => {
                            if (validateInteger(e.target.value) == "") {
                              const updatedProduct = { ...currentProduct };
                              const shelfIndex =
                                updatedProduct.shelves.findIndex(
                                  (shelf) => shelf.establishment.id === 1,
                                );
                              if (shelfIndex !== -1) {
                                updatedProduct.shelves[shelfIndex].stock =
                                  Number(e.target.value);
                                setCurrentProduct(updatedProduct);
                              }
                              errors.stock_store = "";
                            } else {
                              errors.stock_store = validateInteger(
                                e.target.value,
                              );
                            }
                          }}
                          placeholder={t("Stock Store")}
                        />
                        {errors.stock_store && (
                          <div className="error-message">
                            {errors.stock_store}
                          </div>
                        )}
                      </div>
                      {!newProduct && (
                        <>
                          <div className={inputDivClass}>
                            <p>{t("reservation_new")}</p>
                            <input
                              type="number"
                              onSubmit={(e) => {
                                e.preventDefault();
                              }}
                              value={newReservation.amount}
                              onChange={(e) => {
                                const validIntegerRegex = /^\d+$/;
                                if (validIntegerRegex.test(e.target.value))
                                  setNewReservation((nr) => ({
                                    ...nr,
                                    amount: parseInt(e.target.value, 10),
                                  }));
                              }}
                              placeholder={t("Amount")}
                            />
                            <input
                              type="text"
                              onSubmit={(e) => {
                                e.preventDefault();
                              }}
                              value={newReservation.client_name}
                              onChange={(e) =>
                                setNewReservation((nr) => ({
                                  ...nr,
                                  client_name: e.target.value,
                                }))
                              }
                              placeholder={t("Client")}
                            />
                            <button
                              type="button"
                              className={componentThemes.greenSubmitButton}
                              onClick={(e) => {
                                e.preventDefault();
                                sendNewReservation();
                              }}
                            >
                              {t("reservation_create")}
                            </button>
                          </div>
                          <div className={inputDivClass}>
                            <p>{t("reservations")}</p>
                            <div className="flex flex-wrap gap-2">
                              {currentProduct.reservations &&
                                currentProduct.reservations.length > 0 &&
                                currentProduct.reservations.map(
                                  (res, index) => (
                                    <div key={index}>
                                      {res.client_name}
                                      {": x"}
                                      {res.amount}
                                      {"  "}
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          deleteReservation(res.id);
                                        }}
                                      >
                                        <X color="red" />
                                      </button>
                                    </div>
                                  ),
                                )}
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
      {/* <button onClick={() => missingPictures()}>missing pics</button> */}
    </AdminLayout>
  );
}
