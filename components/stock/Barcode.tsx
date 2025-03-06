import { useZxing } from "react-zxing";

export const BarcodeScanner = ({
  onScan,
}: {
  onScan: (result: string) => void;
}) => {
  const { ref } = useZxing({
    onDecodeResult(result) {
      try {
        const audio = new Audio("/assets/sounds/beep.mpeg");
        audio.play().catch((e) => console.error("Playback failed:", e));
      } catch (_) {}
      onScan(result.getText());
    },
  });

  return (
    <>
      <video ref={ref} />
    </>
  );
};
