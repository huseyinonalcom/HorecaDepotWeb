import { PDFCatalogue } from "../../../../components/pdf/pdfcatalogue";
import { renderToStream } from "@react-pdf/renderer";
import statusText from "../../../../api/statustexts";
import { getProducts } from "./products";

export async function generateStockList({ authToken }: { authToken: string }) {
  try {
    const products = (await getProducts({ count: "10000", authToken })).data;
    return await renderToStream(
      PDFCatalogue({
        products: products,
      }),
    );
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json(statusText[405]);
  }
  try {
    const stream = await generateStockList({ authToken: req.cookies.j });

    if (!stream) {
      return res.status(500).json(statusText[500]);
    }

    res.setHeader("Content-Type", "application/pdf");
    stream.pipe(res);
  } catch (e) {
    console.error(e);
    return res.status(500).json(statusText[500]);
  }
}
