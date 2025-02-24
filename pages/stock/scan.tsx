import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect, useState } from "react";

export default function QrReadPage() {
  const [scanning, setScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState<string | undefined>("");

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        qrbox: {
          height: 256,
          width: 256,
        },
        fps: 10,
      },
      false,
    );

    function success(res) {
      scanner.clear();
      setScannedResult(res);
      setScanning(false);
    }

    function error() {}

    scanner.render(success, error);
  }, []);

  return (
    <div>
      {scanning ? (
        <div id="reader"></div>
      ) : (
        <button onClick={() => setScanning(true)}>Scan</button>
      )}
      <p>{scannedResult}</p>
    </div>
  );
}
