import { getAllCategoriesFlattened } from "../../api/categories/public/getallcategoriesflattened";
import isValidDecimal from "../../../api/utils/input_validators/validate_decimal";
import { LocalizedInput } from "../../../components/inputs/localized_input";
import AdminPanelLayout from "../../../components/admin/AdminPanelLayout";
import parseDecimal from "../../../api/utils/input_parsers/parseDecimal";
import { getProductByID } from "../../api/products/admin/getproductbyid";
import { Switch, SwitchField } from "../../../components/styled/switch";
import { ColorChooser } from "../../../components/inputs/ColorChooser";
import BarcodeToPng from "../../../components/common/barcodepng";
import { InputImage } from "../../../components/form/InputImage";
import { BadgeButton } from "../../../components/styled/badge";
import { CurrencyEuroIcon } from "@heroicons/react/24/outline";
import { Textarea } from "../../../components/styled/textarea";
import { Divider } from "../../../components/styled/divider";
import StyledForm from "../../../components/form/StyledForm";
import { getSuppliers } from "../../api/private/suppliers";
import { Select } from "../../../components/styled/select";
import useTranslation from "next-translate/useTranslation";
import { Button } from "../../../components/styled/button";
import { Product } from "../../../api/interfaces/product";
import { Input } from "../../../components/styled/input";
import { RxMagnifyingGlass } from "react-icons/rx";
import { useRouter } from "next/router";
import { useState } from "react";
import Head from "next/head";
import {
  Field,
  FieldGroup,
  Fieldset,
  Label,
  Legend,
} from "../../../components/styled/fieldset";
import {
  FiCopy,
  FiX,
  FiArrowLeft,
  FiArrowDownLeft,
  FiArrowUp,
  FiArrowDown,
  FiArrowDownRight,
  FiArrowRight,
  FiTrash,
} from "react-icons/fi";
import { uploadFileToAPI } from "../../api/private/files/uploadfile";

