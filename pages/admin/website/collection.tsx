import LoadingIndicator from "../../../components/common/loadingIndicator";
import AdminLayout from "../../../components/admin/adminLayout";
import useTranslation from "next-translate/useTranslation";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { CFile } from "../../../api/interfaces/cfile";
import componentThemes from "../../../components/componentThemes";
import { Upload } from "react-feather";
import Image from "next/image";

// collection creation/modificaton
// creation: empty collection => post with name => get ID => switch to modification layout
// modification: existing collection with at least name and ID => add products, image, bgColor, tags, right/left, description => if products, image, bgcolor, right/left are set allow featured to be set to true

const buttonClass =
  "flex flex-row items-center justify-start py-2 rounded shadow-lg hover:bg-orange-400 overflow-hidden duration-500 cursor-pointer";
const navIconDivClass = "flex flex-row justify-center flex-shrink-0 w-[35px]";
const iconClass = "flex-shrink-0";
const textClass = "mx-2 font-bold mtext-left";
const inputDivClass =
  "flex flex-col items-center shadow-lg gap-2 bg-white p-1 rounded h-min";
const inputClass = "border rounded w-full";

export default function Order() {
  const router = useRouter();
  const { t, lang } = useTranslation("common");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [currentCollection, setCurrentCollection] = useState(null);

  const [inputDescription, setInputDescription] = useState<string>("");
  const [inputFeatured, setInputFeatured] = useState<boolean>(false);
  const [inputCategory, setInputCategory] = useState<string>("");
  const [inputRight, setInputRight] = useState<boolean>(false);
  const [inputBgColor, setInputBgColor] = useState<string>("");
  const [inputImage, setInputImage] = useState(null);
  const [inputTags, setInputTags] = useState<string>("");
  const [inputName, setInputName] = useState<string>("");

  const [submitError, setSubmitError] = useState<string | null>(null);

  const fetchCollection = async (orderID: number) => {
    const request = await fetch(
      `/api/collections/public/getcollections?id=${orderID}`,
      {
        method: "GET",
      }
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
          .then((coll) => {
            setCurrentCollection(coll);
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
      setInputName(currentCollection.name);
      setInputRight(currentCollection.right);
      setInputTags(currentCollection.tags ?? "");
      setInputBgColor(currentCollection.bgColor ?? "");
      setInputFeatured(currentCollection.featured ?? "");
      setInputCategory(currentCollection.category ?? "");
      setInputDescription(currentCollection.description ?? "");
      setInputImage(currentCollection.images);
      setIsLoading(false);
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
        <div className="w-[95vw] flex flex-row justify-start items-start mx-auto">
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
        console.log(answer.id);
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
        <div className="w-[95vw] flex flex-col justify-start items-center mx-auto">
          <div className="text-center w-full font-semibold text-xl py-2">
            {t("collection_name_choose")}
          </div>
          <form onSubmit={postCollection}>
            <input
              className="w-full p-2 rounded border border-gray-300"
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
              <p className="text-red-600 font-medium text-center">
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
          }),
        }
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
        <div className="w-[95vw] flex flex-col justify-start items-center mx-auto">
          <div className="text-center w-full font-semibold text-xl py-2">
            {t("collection_name_choose")}
          </div>
          <form onSubmit={putCollection} className="grid grid-cols-2">
            <input
              className="w-full p-2 rounded border border-gray-300"
              type="text"
              id="name"
              required
              value={inputName}
              onChange={(e) => setInputName(e.target.value)}
              placeholder={t("Name")}
            />
            <input
              className="w-full p-2 rounded border border-gray-300"
              type="text"
              id="category"
              required
              value={inputCategory}
              onChange={(e) => setInputCategory(e.target.value)}
              placeholder={t("Category")}
            />
            <input
              className="w-full p-2 rounded border border-gray-300"
              type="text"
              id="description"
              required
              value={inputDescription}
              onChange={(e) => setInputDescription(e.target.value)}
              placeholder={t("Description")}
            />
            <textarea
              className="w-full p-2 rounded border border-gray-300"
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
                  <span className={textClass}>{t("Télécharger Image")}</span>
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
            ) : (
              <Image
                alt=""
                src={`https://hdapi.huseyinonalalpha.com${inputImage.url}`}
                width={400}
                height={400}
              />
            )}
            <div></div>
            <input
              className="w-full p-2 rounded border border-gray-300"
              type="text"
              id="background"
              required
              value={inputBgColor}
              onChange={(e) => setInputBgColor(e.target.value)}
              placeholder={t("Background (hex code)")}
            />
            {inputRight ? (
              <div
                className={`bg-slate-300 cursor-pointer rounded border-1 border-black items-center justify-center flex flex-col`}
                onClick={() => setInputRight(false)}
              >
                {t("Right")}
              </div>
            ) : (
              <div
                className={`bg-slate-300 cursor-pointer rounded border-1 border-black items-center justify-center flex flex-col`}
                onClick={() => setInputRight(true)}
              >
                {t("Left")}
              </div>
            )}
            {inputFeatured ? (
              <div
                className={`bg-green-300 cursor-pointer rounded border-1 border-black items-center justify-center flex flex-col`}
                onClick={() => setInputFeatured(false)}
              >
                {t("Featured")}
              </div>
            ) : (
              <div
                className={`bg-red-300 cursor-pointer rounded border-1 border-black items-center justify-center flex flex-col`}
                onClick={() => setInputFeatured(true)}
              >
                {t("Not Featured")}
              </div>
            )}
            <button className={componentThemes.greenSubmitButton}>
              {t("collection_create")}
            </button>
            {submitError && (
              <p className="text-red-600 font-medium text-center">
                {submitError}
              </p>
            )}
          </form>
        </div>
      </AdminLayout>
    );
  }
}
