import { useZxing } from "react-zxing";

export const BarcodeScanner = ({
  onScan,
}: {
  onScan: (result: string) => void;
}) => {
  const { ref } = useZxing({
    onDecodeResult(result) {
      onScan(result.getText());
    },
  });

  return (
    <>
      <video ref={ref} />
    </>
  );
};
