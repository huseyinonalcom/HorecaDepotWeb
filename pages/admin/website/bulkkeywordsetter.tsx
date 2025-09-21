import LoadingIndicator from "../../../components/common/loadingIndicator";
import AdminPanelLayout from "../../../components/admin/AdminPanelLayout";
import componentThemes from "../../../components/componentThemes";
import useTranslation from "next-translate/useTranslation";
import { FiSearch, FiCheck, FiX } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Keywords() {
  const router = useRouter();
  const { t, lang } = useTranslation("common");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [inputTags, setInputTags] = useState("");

  const [products, setProducts] = useState(null);
  const [allProducts, setAllProducts] = useState(null);
  const [chosenProducts, setChosenProducts] = useState([]);
  const [productSearch, setProductSearch] = useState<string>("");

  const [submitError, setSubmitError] = useState<string | null>(null);

  const fetchProducts = async () => {
    const request = await fetch(
      `/api/public/products/getproducts?count=19000`,
      {
        method: "GET",
      },
    );
    const response = await request.json();
    if (request.ok) {
      setAllProducts(response.sortedData);
      setProducts(response.sortedData);
      return response.sortedData;
    } else {
      setIsLoading(false);
      return;
    }
  };

  useEffect(() => {
    fetchProducts()
      .catch(() => setIsLoading(false))
      .then(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <>
        <Head>
          <title>{t("keywords")}</title>
        </Head>
        <div className="mx-auto flex w-full flex-row items-start justify-start">
          <div className="mx-auto py-2">
            <LoadingIndicator />
          </div>
        </div>
      </>
    );
  } else if (!allProducts) {
    router.push("/admin/website");
    return (
      <>
        <Head>
          <title>{t("keywords")}</title>
        </Head>
        <div className="mx-auto flex w-full flex-row items-start justify-start">
          <div className="mx-auto py-2">
            <LoadingIndicator />
          </div>
        </div>
      </>
    );
  } else {
    const putTags = async (e) => {
      e.preventDefault();
      fetch("/api/products/admin/puttagsbulk", {
        method: "PUT",
        body: JSON.stringify({ products: chosenProducts, tags: inputTags }),
      });
      // fetch put tags with all IDs
      // make api route to handle
    };

    return (
      <>
        <Head>
          <title>{t("keywords")}</title>
        </Head>
        <div className="mx-auto flex w-full flex-col items-center justify-start">
          <div className="w-full py-2 text-center text-xl font-semibold">
            {t("bulk_tag_setter")}
          </div>
          <form
            onSubmit={putTags}
            className="flex flex-col items-center justify-center gap-2 lg:flex-row"
          >
            <div>
              {products && (
                <div className="flex max-h-[350px] flex-col gap-1 overflow-y-scroll p-2">
                  <div className="flex flex-row border-b-2 border-black">
                    <textarea
                      value={productSearch}
                      draggable={false}
                      className="max-h-[28px] min-h-[28px] w-full"
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
                    <FiSearch
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
                        <FiCheck color="green" />
                      ) : (
                        <FiX />
                      )}
                      {prod.internalCode} - {prod.name} - {prod.color}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-col justify-center">
              <textarea
                className="w-full border border-gray-300 p-2"
                id="tags"
                required
                value={inputTags}
                onChange={(e) => setInputTags(e.target.value)}
                placeholder={t("Tags")}
              />
              <button className={componentThemes.outlinedButton} type="submit">
                {t("bulk_tags_modify")}
              </button>
              {submitError && (
                <p className="text-center font-medium text-red-600">
                  {submitError}
                </p>
              )}
            </div>
            <div></div>

            <div></div>
          </form>
        </div>
      </>
    );
  }
}

Keywords.getLayout = function getLayout(children) {
  const { t } = useTranslation("common");
  return (
    <AdminPanelLayout title={t("bulkkeywordsetter")}>
      {children}
    </AdminPanelLayout>
  );
};
