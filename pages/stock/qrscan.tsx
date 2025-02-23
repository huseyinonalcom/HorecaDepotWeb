import { useEffect, useRef, useState } from "react";

import QrScanner from "qr-scanner";

const QrReader = ({ onSuccess, onFail }: { onSuccess: any; onFail: any }) => {
  const scanner = useRef<QrScanner>();
  const videoEl = useRef<HTMLVideoElement>(null);
  const qrBoxEl = useRef<HTMLDivElement>(null);
  const [qrOn, setQrOn] = useState<boolean>(true);

  const onScanSuccess = (result: QrScanner.ScanResult) => {
    console.log(result);
    onSuccess(result?.data);
  };

  const onScanFail = (err: string | Error) => {
    console.log(err);
    onFail();
  };

  useEffect(() => {
    if (videoEl?.current && !scanner.current) {
      scanner.current = new QrScanner(videoEl?.current, onScanSuccess, {
        onDecodeError: onScanFail,
        preferredCamera: "environment",
        highlightScanRegion: true,
        highlightCodeOutline: true,
        overlay: qrBoxEl?.current || undefined,
      });

      scanner?.current
        ?.start()
        .then(() => setQrOn(true))
        .catch((err) => {
          if (err) setQrOn(false);
        });
    }

    return () => {
      if (!videoEl?.current) {
        scanner?.current?.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (!qrOn)
      alert(
        "Camera is blocked or not accessible. Please allow camera in your browser permissions and Reload.",
      );
    onFail();
  }, [qrOn]);

  return (
    <div className="qr-reader">
      <video ref={videoEl}></video>
      <div ref={qrBoxEl} className="qr-box"></div>
    </div>
  );
};

export default function QrReadPage() {
  const [scanning, setScanning] = useState(false);
  const [scannedResult, setScannedResult] = useState<string | undefined>("");

  const activateScanning = () => {
    navigator.permissions
      .query({ name: 'camera' })
      .then((permissionObj) => {
        console.log(permissionObj.state);
      })
      .catch((error) => {
        console.log("Got error :", error);
      });
  };

  return (
    <div>
      {scanning ? (
        <QrReader
          onSuccess={(qr) => {
            setScannedResult(qr);
            setScanning(false);
          }}
          onFail={() => setScanning(false)}
        />
      ) : (
        <button onClick={() => activateScanning()}>Scan</button>
      )}
    </div>
  );
}
