import StockLayout from "../../components/stock/StockLayout";
import InputOutlined from "../../components/inputs/outlined";
import ProductCard from "../../components/stock/ProductCard";
import Scanner from "../../components/stock/Scanner";
import { useEffect, useState } from "react";

export default function ScannerPage({}: {}) {
  const [scanning, setScanning] = useState(false);
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
          className="min-w-[100px] border-2 bg-black text-white font-semibold p-2 shadow-sm border-gray-400 rounded-md"
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
