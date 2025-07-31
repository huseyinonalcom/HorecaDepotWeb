"use client";

import { formatCurrency } from "../../api/utils/formatters/formatcurrency";
import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import useTranslation from "next-translate/useTranslation";
import Lightbox from "yet-another-react-lightbox-lite";
import { PDFDownloadLink } from "@react-pdf/renderer";
import componentThemes from "../componentThemes";
import BarcodeToPng from "../common/barcodepng";
import { LuClipboard } from "react-icons/lu";
import ImageWithURL from "../common/image";
import PDFBarcode from "../pdf/barcodepdf";
import { StockCart } from "./Cart";
import { useState } from "react";

export default function ProductCard({ product }: { product: any }) {
  const { t, lang } = useTranslation("common");
  const [barcodePng, setBarcodePng] = useState(null);
  const [lightBoxIndex, setLightBoxIndex] = useState(undefined);

  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("stock-cart") ?? "[]");
    const existingItem = cart.find((p) => p.id === product.id);
    if (existingItem) {
      const index = cart.indexOf(existingItem);
      cart[index].amount = existingItem.amount + 1;
    } else {
      cart.push({ ...product, amount: 1 });
    }
    localStorage.setItem("stock-cart", JSON.stringify(cart));
    setShowCart(true);
  };

  const [showCart, setShowCart] = useState(false);

  return (
    <div
      key={product.id}
      className="flex w-full flex-col items-start rounded-md border-2 border-gray-300 bg-white p-2 shadow-md lg:flex-row lg:items-center"
    >
      <div className="flex max-w-full flex-1 flex-col overflow-hidden">
        <div
          id="images"
          className="no-scrollbar flex h-34 w-full flex-row flex-nowrap items-center gap-2 overflow-x-auto"
        >
          {product.images?.map((image) => (
            <button
              className="h-full w-full flex-shrink-0 flex-grow-0"
              key={image.id}
              style={{ height: 128, width: 128 }}
              onClick={() => {
                setLightBoxIndex(0);
              }}
            >
              <ImageWithURL
                height={128}
                width={128}
                src={image.url}
                alt={product.name}
                style={{ objectFit: "contain", height: 128, width: 128 }}
              />
            </button>
          ))}
        </div>
        <h2 className="font-bold">
          {product.localized_name ? product.localized_name[lang] : product.name}
        </h2>

        <div className="flex flex-row items-end gap-2">
          <h3 className="text-lg font-semibold">
            {formatCurrency(product.value)}
          </h3>
          <p className="pb-1 text-xs">{t("vat-incl")}</p>
        </div>

        <p>
          <b>{t("Category")}:</b>{" "}
          {product.categories.map((cat) => cat.localized_name[lang]).join(", ")}
        </p>
        <p>{product.product_extra.EAN ?? product.product_extra.supplierCode}</p>
        <p>
          <b>{t("Dimensions")} (cm):</b> {product.height} x {product.width} x{" "}
          {product.depth}
        </p>
        <p>
          <b>{t("Packaged Dimensions")}:</b>{" "}
          {product.product_extra.packaged_dimensions}
        </p>
        <p>
          <b>{t("Color")}:</b> {product.product_color?.name ?? ""}
        </p>
        <p>
          <b>{t("Material")}:</b> {product.material}
        </p>
        {/*  <p>
          <b>{t("product-pdf")}:</b> Voir le PDF
        </p> */}
        <p>
          <b>{t("Stock")}:</b>{" "}
          {product.shelves.reduce((acc, shelf) => acc + shelf.stock, 0)}
        </p>
        <p>
          <b>{t("reserved")}:</b> {product.reserved ?? 0}
        </p>
      </div>
      <div className="flex w-full flex-shrink-0 flex-col items-start lg:w-[314px] lg:items-end">
        <BarcodeToPng
          value={product.supplierCode}
          onGenerated={setBarcodePng}
        />
        <div className="flex flex-row-reverse items-center gap-2">
          <button
            className="peer"
            onClick={() => {
              try {
                navigator.clipboard.writeText(product.supplierCode);
              } catch (_) {}
            }}
          >
            <LuClipboard />
          </button>
          <p className="peer-hover:bg-blue-200 peer-focus:bg-blue-400">
            {product.supplierCode}
          </p>
          <p>{"EAN : "}</p>
        </div>
        <PDFDownloadLink
          fileName={`${product.supplierCode}.pdf`}
          document={
            <PDFBarcode
              value={
                product.categories.at(0).localized_name[lang] +
                " - " +
                product.name
              }
              png={barcodePng}
            />
          }
          className={`${componentThemes.outlinedButton} flex flex-row items-center justify-center gap-1 text-xl whitespace-nowrap`}
        >
          📄 <p>EAN PDF</p>
        </PDFDownloadLink>
        <button
          type="button"
          onClick={() => addToCart()}
          className={`${componentThemes.outlinedButton} flex flex-row items-center justify-center gap-1 text-xl whitespace-nowrap`}
        >
          <ShoppingCartIcon height={24} />
          {t("Add to cart")}
        </button>
      </div>
      {lightBoxIndex != undefined && (
        <Lightbox
          slides={product.images.map((file) => ({ src: file.url }))}
          index={lightBoxIndex}
          setIndex={(v) => setLightBoxIndex(v)}
          render={{
            slide: ({ slide }) => {
              return (
                <ImageWithURL
                  key={slide.src}
                  src={slide.src}
                  alt={slide.alt || ""}
                  sizes="100vw"
                  loading="eager"
                  width={2000}
                  height={2000}
                  draggable={false}
                  style={{
                    minWidth: 0,
                    minHeight: 0,
                    maxWidth: "100%",
                    maxHeight: "100%",
                    objectFit: "contain",
                  }}
                />
              );
            },
          }}
        />
      )}
      <StockCart showCart={showCart} onClose={() => setShowCart(false)} />
    </div>
  );
}
