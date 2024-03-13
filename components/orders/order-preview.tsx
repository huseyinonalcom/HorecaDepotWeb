import Link from "next/link";
import Image from "next/image";
import useTranslation from "next-translate/useTranslation";
import { ArrowLeft } from "react-feather";
import { useEffect, useState } from "react";
import { AutoTextSize } from "auto-text-size";
import formatDateAPIToBe from "../../api/utils/formatdateapibe";
import componentThemes from "../componentThemes";

const OrderPreview = ({ order }) => {
  const { t } = useTranslation("common");

  const [currentImage, setCurrentImage] = useState(0);

  const imageBase =
    "absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000";
  const imageVisible = "opacity-100 z-40";
  const imageInvisible = "opacity-0";

  useEffect(() => {
    setCurrentImage(0);
  }, [order]);

  const orderImages = [];

  for (let i = 0; i < order.document_products.length; i++) {
    if (
      order.document_products[i].product.images &&
      order.document_products[i].product.images.length > 0
    ) {
      orderImages.push(order.document_products[i].product.images[0]);
    }
  }

  const slideNext = () => {
    setCurrentImage((prevImage) => (prevImage + 1) % orderImages.length);
  };

  const slidePrevious = () => {
    setCurrentImage((prevImage) => {
      if (prevImage === 0) {
        return orderImages.length - 1;
      } else {
        return prevImage - 1;
      }
    });
  };

  return (
    <div className="flex flex-row sm:min-w-[400px] bg-white p-1 shadow-md">
      <div className="relative h-[100px] sm:h-[200px] w-[100px] sm:w-[200px] flex flex-row flex-shrink-0">
        <div className="relative w-full h-full">
          {orderImages.length > 0 ? (
            orderImages.map((img, index) => (
              <Image
                key={index}
                src={`https://hdapi.huseyinonalalpha.com${img.url}`}
                width={200}
                height={200}
                alt={""}
                className={`${imageBase} ${
                  currentImage === index ? imageVisible : imageInvisible
                }`}
              />
            ))
          ) : (
            <Image
              key={1}
              src={`/assets/img/placeholder.png`}
              width={200}
              height={200}
              alt={""}
              className={`${imageBase}`}
            />
          )}
        </div>
        {orderImages.length > 1 ? (
          <div
            className="absolute z-40 left-0 h-full opacity-40 bg-slate-100 flex flex-col justify-center"
            onClick={slidePrevious}
          >
            <ArrowLeft />
          </div>
        ) : (
          <div></div>
        )}
        {orderImages.length > 1 ? (
          <div
            className="absolute z-40 right-0 h-full opacity-40 bg-slate-100 flex flex-col justify-center"
            onClick={slideNext}
          >
            <ArrowLeft className="rotate-180" />
          </div>
        ) : (
          <div></div>
        )}
      </div>
      <div className="grid grid-cols-2 border-2 p-4 w-full">
        <div className="flex flex-col">
          <p className="font-bold">{t("Orders")}</p>
          <p>{order.prefix + order.number}</p>
        </div>
        <div className="flex flex-col">
          <p className="font-bold">{t("Date")} </p>
          <p> {formatDateAPIToBe(order.date)}</p>
        </div>
        <div className="flex flex-col">
          <p className="font-bold">{t("Total")}</p>
          <p>
            €{" "}
            {order.document_products
              .reduce((total, product) => total + product.subTotal, 0)
              .toFixed(2)
              .replaceAll(".", ",")}
          </p>
        </div>

        <div className="flex flex-col">
          <p className="font-bold">{t("To pay")} </p>
          <p>
            €{" "}
            {(
              order.document_products.reduce(
                (total, product) => total + product.subTotal,
                0
              ) -
              order.payments
                .filter((pay) => pay.verified && !pay.deleted)
                .reduce((accumulator, currentItem) => {
                  return accumulator + currentItem.value;
                }, 0)
            )
              .toFixed(2)
              .replaceAll(".", ",")}
          </p>
        </div>
        <Link
          href={`/account/order?id=${order.id}`}
          className={`${componentThemes.greenSubmitButton} col-span-2 flex flex-col items-center justify-center`}
        >
          {t("View Details")}
        </Link>
      </div>
    </div>
  );
};

export default OrderPreview;
