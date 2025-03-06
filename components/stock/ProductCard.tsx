import useTranslation from "next-translate/useTranslation";
import Lightbox from "yet-another-react-lightbox-lite";
import { PDFDownloadLink } from "@react-pdf/renderer";
import componentThemes from "../componentThemes";
import BarcodeToPng from "../common/barcodepng";
import { LuClipboard } from "react-icons/lu";
import ImageWithURL from "../common/image";
import { useState } from "react";
import PDFBarcode from "../pdf/barcodepdf";
import { formatCurrency } from "../../api/utils/formatters/formatcurrency";

export default function ProductCard({ product }: { product: any }) {
  const { t, lang } = useTranslation("common");
  const [lightBoxIndex, setLightBoxIndex] = useState(undefined);
  const [barcodePng, setBarcodePng] = useState("");
  return (
    <div
      key={product.id}
      className="flex w-full flex-col items-start rounded-md border-2 border-gray-300 bg-white p-2 shadow-md lg:flex-row lg:items-center"
    >
      <div className="flex max-w-full flex-1 flex-col overflow-hidden">
        <div
          id="images"
          className="h-34 no-scrollbar flex w-full flex-row flex-nowrap items-center gap-2 overflow-x-auto"
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
        <h2 className="font-bold">{product.name}</h2>
        <div className="flex flex-row items-end gap-2">
          <h3 className="font-semibold text-lg">{formatCurrency(product.value)}</h3>
          <p className="text-xs pb-1">{t("vat-incl")}</p>
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
          <b>{t("reserved")}:</b>{" "}
          {product.reservations.reduce((acc, res) => acc + res.amount, 0)}
        </p>
      </div>
      <div className="flex w-full flex-shrink-0 flex-col items-start lg:w-[234px] lg:items-end">
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
          <p className="">{"EAN : "}</p>
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
          className={`${componentThemes.greenSubmitButton} flex flex-row items-center justify-center whitespace-nowrap text-xl`}
        >
          📄 <p className="ml-1">{t("Download PDF")}</p>
        </PDFDownloadLink>
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
    </div>
  );
}
