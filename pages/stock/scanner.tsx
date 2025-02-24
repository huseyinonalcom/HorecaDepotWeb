import StockLayout from "../../components/stock/StockLayout";
import Scanner from "../../components/stock/Scanner";
import { useEffect, useState } from "react";
import InputOutlined from "../../components/inputs/outlined";
import ProductCard from "../../components/stock/ProductCard";

export default function ScannerPage({}: {}) {
  const [scanning, setScanning] = useState(false);
  const [scannedCode, setScannedCode] = useState<string | undefined>("");
  const [product, setProduct] = useState<any>();

  const fetchProduct = async (code: string) => {
    const req = await fetch(`/api/private/products/fetchproducts?ean=${code}`);
    const res = await req.json();
    console.log({ res });
    if (!req.ok) {
      setProduct(null);
      return;
    }
    if (res.data.length != 1) {
      setProduct(null);
      return;
    }
    console.log(`data`, res.data);
    setProduct(res.data.at(0));
  };

  useEffect(() => {
    fetchProduct(scannedCode);
  }, [scannedCode]);

  return (
    <div>
      {scanning ? (
        <Scanner
          onSuccess={(res) => {
            setScannedCode(res);
            setScanning(false);
          }}
        />
      ) : (
        <button onClick={() => setScanning(true)}>Scan</button>
      )}
      <InputOutlined
        value={scannedCode}
        onChange={(e) => setScannedCode(e.target.value)}
        label={"EAN"}
      />
      {product && <ProductCard product={product} onClickImage={() => {}} />}
    </div>
  );
}

ScannerPage.getLayout = function getLayout(page) {
  return <StockLayout>{page}</StockLayout>;
};
