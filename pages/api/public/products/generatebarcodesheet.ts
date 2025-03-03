import PDFBarcode from "../../../../components/pdf/barcodepdf";
import { renderToStream } from "@react-pdf/renderer";
import statusText from "../../../../api/statustexts";

export async function generateBarcodeSheet({
  barcode,
  png,
}: {
  barcode: string;
  png: string;
}) {
  try {
    const answer = await renderToStream(
      PDFBarcode({ value: barcode, png: png }),
    );

    return answer;
  } catch (error) {
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json(statusText[405]);
  }
  try {
    const { barcode, png } = req.query;

    const response = await generateBarcodeSheet({ barcode, png });

    if (!response) {
      return res.status(500).json(statusText[500]);
    }

    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json(statusText[500]);
  }
}
