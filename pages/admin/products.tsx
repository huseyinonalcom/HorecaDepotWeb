import React, { useState, useEffect, useRef, useContext } from "react";
import Head from "next/head";
import useTranslation from "next-translate/useTranslation";
import AdminLayout from "../../components/admin/adminLayout";
import { Product, ProductTransformer } from "../../api/interfaces/product";
import {
  ArrowUp,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Download,
  Minus,
  PlusCircle,
  Search,
  Upload,
  X,
} from "react-feather";
import Image from "next/image";
import Link from "next/link";
import componentThemes from "../../components/componentThemes";
import BarcodeToPng from "../../components/common/barcodepng";
import LoadingIndicator from "../../components/common/loadingIndicator";
import { CategoryContext } from "../../api/providers/categoryProvider";
import { Category } from "../../api/interfaces/category";
import ButtonShadow1 from "../../components/buttons/shadow_1";
import { read, utils, write } from "xlsx";

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
  const [selectedRows, setSelectedRows] = useState(new Set<number>());
  const [inProgress, setInProgress] = useState(false);
  let lastSelectedRow = useRef<number | null>(null);
  const [currentSort, setCurrentSort] = useState<string | null>("id");
  const [currentSortDirection, setCurrentSortDirection] =
    useState<boolean>(false);
  const [currentCategory, setCurrentCategory] = useState(0);

  const buttonClass =
    "flex flex-row items-center justify-start py-2 rounded shadow-lg hover:bg-orange-400 overflow-hidden duration-500 cursor-pointer";
  const navIconDivClass = "flex flex-row justify-center flex-shrink-0 w-[35px]";
  const iconClass = "flex-shrink-0";
  const textClass = "mx-2 font-bold text-left";
  const inputDivClass =
    "flex flex-col items-center shadow-lg gap-2 w-[230px] bg-neutral-300 p-1 h-min";
  const inputClass = "w-full";

  useEffect(() => {
    setIsProductExpanded(true);
    setNewProduct(false);
  }, [currentProduct]);

  const toggleProductActive = () => {
    const toggleActive = async () => {
      try {
        const request = await fetch(
          `/api/products/admin/toggleactive?id=` + currentProduct.id,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ active: !currentProduct.active }),
          }
        );
        const answer = await request.json();
        if (!request.ok) {
        } else {
          setCurrentProduct({ ...currentProduct, active: answer });
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
          }
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
        <div className="w-full text-left flex justify-between items-center hover:bg-gray-200">
          {hasSubCategories ? (
            <>
              <div
                className="whitespace-nowrap h-full py-2 px-4"
                // onClick={() => {
                //   setCurrentCategory(category.id);
                // }}
                onClick={() => {
                  setisHovered(!isHovered);
                }}
              >
                {t(category.Name)}
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
                    "ml-auto w-4 h-4 duration-300 " +
                    (isHovered ? "rotate-180" : "")
                  }
                />
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
          <div
            className={
              "pl-4 overflow-hidden transition-max-height duration-300 ease-in-out " +
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
        category: { id: 0 },
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
        category: "Champs requis",
        supplierCode: "Champs requis",
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
      }`
    );
    const data = await answer.json();
    setAllProducts(data["data"]);
    setTotalPages(data["meta"]["pagination"]["pageCount"]);
  };

  const fetchCategories = async () => {
    const answer = await fetch(
      `/api/categories/public/getallcategoriesflattened`
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

  const fetchProductByID = async () => {
    if (chosenProductID && chosenProductID != 0) {
      const answer = await fetch(
        `/api/products/admin/getproductbyid?id=${chosenProductID}`
      );
      const data = await answer.json();
      setErrors({});
      setCurrentProduct(data);
      setNewProduct(false);
    }
  };

  useEffect(() => {
    if (chosenProductID && chosenProductID != 0) {
      fetchProductByID();
    }
  }, [chosenProductID]);

  const goToPage = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleRowClick = (
    index: number,
    event: React.MouseEvent<HTMLTableRowElement, MouseEvent>
  ) => {
    const newSelectedRows = new Set(selectedRows);

    if (event.shiftKey && lastSelectedRow.current !== null) {
      const start = Math.min(lastSelectedRow.current, index);
      const end = Math.max(lastSelectedRow.current, index);
      for (let i = start; i <= end; i++) {
        newSelectedRows.add(i);
      }
    } else if (event.ctrlKey || event.metaKey) {
      if (newSelectedRows.has(index)) {
        newSelectedRows.delete(index);
      } else {
        newSelectedRows.add(index);
      }
    } else {
      newSelectedRows.clear();
      newSelectedRows.add(index);
    }

    lastSelectedRow.current = index;
    setSelectedRows(newSelectedRows);
  };

  const uploadFile = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      await sendFile(file).then((res) => (e.target.value = ""));
    }
  };

  const sendFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const request = await fetch("/api/files/admin/sendfile", {
        method: "POST",
        body: formData,
      });

      if (request.status == 201) {
        const result = await request.json();

        const imgIDs: number[] = [];
        imgIDs.push(result.id);
        if (currentProduct.images != null) {
          currentProduct.images.forEach((img) => {
            imgIDs.push(img.id);
          });
        }
        let json = '{"data": {"images": [';
        for (let i = 0; i < imgIDs.length; i++) {
          json += `{"id":${imgIDs[i]}},`;
        }
        json = json.slice(0, json.length - 1);
        json += "]}}";

        const request2 = await fetch(
          "/api/products/admin/putproductimages?id=" + currentProduct.id,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: json,
          }
        );

        if (request2.status == 200) {
          fetchProductByID();
        } else {
        }
      } else {
      }
    } catch (error) {}
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
          { method: "DELETE" }
        );
        fetchProductByID();
      } else {
      }
    } else {
    }
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processFile(file);
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  const categoryToId = (category: string) => {
    switch (category) {
      case "Chaises Intérieur":
        return 3;
      case "Chaises Extérieur":
        return 2;
      case "Banquettes":
        return 10;
      case "Tabourets de Bar Intérieur":
        return 29;
      case "Événement":
        return 17;
      case "Pieds de Table Intérieur":
        return 9;
      case "Pieds de Table Extérieur":
        return 8;
      case "Plateaux Intérieur":
        return 21;
      case "Plateaux Extérieur":
        return 20;
      default:
        return 0;
    }
  };

  let allProductsFromAPI;

  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff;
    return buf;
  }

  const getAllProductsByCategories = async () => {
    const answer = await fetch(
      `/api/products/admin/getallproducts?page=1&count=19999&sort=${currentSort}:${
        !currentSortDirection ? "desc" : "asc"
      }`
    );
    const data = await answer.json();
    let groupedData = {};

    data.data.forEach((prod) => {
      const categoryName = prod.category.Name;

      if (!groupedData.hasOwnProperty(categoryName)) {
        groupedData[categoryName] = [];
      }

      groupedData[categoryName].push(prod);
    });

    return groupedData;
  };

  const generateXlsx = async () => {
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
        customProducts.sort((a, b) => a.Nom.localeCompare(b.Nom))
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

  const excelUpload = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    processFile(file);
  };

  const processFile = (file) => {
    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = e.target.result;
      const workbook = read(data, { type: "array" });

      const sheets: string[] = workbook.SheetNames;

      const allIDsReq = await fetch("/api/products/admin/getallids");
      const allIDsAns = await allIDsReq.json();
      allProductsFromAPI = allIDsAns.data;
      let allProdsFromExcel = [];
      for (let i = 0; i < sheets.length; i++) {
        const categoryID = categoryToId(sheets[i]);
        if (categoryID != 0) {
          const worksheet = workbook.Sheets[sheets[i]];
          const json = utils.sheet_to_json(worksheet);
          const excelProds = ProductTransformer.fromXLSX(JSON.stringify(json));
          excelProds.forEach((prod) => {
            prod.category = { id: categoryID } as Category;
          });
          setCategoriesTotal((c) => c + 1);
          sendProductsToAPI(excelProds);
          allProdsFromExcel.push(...excelProds);
        }
        if (!count) {
          setCount(0);
        }
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const [categoriesTotal, setCategoriesTotal] = useState(0);
  const [count, setCount] = useState(null);

  const sendProductsToAPI = async (prodsToPOST: Product[]) => {
    let track = 0;
    prodsToPOST.forEach(async (prodToPost) => {
      let prodFromAPI = allProductsFromAPI.find(
        (prod) =>
          prod.supplierCode.toString() == prodToPost.supplierCode.toString()
      );
      if (prodFromAPI) {
        let idToPost = prodFromAPI.id;
        let idToPostExtra = prodFromAPI.product_extra.id;
        prodToPost.shelves.find((shelf) => shelf.id == 1).id =
          prodFromAPI.shelves.find((shelf) => shelf.establishment.id == 1).id;

        prodToPost.shelves.find((shelf) => shelf.id == 3).id =
          prodFromAPI.shelves.find((shelf) => shelf.establishment.id == 3).id;

        try {
          const request = await fetch(
            `/api/products/admin/putproduct?batch=true&id=` +
              idToPost +
              "&extraid=" +
              idToPostExtra,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(prodToPost),
            }
          );

          if (!request.ok) {
            throw new Error(`Put failed: ${request.status}`);
          } else {
          }
        } catch (error) {}
      } else {
        try {
          const request = await fetch("/api/products/admin/postproduct", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(prodToPost),
          });

          if (!request.ok) {
            throw new Error(`Post failed: ${request.status}`);
          } else {
          }
        } catch (error) {}
      }
      track++;
      if (track == prodsToPOST.length - 1) {
        setCount((c) => c + 1);
      }
    });
  };

  const submitStock = async (id) => {
    const shelf = currentProduct.shelves.find(
      (shelf) => shelf.establishment.id == id
    );
    const putStock = await fetch(
      `/api/shelves/admin/putshelfstock?id=${shelf.id}`,
      {
        method: "PUT",
        body: JSON.stringify({ stock: shelf.stock }),
      }
    );
  };
  const [submitError, setSubmitError] = useState(null);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    if (inProgress) return;
    setInProgress(true);
    setSelectedRows(new Set<number>());
    if (Object.values(errors).some((error) => error !== "")) {
      setSubmitError(t("Remplir tous les champs requis correctement!"));
      setInProgress(false);
    } else if (currentProduct.category.id == 0) {
      setSubmitError(t("Choissisez un categorie!"));
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
            }
          );
          if (!request.ok) {
            setSubmitError(
              t("Un erreur s'est produite pendant la modification de produit!")
            );
          } else {
            fetchProducts();
            setChosenProductID(null);
            setSelectedRows(new Set());
          }
        } catch {
          setSubmitError(
            t("Un erreur s'est produite pendant la modification de produit!")
          );
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
          const answer = await request.json();
          if (!request.ok) {
            setSubmitError(
              t("Un erreur s'est produite pendant la creation de produit!")
            );
          } else {
            fetchProducts();
            setSelectedRows(new Set());
            setNewProduct(false);
            setChosenProductID(null);
          }
        } catch {
          setSubmitError(
            t("Un erreur s'est produite pendant la creation de produit!")
          );
        }
      }
      setInProgress(false);
      setCurrentProduct(null);
    }
  };

  // Reusable validators
  const validateDecimal = (value: string) => {
    const num = Number(value.replaceAll(",", "."));
    if (isNaN(num) || num < 0) return t("Décimal invalide");
    return "";
  };

  const validateInteger = (value: String) => {
    if (value.includes(",") || value.includes(".")) return t("Entier invalide");
    const num = Number(value);
    if (isNaN(num) || num < 0) return t("Entier invalide");
    return "";
  };

  const validateEmpty = (value: string) => {
    return value.trim() === "" ? t("Champ requis") : "";
  };

  // Unified change handler
  const handleChange = (
    field: string,
    value: string,
    isSubObject = false,
    validators = []
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
    category: "Champs requis",
    supplierCode: "Champs requis",
    name: "Champs requis",
    value: "Champs requis",
  });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentSearch(tempSearch);
  };

  const missingPictures = async () => {
    const answer = await fetch(
      `/api/products/public/getproducts?page=${currentPage}&count=19999`
    );
    const data = await answer.json();
    const imagelessSorted = data.sortedData
      .filter((prod) => !prod.images)
      .sort((a, b) => {
        if (a.category.id !== b.category.id) {
          return a.category.id - b.category.id;
        }
        return a.name.localeCompare(b.name);
      });
    console.log(
      imagelessSorted.map(
        (imgl) =>
          imgl.category.Name +
          "," +
          imgl.internalCode +
          "," +
          imgl.name +
          "," +
          imgl.color
      )
    );
  };

  const [isProductExpanded, setIsProductExpanded] = useState(true);

  useEffect(() => {
    if (count == categoriesTotal) {
      window.location.reload();
    }
  }, [count]);

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center">
        {count}/{categoriesTotal}
        <LoadingIndicator />
      </div>
    );
  } else
    return (
      <AdminLayout>
        <Head>
          <title>Produits</title>
          <meta name="language" content={lang} />
        </Head>
        <div className="flex flex-1 max-h-[100vh] pb-1 flex-col items-center pt-1">
          <div className="flex mb-1 flex-row items-center gap-2">
            <div className="group relative h-full">
              <div className="flex flex-row items-center mr-1 font-bold text-black h-full bg-gray-100 pl-3 pr-2">
                {t(
                  currentCategory
                    ? allCategories.find((cat) => cat.id == currentCategory)
                        .Name
                    : "Tout"
                )}
                <ChevronUp className="ml-1 w-4 h-4 transform group-hover:rotate-180 duration-300" />
              </div>
              <div className="absolute top-8 mt-4 py-2 -left-5 z-50 text-gray-500 w-[240px] invisible group-hover:visible opacity-0 group-hover:opacity-100 duration-300 bg-white shadow-lg">
                <div className="w-full text-left flex justify-between items-center hover:bg-gray-200 cursor-pointer">
                  <div
                    className="whitespace-nowrap w-full h-full px-4 py-2"
                    onClick={() => {
                      setCurrentCategory(null);
                    }}
                  >
                    {t("Tout")}
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
                  {t("Cherchez des produits")}
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
                  placeholder={t("Cherchez des produits")}
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
            <div className="shadow-lg bg-gray-100 p-2 flex flex-row gap-2">
              <ArrowUp
                height={36}
                width={36}
                onClick={() => setCurrentSortDirection(!currentSortDirection)}
                className={`rounded bg-white border-2 duration-500 border-blue-500 p-1 ${
                  currentSortDirection ? "rotate-0" : "rotate-180"
                }`}
              />
              <div
                className={`rounded px-2 py-1 bg-white border-2 ${
                  currentSort == "id" ? "border-blue-500" : ""
                }`}
                onClick={() => setCurrentSort("id")}
              >
                {t("Date")}
              </div>
              <div
                className={`rounded px-2 py-1 bg-white border-2 ${
                  currentSort == "value" ? "border-blue-500" : ""
                }`}
                onClick={() => setCurrentSort("value")}
              >
                {t("Prix")}
              </div>
            </div>
            <form
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
            >
              <label htmlFor="upload" className={buttonClass + " bg-green-400"}>
                <div className={navIconDivClass}>
                  <Upload className={iconClass} />
                </div>
                <span className={textClass}>{t("Téléverser Excel")}</span>
              </label>
              <input
                title={t("Téléverser Excel")}
                className="w-0 h-0 opacity-0 absolute"
                placeholder={t("Téléverser Excel")}
                type="file"
                name="upload"
                id="upload"
                onChange={excelUpload}
              />
            </form>

            <button
              className={buttonClass + " bg-green-400 flex-shrink-0"}
              onClick={() => generateXlsx()}
            >
              <div className={navIconDivClass}>
                <Download className={iconClass} />
              </div>
              <span className={textClass}>{t("Télécharger Excel")}</span>
            </button>

            <button className={buttonClass} onClick={() => setNewProduct(true)}>
              <div className={navIconDivClass}>
                <PlusCircle className={iconClass} />
              </div>
              <span className={textClass}>{t("Créer Nouveau Produit")}</span>
            </button>
          </div>
          <div className="w-full flex-shrink-1 overflow-y-hidden flex flex-col items-center pt-1">
            <div className="flex flex-col overflow-y-auto overflow-x-auto max-w-full">
              <table className="w-full shadow-lg bg-gray-100 p-2 relative">
                <thead className="sticky top-0 bg-[#c0c1c3]">
                  <tr>
                    <th>{t("No")}</th>
                    <th>{t("Catégorie")}</th>
                    <th>{t("EAN")}</th>
                    <th>{t("Code Model")}</th>
                    <th>{t("Nom")}</th>
                    <th>{t("Couleur")}</th>
                    <th>{t("Matériel")}</th>
                    <th>{t("Prix Avant Remise")}</th>
                    <th>{t("Prix Vente")}</th>
                    <th>{t("Stock Depot")}</th>
                    <th>{t("Stock Magasin")}</th>
                    <th>{t("Poids")}</th>
                    <th>{t("Poids Colis Net")}</th>
                    <th>{t("Poids Colis Brut")}</th>
                    <th>{t("Dimensions Colis")}</th>
                    <th>{t("Par Boite")}</th>
                    <th>{t("Hauteur Assise")}</th>
                    <th>{t("Hauteur")}</th>
                    <th>{t("Largeur")}</th>
                    <th>{t("Longueur")}</th>
                    <th>{t("Diametre")}</th>
                  </tr>
                </thead>
                <tbody>
                  {allProducts.map((product, index) => (
                    <tr
                      key={index}
                      className={`cursor-pointer ${
                        !selectedRows.has(index) && index % 2 === 0
                          ? "bg-slate-300"
                          : ""
                      } ${selectedRows.has(index) ? "bg-orange-300" : ""}`}
                      onDoubleClick={() => setChosenProductID(product.id)}
                      onClick={(e) => handleRowClick(index, e)}
                      onMouseOver={(e) =>
                        e.currentTarget.classList.add("hover:bg-slate-500")
                      }
                      onMouseOut={(e) =>
                        e.currentTarget.classList.remove("hover:bg-slate-500")
                      }
                    >
                      <td>{product.id}</td>
                      <td>{product.category.Name}</td>
                      <td>{product.product_extra.barcode}</td>
                      <td>{product.internalCode}</td>
                      <td>{product.name}</td>
                      <td>{product.color}</td>
                      <td>{product.material}</td>
                      <td>
                        {product.priceBeforeDiscount != undefined
                          ? "€ " +
                            product.priceBeforeDiscount
                              .toFixed(2)
                              .replaceAll(".", ",")
                          : ""}
                      </td>
                      <td>
                        {product.value != undefined
                          ? "€ " + product.value.toFixed(2).replaceAll(".", ",")
                          : ""}
                      </td>
                      <td>
                        {
                          product.shelves.find(
                            (shelf) => shelf.establishment.id == 3
                          ).stock
                        }
                      </td>
                      <td>
                        {
                          product.shelves.find(
                            (shelf) => shelf.establishment.id == 1
                          ).stock
                        }
                      </td>
                      <td>
                        {product.product_extra.weight != 0
                          ? product.product_extra.weight
                              .toString()
                              .replaceAll(".", ",") + " kg"
                          : ""}
                      </td>
                      <td>
                        {product.product_extra.packaged_weight_net != 0
                          ? product.product_extra.packaged_weight_net
                              .toString()
                              .replaceAll(".", ",") + " kg"
                          : ""}
                      </td>
                      <td>
                        {product.product_extra.packaged_weight != 0
                          ? product.product_extra.packaged_weight
                              .toString()
                              .replaceAll(".", ",") + " kg"
                          : ""}
                      </td>
                      <td>{product.product_extra.packaged_dimensions}</td>
                      <td>
                        {product.product_extra.per_box != 0
                          ? product.product_extra.per_box
                          : ""}
                      </td>
                      <td>
                        {product.product_extra.seat_height != 0
                          ? product.product_extra.seat_height
                              .toString()
                              .replaceAll(".", ",") + " cm"
                          : ""}
                      </td>
                      <td>
                        {product.height != 0
                          ? product.height.toString().replaceAll(".", ",") +
                            " cm"
                          : ""}
                      </td>
                      <td>
                        {product.width != 0
                          ? product.width.toString().replaceAll(".", ",") +
                            " cm"
                          : ""}
                      </td>
                      <td>
                        {product.depth != 0
                          ? product.depth.toString().replaceAll(".", ",") +
                            " cm"
                          : ""}
                      </td>
                      <td>
                        {product.product_extra.diameter != 0
                          ? product.product_extra.diameter
                              .toString()
                              .replaceAll(".", ",") + " cm"
                          : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <>
              {allProducts.length > 0 ? (
                <div className="flex flex-row px-6 justify-center mb-2 mt-2">
                  <div className="flex justify-center items-center space-x-1">
                    <button
                      className="p-2 border rounded hover:bg-gray-200"
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
                          className={`p-2 border rounded hover:bg-gray-200 ${
                            currentPage === page ? "bg-gray-300" : ""
                          }`}
                          onClick={() => goToPage(page)}
                        >
                          {page}
                        </button>
                      )
                    )}
                    <button
                      className="p-2 border rounded hover:bg-gray-200"
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
          <div
            className={`shadow-md w-full flex flex-row flex-shrink-0 bg-gray-400 duration-500 overflow-y-hidden p-2 flex-grow transition-height `}
          >
            {currentProduct || newProduct ? (
              <>
                <div
                  className="grid"
                  style={{
                    gridTemplateRows: isProductExpanded ? "1fr" : "0fr",
                    transition: "grid-template-rows 0.4s",
                  }}
                >
                  <form
                    className={`w-full overflow-hidden flex flex-col justify-center items-center gap-2`}
                    onSubmit={handleFormSubmit}
                  >
                    <div className="flex flex-wrap gap-2 justify-center items-center">
                      <div className={inputDivClass}>
                        <p>{t("No")}</p>
                        <input
                          type="number"
                          onSubmit={(e) => {
                            e.preventDefault();
                          }}
                          value={currentProduct?.id ?? ""}
                          placeholder={t("No")}
                          className={inputClass}
                          onChange={() => {}}
                        />
                      </div>
                      <div className={inputDivClass}>
                        <p>{t("Catégorie")}</p>
                        <select
                          className="w-full"
                          value={
                            currentProduct != null &&
                            currentProduct.category != null &&
                            currentProduct.category.id != null
                              ? currentProduct.category.id
                              : 0
                          }
                          onChange={(e) =>
                            handleChange(
                              "category",
                              allCategories.find(
                                (cat) => cat.id == e.target.value
                              )
                            )
                          }
                        >
                          <option key={0} value={0}>
                            Select a category
                          </option>
                          {allCategories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.Name}
                            </option>
                          ))}
                        </select>
                        {errors.category && (
                          <div className="error-message">{errors.category}</div>
                        )}
                      </div>
                      <div className={inputDivClass}>
                        <p>{t("EAN")}</p>
                        <input
                          type="number"
                          onSubmit={(e) => {
                            e.preventDefault();
                          }}
                          value={currentProduct?.product_extra.barcode ?? ""}
                          onChange={(e) =>
                            handleChange("barcode", e.target.value, true, [
                              validateEmpty,
                            ])
                          }
                          placeholder={t("EAN")}
                          className={inputClass}
                        />
                        {errors.barcode && (
                          <div className="error-message">{errors.barcode}</div>
                        )}
                      </div>
                      <div className={inputDivClass}>
                        <p>{t("Code Model")}</p>
                        <input
                          type="text"
                          onSubmit={(e) => {
                            e.preventDefault();
                          }}
                          value={currentProduct?.internalCode ?? ""}
                          onChange={(e) =>
                            handleChange(
                              "internalCode",
                              e.target.value,
                              false,
                              [validateEmpty]
                            )
                          }
                          placeholder={t("Code Model")}
                          className={inputClass}
                        />

                        {errors.internalCode && (
                          <div className="error-message">
                            {errors.internalCode}
                          </div>
                        )}
                      </div>
                      <div className={inputDivClass}>
                        <p>{t("Nom")}</p>
                        <input
                          onSubmit={(e) => {
                            e.preventDefault();
                          }}
                          type="text"
                          value={currentProduct?.name ?? ""}
                          onChange={(e) =>
                            handleChange("name", e.target.value, false, [
                              validateEmpty,
                            ])
                          }
                          placeholder={t("Nom")}
                          className={inputClass}
                        />
                        {errors.name && (
                          <div className="error-message">{errors.name}</div>
                        )}
                      </div>
                      <div className={inputDivClass}>
                        <p>{t("Prix Avant Remise")}</p>
                        <input
                          onSubmit={(e) => {
                            e.preventDefault();
                          }}
                          type="number"
                          value={currentProduct?.priceBeforeDiscount ?? ""}
                          onChange={(e) =>
                            handleChange(
                              "priceBeforeDiscount",
                              e.target.value,
                              false,
                              [validateDecimal]
                            )
                          }
                          placeholder={t("Prix Vente")}
                          className={inputClass}
                        />
                        {errors.priceBeforeDiscount && (
                          <div className="error-message">
                            {errors.priceBeforeDiscount}
                          </div>
                        )}
                      </div>
                      <div className={inputDivClass}>
                        <p>{t("Prix Vente")}</p>
                        <input
                          onSubmit={(e) => {
                            e.preventDefault();
                          }}
                          type="number"
                          value={currentProduct?.value ?? ""}
                          onChange={(e) =>
                            handleChange("value", e.target.value, false, [
                              validateDecimal,
                              validateEmpty,
                            ])
                          }
                          placeholder={t("Prix Vente")}
                          className={inputClass}
                        />
                        {errors.value && (
                          <div className="error-message">{errors.value}</div>
                        )}
                      </div>
                      <div className={inputDivClass}>
                        <p>{t("Matériel")}</p>
                        <input
                          onSubmit={(e) => {
                            e.preventDefault();
                          }}
                          type="text"
                          value={currentProduct?.material ?? ""}
                          onChange={(e) =>
                            handleChange("material", e.target.value)
                          }
                          placeholder={t("Matériel")}
                          className={inputClass}
                        />
                      </div>
                      <div className={inputDivClass}>
                        <p>{t("Couleur")}</p>
                        <input
                          type="text"
                          onSubmit={(e) => {
                            e.preventDefault();
                          }}
                          value={currentProduct?.color ?? ""}
                          onChange={(e) =>
                            handleChange("color", e.target.value)
                          }
                          placeholder={t("Couleur")}
                          className={inputClass}
                        />
                      </div>
                      <div className={inputDivClass}>
                        <p>{t("Poids")}</p>
                        <input
                          type="number"
                          onSubmit={(e) => {
                            e.preventDefault();
                          }}
                          value={currentProduct?.product_extra?.weight ?? ""}
                          onChange={(e) =>
                            handleChange("weight", e.target.value, true, [
                              validateInteger,
                            ])
                          }
                          placeholder={t("Poids")}
                          className={inputClass}
                        />
                        {errors.weight && (
                          <div className="error-message">{errors.weight}</div>
                        )}
                      </div>
                      <div className={inputDivClass}>
                        <p>{t("Poids Colis Net")}</p>
                        <input
                          type="number"
                          onSubmit={(e) => {
                            e.preventDefault();
                          }}
                          value={
                            currentProduct?.product_extra
                              ?.packaged_weight_net ?? ""
                          }
                          onChange={(e) =>
                            handleChange(
                              "packaged_weight_net",
                              e.target.value,
                              true,
                              [validateDecimal]
                            )
                          }
                          placeholder={t("Poids Colis Net")}
                          className={inputClass}
                        />
                        {errors.packaged_weight_net && (
                          <div className="error-message">
                            {errors.packaged_weight_net}
                          </div>
                        )}
                      </div>
                      <div className={inputDivClass}>
                        <p>{t("Poids Colis Brut")}</p>
                        <input
                          type="number"
                          onSubmit={(e) => {
                            e.preventDefault();
                          }}
                          value={
                            currentProduct?.product_extra?.packaged_weight ?? ""
                          }
                          onChange={(e) =>
                            handleChange(
                              "packaged_weight",
                              e.target.value,
                              true,
                              [validateDecimal]
                            )
                          }
                          placeholder={t("Poids Colis")}
                          className={inputClass}
                        />
                        {errors.packaged_weight && (
                          <div className="error-message">
                            {errors.packaged_weight}
                          </div>
                        )}
                      </div>
                      <div className={inputDivClass}>
                        <p>{t("Dimensions Colis")}</p>
                        <input
                          type="text"
                          onSubmit={(e) => {
                            e.preventDefault();
                          }}
                          value={
                            currentProduct?.product_extra
                              ?.packaged_dimensions ?? ""
                          }
                          onChange={(e) =>
                            handleChange(
                              "packaged_dimension",
                              e.target.value,
                              true
                            )
                          }
                          placeholder={t("Dimensions Colis")}
                          className={inputClass}
                        />
                      </div>
                      <div className={inputDivClass}>
                        <p>{t("Par Boite")}</p>
                        <input
                          type="number"
                          onSubmit={(e) => {
                            e.preventDefault();
                          }}
                          value={currentProduct?.product_extra?.per_box ?? ""}
                          onChange={(e) =>
                            handleChange("per_box", e.target.value, true, [
                              validateInteger,
                            ])
                          }
                          placeholder={t("Par Boite")}
                          className={inputClass}
                        />
                        {errors.per_box && (
                          <div className="error-message">{errors.per_box}</div>
                        )}
                      </div>
                      <div className={inputDivClass}>
                        <p>{t("Hauteur")}</p>
                        <input
                          type="number"
                          onSubmit={(e) => {
                            e.preventDefault();
                          }}
                          value={currentProduct?.height ?? ""}
                          onChange={(e) =>
                            handleChange("height", e.target.value, false, [
                              validateInteger,
                            ])
                          }
                          placeholder={t("Hauteur")}
                          className={inputClass}
                        />
                        {errors.height && (
                          <div className="error-message">{errors.height}</div>
                        )}
                      </div>
                      <div className={inputDivClass}>
                        <p>{t("Largeur")}</p>
                        <input
                          type="number"
                          onSubmit={(e) => {
                            e.preventDefault();
                          }}
                          value={currentProduct?.width ?? ""}
                          onChange={(e) =>
                            handleChange("width", e.target.value, false, [
                              validateInteger,
                            ])
                          }
                          placeholder={t("Largeur")}
                          className={inputClass}
                        />
                        {errors.width && (
                          <div className="error-message">{errors.width}</div>
                        )}
                      </div>
                      <div className={inputDivClass}>
                        <p>{t("Longueur")}</p>
                        <input
                          type="number"
                          onSubmit={(e) => {
                            e.preventDefault();
                          }}
                          value={currentProduct?.depth ?? ""}
                          onChange={(e) =>
                            handleChange("depth", e.target.value, false, [
                              validateInteger,
                            ])
                          }
                          placeholder={t("Longueur")}
                          className={inputClass}
                        />
                        {errors.depth && (
                          <div className="error-message">{errors.depth}</div>
                        )}
                      </div>
                      <div className={inputDivClass}>
                        <p>{t("Diametre")}</p>
                        <input
                          type="number"
                          onSubmit={(e) => {
                            e.preventDefault();
                          }}
                          value={currentProduct?.product_extra?.diameter ?? ""}
                          onChange={(e) =>
                            handleChange("diameter", e.target.value, true, [
                              validateInteger,
                            ])
                          }
                          placeholder={t("Diametre")}
                          className={inputClass}
                        />
                        {errors.diameter && (
                          <div className="error-message">{errors.diameter}</div>
                        )}
                      </div>
                      <div className={inputDivClass}>
                        <p>{t("Hauteur Assise")}</p>
                        <input
                          type="number"
                          onSubmit={(e) => {
                            e.preventDefault();
                          }}
                          value={
                            currentProduct?.product_extra?.seat_height ?? ""
                          }
                          onChange={(e) =>
                            handleChange("seat_height", e.target.value, true, [
                              validateInteger,
                            ])
                          }
                          placeholder={t("Hauteur Assise")}
                          className={inputClass}
                        />
                        {errors.seat_height && (
                          <div className="error-message">
                            {errors.seat_height}
                          </div>
                        )}
                      </div>
                      <div className={inputDivClass}>
                        <p>{t("Hauteur Accoudoir")}</p>
                        <input
                          type="number"
                          onSubmit={(e) => {
                            e.preventDefault();
                          }}
                          value={
                            currentProduct?.product_extra?.armrest_height ?? ""
                          }
                          onChange={(e) =>
                            handleChange(
                              "armrest_height",
                              e.target.value,
                              true,
                              [validateInteger]
                            )
                          }
                          placeholder={t("Hauteur Accoudoir")}
                          className={inputClass}
                        />
                        {errors.armrest_height && (
                          <div className="error-message">
                            {errors.armrest_height}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center items-center">
                      <div className={inputDivClass}>
                        <p>{t("Ettiquetes")}</p>
                        <textarea
                          value={currentProduct?.product_extra?.tags ?? ""}
                          onChange={(e) =>
                            handleChange("tags", e.target.value, true, [])
                          }
                          placeholder={t("Ettiquetes")}
                          className={inputClass}
                        />
                      </div>
                      <div className={inputDivClass}>
                        <p>{t("Description")}</p>
                        <textarea
                          value={currentProduct?.description ?? ""}
                          onChange={(e) =>
                            handleChange(
                              "description",
                              e.target.value,
                              false,
                              []
                            )
                          }
                          placeholder={t("Description")}
                          className={inputClass}
                        />
                      </div>
                      {chosenProductID != 0 && chosenProductID != null && (
                        <>
                          <div className={inputDivClass}>
                            <div className="flex flex-row items-center gap-2">
                              <p className="whitespace-nowrap">
                                {t("Stock Depot")}
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
                                  (shelf) => shelf.establishment.id == 3
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
                                      (shelf) => shelf.establishment.id === 3
                                    );
                                  if (shelfIndex !== -1) {
                                    updatedProduct.shelves[shelfIndex].stock =
                                      Number(e.target.value);
                                    setCurrentProduct(updatedProduct);
                                  }
                                  errors.stock_depot = "";
                                } else {
                                  errors.stock_depot = validateInteger(
                                    e.target.value
                                  );
                                }
                              }}
                              placeholder={t("Stock Depot")}
                              className={inputClass}
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
                                {t("Stock Magasin")}
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
                                  (shelf) => shelf.establishment.id == 1
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
                                      (shelf) => shelf.establishment.id === 1
                                    );
                                  if (shelfIndex !== -1) {
                                    updatedProduct.shelves[shelfIndex].stock =
                                      Number(e.target.value);
                                    setCurrentProduct(updatedProduct);
                                  }
                                  errors.stock_store = "";
                                } else {
                                  errors.stock_store = validateInteger(
                                    e.target.value
                                  );
                                }
                              }}
                              placeholder={t("Stock Magasin")}
                              className={inputClass}
                            />
                            {errors.stock_store && (
                              <div className="error-message">
                                {errors.stock_store}
                              </div>
                            )}
                          </div>
                          <BarcodeToPng value={currentProduct.supplierCode} />
                        </>
                      )}
                      <div className="flex flex-col gap-2">
                        {currentProduct && currentProduct.id != 0 ? (
                          currentProduct.product_extra.new ? (
                            <div
                              className={`bg-green-300 cursor-pointer rounded border-1 border-black items-center justify-center flex flex-col`}
                              onClick={toggleProductNew}
                            >
                              {t("Featured")}
                            </div>
                          ) : (
                            <div
                              className={`bg-red-300 cursor-pointer rounded border-1 border-black items-center justify-center flex flex-col`}
                              onClick={toggleProductNew}
                            >
                              {t("Normal")}
                            </div>
                          )
                        ) : null}
                        {currentProduct && currentProduct.id != 0 ? (
                          currentProduct.active ? (
                            <div
                              className={`bg-green-300 cursor-pointer rounded border-1 border-black items-center justify-center flex flex-col`}
                              onClick={toggleProductActive}
                            >
                              {t("Actif")}
                            </div>
                          ) : (
                            <div
                              className={`bg-red-300 cursor-pointer rounded border-1 border-black items-center justify-center flex flex-col`}
                              onClick={toggleProductActive}
                            >
                              {t("Inactif")}
                            </div>
                          )
                        ) : null}
                        {currentProduct &&
                          currentProduct.id != 0 &&
                          !newProduct && (
                            <>
                              <label
                                htmlFor="uploadimg"
                                className={buttonClass}
                              >
                                <div className={navIconDivClass}>
                                  <Upload className={iconClass} />
                                </div>
                                <span className={textClass}>
                                  {t("Télécharger Image")}
                                </span>
                              </label>
                              <input
                                title={t("Télécharger Image")}
                                className="w-0 h-0 opacity-0 absolute"
                                placeholder={t("Télécharger Image")}
                                type="file"
                                name="uploadimg"
                                id="uploadimg"
                                onChange={uploadFile}
                              />
                            </>
                          )}
                      </div>
                      <div className="flex flex-col">
                        <button
                          onClick={handleFormSubmit}
                          className={buttonClass + " bg-white col-span-2"}
                        >
                          <div className={navIconDivClass}>
                            <CheckCircle className={iconClass} />
                          </div>
                          <span className={textClass}>
                            {newProduct
                              ? t("Créer Nouveau Produit")
                              : t("Modifier Produit")}
                          </span>
                        </button>
                        {submitError && (
                          <p className="text-red-400">{submitError}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-row">
                      {currentProduct &&
                        currentProduct.id != 0 &&
                        currentProduct.images?.map((img) => (
                          <div className="relative image_parent" key={img.id}>
                            <Image
                              alt={""}
                              src={
                                "https://hdapi.huseyinonalalpha.com" + img.url
                              }
                              id={img.id.toString()}
                              width={160}
                              height={160}
                            />
                            <div
                              className="absolute top-2 right-2 z-50"
                              onClick={handleImageDelete}
                            >
                              <X className="w-4 h-4" color="red" />
                            </div>
                            <Link
                              target="_blank"
                              className="absolute top-6 right-2"
                              href={
                                "https://hdapi.huseyinonalalpha.com" + img.url
                              }
                            >
                              <Download className="w-4 h-4" color="green" />
                            </Link>
                          </div>
                        ))}
                    </div>
                  </form>
                </div>
                <div className={`flex flex-col ml-auto`}>
                  <div className="flex flex-row justify-end gap-2 mb-2">
                    <ButtonShadow1
                      onClick={() => setIsProductExpanded(!isProductExpanded)}
                    >
                      <div className="p-2 bg-white">
                        <Minus color="black" />
                      </div>
                    </ButtonShadow1>
                    <ButtonShadow1
                      onClick={() => {
                        setNewProduct(false);
                        setCurrentProduct(null);
                        setChosenProductID(null);
                      }}
                    >
                      <div className="p-2 bg-white">
                        <X color="red" />
                      </div>
                    </ButtonShadow1>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex w-full items-center justify-center text-2xl font-bold">
                {t("Aucun produit sélectionné")}
              </div>
            )}
          </div>
        </div>
        {/* <button onClick={() => missingPictures()}>missing pics</button> */}
      </AdminLayout>
    );
}
