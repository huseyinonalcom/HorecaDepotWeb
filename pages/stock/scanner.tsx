import StockLayout from "../../components/stock/StockLayout";
import Scanner from "../../components/stock/Scanner";
import { useState } from "react";

export default function ScannerPage({}: {}) {
  const [scanning, setScanning] = useState(false);
  const [scannedCode, setScannedCode] = useState<string | undefined>("");

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
      <p>{scannedCode}</p>
    </div>
  );
}

ScannerPage.getLayout = function getLayout(page) {
  return <StockLayout>{page}</StockLayout>;
};
