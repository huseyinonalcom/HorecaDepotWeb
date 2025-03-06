import { useZxing } from "react-zxing";

export const BarcodeScanner = ({
  onScan,
}: {
  onScan: (result: string) => void;
}) => {
  const audio = new Audio("/assets/sounds/beep.mpeg");

  const beep = () => {
    try {
      audio.play().catch((e) => console.error("Playback failed:", e));
    } catch (_) {}
  };

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
