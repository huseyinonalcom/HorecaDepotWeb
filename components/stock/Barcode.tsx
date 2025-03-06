import { useEffect } from "react";
import { useZxing } from "react-zxing";

export const BarcodeScanner = ({
  onScan,
}: {
  onScan: (result: string) => void;
}) => {
  let audio;

  const beep = () => {
    try {
      audio.play().catch((e) => console.error("Playback failed:", e));
    } catch (_) {}
  };

  useEffect(() => {
    audio = new Audio("/assets/sounds/beep.mpeg");
  }, []);

  const { ref } = useZxing({
    onDecodeResult(result) {
      beep();
      onScan(result.getText());
    },
  });

  return (
    <>
      <video ref={ref} />
    </>
  );
};
