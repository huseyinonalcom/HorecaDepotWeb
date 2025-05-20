import { ProductSelector } from "../../../components/selector/Product-Selector";
import TextareaOutlined from "../../../components/inputs/textarea_outlined";
import LoadingIndicator from "../../../components/common/loadingIndicator";
import componentThemes from "../../../components/componentThemes";
import InputOutlined from "../../../components/inputs/outlined";
import ImageWithURL from "../../../components/common/image";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import ButtonShadow1 from "../../../components/buttons/shadow_1";
import AdminPanelLayout from "../../../components/admin/AdminPanelLayout";
import { FiUpload, FiX } from "react-icons/fi";

const navIconDivClass = "flex flex-row justify-center flex-shrink-0 w-[35px]";
const iconClass = "flex-shrink-0";
const textClass = "mx-2 font-bold text-left";

export default function Collection() {
  const router = useRouter();
  const { t, lang } = useTranslation("common");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [currentCollection, setCurrentCollection] = useState(null);

  const [submitError, setSubmitError] = useState<string | null>(null);

  const fetchCollection = async (orderID: number) => {
    const request = await fetch(
      `/api/collections/public/getcollections?id=${orderID}`,
      {
        method: "GET",
      },
    );
    const response = await request.json();
    if (request.ok) {
      return response;
    } else {
      setIsLoading(false);
      return;
    }
  };

  useEffect(() => {
    if (router.isReady && router.query.id) {
      if (
        !Number.isSafeInteger(Number(router.query.id)) ||
        Number(router.query.id) <= 0
      ) {
        setIsLoading(false);
        return;
      }

      const collectionID: number = Number(router.query.id);

      if (collectionID) {
        fetchCollection(collectionID)
          .then(async (coll) => {
            setCurrentCollection(coll);
            setIsLoading(false);
          })
          .catch((_) => {
            setIsLoading(false);
          });
      } else {
        setIsLoading(false);
      }
    } else setIsLoading(false);
  }, [router.isReady, router.query.id]);

  if (isLoading) {
    return (
      <>
        <Head>
          <title>{t("collcetion")}</title>
        </Head>
        <div className="mx-auto flex w-[95vw] flex-row items-start justify-start">
          <div className="mx-auto py-2">
            <LoadingIndicator />
          </div>
        </div>
      </>
    );
  } else if (!currentCollection) {
    const postCollection = async (e) => {
      e.preventDefault();
      const request = await fetch(`/api/collections/admin/submitcollection`, {
        method: "POST",
        body: JSON.stringify({ name: currentCollection.name }),
      });
      const answer = await request.json();
      if (request.ok) {
        router.push(`/admin/website/collection?id=${answer.id}`);
      } else {
        setSubmitError(t("collection_submit_error"));
      }
    };
    return (
      <>
        <Head>
          <title>{t("collcetion")}</title>
        </Head>
        <div className="mx-auto flex w-[95vw] flex-col items-center justify-start">
          <div className="w-full py-2 text-center text-xl font-semibold">
            {t("collection_name_choose")}
          </div>
          <form onSubmit={postCollection}>
            <InputOutlined
              type="text"
              id="name"
              required
              value={currentCollection?.name ?? ""}
              onChange={(e) =>
                setCurrentCollection({
                  name: e.target.value,
                })
              }
              label={t("Name")}
            />
            <button className={componentThemes.outlinedButton}>
              {t("collection_create")}
            </button>
            {submitError && (
              <p className="text-center font-medium text-red-600">
                {submitError}
              </p>
            )}
          </form>
        </div>
      </>
    );
  } else {
    const putCollection = async (e) => {
      e.preventDefault();
      const request = await fetch(
        `/api/collections/admin/submitcollection?id=${currentCollection.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            name: currentCollection.name,
            category: currentCollection.category,
            bgColor: currentCollection.bgColor,
            description: currentCollection.description,
            image: currentCollection.image,
            right: currentCollection.right,
            tags: currentCollection.tags,
            textColor: currentCollection.textColor,
            products: currentCollection.products.map((pro) => pro.id),
          }),
        },
      );
      if (request.ok) {
        router.push("/admin/website/collections");
      } else {
        setSubmitError(t("collection_modify_error"));
      }
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
        const request = await fetch("/api/private/files/sendfile", {
          method: "POST",
          body: formData,
        });

        if (request.status == 201) {
          const result = await request.json();
          setCurrentCollection((pc) => ({
            ...pc,
            image: result,
          }));
        } else {
        }
      } catch (e) {}
    };

    return (
      <>
        <Head>
          <title>{t("collection")}</title>
        </Head>
        <div className="mx-auto flex w-full flex-col items-center justify-start">
          <div className="w-full py-2 text-center text-xl font-semibold">
            {currentCollection?.name} -
            {` /collections/${currentCollection?.id}/${encodeURIComponent(currentCollection?.name)}`}
          </div>
          <form
            onSubmit={putCollection}
            className="grid w-full max-w-screen-xl grid-cols-2"
          >
            <InputOutlined
              type="text"
              id="name"
              required
              value={currentCollection.name}
              onChange={(e) =>
                setCurrentCollection((pc) => ({
                  ...pc,
                  name: e.target.value,
                }))
              }
              label={t("Name")}
            />
            <InputOutlined
              type="text"
              id="category"
              required
              value={currentCollection.category}
              onChange={(e) =>
                setCurrentCollection((pc) => ({
                  ...pc,
                  category: e.target.value,
                }))
              }
              label={t("Category")}
            />
            <InputOutlined
              type="text"
              id="description"
              required
              value={currentCollection.description}
              onChange={(e) =>
                setCurrentCollection((pc) => ({
                  ...pc,
                  description: e.target.value,
                }))
              }
              label={t("Description")}
            />
            <TextareaOutlined
              id="tags"
              required
              value={currentCollection.tags}
              onChange={(e) =>
                setCurrentCollection((pc) => ({
                  ...pc,
                  tags: e.target.value,
                }))
              }
              label={t("Tags")}
            />
            {!currentCollection.image ? (
              <div>
                <label
                  htmlFor="uploadimg"
                  className="flex cursor-pointer flex-row items-center justify-start overflow-hidden py-2 shadow-lg duration-500 hover:bg-orange-400"
                >
                  <div className={navIconDivClass}>
                    <FiUpload className={iconClass} />
                  </div>
                  <span className={textClass}>{t("Upload Image")}</span>
                </label>
                <input
                  title={t("Upload Image")}
                  className="h-0 w-0 opacity-0"
                  type="file"
                  name="uploadimg"
                  id="uploadimg"
                  onChange={uploadFile}
                />
              </div>
            ) : (
              <div className="relative w-full">
                <ImageWithURL
                  alt=""
                  src={currentCollection.image.url}
                  width={400}
                  height={400}
                />

                <button
                  type="button"
                  onClick={() =>
                    setCurrentCollection((pc) => ({
                      ...pc,
                      image: null,
                    }))
                  }
                  className="absolute top-2 right-2 text-red-500"
                >
                  <FiX />
                </button>
              </div>
            )}
            <div className="flex w-full flex-col overflow-y-auto">
              {currentCollection.products.map((product) => (
                <ButtonShadow1
                  key={"remove-" + product.id}
                  onClick={() =>
                    setCurrentCollection((pc) => ({
                      ...pc,
                      products: pc.products.filter((p) => p.id !== product.id),
                    }))
                  }
                >
                  <div className="flex h-28 w-full flex-row items-center p-2">
                    <ImageWithURL
                      alt=""
                      src={product.images != null ? product.images[0].url : ""}
                      width={90}
                      height={90}
                    />
                    <p>
                      {product.name}
                      {product.product_color?.name ?? product.color ?? ""}{" "}
                      {product.internalCode}
                    </p>
                  </div>
                </ButtonShadow1>
              ))}
            </div>
            <div>
              {/*  {products && (
                <div className="flex max-h-[350px] flex-col gap-1 overflow-y-scroll p-2">
                  <div className="flex flex-row border-b-2 border-black">
                    <textarea
                      className="h-[30px] w-full"
                      value={productSearch}
                      onChange={(e) => {
                        setProductSearch(e.target.value.trim());
                        if (e.target.value.trim() == "") {
                          setProducts(allProducts);
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key.toLowerCase() == "enter") {
                          setProducts(
                            allProducts.filter(
                              (prod) =>
                                prod.internalCode
                                  .toLowerCase()
                                  .includes(productSearch.toLowerCase()) ||
                                prod.name
                                  .toLowerCase()
                                  .includes(productSearch.toLowerCase()) ||
                                prod.color
                                  .toLowerCase()
                                  .includes(productSearch.toLowerCase()),
                            ),
                          );
                        }
                      }}
                      label={t("Internal Code / Nom / Couleur")}
                    />
                    <Search
                      onClick={() => {
                        setProducts(
                          allProducts.filter(
                            (prod) =>
                              prod.internalCode
                                .toLowerCase()
                                .includes(productSearch.toLowerCase()) ||
                              prod.name
                                .toLowerCase()
                                .includes(productSearch.toLowerCase()) ||
                              prod.color
                                .toLowerCase()
                                .includes(productSearch.toLowerCase()),
                          ),
                        );
                      }}
                    />
                  </div>
                  {products.map((prod) => (
                    <div
                      key={prod.id}
                      className="flex cursor-pointer flex-row odd:bg-gray-300 hover:bg-orange-400"
                      onClick={() => {
                        if (chosenProducts.some((p) => p.id === prod.id)) {
                          setChosenProducts(
                            chosenProducts.filter((p) => p.id !== prod.id),
                          );
                        } else {
                          setChosenProducts([...chosenProducts, prod]);
                        }
                      }}
                    >
                      {chosenProducts.some((p) => p.id === prod.id) ? (
                        <Check color="green" />
                      ) : (
                        <X />
                      )}
                      {prod.internalCode} - {prod.name} - {prod.color}
                    </div>
                  ))}
                </div>
              )} */}
            </div>

            <button className={componentThemes.outlinedButton}>
              {t("collection_modify")}
            </button>
            {submitError && (
              <p className="text-center font-medium text-red-600">
                {submitError}
              </p>
            )}
            <div></div>
          </form>
          <ProductSelector
            onProductSelected={(prod) => {
              if (currentCollection.products.some((p) => p.id === prod.id)) {
              } else {
                setCurrentCollection((pc) => ({
                  ...pc,
                  products: [...pc.products, prod],
                }));
              }
            }}
          />
        </div>
      </>
    );
  }
}

Collection.getLayout = function getLayout(children) {
  const { t } = useTranslation("common");
  return (
    <AdminPanelLayout title={t("collections")}>{children}</AdminPanelLayout>
  );
};
