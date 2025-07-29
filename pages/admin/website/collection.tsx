import { ProductSelector } from "../../../components/selector/ProductSelector";
import LoadingIndicator from "../../../components/common/loadingIndicator";
import AdminPanelLayout from "../../../components/admin/AdminPanelLayout";
import componentThemes from "../../../components/componentThemes";
import ButtonShadow1 from "../../../components/buttons/shadow_1";
import InputOutlined from "../../../components/inputs/outlined";
import ImageWithURL from "../../../components/common/image";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

export default function Collection() {
  const router = useRouter();
  const { t, lang } = useTranslation("common");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [currentCollection, setCurrentCollection] = useState({
    id: 0,
    name: "",
    products: [],
  });

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
          <title>{t("collection")}</title>
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
          <title>{t("collection")}</title>
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
                setCurrentCollection((pc) => ({
                  ...pc,
                  name: e.target.value,
                }))
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
            <div className="flex w-full flex-col overflow-y-auto">
              {currentCollection?.products?.map((product) => (
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

            <button className={componentThemes.outlinedButton}>
              {t("collection_modify")}
            </button>
            {submitError && (
              <p className="text-center font-medium text-red-600">
                {submitError}
              </p>
            )}
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
