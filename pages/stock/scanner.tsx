import Scanner from "../../components/stock/Scanner";
import { useState } from "react";

export default function ScannerPage({}: {}) {
  const [scanning, setScanning] = useState(false);
  const [scannedCode, setScannedCode] = useState<string | undefined>("");

  return (
    <div>
      {scanning ? (
        <Scanner onSuccess={(res) => setScannedCode(res)} />
      ) : (
        <button onClick={() => setScanning(true)}>Scan</button>
      )}
      <p>{scannedCode}</p>
    </div>
  );
}
