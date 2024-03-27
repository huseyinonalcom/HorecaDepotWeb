import React, { Fragment, useEffect, useState } from "react";
import Head from "next/head";
import useTranslation from "next-translate/useTranslation";
import AdminLayout from "../../../components/admin/adminLayout";
import componentThemes from "../../../components/componentThemes";
import { ArrowLeft, Upload } from "react-feather";
import Image from "next/image";
import { CFile } from "../../../api/interfaces/cfile";

export default function IndexSlider() {
  const { t, lang } = useTranslation("common");

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
        if (images != null) {
          images.forEach((img) => {
            imgIDs.push(img.id);
          });
        }
        let json = '{"data": {"indexSliderImages": [';
        for (let i = 0; i < imgIDs.length; i++) {
          json += `{"id":${imgIDs[i]}},`;
        }
        json = json.slice(0, json.length - 1);
        json += "]}}";

        const request2 = await fetch(
          "/api/website/admin/putindexsliderimages",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: json,
          },
        );

        if (request2.status == 200) {
          setImages(await fetchImages());
        } else {
        }
      } else {
      }
    } catch (error) {}
  };

  const [images, setImages] = useState<CFile[] | null>(null);
  const [imageUrls, setImageUrls] = useState(null);
  const [inputValues, setInputValues] = useState({});

  const fetchImages = async () => {
    const fetchImagesRequest = await fetch(
      "/api/website/public/getindexsliderimages",
      {
        method: "GET",
      },
    );
    if (fetchImagesRequest.ok) {
      const fetchImagesAnswer = await fetchImagesRequest.json();
      setImageUrls(fetchImagesAnswer.indexSliderImagesUrls);
      return fetchImagesAnswer.indexSliderImages;
    } else {
      return null;
    }
  };

  useEffect(() => {
    if (!images) {
      const fetchAndSetImages = async () => {
        setImages(await fetchImages());
      };
      fetchAndSetImages();
    }
  }, []);

  const [currentImage, setCurrentImage] = useState(0);

  const imageBase =
    "absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000";
  const imageVisible = "opacity-100 z-40";
  const imageInvisible = "opacity-0";

  useEffect(() => {
    setInputValues(imageUrls);
  }, [imageUrls]);

  useEffect(() => {
    setCurrentImage(0);
  }, [images]);

  const slideNext = () => {
    setCurrentImage((prevImage) => (prevImage + 1) % images.length);
  };

  const slidePrevious = () => {
    setCurrentImage((prevImage) => {
      if (prevImage === 0) {
        return images.length - 1;
      } else {
        return prevImage - 1;
      }
    });
  };

  const saveChanges = async () => {
    const imgIDs: number[] = [];
    if (images != null) {
      images.forEach((img) => {
        imgIDs.push(img.id);
      });
    }
    let json = '{"data": {"indexSliderImagesUrls": ';
    json += JSON.stringify(imageUrls);

    json = json.slice(0, json.length - 1);
    json += '},"indexSliderImages": [';
    for (let i = 0; i < imgIDs.length; i++) {
      json += `{"id":${imgIDs[i]}},`;
    }
    json = json.slice(0, json.length - 1);
    json += "]}}";

    const request2 = await fetch("/api/website/admin/putindexsliderimages", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: json,
    });

    if (request2.status == 200) {
      setImages(await fetchImages());
    } else {
    }
  };

  const iconClass = "flex-shrink-0";
  const textClass = "mx-2 font-bold text-center";

  return (
    <AdminLayout>
      <Head>
        <title>Website</title>
        <meta name="language" content={lang} />
      </Head>
      <div className="mx-auto flex w-[95%] flex-col items-center pt-2">
        <div className="relative aspect-[32/9] max-h-[50vh] w-full">
          {images && imageUrls && inputValues && (
            <div className="relative flex h-full w-full flex-shrink-0 flex-row">
              <div className="relative h-full w-full">
                {images.map((img, index) => (
                  <Fragment key={img.id}>
                    <Image
                      fill
                      id="background-image"
                      style={{ objectFit: "cover" }}
                      priority
                      loading="eager"
                      key={index}
                      src={`https://hdapi.huseyinonalalpha.com${img.url}`}
                      alt={""}
                      className={`${imageBase} ${
                        currentImage === index ? imageVisible : imageInvisible
                      }`}
                    />
                    <button
                      onClick={() => {
                        setImages([
                          ...images.filter((imag) => imag.id != img.id),
                        ]);
                        const newImageUrls = Object.entries(imageUrls).reduce(
                          (acc, [key, value]) => {
                            if (key != img.id.toString()) {
                              // Check if the key does not match imgId
                              acc[key] = value; // Add to accumulator if it doesn't match
                            }
                            return acc; // Return the accumulated object
                          },
                          {},
                        );
                        setImageUrls(newImageUrls);
                      }}
                      className={`absolute bottom-10 left-10 z-50 bg-black  p-4 text-red-500 ${
                        currentImage === index ? "" : "hidden"
                      }`}
                    >
                      ❌ {t("Delete this image")}
                    </button>
                    <div className="absolute bottom-10 right-10 z-50">
                      <form className="flex flex-col">
                        <input
                          className={`border  border-gray-300 p-2 ${
                            currentImage === index ? "" : "hidden"
                          }`}
                          type="text"
                          name="url"
                          placeholder={t("Link")}
                          value={inputValues[img.id]}
                          onChange={(e) =>
                            setInputValues({
                              ...inputValues,
                              [img.id]: e.target.value,
                            })
                          }
                        />
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setImageUrls({
                              ...imageUrls,
                              [img.id]: inputValues[img.id],
                            });
                          }}
                          className={`bg-black p-4  text-green-500 ${
                            currentImage === index ? "" : "hidden"
                          }`}
                        >
                          🔗 {t("Attach link to this image")}
                        </button>
                      </form>
                    </div>
                  </Fragment>
                ))}
              </div>
              {images.length > 1 ? (
                <div
                  className="absolute left-0 z-40 flex h-full flex-col justify-center bg-slate-100 opacity-40"
                  onClick={slidePrevious}
                >
                  <ArrowLeft />
                </div>
              ) : (
                <div></div>
              )}
              {images.length > 1 ? (
                <div
                  className="absolute right-0 z-40 flex h-full flex-col justify-center bg-slate-100 opacity-40"
                  onClick={slideNext}
                >
                  <ArrowLeft className="rotate-180" />
                </div>
              ) : (
                <div></div>
              )}
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={saveChanges}
              className={componentThemes.greenSubmitButton}
            >
              {t("Save")}
            </button>
            <>
              <label
                htmlFor="uploadimg"
                className={
                  componentThemes.greenSubmitButton +
                  " flex cursor-pointer flex-row justify-center"
                }
              >
                <Upload className={iconClass} />
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
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
