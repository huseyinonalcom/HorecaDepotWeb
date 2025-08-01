import { Address } from "../../../../api/interfaces/address";
import { countries } from "../../../../api/utils/countries";
import statusText from "../../../../api/statustexts";
import { getConfig } from "../../private/config";

export async function getShippingDistance({ address }: { address: Address }) {
  let config;
  try {
    config = (await getConfig({ authToken: process.env.API_KEY })).result;
  } catch (e) {
    console.error(e);
  }

  const url = "https://maps.googleapis.com/maps/api/distancematrix/json";

  const params = new URLSearchParams({
    origins: "Rue de Ribaucourt 154, 1080 Bruxelles, Belgique",
    destinations: `${address.street} ${address.doorNumber} ${address.zipCode} ${address.city} ${address.country}`,
    key: config.google.GOOGLE_API_KEY,
  });

  try {
    const response = await fetch(`${url}?${params}`);
    const data = await response.json();

    if (data.status === "OK") {
      try {
        const distanceString = data.rows[0].elements[0].distance.text;
        const distance = parseFloat(
          distanceString.replace(" km", "").replace(",", ""),
        );
        return distance;
      } catch (e) {
        console.error(e);
        return 500;
      }
    } else {
      return 500;
    }
  } catch (error) {
    console.error(error);
    return 500;
  }
}

export async function getShippingCostFromAddress({
  address,
  documentTotal,
}: {
  address: Address;
  documentTotal?: number;
}) {
  let config;
  try {
    config = (await getConfig({ authToken: process.env.API_KEY })).result;
  } catch (e) {
    console.error(e);
  }

  if ((address.doorNumber = "999aaa999")) {
    return 0;
  }

  try {
    if (
      countries
        .find((country) => country.name == "Belgium")
        .names.includes(address.country)
    ) {
      if (documentTotal && documentTotal > 800) {
        return 0;
      } else {
        return 25;
      }
    } else {
      const distance = await getShippingDistance({ address });
      return distance * config.costPerKM;
    }
  } catch (error) {
    console.error(error);
    return 500;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json(statusText[405]);
  }
  try {
    const json = JSON.parse(req.body as string);
    const { address, documentTotal } = json;
    const response = await getShippingCostFromAddress({
      address,
      documentTotal,
    });

    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json(statusText[500]);
  }
}
