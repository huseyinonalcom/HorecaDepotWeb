import LoadingIndicator from "../../../components/common/loadingIndicator";
import AdminLayout from "../../../components/admin/adminLayout";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import componentThemes from "../../../components/componentThemes";
import { Check, Search, Upload, X } from "react-feather";
import ImageWithURL from "../../../components/common/image";

const buttonClass =
  "flex flex-row items-center justify-start py-2  shadow-lg hover:bg-orange-400 overflow-hidden duration-500 cursor-pointer";
const navIconDivClass = "flex flex-row justify-center flex-shrink-0 w-[35px]";
const iconClass = "flex-shrink-0";
const textClass = "mx-2 font-bold mtext-left";

export default function Order() {
  const router = useRouter();
  const { t, lang } = useTranslation("common");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [currentCollection, setCurrentCollection] = useState(null);

  const [inputDescription, setInputDescription] = useState<string>("");
  const [inputFeatured, setInputFeatured] = useState<boolean>(false);
  const [inputTextColor, setInputTextColor] = useState<string>("");
  const [inputCategory, setInputCategory] = useState<string>("");
  const [inputRight, setInputRight] = useState<boolean>(false);
  const [inputBgColor, setInputBgColor] = useState<string>("");
  const [inputTags, setInputTags] = useState<string>("");
  const [inputName, setInputName] = useState<string>("");
  const [inputImage, setInputImage] = useState(null);

  const [products, setProducts] = useState(null);
  const [allProducts, setAllProducts] = useState(null);
  const [chosenProducts, setChosenProducts] = useState([]);
  const [productSearch, setProductSearch] = useState<string>("");

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
            const fetchProducts = async () => {
              const request = await fetch(
                `/api/products/public/getproducts?count=19000`,
                {
                  method: "GET",
                },
              );
              const response = await request.json();
              if (request.ok) {
                setAllProducts(response.sortedData);
                return response.sortedData;
              } else {
                setIsLoading(false);
                return;
              }
            };

            setProducts(await fetchProducts());
          })
          .catch((_) => {
            setIsLoading(false);
          });
      } else {
        setIsLoading(false);
      }
    } else setIsLoading(false);
  }, [router.isReady, router.query.id]);

  useEffect(() => {
    if (currentCollection) {
      setIsLoading(false);
      setInputName(currentCollection.name);
      setInputRight(currentCollection.right);
      setInputImage(currentCollection.image);
      setInputTags(currentCollection.tags ?? "");
      setInputBgColor(currentCollection.bgColor ?? "");
      setInputFeatured(currentCollection.featured ?? "");
      setInputCategory(currentCollection.category ?? "");
      setChosenProducts(currentCollection.products ?? []);
      setInputTextColor(currentCollection.textColor ?? "");
      setInputDescription(currentCollection.description ?? "");
    }
  }, [currentCollection]);

  if (isLoading) {
    return (
      <AdminLayout>
        <Head>
          <title>horecadepot</title>
          <meta name="description" content="horecadepot" />
          <meta name="language" content={lang} />
        </Head>
        <div className="mx-auto flex w-[95vw] flex-row items-start justify-start">
          <div className="mx-auto py-2">
            <LoadingIndicator />
          </div>
        </div>
      </AdminLayout>
    );
  } else if (!currentCollection) {
    const postCollection = async (e) => {
      e.preventDefault();
      const request = await fetch(`/api/collections/admin/submitcollection`, {
        method: "POST",
        body: JSON.stringify({ name: inputName }),
      });
      const answer = await request.json();
      if (request.ok) {
        router.push(`/admin/website/collection?id=${answer.id}`);
      } else {
        setSubmitError(t("collection_submit_error"));
      }
    };
    return (
      <AdminLayout>
        <Head>
          <title>horecadepot</title>
          <meta name="description" content="horecadepot" />
          <meta name="language" content={lang} />
        </Head>
        <div className="mx-auto flex w-[95vw] flex-col items-center justify-start">
          <div className="w-full py-2 text-center text-xl font-semibold">
            {t("collection_name_choose")}
          </div>
          <form onSubmit={postCollection}>
            <input
              className="w-full border  border-gray-300 p-2"
              type="text"
              id="name"
              required
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              placeholder={t("Name")}
            />
            <button className={componentThemes.greenSubmitButton}>
              {t("collection_create")}
            </button>
            {submitError && (
              <p className="text-center font-medium text-red-600">
                {submitError}
              </p>
            )}
          </form>
        </div>
      </AdminLayout>
    );
  } else {
    const putCollection = async (e) => {
      e.preventDefault();
      const request = await fetch(
        `/api/collections/admin/submitcollection?id=${currentCollection.id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            name: inputName,
            category: inputCategory,
            bgColor: inputBgColor,
            description: inputDescription,
            image: inputImage.id,
            right: inputRight,
            tags: inputTags,
            textColor: inputTextColor,
            products: chosenProducts.map((pro) => pro.id),
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
        const request = await fetch("/api/files/admin/sendfile", {
          method: "POST",
          body: formData,
        });

        if (request.status == 201) {
          const result = await request.json();
          setInputImage(await result);
        } else {
        }
      } catch (e) {}
    };

    return (
      <AdminLayout>
        <Head>
          <title>horecadepot</title>
          <meta name="description" content="horecadepot" />
          <meta name="language" content={lang} />
        </Head>
        <div className="mx-auto flex w-[95vw] flex-col items-center justify-start">
          <div className="w-full py-2 text-center text-xl font-semibold">
            {t("collection_name_choose")}
          </div>
          <form onSubmit={putCollection} className="grid grid-cols-2">
            <input
              className="w-full border  border-gray-300 p-2"
              type="text"
              id="name"
              required
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              placeholder={t("Name")}
            />
            <input
              className="w-full border  border-gray-300 p-2"
              type="text"
              id="category"
              required
              value={inputCategory}
              onChange={(e) => setInputCategory(e.target.value)}
              placeholder={t("Category")}
            />
            <input
              className="w-full border  border-gray-300 p-2"
              type="text"
              id="description"
              required
              value={inputDescription}
              onChange={(e) => setInputDescription(e.target.value)}
              placeholder={t("Description")}
            />
            <textarea
              className="w-full border  border-gray-300 p-2"
              id="tags"
              required
              value={inputTags}
              onChange={(e) => setInputTags(e.target.value)}
              placeholder={t("Tags")}
            />
            {!inputImage || inputImage.length < 1 ? (
              <>
                <label htmlFor="uploadimg" className={buttonClass}>
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
                  id="uploadimg"
                  onChange={uploadFile}
                />
              </>
            ) : (
              <ImageWithURL
                alt=""
                src={inputImage.url}
                width={400}
                height={400}
              />
            )}
            <div>
              {products && (
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
                      placeholder={t("Internal Code / Nom / Couleur")}
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
              )}
            </div>
            <div className="flex flex-row">
              <input
                className="w-full border  border-gray-300 p-2"
                type="text"
                id="background"
                required
                value={inputBgColor}
                onChange={(e) => setInputBgColor(e.target.value)}
                placeholder={t("Background (hex code)")}
              />
              <input
                className="w-full border  border-gray-300 p-2"
                type="text"
                id="text"
                required
                value={inputTextColor}
                onChange={(e) => setInputTextColor(e.target.value)}
                placeholder={t("Text Color (hex code)")}
              />
            </div>
            {inputRight ? (
              <div
                className={`border-1 flex  cursor-pointer flex-col items-center justify-center border-black bg-slate-300`}
                onClick={() => setInputRight(false)}
              >
                {t("Right")}
              </div>
            ) : (
              <div
                className={`border-1 flex  cursor-pointer flex-col items-center justify-center border-black bg-slate-300`}
                onClick={() => setInputRight(true)}
              >
                {t("Left")}
              </div>
            )}
            {inputFeatured ? (
              <div
                className={`border-1 flex  cursor-pointer flex-col items-center justify-center border-black bg-green-300`}
                onClick={() => setInputFeatured(false)}
              >
                {t("Featured")}
              </div>
            ) : (
              <div
                className={`border-1 flex  cursor-pointer flex-col items-center justify-center border-black bg-red-300`}
                onClick={() => setInputFeatured(true)}
              >
                {t("Not Featured")}
              </div>
            )}
            <button className={componentThemes.greenSubmitButton}>
              {t("collection_modify")}
            </button>
            {submitError && (
              <p className="text-center font-medium text-red-600">
                {submitError}
              </p>
            )}
            <div></div>
          </form>
        </div>
      </AdminLayout>
    );
  }
}
