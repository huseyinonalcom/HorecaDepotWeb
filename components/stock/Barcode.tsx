import { useEffect, useRef } from "react";
import { useZxing } from "react-zxing";

export const BarcodeScanner = ({
  onScan,
}: {
  onScan: (result: string) => void;
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/assets/sounds/beep.mp3");
  }, []);

  const beep = async () => {
    if (audioRef.current) {
      await audioRef.current.play().catch((_) => {});
    }
  };

  const { ref } = useZxing({
    onDecodeResult(result) {
      beep().then(() => {
        onScan(result.getText());
      });
    },
  });

  return <video ref={ref} />;
};
