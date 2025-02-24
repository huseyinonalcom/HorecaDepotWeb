import Scanner from "../../components/stock/Scanner";
import { useState } from "react";

export default function ScannerPage({}: {}) {
  const [scanning, setScanning] = useState(false);

  return (
    <div>
      {scanning ? (
        <Scanner onSuccess={(res) => console.log(res)} />
      ) : (
        <button onClick={() => setScanning(true)}>Scan</button>
      )}
    </div>
  );
}
