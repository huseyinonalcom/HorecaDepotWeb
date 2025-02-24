import { useState } from "react";
import { BarcodeScanner } from "react-barcode-scanner";

export default function QrReadPage() {
  const [scanning, setScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState<string | undefined>("");

  return (
    <div>
      {scanning ? (
        <BarcodeScanner
          onCapture={(result) => {
            setScannedResult(result.at(0).rawValue);
            setScanning(false);
          }}
          trackConstraints={{
            facingMode: "environment",
            frameRate: 24,
            aspectRatio: 1,
          }}
        />
      ) : (
        <button onClick={() => setScanning(true)}>Scan</button>
      )}
      <p>{scannedResult}</p>
    </div>
  );
}
