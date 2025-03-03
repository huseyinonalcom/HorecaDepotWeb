import { Address } from "../../../../api/interfaces/address";
import { countries } from "../../../../api/utils/countries";
import statusText from "../../../../api/statustexts";
import getConfig from "next/config";

async function getShippingDistance(destinationAddress) {
  let config;
  try {
    config = await getConfig();
  } catch (e) {
    console.error(e);
  }

  const url = "https://maps.googleapis.com/maps/api/distancematrix/json";

  const params = new URLSearchParams({
    origins: "Rue de Ribaucourt 154, 1080 Bruxelles, Belgique",
    destinations: destinationAddress,
    key: config.google.GOOGLE_API_KEY,
  });

  try {
    const response = await fetch(`${url}?${params}`);
    const data = await response.json();

    if (data.status === "OK") {
      try {
        const distanceString = data.rows[0].elements[0].distance.text;
        const distance = parseFloat(
          distanceString.replace(" km", "").replace(",", "."),
        );
        return distance;
      } catch (e) {
        return 0;
      }
    } else {
      return 0;
    }
  } catch (error) {
    return 0;
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
    config = await getConfig();
  } catch (e) {
    console.error(e);
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
      const distance = await getShippingDistance(address);
      return distance * config.costPerKM;
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
