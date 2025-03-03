import { Address } from "../../../../api/interfaces/address";
import { countries } from "../../../../api/utils/countries";
import statusText from "../../../../api/statustexts";

export async function getShippingCostFromAddress({
  address,
  documentTotal,
}: {
  address: Address;
  documentTotal: number;
}) {
  try {
    if (
      countries
        .find((country) => country.name == "Belgium")
        .names.includes(address.country)
    ) {
      if (documentTotal > 800) {
        return 0;
      } else {
        return 25;
      }
    }





  } catch (error) {
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json(statusText[405]);
  }
  try {
    const { address, documentTotal } = req.body;
    const response = await getShippingCostFromAddress({
      address,
      documentTotal,
    });

    if (!response) {
      return res.status(500).json(statusText[500]);
    }

    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json(statusText[500]);
  }
}
