import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";

export default function Scanner({
  onSuccess,
}: {
  onSuccess: (res: string) => void;
}) {
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
      onSuccess(res);
    }

    function error() {}

    scanner.render(success, error);
  }, []);

  return (
    <div>
      <div id="reader"></div>
    </div>
  );
}
