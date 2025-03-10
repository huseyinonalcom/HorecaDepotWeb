import Link from "next/link";
import Image from "next/image";
import useTranslation from "next-translate/useTranslation"; 
import { useEffect, useState } from "react";
import { formatDateAPIToBe } from "../../api/utils/formatters/formatdateapibe";
import componentThemes from "../componentThemes";
import { FiArrowLeft } from "react-icons/fi";

const OrderPreview = ({ order }) => {
  const { t } = useTranslation("common");

  const [currentImage, setCurrentImage] = useState(0);

  const imageBase =
    "absolute inset-0 flex flex-col items-center justify-center transition-opacity duration-1000";
  const imageVisible = "opacity-100 z-30";
  const imageInvisible = "opacity-0";

  useEffect(() => {
    setCurrentImage(0);
  }, [order]);

  const orderImages = [];

  for (let i = 0; i < order.document_products.length; i++) {
    if (
      order.document_products[i].product &&
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
    <div className="flex w-full flex-col bg-white p-1 shadow-md">
      <div className="relative flex w-full flex-shrink-0 flex-row">
        <div className="relative aspect-square h-[200px]">
          {orderImages.length > 0 ? (
            orderImages.map((img, index) => (
              <Image
                key={index}
                src={`https://hdcdn.hocecomv1.com${img.url.replace("https://hdcdn.hocecomv1.com", "")}`}
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
              src={`/uploads/placeholder_9db455d1f1.webp`}
              width={200}
              height={200}
              alt={""}
              className={`${imageBase}`}
            />
          )}
        </div>
        {orderImages.length > 1 ? (
          <div
            className="absolute left-0 z-40 flex h-full flex-col justify-center bg-slate-100 opacity-40"
            onClick={slidePrevious}
          >
            <FiArrowLeft />
          </div>
        ) : (
          <div></div>
        )}
        {orderImages.length > 1 ? (
          <div
            className="absolute right-0 z-40 flex h-full flex-col justify-center bg-slate-100 opacity-40"
            onClick={slideNext}
          >
            <FiArrowLeft className="rotate-180" />
          </div>
        ) : (
          <div></div>
        )}
      </div>
      <div className="grid w-full grid-cols-1 border-2 p-4 md:grid-cols-2">
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
                0,
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
          className={`${componentThemes.outlinedButton} flex flex-col items-center justify-center md:col-span-2`}
        >
          {t("View Details")}
        </Link>
      </div>
    </div>
  );
};

export default OrderPreview;
