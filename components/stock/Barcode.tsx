import { useEffect, useRef } from "react";
import { useZxing } from "react-zxing";

export const BarcodeScanner = ({
  onScan,
}: {
  onScan: (result: string) => void;
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/assets/sounds/beep.mpeg");
  }, []);

  const beep = () => {
    if (audioRef.current) {
      audioRef.current.play().catch((_) => {});
    }
  };

  const { ref } = useZxing({
    onDecodeResult(result) {
      beep();
      onScan(result.getText());
    },
  });

  return <video ref={ref} />;
};
