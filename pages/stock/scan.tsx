import { useState } from "react";
import BarcodeScannerComponent from "react-qr-barcode-scanner";

export default function QrReadPage() {
  const [scanning, setScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState<string | undefined>("");

  return (
    <div>
      {scanning ? (
        <BarcodeScannerComponent
          width={500}
          height={500}
          onUpdate={(err, result) => {
            if (result) setScannedResult(result.getText());
          }}
        />
      ) : (
        <button onClick={() => setScanning(true)}>Scan</button>
      )}
      <p>{scannedResult}</p>
    </div>
  );
}
