import { getAllCategoriesFlattened } from "../../api/categories/public/getallcategoriesflattened";
import validateDecimal from "../../../api/utils/input_validators/validate_decimal";
import validateInteger from "../../../api/utils/input_validators/validate_integer";
import validateEmpty from "../../../api/utils/input_validators/validate_empty";
import {
  ArrowDown,
  ArrowDownLeft,
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  Check,
  ChevronDown,
  Copy,
  Download,
  Upload,
  X,
} from "react-feather";
import { getAllSuppliers } from "../../api/suppliers/admin/getallsuppliers";
import { getProductByID } from "../../api/products/admin/getproductbyid";
import { LuPackage, LuPackageOpen, LuPackageX } from "react-icons/lu";
import componentThemes from "../../../components/componentThemes";
import ButtonShadow1 from "../../../components/buttons/shadow_1";
import BarcodeToPng from "../../../components/common/barcodepng";
import AdminLayout from "../../../components/admin/adminLayout";
import InputOutlined from "../../../components/inputs/outlined";
import useTranslation from "next-translate/useTranslation";
import { MdAutoAwesome, MdHeight, MdOutlineChair } from "react-icons/md";
import { Product } from "../../../api/interfaces/product";
import { useEffect, useState } from "react";
import { GoCircleSlash } from "react-icons/go";
import { RxDimensions, RxMagnifyingGlass } from "react-icons/rx";
import { GiWeight } from "react-icons/gi";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import ImageWithURL from "../../../components/common/image";
import { ColorChooser } from "../../../components/inputs/ColorChooser";
import { LocalizedInput } from "../../../components/inputs/localized_input";

