import StockLayout from "../../components/stock/StockLayout";
import InputOutlined from "../../components/inputs/outlined";
import ProductCard from "../../components/stock/ProductCard";
import Scanner from "../../components/stock/Scanner";
import { useEffect, useState } from "react";
import { BarcodeScanner } from "../../components/stock/Barcode";

export default function ScannerPage({}: {}) {
  const [scanning, setScanning] = useState(false);
  const [scanning2, setScanning2] = useState(false);
  const [scannedCode, setScannedCode] = useState<string | undefined>("");
  const [product, setProduct] = useState<any>();

  const fetchProduct = async (code: string) => {
    const req = await fetch(`/api/private/products/fetchproducts?ean=${code}`);
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
  };

  useEffect(() => {
    fetchProduct(scannedCode);
  }, [scannedCode]);

  return (
    <div className="flex w-full flex-col items-center gap-2 p-2">
      {scanning ? (
        <Scanner
          onSuccess={(res) => {
            setScannedCode(res);
            setScanning(false);
          }}
        />
      ) : (
        <button
          className="min-w-[100px] rounded-md border-2 border-gray-400 bg-black p-2 font-semibold text-white shadow-sm"
          type="button"
          onClick={() => setScanning(true)}
        >
          Scan
        </button>
      )}
      {scanning2 ? (
        <BarcodeScanner onScan={(res) => setScannedCode(res)} />
      ) : (
        <button
          className="min-w-[100px] rounded-md border-2 border-gray-400 bg-black p-2 font-semibold text-white shadow-sm"
          type="button"
          onClick={() => setScanning2(true)}
        >
          Scan2
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