export default function ProductPage(props) {
  const { t, lang } = useTranslation("common");
  const [currentProduct, setCurrentProduct] = useState(props.currentProduct);
  const [inProgress, setInProgress] = useState(false);
  const allCategories = props.allCategories;
  const allSuppliers = props.allSuppliers;
  const router = useRouter();
  const searchParams = router.query;
  const returnUrl = (searchParams.return as string) ?? "/admin/stock/all";

  const deleteProduct = () => {
    const deleteProd = async () => {
      try {
        const request = await fetch(
          `/api/private/products/products?id=` + currentProduct.id,
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
      await uploadFileToAPI({ file: files[i] }).then((res) => {
        uploadedFiles.push(res);
      });
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
  };

  const [submitError, setSubmitError] = useState(null);

  const handleFormSubmit = async (e) => {
    console.log(currentProduct);

    e.preventDefault();
    if (inProgress) return;
    try {
      setInProgress(true);
      setSubmitError(null);

      try {
        currentProduct.description = currentProduct.localized_description["en"];
      } catch (e) {}

      currentProduct.supplierCode = currentProduct.product_extra.barcode;

      currentProduct.name = currentProduct.localized_name["en"];

      if (!currentProduct.categories || currentProduct.categories.length == 0) {
        setSubmitError("validators_empty_invalid");
        setInProgress(false);
        return;
      }

      if (currentProduct.id != "0") {
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
            console.error("Error updating product:", ans);
            setInProgress(false);
            setSubmitError(ans);
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
            const answer = await request.text();
            setInProgress(false);
            setSubmitError(answer);
          } else {
            router.push(returnUrl);
          }
        } catch (e) {
          setInProgress(false);
          setSubmitError(t("An error occurred during the product creation!"));
        }
      }
    } catch (error) {
      setInProgress(false);
      setSubmitError(error);
    }
  };

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
    }
  };

  const isValidPriceBeforeDiscount = () => {
    if (!isValidDecimal(currentProduct.priceBeforeDiscount)) {
      return false;
    }

    const priceBeforeDiscount = parseDecimal(
      currentProduct.priceBeforeDiscount,
    );

    if (priceBeforeDiscount <= 0) return false;

    if (priceBeforeDiscount <= Number(currentProduct.value)) return false;

    return true;
  };

  const isValidPrice = () => {
    if (!isValidDecimal(currentProduct.value)) {
      return false;
    }

    const price = parseDecimal(currentProduct.value);

    if (price <= 0) return false;

    return true;
  };

  const PrimaryDetails = (
    <Fieldset>
      <Legend>{t("primary-details")}</Legend>
      <FieldGroup>
        {currentProduct.id != 0 && (
          <SwitchField className="flex flex-row items-start">
            <Label>{t("active")}</Label>
            <Switch
              defaultChecked={currentProduct.active}
              color="green"
              onChange={(e) => {
                setCurrentProduct((pp) => ({
                  ...pp,
                  active: e,
                }));
              }}
            />
          </SwitchField>
        )}
        {currentProduct.id != 0 && (
          <SwitchField className="flex flex-row items-start">
            <Label>{t("featured")}</Label>
            <Switch
              defaultChecked={currentProduct.featured}
              color="green"
              onChange={(e) => {
                setCurrentProduct((pp) => ({
                  ...pp,
                  featured: e,
                }));
              }}
            />
          </SwitchField>
        )}
        <Field>
          <Label>{t("name")}</Label>
          <LocalizedInput
            required
            value={
              currentProduct?.localized_name ?? {
                nl: currentProduct?.name,
                en: currentProduct?.name,
                fr: currentProduct?.name,
                de: currentProduct?.name,
              }
            }
            onChange={(value) => {
              setCurrentProduct((pp) => ({
                ...pp,
                localized_name: value,
              }));
            }}
          />
        </Field>
        <Divider />
        <Input
          label={t("price-undiscounted")}
          required
          name="priceBeforeDiscount"
          type="number"
          invalid={!isValidPriceBeforeDiscount()}
          value={currentProduct?.priceBeforeDiscount}
          icon={<CurrencyEuroIcon />}
          onChange={(e) => {
            setCurrentProduct((pp) => ({
              ...pp,
              priceBeforeDiscount: e.target.value,
            }));
          }}
        />
        <Input
          label={t("price")}
          required
          name="value"
          type="number"
          value={currentProduct?.value ?? ""}
          icon={<CurrencyEuroIcon />}
          onChange={(e) => {
            setCurrentProduct((pp) => ({
              ...pp,
              value: e.target.value,
            }));
          }}
          invalid={!isValidPrice()}
        />
        <Input
          label="EAN"
          required
          name="barcode"
          value={currentProduct?.product_extra?.barcode ?? ""}
          onChange={(e) => {
            setCurrentProduct((pp) => ({
              ...pp,
              product_extra: {
                ...pp.product_extra,
                barcode: e.target.value,
              },
            }));
          }}
        />
        {currentProduct.id != 0 && (
          <div className="flex w-full flex-shrink-0 flex-col">
            <BarcodeToPng value={currentProduct.supplierCode} />
          </div>
        )}
        <Input
          label={t("code-model")}
          required
          name="internalCode"
          value={currentProduct?.internalCode ?? ""}
          onChange={(e) => {
            setCurrentProduct((pp) => ({
              ...pp,
              internalCode: e.target.value,
            }));
          }}
        />
        <Field>
          <Label>{t("supplier")}</Label>
          <Select
            name="supplier"
            onChange={(e) => {
              setCurrentProduct((pp) => ({
                ...pp,
                supplier: allSuppliers.find((sup) => sup.id == e.target.value),
              }));
            }}
            value={currentProduct?.supplier?.id ?? ""}
          >
            {allSuppliers.map((sup) => (
              <option key={sup.id} value={sup.id}>
                {sup.name}
              </option>
            ))}
          </Select>
        </Field>
      </FieldGroup>
    </Fieldset>
  );

  const Categories = (
    <Fieldset>
      <Legend>{t("categories")}</Legend>
      <FieldGroup>
        <Field>
          <Label>{t("Select Category")}</Label>
          <Select
            name="categories"
            onChange={(e) => {
              setCurrentProduct({
                ...currentProduct,
                categories: [
                  ...(currentProduct.categories ?? []),
                  allCategories.find((c) => c.id == e.target.value),
                ],
              });
            }}
          >
            <option>{t("Select Category")}</option>
            {allCategories
              .filter(
                (cat) =>
                  !currentProduct.categories?.some((c) => c.id === cat.id),
              )
              .map((cat) => {
                const isSubcategory = !!cat.headCategory;
                const hasHeadParent =
                  isSubcategory &&
                  !!allCategories.find(
                    (parent) => parent.id === cat.headCategory?.id,
                  )?.headCategory;

                const prefix = isSubcategory
                  ? hasHeadParent
                    ? "--"
                    : "-"
                  : "";

                return (
                  <option key={`${cat.id}-cat`} value={cat.id}>
                    {prefix}
                    {cat.localized_name[lang]}
                  </option>
                );
              })}
          </Select>
        </Field>
        <div className="flex flex-wrap gap-3">
          {currentProduct.categories?.map((cat) => (
            <BadgeButton
              key={cat.id}
              className="bg-transparent"
              onClick={() => {
                setCurrentProduct({
                  ...currentProduct,
                  categories: currentProduct.categories.filter(
                    (c) => c.id != cat.id,
                  ),
                });
              }}
            >
              {cat.localized_name[lang]}
              <FiX color="red" />
            </BadgeButton>
          ))}
        </div>
      </FieldGroup>
    </Fieldset>
  );

  // TODO: improve color functionality
  // add color image
  // make colors editable
  // make new page to manage colors

  const Color = (
    <Fieldset>
      <Legend>{t("color")}</Legend>
      <FieldGroup>
        {currentProduct.product_color && (
          <p>
            {t("selected_color")}: {currentProduct.product_color.name}
          </p>
        )}
        <ColorChooser
          selectedColor={currentProduct.product_color}
          onSelect={(color) =>
            setCurrentProduct({
              ...currentProduct,
              product_color: color,
            })
          }
        />
      </FieldGroup>
    </Fieldset>
  );

  const Stock = (
    <Fieldset>
      <Legend>{t("stock")}</Legend>
      <FieldGroup>
        <Input
          label={t("stock-warehouse")}
          type="number"
          name="stockWarehouse"
          value={
            currentProduct?.shelves?.find(
              (shelf) => shelf.establishment.id == 3,
            ).stock
          }
          onChange={(e) => {
            setCurrentProduct((pp) => ({
              ...pp,
              shelves: pp.shelves.map((shelf) => {
                if (shelf.establishment.id == 3) {
                  return {
                    ...shelf,
                    stock: e.target.value,
                  };
                } else {
                  return shelf;
                }
              }),
            }));
          }}
        />
        <Input
          label={t("stock-store")}
          type="number"
          name="stockStore"
          value={
            currentProduct?.shelves?.find(
              (shelf) => shelf.establishment.id == 1,
            ).stock
          }
          onChange={(e) => {
            setCurrentProduct((pp) => ({
              ...pp,
              shelves: pp.shelves.map((shelf) => {
                if (shelf.establishment.id == 1) {
                  return {
                    ...shelf,
                    stock: e.target.value,
                  };
                } else {
                  return shelf;
                }
              }),
            }));
          }}
        />
        <Input
          label={t("reserved")}
          type="number"
          required
          name="reserved"
          value={currentProduct?.reserved ?? "0"}
          onChange={(e) => {
            setCurrentProduct((pp) => ({
              ...pp,
              reserved: e.target.value,
            }));
          }}
        />
      </FieldGroup>
    </Fieldset>
  );

  const Images = (
    <Fieldset>
      <Legend>{t("images")}</Legend>
      <FieldGroup>
        <div className="flex flex-wrap gap-4">
          {currentProduct.images
            ?.filter(
              (img) =>
                !Object.values(currentProduct.imageDirections ?? {}).includes(
                  img.id,
                ),
            )
            .map((img) => (
              <InputImage
                id={img.url}
                height={80}
                width={80}
                url={img.url}
                onChange={() => {}}
                onDelete={() => {
                  handleImageDelete(currentProduct.imageDirections?.l);
                }}
              >
                <FiArrowLeft />
              </InputImage>
            ))}
          <InputImage
            id="l"
            height={80}
            width={80}
            url={
              currentProduct.images?.find(
                (img) => img.id == currentProduct.imageDirections?.l,
              )?.url
            }
            onChange={(e) => uploadFile(e, "l")}
            onDelete={() => {
              handleImageDelete(currentProduct.imageDirections?.l);
            }}
          >
            <FiArrowLeft />
          </InputImage>
          <InputImage
            id={"fl"}
            height={80}
            width={80}
            url={
              currentProduct.images?.find(
                (img) => img.id == currentProduct.imageDirections?.fl,
              )?.url
            }
            onChange={(e) => uploadFile(e, "fl")}
            onDelete={() => {
              handleImageDelete(currentProduct.imageDirections?.fl);
            }}
          >
            <FiArrowDownLeft />
          </InputImage>
          <InputImage
            id={"b"}
            height={80}
            width={80}
            url={
              currentProduct.images?.find(
                (img) => img.id == currentProduct.imageDirections?.b,
              )?.url
            }
            onChange={(e) => uploadFile(e, "b")}
            onDelete={() => {
              handleImageDelete(currentProduct.imageDirections?.b);
            }}
          >
            <FiArrowUp />
          </InputImage>
          <InputImage
            id={"f"}
            height={80}
            width={80}
            url={
              currentProduct.images?.find(
                (img) => img.id == currentProduct.imageDirections?.f,
              )?.url
            }
            onChange={(e) => uploadFile(e, "f")}
            onDelete={() => {
              handleImageDelete(currentProduct.imageDirections?.f);
            }}
          >
            <FiArrowDown />
          </InputImage>
          <InputImage
            id={"fr"}
            height={80}
            width={80}
            url={
              currentProduct.images?.find(
                (img) => img.id == currentProduct.imageDirections?.fr,
              )?.url
            }
            onChange={(e) => uploadFile(e, "fr")}
            onDelete={() => {
              handleImageDelete(currentProduct.imageDirections?.fr);
            }}
          >
            <FiArrowDownRight />
          </InputImage>
          <InputImage
            id={"r"}
            height={80}
            width={80}
            url={
              currentProduct.images?.find(
                (img) => img.id == currentProduct.imageDirections?.r,
              )?.url
            }
            onChange={(e) => uploadFile(e, "r")}
            onDelete={() => {
              handleImageDelete(currentProduct.imageDirections?.r);
            }}
          >
            <FiArrowRight />
          </InputImage>
          <InputImage
            id={"d"}
            height={80}
            width={80}
            url={
              currentProduct.images?.find(
                (img) => img.id == currentProduct.imageDirections?.d,
              )?.url
            }
            onChange={(e) => uploadFile(e, "d")}
            onDelete={() => {
              handleImageDelete(currentProduct.imageDirections?.d);
            }}
          >
            <RxMagnifyingGlass />
          </InputImage>
        </div>
      </FieldGroup>
    </Fieldset>
  );

  const Description = (
    <Fieldset>
      <Legend>{t("description")}</Legend>
      <FieldGroup>
        <LocalizedInput
          lines={2}
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
      </FieldGroup>
    </Fieldset>
  );

  const SecondaryDetails = (
    <Fieldset>
      <Legend>{t("secondary-details")}</Legend>
      <FieldGroup>
        <Input
          label={t("material")}
          name="material"
          value={currentProduct?.material ?? ""}
          onChange={(e) => {
            setCurrentProduct((pp) => ({
              ...pp,
              material: e.target.value,
            }));
          }}
        />
        <Input
          label={t("color")}
          name="color"
          value={currentProduct?.color ?? ""}
          onChange={(e) => {
            setCurrentProduct((pp) => ({
              ...pp,
              color: e.target.value,
            }));
          }}
        />
        <Input
          label={t("height")}
          name="height"
          value={currentProduct?.height ?? ""}
          onChange={(e) => {
            setCurrentProduct((pp) => ({
              ...pp,
              height: e.target.value,
            }));
          }}
        />
        <Input
          label={t("width")}
          name="width"
          value={currentProduct?.width ?? ""}
          required
          onChange={(e) => {
            setCurrentProduct((pp) => ({
              ...pp,
              width: e.target.value,
            }));
          }}
        />
        <Input
          label={t("depth")}
          name="depth"
          value={currentProduct?.depth ?? ""}
          required
          onChange={(e) => {
            setCurrentProduct((pp) => ({
              ...pp,
              depth: e.target.value,
            }));
          }}
        />
        <Input
          label={t("weight")}
          name="weight"
          value={currentProduct?.product_extra?.weight ?? ""}
          onChange={(e) => {
            setCurrentProduct((pp) => ({
              ...pp,
              product_extra: {
                ...pp.product_extra,
                weight: e.target.value,
              },
            }));
          }}
        />
        <Input
          label={t("diameter")}
          name="diameter"
          value={currentProduct?.product_extra?.diameter ?? ""}
          onChange={(e) => {
            setCurrentProduct((pp) => ({
              ...pp,
              product_extra: {
                ...pp.product_extra,
                diameter: e.target.value,
              },
            }));
          }}
        />
        <Input
          label={t("seat_height")}
          name="seat_height"
          value={currentProduct?.product_extra?.seat_height ?? ""}
          onChange={(e) => {
            setCurrentProduct((pp) => ({
              ...pp,
              product_extra: {
                ...pp.product_extra,
                seat_height: e.target.value,
              },
            }));
          }}
        />
        <Input
          label={t("armrest_height")}
          name="armrest_height"
          value={currentProduct?.product_extra?.armrest_height ?? ""}
          onChange={(e) => {
            setCurrentProduct((pp) => ({
              ...pp,
              product_extra: {
                ...pp.product_extra,
                armrest_height: e.target.value,
              },
            }));
          }}
        />
      </FieldGroup>
    </Fieldset>
  );

  const PackageDetails = (
    <Fieldset>
      <Legend>{t("package-details")}</Legend>
      <FieldGroup>
        <Input
          label={t("per_box")}
          name="per_box"
          value={currentProduct?.product_extra?.per_box ?? ""}
          onChange={(e) => {
            setCurrentProduct((pp) => ({
              ...pp,
              product_extra: {
                ...pp.product_extra,
                per_box: e.target.value,
              },
            }));
          }}
        />
        <Input
          label={t("packaged_weight_net")}
          name="packaged_weight_net"
          value={currentProduct?.product_extra?.packaged_weight_net ?? ""}
          onChange={(e) => {
            setCurrentProduct((pp) => ({
              ...pp,
              product_extra: {
                ...pp.product_extra,
                packaged_weight_net: e.target.value,
              },
            }));
          }}
        />
        <Input
          label={t("packaged_weight")}
          name="packaged_weight"
          value={currentProduct?.product_extra?.packaged_weight ?? ""}
          onChange={(e) => {
            setCurrentProduct((pp) => ({
              ...pp,
              product_extra: {
                ...pp.product_extra,
                packaged_weight: e.target.value,
              },
            }));
          }}
        />
        <Input
          label={t("packaged_dimensions")}
          name="packaged_dimensions"
          value={currentProduct?.product_extra?.packaged_dimensions ?? ""}
          onChange={(e) => {
            setCurrentProduct((pp) => ({
              ...pp,
              product_extra: {
                ...pp.product_extra,
                packaged_dimensions: e.target.value,
              },
            }));
          }}
        />
      </FieldGroup>
    </Fieldset>
  );

  const Tags = (
    <Fieldset>
      <Legend>{t("tags")}</Legend>
      <FieldGroup>
        <Field>
          <Textarea
            rows={5}
            name="tags"
            value={currentProduct?.product_extra?.tags ?? ""}
            onChange={(e) => {
              setCurrentProduct((pp) => ({
                ...pp,
                product_extra: {
                  ...pp.product_extra,
                  tags: e.target.value,
                },
              }));
            }}
          />
        </Field>
      </FieldGroup>
    </Fieldset>
  );

  return (
    <>
      <Head>
        <title>{t("product")}</title>
      </Head>
      <StyledForm
        bottomBarChildren={
          <>
            {currentProduct.id != 0 && (
              <>
                <div className="flex flex-row gap-6">
                  <Button type="button" color="red" onClick={deleteProduct}>
                    <div className="p-2">
                      <FiTrash />
                    </div>
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setCurrentProduct((pr) => ({
                        ...pr,
                        id: 0,
                        supplierCode: "",
                        description: "",
                        name: "",
                        product_extra: {
                          ...pr.product_extra,
                          barcode: "",
                        },
                      }));
                    }}
                    color="white"
                  >
                    <div className="p-2">
                      <FiCopy />
                    </div>
                  </Button>
                </div>
              </>
            )}
            {submitError && (
              <p className="bg-white p-1 text-red-400">
                {submitError?.toString()}
              </p>
            )}
          </>
        }
        onSubmit={handleFormSubmit}
      >
        <div className="hidden flex-row space-x-6 lg:flex">
          <div className="flex w-1/2 flex-col space-y-12 border-r border-zinc-950/10 pr-6">
            {PrimaryDetails}
            <Divider />
            {Color}
            <Divider />
            {Description}
            <Divider />
            {Tags}
            {currentProduct.id != 0 && (
              <>
                <Divider />
                {Stock}
              </>
            )}
          </div>
          <div className="flex w-1/2 flex-col space-y-12">
            {Images}
            <Divider />
            {Categories}
            <Divider />
            {SecondaryDetails}
            <Divider />
            {PackageDetails}
          </div>
        </div>
        <div className="flex flex-col space-y-12 lg:hidden">
          {PrimaryDetails}
          <Divider />
          {Images}
          <Divider />
          {Categories}
          <Divider />
          {Color}
          <Divider />
          {Description}
          <Divider />
          {Tags}
          {currentProduct.id != 0 && (
            <>
              <Divider />
              {Stock}
            </>
          )}
          <Divider />
          {SecondaryDetails}
          <Divider />
          {PackageDetails}
        </div>
      </StyledForm>
    </>
  );
}

ProductPage.getLayout = function getLayout(page) {
  const { t } = useTranslation("common");
  return <AdminPanelLayout title={t("stock")}>{page}</AdminPanelLayout>;
};

export async function getServerSideProps(context) {
  const req = context.req;
  const allCategories = await getAllCategoriesFlattened();
  const allSuppliers = await getSuppliers({ authToken: req.cookies.j });
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
