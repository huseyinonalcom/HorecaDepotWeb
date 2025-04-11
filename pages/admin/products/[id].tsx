import { getAllCategoriesFlattened } from "../../api/categories/public/getallcategoriesflattened";
import { getAllSuppliers } from "../../api/suppliers/admin/getallsuppliers";
import { LocalizedInput } from "../../../components/inputs/localized_input";
import AdminPanelLayout from "../../../components/admin/AdminPanelLayout";
import { getProductByID } from "../../api/products/admin/getproductbyid";
import { Switch, SwitchField } from "../../../components/styled/switch";
import { ColorChooser } from "../../../components/inputs/ColorChooser";
import BarcodeToPng from "../../../components/common/barcodepng";
import { InputImage } from "../../../components/form/InputImage";
import { CurrencyEuroIcon } from "@heroicons/react/24/outline";
import { Textarea } from "../../../components/styled/textarea";
import { Divider } from "../../../components/styled/divider";
import StyledForm from "../../../components/form/StyledForm";
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
  FiChevronDown,
  FiX,
  FiArrowLeft,
  FiArrowDownLeft,
  FiArrowUp,
  FiArrowDown,
  FiArrowDownRight,
  FiArrowRight,
  FiTrash,
} from "react-icons/fi";
import isValidDecimal from "../../../api/utils/input_validators/validate_decimal";
import parseDecimal from "../../../api/utils/input_parsers/parseDecimal";

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
    e.preventDefault();
    if (inProgress) return;
    try {
      setInProgress(true);
      setSubmitError(null);

      currentProduct.supplierCode = currentProduct.product_extra.barcode;

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
            setInProgress(false);
            setSubmitError(t("An error occurred while modifying the product!"));
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
            setSubmitError(t("An error occurred during the product creation!"));
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

  return (
    <>
      <Head>
        <title>{t("product")}</title>
      </Head>

      <StyledForm
        bottomBarChildren={
          submitError && (
            <p className="bg-white p-1 text-red-400">
              {submitError?.toString()}
            </p>
          )
        }
        onSubmit={handleFormSubmit}
      >
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
            <Input
              label={t("name")}
              required
              name="name"
              defaultValue={currentProduct?.name}
              onChange={(e) => {
                setCurrentProduct((pp) => ({
                  ...pp,
                  name: e.target.value,
                }));
              }}
            />
            <Input
              label={t("price-undiscounted")}
              required
              name="priceBeforeDiscount"
              type="number"
              invalid={!isValidPriceBeforeDiscount()}
              defaultValue={currentProduct?.priceBeforeDiscount}
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
              defaultValue={currentProduct?.value ?? ""}
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
              type="number"
              defaultValue={currentProduct?.product_extra?.barcode ?? ""}
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
              <BarcodeToPng value={currentProduct.supplierCode} />
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
                    supplier: allSuppliers.find(
                      (sup) => sup.id == e.target.value,
                    ),
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
        <Divider />
        <Fieldset>
          <Legend>{t("categories")}</Legend>
          <FieldGroup>
            <div className="group relative">
              <div className="flex w-full flex-row justify-between rounded-md bg-blue-300 p-1">
                <p className="">{t("Select Category")}</p>
                <FiChevronDown />
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
                      key={cat.id + "-cat"}
                      className={`flex flex-row items-start gap-2 p-1 hover:bg-blue-200 ${cat.headCategory ? "ml-2" : ""}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setCurrentProduct({
                          ...currentProduct,
                          categories: [
                            ...(currentProduct.categories ?? []),
                            cat,
                          ],
                        });
                      }}
                    >
                      {cat.localized_name[lang]}
                    </button>
                  ))}
              </div>
            </div>
            <div className="flex flex-col gap-1">
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
                    <FiX color="red" />
                  </button>
                  <p>{cat.localized_name[lang]}</p>
                </div>
              ))}
            </div>
          </FieldGroup>
        </Fieldset>
        <Divider />
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
                setCurrentProduct({ ...currentProduct, product_color: color })
              }
            />
          </FieldGroup>
        </Fieldset>
        <Divider />
        <Fieldset>
          <Legend>{t("images")}</Legend>
          <FieldGroup>
            <div className="flex flex-wrap gap-4">
              {currentProduct.images
                ?.filter(
                  (img) =>
                    !Object.values(
                      currentProduct.imageDirections ?? {},
                    ).includes(img.id),
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
        <Divider />
        <Fieldset>
          <Legend>{t("description")}</Legend>
          <FieldGroup>
            <LocalizedInput
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
        <Divider />
        <Fieldset>
          <Legend>{t("secondary-details")}</Legend>
          <FieldGroup>
            <Input
              label={t("material")}
              name="material"
              defaultValue={currentProduct?.material ?? ""}
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
              defaultValue={currentProduct?.color ?? ""}
              onChange={(e) => {
                setCurrentProduct((pp) => ({
                  ...pp,
                  color: e.target.value,
                }));
              }}
            />
            <Input
              label={t("weight")}
              name="weight"
              defaultValue={currentProduct?.product_extra?.weight ?? ""}
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
              label={t("packaged_weight_net")}
              name="packaged_weight_net"
              defaultValue={
                currentProduct?.product_extra?.packaged_weight_net ?? ""
              }
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
              defaultValue={
                currentProduct?.product_extra?.packaged_weight ?? ""
              }
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
              defaultValue={
                currentProduct?.product_extra?.packaged_dimensions ?? ""
              }
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
            <Input
              label={t("per_box")}
              name="per_box"
              defaultValue={currentProduct?.product_extra?.per_box ?? ""}
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
              label={t("height")}
              name="height"
              defaultValue={currentProduct?.height ?? ""}
              onChange={(e) => {
                setCurrentProduct((pp) => ({
                  ...pp,
                  product_extra: {
                    ...pp.product_extra,
                    height: e.target.value,
                  },
                }));
              }}
            />
            <Input
              label={t("width")}
              name="width"
              defaultValue={currentProduct?.width ?? ""}
              onChange={(e) => {
                setCurrentProduct((pp) => ({
                  ...pp,
                  product_extra: {
                    ...pp.product_extra,
                    width: e.target.value,
                  },
                }));
              }}
            />
            <Input
              label={t("depth")}
              name="depth"
              defaultValue={currentProduct?.depth ?? ""}
              onChange={(e) => {
                setCurrentProduct((pp) => ({
                  ...pp,
                  product_extra: {
                    ...pp.product_extra,
                    depth: e.target.value,
                  },
                }));
              }}
            />
            <Input
              label={t("diameter")}
              name="diameter"
              defaultValue={currentProduct?.product_extra?.diameter ?? ""}
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
              defaultValue={currentProduct?.product_extra?.seat_height ?? ""}
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
              defaultValue={currentProduct?.product_extra?.armrest_height ?? ""}
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
            <Field>
              <Label>{t("tags")}</Label>
              <Textarea
                rows={5}
                name="tags"
                defaultValue={currentProduct?.product_extra?.tags ?? ""}
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
        {currentProduct.id != 0 && (
          <>
            <Divider />
            <Fieldset>
              <Legend>{t("stock")}</Legend>
              <FieldGroup>
                <Input
                  label={t("stock-warehouse")}
                  type="number"
                  name="stockWarehouse"
                  defaultValue={
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
                  defaultValue={
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
              </FieldGroup>
            </Fieldset>
            <Divider />
            <div className="flex flex-row gap-2 pb-6">
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
                    supplierCode: "0",
                    product_extra: {
                      ...pr.product_extra,
                      barcode: "0",
                    },
                    shelves: [],
                  }));
                }}
              >
                <div className="p-2">
                  <FiCopy />
                </div>
              </Button>
            </div>
          </>
        )}
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
