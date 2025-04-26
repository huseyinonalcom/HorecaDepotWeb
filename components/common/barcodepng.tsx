import { ReactBarcode, Renderer } from "react-jsbarcode";
import { useRef, useEffect, useState } from "react";

const BarcodeToPng = ({
  value,
  onGenerated,
}: {
  value: string;
  onGenerated?: (png: string) => void;
}) => {
  const barcodeRef = useRef<HTMLDivElement>(null);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (!barcodeRef.current) return;

    const checkImgSrc = () => {
      const img = barcodeRef.current?.querySelector(
        "img",
      ) as HTMLImageElement | null;
      if (img && img.src && img.src.startsWith("data:image")) {
        if (onGenerated) {
          onGenerated(img.src);
        }
        return true;
      }
      return false;
    };

    if (checkImgSrc()) return;

    const interval = setInterval(() => {
      if (checkImgSrc()) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [value]);

  try {
    if (!isValid) {
      return <div></div>;
    }
    return (
      <div ref={barcodeRef}>
        <ReactBarcode
          className="max-w-[314px]"
          value={value}
          renderer={Renderer.IMAGE}
          options={{
            format: "EAN13",
            height: 45,
            valid: (v) => {
              setIsValid(v);
            },
          }}
        />
      </div>
    );
  } catch (e) {
    setIsValid(false);
    return <div></div>;
  }
};

export default BarcodeToPng;
