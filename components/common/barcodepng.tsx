import { useRef, useEffect, useState } from "react";
import { ReactBarcode } from "react-jsbarcode";
import { Canvg } from "canvg";

const BarcodeToPng = ({
  value,
  id,
  onGenerated,
}: {
  value: string;
  id: string;
  onGenerated?: (png: string) => void;
}) => {
  if (!value || value.length !== 13) {
    return <div></div>;
  }

  const barcodeRef = useRef(null);

  useEffect(() => {
    if (barcodeRef.current) {
      const svgElement = barcodeRef.current.querySelector("svg");
      if (!svgElement) return;

      const svgString = svgElement.outerHTML;
      const canvas = document.createElement("canvas");

      canvas.width = svgElement.clientWidth;
      canvas.height = svgElement.clientHeight;

      const ctx = canvas.getContext("2d");
      const v = Canvg.fromString(ctx, svgString);

      v.start();

      const pngUrl = canvas.toDataURL("image/png");

      const imgElement = document.getElementById(
        `barcode-${value}-${id}`,
      ) as HTMLImageElement;
      if (imgElement) {
        imgElement.src = pngUrl;
      }
      if (onGenerated) {
        onGenerated(pngUrl);
      }
    }
  }, [value]);

  const [isValid, setIsValid] = useState(true);
  try {
    if (!isValid) {
      return <div></div>;
    }
    return (
      <>
        <div ref={barcodeRef}>
          <ReactBarcode
            className="hidden"
            value={value}
            options={{
              format: "EAN13",
              height: 45,
              valid: (v) => {
                if (v) {
                  setIsValid(true);
                } else if (!v) {
                  setIsValid(false);
                  console.error("Invalid barcode");
                }
              },
            }}
          />
        </div>
        <img id={`barcode-${value}-${id}`} alt={value ?? "Barcode as PNG"} />
      </>
    );
  } catch (e) {
    setIsValid(false);
    return <div></div>;
  }
};

export default BarcodeToPng;
