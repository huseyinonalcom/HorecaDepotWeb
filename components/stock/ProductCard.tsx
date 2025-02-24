import { formatCurrency } from "../../api/utils/formatters/formatcurrency";
import useTranslation from "next-translate/useTranslation";
import Lightbox from "yet-another-react-lightbox-lite";
import BarcodeToPng from "../common/barcodepng";
import { LuClipboard } from "react-icons/lu";
import ImageWithURL from "../common/image";
import { useState } from "react";

export default function ProductCard({ product }: { product: any }) {
  const { lang } = useTranslation("common");
  const [lightBoxIndex, setLightBoxIndex] = useState(undefined);
  return (
    <div
      key={product.id}
      className="flex w-full flex-col items-center rounded-md border-2 border-gray-300 bg-white p-2 shadow-md md:flex-row"
    >
      <div className="w-full">
        <div className="flex h-24 w-full flex-row items-center gap-2 overflow-x-auto">
          {product.images?.map((image) => (
            <button
              key={image.id}
              style={{ height: 96, width: 96 }}
              onClick={() => {
                setLightBoxIndex(0);
              }}
            >
              <ImageWithURL
                height={96}
                width={96}
                src={image.url}
                alt={product.name}
                style={{ objectFit: "contain", height: 96, width: 96 }}
              />
            </button>
          ))}
        </div>
        <h2>{product.name}</h2>
        <p>
          Catégorie:{" "}
          {product.categories.map((cat) => cat.localized_name[lang]).join(", ")}
        </p>
        <p>{formatCurrency(product.value)}</p>
        <p>{product.product_extra.EAN ?? product.product_extra.supplierCode}</p>
        <p>
          Dimensions (cm): {product.height} x {product.width} x {product.depth}
        </p>
        <p>
          Dimensions de la boîte: {product.product_extra.packaged_dimensions}
        </p>
        <p>Couleur: {product.product_color?.name ?? ""}</p>
        <p>Matériau: {product.material}</p>
        <p>Lien vers le PDF du produit: Voir le PDF</p>
        <p>
          Total Stock:{" "}
          {product.shelves.reduce((acc, shelf) => acc + shelf.stock, 0)}
        </p>
        <p>
          Réservé:{" "}
          {product.reservations.reduce((acc, res) => acc + res.amount, 0)}
        </p>
      </div>
      <div className="flex flex-col items-end">
        <BarcodeToPng value={product.supplierCode} />
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
