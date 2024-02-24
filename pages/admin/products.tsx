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
  PlusCircle,
  Search,
  Upload,
  X,
} from "react-feather";
import * as xlsx from "xlsx";
import Image from "next/image";
import Link from "next/link";
import componentThemes from "../../components/componentThemes";
import BarcodeToPng from "../../components/common/barcodepng";
import LoadingIndicator from "../../components/common/loadingIndicator";
import { CategoryContext } from "../../api/providers/categoryProvider";
import { Category } from "../../api/interfaces/category";

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
  const textClass = "mx-2 font-bold mtext-left";
  const inputDivClass =
    "flex flex-col items-center shadow-lg gap-2 bg-white p-1 rounded h-min";
  const inputClass = "border rounded w-full";

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
          currentProduct.active = answer;
          setCurrentProduct({ ...currentProduct, active: answer });
        }
      } catch {}
    };

    toggleActive();
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
          surface_area: "0",
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
    setAllCategories(data);
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

  const uploadFile = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      sendFile(file);
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
      case "SANDALYE IC MEKAN":
        return 3;
      case "SANDALYE DIS MEKAN":
        return 2;
      case "BANKET":
        return 10;
      case "BAR TABURESI IC MEKAN":
        return 29;
      case "ETKINLIK":
        return 17;
      default:
        return 0;
    }
  };

  let allProductsFromAPI;

  const processFile = (file) => {
    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = e.target.result;
      const workbook = xlsx.read(data, { type: "array" });

      const sheets: string[] = workbook.SheetNames;

      const allIDsReq = await fetch("/api/products/admin/getallids");
      const allIDsAns = await allIDsReq.json();
      allProductsFromAPI = allIDsAns.data;

      for (let i = 0; i < sheets.length; i++) {
        const categoryID = categoryToId(sheets[i]);
        if (categoryID != 0) {
          const worksheet = workbook.Sheets[sheets[i]];
          const json = xlsx.utils.sheet_to_json(worksheet);
          const excelProds = ProductTransformer.fromXLSX(JSON.stringify(json));
          excelProds.forEach((prod) => {
            prod.category = { id: categoryID } as Category;
          });
          sendProductsToAPI(excelProds);
        }

        if (i == sheets.length - 1) {
          setIsLoading(false);
        }
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const excelUpload = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    processFile(file);
  };

  const clearProduct = () => {
    setCurrentProduct(null);
    setChosenProductID(null);
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

  const sendProductsToAPI = async (prodsToPOST: Product[]) => {
    prodsToPOST.forEach(async (prodToPost) => {
      let prodFromAPI = allProductsFromAPI.find(
        (prod) =>
          prod.supplierCode.toString() == prodToPost.supplierCode.toString()
      );
      if (prodFromAPI) {
        let idToPost = prodFromAPI.id;
        let idToPostExtra = prodFromAPI.product_extra.id;
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
          }
          fetchProducts();
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
            const answer = await request.json();
            throw new Error(`Post failed: ${request.status}`);
          }
          fetchProducts();
        } catch (error) {}
      }
    });
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
            setChosenProductID(0);
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
    surface_area?: string;
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

  const EAN = {
    "6097501691626": "",
    "6097528261253": "",
    "6097504799787": "",
    "6097524485431": "",
    "6097519295298": "",
    "6097501665627": "",
    "6097510384397": "",
    "6097506862816": "",
    "6097503794790": "",
    "6097521343369": "",
    "6097505166106": "",
    "6097512340391": "",
    "6097510449461": "",
    "6097515654679": "",
    "6097503013044": "",
    "6097510149187": "",
    "6097503199175": "",
    "6097515262263": "",
    "6097507933959": "",
    "6097504110131": "",
    "6097538342324": "",
    "6097510974901": "",
    "6097509721752": "",
    "6097510668602": "",
    "6097504658664": "",
    "6097507560582": "",
    "6097501583525": "",
    "6097521531575": "",
    "6097509873871": "",
    "6097530884808": "",
    "6097501040059": "",
    "6097504081059": "",
    "6097514339379": "",
    "6097531774702": "",
    "6097528810864": "",
    "6097526686669": "",
    "6097517876871": "",
    "6097529022075": "",
    "6097538047021": "",
    "6097503931942": "",
    "6097503710783": "",
    "6097511993918": "",
    "6097554394369": "",
    "6097505592578": "",
    "6097504442430": "",
    "6097501259291": "",
    "6097523573580": "",
    "6097522857865": "",
    "6097504438495": "",
    "6097505670603": "",
    "6097502976944": "",
    "6097503327332": "",
    "6097525627670": "",
    "6097524648614": "",
    "6097512125110": "",
    "6097510137191": "",
    "6097517976984": "",
    "6097506752780": "",
    "6097507247209": "",
    "6097506137105": "",
    "6097518938943": "",
    "6097509685610": "",
    "6097508942950": "",
    "6097502519578": "",
    "6097529625634": "",
    "6097524881882": "",
    "6097502063019": "",
    "6097501512570": "",
    "6097503922940": "",
    "6097507573520": "",
    "6097507549549": "",
    "6097507524515": "",
    "6097505392314": "",
    "6097524071078": "",
    "6097507760722": "",
    "6097505770730": "",
    "6097523635615": "",
    "6097522257238": "",
    "6097506687693": "",
    "6097505140175": "",
    "6097504324378": "",
    "6097505521530": "",
    "6097502349328": "",
    "6097509239233": "",
    "6097502112137": "",
    "6097532234267": "",
    "6097508899834": "",
    "6097542240258": "",
    "6097504484430": "",
    "6097501527550": "",
    "6097515461451": "",
    "6097503448464": "",
    "6097514527547": "",
    "6097512791773": "",
    "6097510069089": "",
    "6097511549542": "",
    "6097507434463": "",
    "6097508559592": "",
    "6097501560526": "",
    "6097501475455": "",
    "6097526812860": "",
    "6097533691656": "",
    "6097516973984": "",
    "6097546610675": "",
    "6097515461482": "",
    "6097539653658": "",
    "6097505722722": "",
    "6097507493446": "",
    "6097522626614": "",
    "6097514675613": "",
    "6097502686645": "",
    "6097501520537": "",
    "6097501252223": "",
    "6097514195159": "",
    "6097520220272": "",
    "6097507179111": "",
    "6097516386302": "",
    "6097501883847": "",
    "6097501594538": "",
    "6097508395381": "",
    "6097512847845": "",
    "6097506566554": "",
    "6097510565550": "",
    "6097505256258": "",
    "6097503432456": "",
    "6097526621677": "",
    "6097505431464": "",
    "6097519544570": "",
    "6097556414409": "",
    "6097516689601": "",
    "6097507874863": "",
    "6097508053038": "",
    "6097519514597": "",
    "6097503741756": "",
    "6097508432475": "",
    "6097515354371": "",
    "6097547199186": "",
    "6097508764767": "",
    "6097502748749": "",
    "6097510586500": "",
    "6097506879869": "",
    "6097503939955": "",
    "6097503537571": "",
    "6097511035038": "",
    "6097515313316": "",
    "6097503660606": "",
    "6097519363324": "",
    "6097503021018": "",
    "6097514882820": "",
    "6097517414493": "",
    "6097510543565": "",
    "6097504714704": "",
    "6097502544587": "",
    "6097513462498": "",
    "6097511821891": "",
    "6097508162143": "",
    "6097515632677": "",
    "6097518178141": "",
    "6097505698690": "",
    "6097504450497": "",
    "6097503092025": "",
    "6097503185130": "",
    "6097501087078": "",
    "6097509158176": "",
    "6097509232258": "",
    "6097508323346": "",
    "6097503155140": "",
    "6097503449409": "",
    "6097540144121": "",
    "6097505242275": "",
    "6097511598502": "",
    "6097512833893": "",
    "6097510295204": "",
    "6097505025090": "",
    "6097521299246": "",
    "6097501241203": "",
    "6097517448443": "",
    "6097507727794": "",
    "6097514497499": "",
    "6097516469456": "",
    "6097506473418": "",
    "6097505758738": "",
    "6097532868813": "",
    "6097506675645": "",
    "6097504383375": "",
    "6097503080084": "",
    "6097510675624": "",
    "6097515411401": "",
    "6097507015006": "",
    "6097501760773": "",
    "6097501720777": "",
    "6097504530571": "",
    "6097509538510": "",
    "6097512281205": "",
    "6097540588543": "",
    "6097511236213": "",
    "6097508436459": "",
    "6097502023037": "",
    "6097502079034": "",
    "6097518718729": "",
    "6097512178116": "",
    "6097509617666": "",
    "6097502028087": "",
    "6097527716716": "",
    "6097506598524": "",
    "6097503696612": "",
    "6097506527593": "",
    "6097503462422": "",
    "6097504646647": "",
    "6097509597562": "",
    "6097539819825": "",
    "6097554513562": "",
    "6097520674693": "",
    "6097501921938": "",
    "6097548910988": "",
    "6097511734795": "",
    "6097504324330": "",
    "6097515026056": "",
    "6097516510578": "",
    "6097508637689": "",
    "6097545850867": "",
    "6097510393306": "",
    "6097517366389": "",
    "6097504858835": "",
    "6097502247235": "",
    "6097501696683": "",
    "6097502964903": "",
    "6097531590579": "",
    "6097522545502": "",
    "6097504499489": "",
    "6097502923924": "",
    "6097527355366": "",
    "6097503519553": "",
    "6097504974917": "",
    "6097517825855": "",
    "6097543919900": "",
    "6097505820824": "",
    "6097501378381": "",
    "6097507965929": "",
    "6097507721761": "",
    "6097501913988": "",
    "6097510369387": "",
    "6097522159143": "",
    "6097510234234": "",
    "6097520642685": "",
    "6097505582531": "",
    "6097523326308": "",
    "6097532414461": "",
    "6097503672616": "",
    "6097501984940": "",
  };

  if (isLoading) {
    return <LoadingIndicator />;
  } else
    return (
      <AdminLayout>
        <Head>
          <title>Produits</title>
          <meta name="language" content={lang} />
        </Head>
        <div className="flex flex-col w-full items-center pt-1">
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
                <span className={textClass}>{t("Télécharger Excel")}</span>
              </label>
              <input
                title={t("Télécharger Excel")}
                className="w-0 h-0 opacity-0 absolute"
                placeholder={t("Télécharger Excel")}
                type="file"
                name="upload"
                id="upload"
                onChange={excelUpload}
              />
            </form>
            <button className={buttonClass} onClick={() => setNewProduct(true)}>
              <div className={navIconDivClass}>
                <PlusCircle className={iconClass} />
              </div>
              <span className={textClass}>{t("Créer Nouveau Produit")}</span>
            </button>
          </div>
          <div>
            <div className="table-container">
              <table className="rounded overflow-x-auto shadow-lg bg-gray-100 p-2">
                <thead>
                  <tr>
                    <th>{t("No")}</th>
                    <th>{t("Catégorie")}</th>
                    <th>{t("Code Model")}</th>
                    <th>{t("EAN")}</th>
                    <th>{t("Nom")}</th>
                    <th>{t("Prix Avant Remise")}</th>
                    <th>{t("Prix Vente")}</th>
                    <th>{t("Stock Depot")}</th>
                    <th>{t("Stock Magasin")}</th>
                    <th>{t("Matériel")}</th>
                    <th>{t("Couleur")}</th>
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
                    <th>{t("Surface")}</th>
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
                      <td>{product.internalCode}</td>
                      <td>{product.product_extra.barcode}</td>
                      <td>{product.name}</td>
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
                      <td>{product.material}</td>
                      <td>{product.color}</td>
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
                      <td>{product.product_extra.packaged_dimension}</td>
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
                      <td>
                        {product.product_extra.surface_area != "0"
                          ? product.product_extra.surface_area
                          : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <>
              {allProducts.length > 0 ? (
                <div className="flex flex-row px-6 justify-center mb-4">
                  <div className="mt-2">
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
                </div>
              ) : (
                <p></p>
              )}
            </>
          </div>
          <div className="product-container mt-2 mb-1">
            {currentProduct || newProduct ? (
              <>
                <form
                  className="w-full grid items-center grid-cols-7 gap-2"
                  onSubmit={handleFormSubmit}
                >
                  <div className={inputDivClass}>
                    <p>{t("No")}</p>
                    <input
                      type="number"
                      value={currentProduct?.id ?? ""}
                      placeholder={t("No")}
                      className={inputClass}
                      onChange={() => {}}
                    />
                  </div>
                  <div className={inputDivClass}>
                    <p>{t("Catégorie")}</p>
                    <select
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
                          allCategories.find((cat) => cat.id == e.target.value)
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
                    <p>{t("Code Model")}</p>
                    <input
                      type="text"
                      value={currentProduct?.internalCode ?? ""}
                      onChange={(e) =>
                        handleChange("internalCode", e.target.value, false, [
                          validateEmpty,
                        ])
                      }
                      placeholder={t("Code Model")}
                      className={inputClass}
                    />

                    {errors.internalCode && (
                      <div className="error-message">{errors.internalCode}</div>
                    )}
                  </div>
                  <div className={inputDivClass}>
                    <p>{t("EAN")}</p>
                    <input
                      type="number"
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
                    <p>{t("Nom")}</p>
                    <input
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
                      type="number"
                      value={currentProduct?.value ?? ""}
                      onChange={(e) =>
                        handleChange("value", e.target.value, false, [
                          validateDecimal,
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
                      type="text"
                      value={currentProduct?.material ?? ""}
                      onChange={(e) => handleChange("material", e.target.value)}
                      placeholder={t("Matériel")}
                      className={inputClass}
                    />
                  </div>
                  <div className={inputDivClass}>
                    <p>{t("Couleur")}</p>
                    <input
                      type="text"
                      value={currentProduct?.color ?? ""}
                      onChange={(e) => handleChange("color", e.target.value)}
                      placeholder={t("Couleur")}
                      className={inputClass}
                    />
                  </div>
                  <div className={inputDivClass}>
                    <p>{t("Poids")}</p>
                    <input
                      type="number"
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
                      value={
                        currentProduct?.product_extra?.packaged_weight_net ?? ""
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
                      value={
                        currentProduct?.product_extra?.packaged_weight ?? ""
                      }
                      onChange={(e) =>
                        handleChange("packaged_weight", e.target.value, true, [
                          validateDecimal,
                        ])
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
                      value={
                        currentProduct?.product_extra?.packaged_dimension ?? ""
                      }
                      onChange={(e) =>
                        handleChange("packaged_dimension", e.target.value, true)
                      }
                      placeholder={t("Dimensions Colis")}
                      className={inputClass}
                    />
                  </div>
                  <div className={inputDivClass}>
                    <p>{t("Par Boite")}</p>
                    <input
                      type="number"
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
                    <p>{t("Surface")}</p>
                    <input
                      type="text"
                      value={currentProduct?.product_extra?.surface_area ?? ""}
                      onChange={(e) =>
                        handleChange("surface_area", e.target.value, true, [
                          validateDecimal,
                        ])
                      }
                      placeholder={t("Surface")}
                      className={inputClass}
                    />
                    {errors.surface_area && (
                      <div className="error-message">{errors.surface_area}</div>
                    )}
                  </div>
                  <div className={inputDivClass}>
                    <p>{t("Hauteur Assise")}</p>
                    <input
                      type="number"
                      value={currentProduct?.product_extra?.seat_height ?? ""}
                      onChange={(e) =>
                        handleChange("seat_height", e.target.value, true, [
                          validateInteger,
                        ])
                      }
                      placeholder={t("Hauteur Assise")}
                      className={inputClass}
                    />
                    {errors.seat_height && (
                      <div className="error-message">{errors.seat_height}</div>
                    )}
                  </div>
                  <div className={inputDivClass}>
                    <p>{t("Hauteur Accoudoir")}</p>
                    <input
                      type="number"
                      value={
                        currentProduct?.product_extra?.armrest_height ?? ""
                      }
                      onChange={(e) =>
                        handleChange("armrest_height", e.target.value, true, [
                          validateInteger,
                        ])
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
                  <div
                    className={
                      "flex flex-col items-center shadow-lg gap-2 bg-white p-1 rounded h-full"
                    }
                  >
                    <p>{t("Ettiquetes")}</p>
                    <textarea
                      value={currentProduct?.product_extra?.tags ?? ""}
                      onChange={(e) =>
                        handleChange("tags", e.target.value, true, [])
                      }
                      placeholder={t("Ettiquetes")}
                      className={inputClass + " h-full"}
                    />
                  </div>
                  <div
                    className={
                      "flex flex-col items-center shadow-lg gap-2 bg-white p-1 rounded h-full"
                    }
                  >
                    <p>{t("Description")}</p>
                    <textarea
                      value={currentProduct?.description ?? ""}
                      onChange={(e) =>
                        handleChange("description", e.target.value, false, [])
                      }
                      placeholder={t("Description")}
                      className={inputClass + " h-full"}
                    />
                    {errors.surface_area && (
                      <div className="error-message">{errors.surface_area}</div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
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
                          <label htmlFor="uploadimg" className={buttonClass}>
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
                  <div className="col-span-3 flex flex-row">
                    {currentProduct &&
                      currentProduct.id != 0 &&
                      currentProduct.images?.map((img) => (
                        <div className="relative image_parent" key={img.id}>
                          <Image
                            alt={""}
                            src={"https://hdapi.huseyinonalalpha.com" + img.url}
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
                  <div className="flex flex-col">
                    <button
                      type="submit"
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
                </form>
                {chosenProductID != 0 && chosenProductID != null && (
                  <div className="flex flex-row mt-2 gap-2">
                    <div className={inputDivClass}>
                      <div className="flex flex-row items-center gap-2">
                        <p className="whitespace-nowrap">{t("Stock Depot")}</p>
                        <button
                          onClick={() => submitStock(3)}
                          className={componentThemes.greenSubmitButton}
                        >
                          Save
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
                            const shelfIndex = updatedProduct.shelves.findIndex(
                              (shelf) => shelf.establishment.id === 3
                            );
                            if (shelfIndex !== -1) {
                              updatedProduct.shelves[shelfIndex].stock = Number(
                                e.target.value
                              );
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
                          Save
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
                            const shelfIndex = updatedProduct.shelves.findIndex(
                              (shelf) => shelf.establishment.id === 1
                            );
                            if (shelfIndex !== -1) {
                              updatedProduct.shelves[shelfIndex].stock = Number(
                                e.target.value
                              );
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
                  </div>
                )}
              </>
            ) : (
              <div className="flex w-full h-full items-center justify-center text-2xl font-bold">
                {t("Aucun produit sélectionné")}
              </div>
            )}
          </div>
        </div>
      </AdminLayout>
    );
}