export default function ProductPage(props) {
  const { t, lang } = useTranslation("common");
  const [currentProduct, setCurrentProduct] = useState(props.currentProduct);
  const [inProgress, setInProgress] = useState(false);
  const allCategories = props.allCategories;
  const [selectedImage, setSelectedImage] = useState(null);
  const allSuppliers = props.allSuppliers;
  const router = useRouter();
  const searchParams = router.query;
  const returnUrl = (searchParams.return as string) ?? "/admin/stock/all";

  const navIconDivClass = "flex flex-row justify-center flex-shrink-0 w-[35px]";
  const iconClass = "flex-shrink-0";
  const inputDivClass =
    "flex flex-col items-center shadow-lg gap-2 w-[230px] bg-neutral-300 p-1 h-min";

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
          window.location.reload();
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
        if (!request.ok) {
        } else {
          window.location.reload();
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
          router.push("/admin/stock/all");
        }
      } catch {}
    };

    let confirmDelete = confirm(t("confirm_delete"));

    if (confirmDelete) {
      deleteProd();
    }
  };

  const uploadFile = async (e, d) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.target.files && e.target.files[0]) {
      const files = e.target.files;
      await sendFile(files, d).then((res) => (e.target.value = ""));
    }
  };

  const sendFile = async (files: File[], d?: string) => {
    let uploadedFiles = [];

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
          uploadedFiles.push(result);
        }
      } catch (error) {}
    }

    setCurrentProduct((pr) => ({
      ...pr,
      images: [...(pr.images ?? []), ...uploadedFiles],
      imageDirections: {
        ...(pr.imageDirections ?? {}),
        [d]: uploadedFiles.at(0).id,
      },
    }));
  };

  const handleImageDelete = async (id) => {
    setCurrentProduct((pr) => ({
      ...pr,
      images: pr.images.filter((img) => img.id != id),
    }));
    setSelectedImage(null);
  };

  const submitStock = async (id) => {
    const shelf = currentProduct.shelves.find(
      (shelf) => shelf.establishment.id == id,
    );
    await fetch(`/api/shelves/admin/putshelfstock?id=${shelf.id}`, {
      method: "PUT",
      body: JSON.stringify({ stock: shelf.stock }),
    }).then((res) => {
      router.push(returnUrl);
    });
  };
  const [submitError, setSubmitError] = useState(null);

  const handleFormSubmit = async (e) => {
    try {
      e.preventDefault();
      setSubmitError(null);
      if (inProgress) return;
      setInProgress(true);

      currentProduct.supplierCode = currentProduct.product_extra.barcode;

      if (currentProduct.id == 0) {
        errors.stock_depot = null;
        errors.stock_store = null;
      }

      if (!currentProduct.categories || currentProduct.categories.length == 0) {
        errors.category = "validators_empty_invalid";
      } else {
        errors.category = null;
      }

      if (
        Object.values(errors).some((error) => error != null && error != "") ||
        !currentProduct.categories ||
        currentProduct.categories.length == 0
      ) {
        setSubmitError(t("Fill all the required fields correctly!"));
        setInProgress(false);
      } else {
        if (currentProduct.id != 0) {
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
            const ans = await request.text();
            if (!request.ok) {
              setInProgress(false);
              setSubmitError(
                t("An error occurred while modifying the product!"),
              );
            } else {
              router.push(returnUrl);
            }
          } catch (e) {
            setInProgress(false);
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
              setInProgress(false);
              setSubmitError(
                t("An error occurred during the product creation!"),
              );
            } else {
              router.push(returnUrl);
            }
          } catch (e) {
            setInProgress(false);
            setSubmitError(t("An error occurred during the product creation!"));
          }
        }
      }
    } catch (error) {
      setInProgress(false);
      setSubmitError(error);
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
      window.location.reload();
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
      window.location.reload();
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
    internalCode: "validators_empty_invalid",
    name: "validators_empty_invalid",
    value: "validators_empty_invalid",
    barcode: "validators_empty_invalid",
    category: "validators_empty_invalid",
  });

  useEffect(() => {
    if (currentProduct.id != 0) {
      setErrors((pe) => ({
        ...pe,
        internalCode: null,
        name: null,
        value: null,
        barcode: null,
      }));
    }
  }, []);

  const autoCode = async () => {
    if (currentProduct.internalCode && currentProduct.internalCode != "") {
      alert(t("internalCode_not_empty"));
      return;
    }

    if (
      !currentProduct.name ||
      currentProduct.name == "" ||
      !currentProduct.categories ||
      currentProduct.categories.length < 1 ||
      !currentProduct.product_color
    ) {
      alert(t("fill_fields"));
      return;
    }
    const prods = await fetch(
      `/api/products/admin/getallproducts?search=${currentProduct.name}&sort=id&category=${currentProduct.categories.at(0).id}`,
    );
    let fetchedProds: Product[] = (await prods.json()).data;
    let ic = fetchedProds.find(
      (prd) => prd.name.toLowerCase() == currentProduct.name.toLowerCase(),
    )?.internalCode;

    if (ic && ic.split(".").length > 1) {
      let newCode = `HD.${ic.split(".")[1]}.${ic.split(".")[2]}.${currentProduct.product_color.code}`;
      setCurrentProduct((pr) => ({
        ...pr,
        internalCode: newCode,
      }));
      setErrors((pe) => ({
        ...pe,
        internalCode: null,
      }));
    } else {
      const prodsFromCat = await fetch(
        `/api/products/admin/getallproducts?category=${currentProduct.categories.at(0).id}&sort=id`,
      );

      const prodsFromCatData = (await prodsFromCat.json()).data;

      const result = prodsFromCatData
        .map((product) => product.internalCode) // Get the internalCode
        .map((code) => code.split(".")) // Split by "."
        .filter((parts) => parts.length === 4) // Keep only the ones with 4 parts
        .map((parts) => parseInt(parts[2])) // Extract the 3rd part (and convert it to a number)
        .sort((a, b) => a - b); // Sort numerically

      let nextValue = 1;

      if (result.length > 0) {
        nextValue = result[result.length - 1] + 1;
      }

      let newCode = `HD.${currentProduct.categories.at(0).code}.${nextValue}.${currentProduct.product_color.code}`;
      setCurrentProduct((pr) => ({
        ...pr,
        internalCode: newCode,
      }));
      setErrors((pe) => ({
        ...pe,
        internalCode: null,
      }));
    }
  };

  return (
    <AdminLayout>
      <Head>
        <title>Produit</title>
        <meta name="language" content={lang} />
      </Head>
      <form
        className={`flex w-full flex-col items-center justify-center gap-2 overflow-hidden p-2`}
        onSubmit={handleFormSubmit}
      >
        <div className="mb-2 flex flex-row items-center justify-end gap-2">
          {currentProduct.id != 0 && (
            <div
              className={`border-1 flex cursor-pointer flex-col items-center justify-center border-black bg-red-600 p-1`}
              onClick={deleteProduct}
            >
              {t("Delete")}
            </div>
          )}
          {currentProduct.id != 0 &&
            (currentProduct.product_extra.new ? (
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
            ))}
          {currentProduct.id != 0 &&
            (currentProduct.active ? (
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
            ))}
          {currentProduct.id != 0 && (
            <ButtonShadow1
              type="button"
              onClick={() => {
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
          )}
          {submitError && (
            <p className="bg-white p-1 text-red-400">
              {submitError?.toString()}
            </p>
          )}
          <ButtonShadow1 type="submit">
            <div className="flex flex-row gap-2 bg-white p-2">
              <Check color="green" />
              <p>{t("Save")}</p>
            </div>
          </ButtonShadow1>
        </div>
        <div className="flex w-full flex-row gap-2">
          <div className="flex w-2/3 flex-col gap-2">
            <div className="flex h-fit w-full flex-col gap-2 rounded-md bg-gray-200 p-4">
              <div className="flex flex-row text-3xl font-semibold">
                {t("Primary Details")}
              </div>
              <div className="flex w-full flex-col items-center justify-between gap-2">
                <div className="w-full">
                  <InputOutlined
                    label="Name"
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
                {/*  <div className={"w-full"}>
                  <TextareaOutlined
                    label="Description"
                    value={currentProduct?.description ?? ""}
                    onChange={(e) =>
                      handleChange("description", e.target.value, false, [])
                    }
                  />
                </div> */}
                <div className={"w-full"}>
                  <LocalizedInput
                    title="Description"
                    value={
                      currentProduct?.localized_description ?? {
                        nl: currentProduct?.description,
                        en: currentProduct?.description,
                        fr: currentProduct?.description,
                        de: currentProduct?.description,
                      }
                    }
                    onChange={(value) => {
                      setCurrentProduct((pp) => ({
                        ...pp,
                        localized_description: value,
                      }));
                    }}
                  />
                </div>
                <div className="flex w-full flex-row gap-2">
                  <div className="flex w-1/2 flex-row items-center">
                    <InputOutlined
                      label="Code Model"
                      type="text"
                      error={errors.internalCode}
                      value={currentProduct?.internalCode ?? ""}
                      onChange={(e) =>
                        handleChange("internalCode", e.target.value, false, [
                          validateEmpty,
                        ])
                      }
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        autoCode();
                      }}
                    >
                      <MdAutoAwesome
                        size={28}
                        className="m-1 flex-shrink-0 rounded-md bg-white p-1"
                      />
                    </button>
                  </div>
                  <div className="w-1/2">
                    <InputOutlined
                      label="EAN"
                      type="number"
                      error={errors.barcode}
                      value={currentProduct?.product_extra?.barcode ?? ""}
                      onChange={(e) =>
                        handleChange("barcode", e.target.value, true, [
                          validateEmpty,
                        ])
                      }
                    />
                  </div>
                  <div className="hidden">
                    <InputOutlined
                      label="Supplier Code"
                      type="number"
                      error={errors.supplierCode}
                      value={currentProduct?.supplierCode ?? ""}
                      onChange={(e) =>
                        handleChange("supplierCode", e.target.value, false, [])
                      }
                    />
                  </div>
                </div>
                <div className="flex w-full flex-row gap-2">
                  <div className="w-1/2">
                    <InputOutlined
                      label="Price Before Discount"
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
                  <div className="w-1/2">
                    <InputOutlined
                      label="Selling Price"
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
                <div className="flex w-full flex-row gap-2">
                  <div className="flex w-1/2 flex-col gap-2 rounded-md bg-slate-300 p-1">
                    Fournisseur:
                    <div className="group relative w-full">
                      <div className="flex w-full flex-row justify-between rounded-md bg-blue-300 p-1">
                        <p>{currentProduct.supplier.name}</p>
                        <ChevronDown />
                      </div>
                      <div
                        className={`absolute z-40 hidden max-h-[300px] w-full grid-cols-1 items-start overflow-y-auto bg-gray-100 p-2 group-hover:grid`}
                      >
                        {allSuppliers
                          .filter(
                            (sup) => sup.id != currentProduct?.supplier?.id,
                          )
                          .map((sup) => (
                            <button
                              key={sup.id}
                              className="flex flex-row items-start gap-2 p-1 hover:bg-blue-200"
                              onClick={() => {
                                setCurrentProduct({
                                  ...currentProduct,
                                  supplier: sup,
                                });
                              }}
                            >
                              {t(sup.name)}
                            </button>
                          ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex w-1/2 flex-row">
                    {currentProduct.id != 0 && (
                      <BarcodeToPng value={currentProduct.supplierCode} />
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex h-fit w-full flex-col gap-2 rounded-md bg-gray-200 p-4">
              <div className="flex flex-row text-3xl font-semibold">
                {t("Secondary Details")}
              </div>
              <div className="flex w-full flex-col items-center justify-between gap-2">
                <div className="flex w-full flex-wrap items-center justify-start gap-2">
                  <div className="w-[200px]">
                    <InputOutlined
                      label="Material"
                      type="text"
                      value={currentProduct?.material ?? ""}
                      onChange={(e) => handleChange("material", e.target.value)}
                    />
                  </div>
                  <div className="w-[200px]">
                    <InputOutlined
                      label="Color"
                      type="text"
                      value={currentProduct?.color ?? ""}
                      onChange={(e) => handleChange("color", e.target.value)}
                    />
                  </div>

                  <div className="flex w-[200px] flex-row items-center">
                    <GiWeight size={36} className="flex-shrink-0" />
                    <InputOutlined
                      label="Weight"
                      type="number"
                      value={currentProduct?.product_extra?.weight ?? ""}
                      error={errors.weight}
                      onChange={(e) =>
                        handleChange("weight", e.target.value, true, [
                          validateDecimal,
                        ])
                      }
                    />
                  </div>
                  <div className="flex w-[200px] flex-row items-center">
                    <LuPackageOpen size={36} className="flex-shrink-0" />
                    <InputOutlined
                      label="Packaged Weight Net"
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
                  <div className="flex w-[200px] flex-row items-center">
                    <LuPackage size={36} className="flex-shrink-0" />
                    <InputOutlined
                      label="Packaged Weight"
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
                  <div className="flex w-[200px] flex-row items-center">
                    <RxDimensions size={36} className="flex-shrink-0" />
                    <InputOutlined
                      label="Packaged Dimensions"
                      type="text"
                      value={
                        currentProduct?.product_extra?.packaged_dimensions ?? ""
                      }
                      onChange={(e) =>
                        handleChange(
                          "packaged_dimensions",
                          e.target.value,
                          true,
                        )
                      }
                    />
                  </div>
                  <div className="flex w-[200px] flex-row items-center">
                    <LuPackageX size={36} className="flex-shrink-0" />
                    <InputOutlined
                      label="Per Box"
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
                  <div className="flex w-[200px] flex-row">
                    <MdHeight size={36} className="flex-shrink-0" />
                    <InputOutlined
                      label="Height"
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
                  <div className="flex w-[200px] flex-row">
                    <MdHeight size={36} className="flex-shrink-0 rotate-90" />
                    <InputOutlined
                      label="Width"
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
                  <div className="flex w-[200px] flex-row">
                    <MdHeight size={36} className="flex-shrink-0 rotate-45" />
                    <InputOutlined
                      label="Depth"
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
                  <div className="flex w-[200px] flex-row items-center">
                    <GoCircleSlash size={36} className="flex-shrink-0" />
                    <InputOutlined
                      label="Diameter"
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
                  <div className="flex w-[200px] flex-row items-end">
                    <MdOutlineChair size={36} className="flex-shrink-0" />
                    <MdHeight size={20} className="-ml-1.5 flex-shrink-0" />
                    <InputOutlined
                      label="Seat Height"
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
                  <div className="flex w-[200px] flex-row items-end">
                    <MdOutlineChair size={36} className="flex-shrink-0" />
                    <MdHeight size={26} className="-ml-1.5 flex-shrink-0" />
                    <InputOutlined
                      label="Armrest Height"
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

                  {currentProduct.id != 0 && (
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
                            const updatedProduct = { ...currentProduct };
                            const shelfIndex = updatedProduct.shelves.findIndex(
                              (shelf) => shelf.establishment.id === 3,
                            );
                            if (shelfIndex !== -1) {
                              updatedProduct.shelves[shelfIndex].stock = Number(
                                e.target.value,
                              );
                              setCurrentProduct(updatedProduct);
                            }
                            errors.stock_depot = "";
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
                            const updatedProduct = { ...currentProduct };
                            const shelfIndex = updatedProduct.shelves.findIndex(
                              (shelf) => shelf.establishment.id === 1,
                            );
                            if (shelfIndex !== -1) {
                              updatedProduct.shelves[shelfIndex].stock = Number(
                                e.target.value,
                              );
                              setCurrentProduct(updatedProduct);
                            }
                            errors.stock_store = "";
                          }}
                          placeholder={t("Stock Store")}
                        />
                        {errors.stock_store && (
                          <div className="error-message">
                            {errors.stock_store}
                          </div>
                        )}
                      </div>
                      {currentProduct.id != 0 && (
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
              </div>
            </div>
          </div>
          <div className="flex w-1/3 flex-col gap-2">
            <div className="flex h-fit w-full flex-col gap-2 rounded-md bg-gray-200 p-4">
              <div className="flex flex-row text-3xl font-semibold">
                {t("Images")}
              </div>
              <div className="flex flex-wrap gap-1">
                {selectedImage && (
                  <div
                    className="relative aspect-square w-full"
                    key={selectedImage.id}
                  >
                    <ImageWithURL
                      alt={""}
                      src={selectedImage.url}
                      id={selectedImage.id}
                      fill
                      style={{ objectFit: "contain" }}
                    />
                    <div
                      className="absolute right-2 top-2 z-50"
                      onClick={() => handleImageDelete(selectedImage.id)}
                    >
                      <X className="h-8 w-8" color="red" />
                    </div>
                    <Link
                      target="_blank"
                      className="absolute right-2 top-12"
                      href={
                        "https://hdcdn.hocecomv1.com" + selectedImage.url.replace("https://hdcdn.hocecomv1.com", "")
                      }
                    >
                      <Download className="h-8 w-8" color="green" />
                    </Link>
                  </div>
                )}
                {currentProduct.images
                  ?.filter(
                    (img) =>
                      !Object.values(
                        currentProduct.imageDirections ?? {},
                      ).includes(img.id),
                  )
                  .map((img) => (
                    <ImageWithURL
                      key={img.id}
                      alt={""}
                      src={img.url}
                      id={img.id}
                      width={80}
                      height={80}
                      onClick={() => setSelectedImage(img)}
                    />
                  ))}
                <div className="flex flex-col items-center">
                  {currentProduct.images?.find(
                    (img) => currentProduct.imageDirections?.l == img.id,
                  ) ? (
                    <ImageWithURL
                      alt={""}
                      src={
                        currentProduct.images?.find(
                          (img) => currentProduct.imageDirections?.l == img.id,
                        ).url
                      }
                      id={
                        currentProduct.images?.find(
                          (img) => currentProduct.imageDirections?.l == img.id,
                        ).id
                      }
                      width={80}
                      height={80}
                      onClick={() =>
                        setSelectedImage(
                          currentProduct.images?.find(
                            (img) =>
                              currentProduct.imageDirections?.l == img.id,
                          ),
                        )
                      }
                    />
                  ) : (
                    <>
                      <label
                        htmlFor="uploadimgl"
                        className={
                          "hover:bg flex h-[80px] w-[80px] cursor-pointer flex-row items-center justify-center overflow-hidden bg-white shadow-lg duration-500"
                        }
                      >
                        <div className={navIconDivClass}>
                          <Upload className={iconClass} />
                        </div>
                      </label>
                      <input
                        title={t("Upload Image")}
                        className="absolute h-0 w-0 opacity-0"
                        placeholder={t("Upload Image")}
                        type="file"
                        name="uploadimgl"
                        multiple={true}
                        id="uploadimgl"
                        onChange={(e) => uploadFile(e, "l")}
                      ></input>
                    </>
                  )}
                  <ArrowLeft />
                </div>
                <div className="flex flex-col items-center">
                  {currentProduct.images?.find(
                    (img) => currentProduct.imageDirections?.fl == img.id,
                  ) ? (
                    <ImageWithURL
                      alt={""}
                      src={
                        currentProduct.images?.find(
                          (img) => currentProduct.imageDirections?.fl == img.id,
                        ).url
                      }
                      id={
                        currentProduct.images?.find(
                          (img) => currentProduct.imageDirections?.fl == img.id,
                        ).id
                      }
                      width={80}
                      height={80}
                      onClick={() =>
                        setSelectedImage(
                          currentProduct.images?.find(
                            (img) =>
                              currentProduct.imageDirections?.fl == img.id,
                          ),
                        )
                      }
                    />
                  ) : (
                    <>
                      <label
                        htmlFor="uploadimgfl"
                        className={
                          "hover:bg flex h-[80px] w-[80px] cursor-pointer flex-row items-center justify-center overflow-hidden bg-white shadow-lg duration-500"
                        }
                      >
                        <div className={navIconDivClass}>
                          <Upload className={iconClass} />
                        </div>
                      </label>
                      <input
                        title={t("Upload Image")}
                        className="absolute h-0 w-0 opacity-0"
                        placeholder={t("Upload Image")}
                        type="file"
                        name="uploadimgfl"
                        multiple={true}
                        id="uploadimgfl"
                        onChange={(e) => uploadFile(e, "fl")}
                      ></input>
                    </>
                  )}
                  <ArrowDownLeft />
                </div>
                <div className="flex flex-col items-center">
                  {currentProduct.images?.find(
                    (img) => currentProduct.imageDirections?.b == img.id,
                  ) ? (
                    <ImageWithURL
                      alt={""}
                      src={
                        currentProduct.images?.find(
                          (img) => currentProduct.imageDirections?.b == img.id,
                        ).url
                      }
                      id={
                        currentProduct.images?.find(
                          (img) => currentProduct.imageDirections?.b == img.id,
                        ).id
                      }
                      width={80}
                      height={80}
                      onClick={() =>
                        setSelectedImage(
                          currentProduct.images?.find(
                            (img) =>
                              currentProduct.imageDirections?.b == img.id,
                          ),
                        )
                      }
                    />
                  ) : (
                    <>
                      <label
                        htmlFor="uploadimgb"
                        className={
                          "hover:bg flex h-[80px] w-[80px] cursor-pointer flex-row items-center justify-center overflow-hidden bg-white shadow-lg duration-500"
                        }
                      >
                        <div className={navIconDivClass}>
                          <Upload className={iconClass} />
                        </div>
                      </label>
                      <input
                        title={t("Upload Image")}
                        className="absolute h-0 w-0 opacity-0"
                        placeholder={t("Upload Image")}
                        type="file"
                        name="uploadimgb"
                        multiple={true}
                        id="uploadimgb"
                        onChange={(e) => uploadFile(e, "b")}
                      ></input>
                    </>
                  )}
                  <ArrowUp />
                </div>
                <div className="flex flex-col items-center">
                  {currentProduct.images?.find(
                    (img) => currentProduct.imageDirections?.f == img.id,
                  ) ? (
                    <ImageWithURL
                      alt={""}
                      src={
                        currentProduct.images?.find(
                          (img) => currentProduct.imageDirections?.f == img.id,
                        ).url
                      }
                      id={
                        currentProduct.images?.find(
                          (img) => currentProduct.imageDirections?.f == img.id,
                        ).id
                      }
                      width={80}
                      height={80}
                      onClick={() =>
                        setSelectedImage(
                          currentProduct.images?.find(
                            (img) =>
                              currentProduct.imageDirections?.f == img.id,
                          ),
                        )
                      }
                    />
                  ) : (
                    <>
                      <label
                        htmlFor="uploadimgf"
                        className={
                          "hover:bg flex h-[80px] w-[80px] cursor-pointer flex-row items-center justify-center overflow-hidden bg-white shadow-lg duration-500"
                        }
                      >
                        <div className={navIconDivClass}>
                          <Upload className={iconClass} />
                        </div>
                      </label>
                      <input
                        title={t("Upload Image")}
                        className="absolute h-0 w-0 opacity-0"
                        placeholder={t("Upload Image")}
                        type="file"
                        name="uploadimgf"
                        multiple={true}
                        id="uploadimgf"
                        onChange={(e) => uploadFile(e, "f")}
                      ></input>
                    </>
                  )}
                  <ArrowDown />
                </div>
                <div className="flex flex-col items-center">
                  {currentProduct.images?.find(
                    (img) => currentProduct.imageDirections?.fr == img.id,
                  ) ? (
                    <ImageWithURL
                      alt={""}
                      src={
                        currentProduct.images?.find(
                          (img) => currentProduct.imageDirections?.fr == img.id,
                        ).url
                      }
                      id={
                        currentProduct.images?.find(
                          (img) => currentProduct.imageDirections?.fr == img.id,
                        ).id
                      }
                      width={80}
                      height={80}
                      onClick={() =>
                        setSelectedImage(
                          currentProduct.images?.find(
                            (img) =>
                              currentProduct.imageDirections?.fr == img.id,
                          ),
                        )
                      }
                    />
                  ) : (
                    <>
                      <label
                        htmlFor="uploadimgfr"
                        className={
                          "hover:bg flex h-[80px] w-[80px] cursor-pointer flex-row items-center justify-center overflow-hidden bg-white shadow-lg duration-500"
                        }
                      >
                        <div className={navIconDivClass}>
                          <Upload className={iconClass} />
                        </div>
                      </label>
                      <input
                        title={t("Upload Image")}
                        className="absolute h-0 w-0 opacity-0"
                        placeholder={t("Upload Image")}
                        type="file"
                        name="uploadimgfr"
                        multiple={true}
                        id="uploadimgfr"
                        onChange={(e) => uploadFile(e, "fr")}
                      ></input>
                    </>
                  )}
                  <ArrowDownRight />
                </div>
                <div className="flex flex-col items-center">
                  {currentProduct.images?.find(
                    (img) => currentProduct.imageDirections?.r == img.id,
                  ) ? (
                    <ImageWithURL
                      alt={""}
                      src={
                        currentProduct.images?.find(
                          (img) => currentProduct.imageDirections?.r == img.id,
                        ).url
                      }
                      id={
                        currentProduct.images?.find(
                          (img) => currentProduct.imageDirections?.r == img.id,
                        ).id
                      }
                      width={80}
                      height={80}
                      onClick={() =>
                        setSelectedImage(
                          currentProduct.images?.find(
                            (img) =>
                              currentProduct.imageDirections?.r == img.id,
                          ),
                        )
                      }
                    />
                  ) : (
                    <>
                      <label
                        htmlFor="uploadimgr"
                        className={
                          "hover:bg flex h-[80px] w-[80px] cursor-pointer flex-row items-center justify-center overflow-hidden bg-white shadow-lg duration-500"
                        }
                      >
                        <div className={navIconDivClass}>
                          <Upload className={iconClass} />
                        </div>
                      </label>
                      <input
                        title={t("Upload Image")}
                        className="absolute h-0 w-0 opacity-0"
                        placeholder={t("Upload Image")}
                        type="file"
                        name="uploadimgr"
                        multiple={true}
                        id="uploadimgr"
                        onChange={(e) => uploadFile(e, "r")}
                      ></input>
                    </>
                  )}
                  <ArrowRight />
                </div>
                <div className="flex flex-col items-center">
                  {currentProduct.images?.find(
                    (img) => currentProduct.imageDirections?.d == img.id,
                  ) ? (
                    <ImageWithURL
                      alt={""}
                      src={
                        currentProduct.images?.find(
                          (img) => currentProduct.imageDirections?.d == img.id,
                        ).url
                      }
                      id={
                        currentProduct.images?.find(
                          (img) => currentProduct.imageDirections?.d == img.id,
                        ).id
                      }
                      width={80}
                      height={80}
                      onClick={() =>
                        setSelectedImage(
                          currentProduct.images?.find(
                            (img) =>
                              currentProduct.imageDirections?.d == img.id,
                          ),
                        )
                      }
                    />
                  ) : (
                    <>
                      <label
                        htmlFor="uploadimgd"
                        className={
                          "hover:bg flex h-[80px] w-[80px] cursor-pointer flex-row items-center justify-center overflow-hidden bg-white shadow-lg duration-500"
                        }
                      >
                        <div className={navIconDivClass}>
                          <Upload className={iconClass} />
                        </div>
                      </label>
                      <input
                        title={t("Upload Image")}
                        className="absolute h-0 w-0 opacity-0"
                        placeholder={t("Upload Image")}
                        type="file"
                        name="uploadimgd"
                        multiple={true}
                        id="uploadimgd"
                        onChange={(e) => uploadFile(e, "d")}
                      ></input>
                    </>
                  )}
                  <RxMagnifyingGlass />
                </div>
              </div>
            </div>
            <div className="flex h-fit w-full flex-col gap-2 rounded-md bg-gray-200 p-4">
              <div className="flex flex-row text-3xl font-semibold">
                {t("Categories")}
              </div>
              {currentProduct.categories?.map((cat) => (
                <div
                  key={cat.id}
                  className="flex flex-row items-center gap-2 bg-blue-100 p-1"
                >
                  <button
                    onClick={() => {
                      setCurrentProduct({
                        ...currentProduct,
                        categories: currentProduct.categories.filter(
                          (c) => c.id != cat.id,
                        ),
                      });
                    }}
                  >
                    <X color="red" />
                  </button>
                  <p>{t(cat.localized_name[lang])}</p>
                </div>
              ))}
              <div className="group relative">
                <div className="flex w-full flex-row justify-between rounded-md bg-blue-300 p-1">
                  <p className={`${errors.category ? "text-red-500" : ""}`}>
                    {t("Select Category")}
                  </p>
                  <ChevronDown />
                </div>
                <div
                  className={`absolute z-40 hidden max-h-[300px] w-full grid-cols-1 items-start overflow-y-auto bg-gray-100 p-2 group-hover:grid`}
                >
                  {allCategories
                    .filter(
                      (cat) =>
                        !currentProduct.categories?.some((c) => c.id == cat.id),
                    )
                    .map((cat) => (
                      <button
                        key={cat.id}
                        className={`flex flex-row items-start gap-2 p-1 hover:bg-blue-200 ${cat.headCategory ? "ml-2" : ""}`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (cat.subCategories.length > 0) {
                            return;
                          } else {
                            setCurrentProduct({
                              ...currentProduct,
                              categories: [
                                ...(currentProduct.categories ?? []),
                                cat,
                              ],
                            });
                          }
                        }}
                      >
                        {t(cat.localized_name[lang])}
                      </button>
                    ))}
                </div>
              </div>
            </div>
            <div className="flex h-fit w-full flex-col gap-2 rounded-md bg-gray-200 p-4">
              <div className="flex flex-row text-3xl font-semibold">
                {t("color")}
              </div>
              {currentProduct.product_color && (
                <p>
                  {t("selected_color")}: {currentProduct.product_color.name}
                </p>
              )}
              <ColorChooser
                selectedColor={currentProduct.product_color}
                onSelect={(color) =>
                  setCurrentProduct({ ...currentProduct, product_color: color })
                }
              />
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}

export async function getServerSideProps(context) {
  const req = context.req;
  const allCategories = await getAllCategoriesFlattened();
  const allSuppliers = await getAllSuppliers(req);
  let currentProduct: Product = {
    id: 0,
    supplier: allSuppliers.at(0),
    product_extra: {},
  };
  if (context.query.id != 0) {
    context.req.query = context.query;
    currentProduct = await getProductByID(req.cookies.j, context.query.id);
  }
  return {
    props: {
      currentProduct,
      allCategories,
      allSuppliers,
    },
  };
}
