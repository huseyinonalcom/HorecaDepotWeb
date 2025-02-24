import useTranslation from "next-translate/useTranslation";
import { formatCurrency } from "../../api/utils/formatters/formatcurrency";
import ImageWithURL from "../common/image";
import BarcodeToPng from "../common/barcodepng";
import { LuClipboard } from "react-icons/lu";

export default function ProductCard({
  product,
  onClickImage,
}: {
  product: any;
  onClickImage: (image: any) => void;
}) {
  const { lang } = useTranslation("common");
  return (
    <div
      key={product.id}
      className="flex w-full flex-row items-center rounded-md border-2 border-gray-300 bg-white p-2 shadow-md"
    >
      <div className="w-full">
        <div className="flex h-24 w-full flex-row items-center gap-2">
          {product.images?.map((image) => (
            <button
              key={image.id}
              style={{ height: 96, width: 96 }}
              onClick={() => {
                onClickImage(image);
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
              navigator.clipboard.writeText(product.supplierCode);
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
    </div>
  );
}
