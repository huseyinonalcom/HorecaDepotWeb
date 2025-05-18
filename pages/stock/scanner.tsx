import { BarcodeScanner } from "../../components/stock/Barcode";
import StockLayout from "../../components/stock/StockLayout";
import InputOutlined from "../../components/inputs/outlined";
import ProductCard from "../../components/stock/ProductCard";
import { useEffect, useState } from "react";

export default function ScannerPage({}: {}) {
  const [scanning, setScanning] = useState(true);
  const [scannedCode, setScannedCode] = useState<string | undefined>("");
  const [product, setProduct] = useState<any>();

  const fetchProduct = async (code: string) => {
    const req = await fetch(`/api/private/products/products?ean=${code}`);
    const res = await req.json();
    if (!req.ok) {
      setProduct(null);
      return;
    }
    if (res.data.length != 1) {
      setProduct(null);
      return;
    }
    setProduct(res.data.at(0));
    setScanning(false);
  };

  useEffect(() => {
    fetchProduct(scannedCode);
  }, [scannedCode]);

  return (
    <div className="flex w-full flex-col items-center gap-2 p-2">
      {scanning ? (
        <BarcodeScanner onScan={(res) => setScannedCode(res)} />
      ) : (
        <button
          className="min-w-[100px] rounded-md border-2 border-gray-400 bg-black p-2 font-semibold text-white shadow-sm"
          type="button"
          onClick={() => setScanning(true)}
        >
          Scan
        </button>
      )}
      <InputOutlined
        value={scannedCode}
        onChange={(e) => setScannedCode(e.target.value)}
        label={"EAN"}
      />
      {product && <ProductCard product={product} />}
    </div>
  );
}

ScannerPage.getLayout = function getLayout(page) {
  return <StockLayout>{page}</StockLayout>;
};
