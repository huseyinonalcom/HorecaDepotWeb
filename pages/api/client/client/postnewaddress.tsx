import { NextApiRequest, NextApiResponse } from "next";
import statusText from "../../../../api/statustexts";
import { getConfig } from "../../config/private/getconfig";

const costPerKM = 1;

async function getShippingCost(originAddress, destinationAddress, apiKey) {
  const url = "https://maps.googleapis.com/maps/api/distancematrix/json";

  const params = new URLSearchParams({
    origins: originAddress,
    destinations: destinationAddress,
    key: apiKey,
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
        return distance * costPerKM;
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

const originAdd = "Rue de Ribaucourt 154, 1080 Bruxelles, Belgique";

export default async function postNewAddress(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    let config;
    try {
      config = await getConfig();
    } catch (e) {
      console.error(e);
    }
    const cookies = req.cookies;
    const authToken = cookies.cj;
    const clientID = req.query.client;
    let addressData = JSON.parse(req.body as string).newAddressExistingClient;
    addressData.client = Number(clientID);
    addressData.name = "Addresse";
    const addressString = `${addressData.street} ${addressData.doorNumber} ${addressData.zipCode} ${addressData.city} ${addressData.country}`;
    let shippingCost = 0;
    try {
      shippingCost = await getShippingCost(
        originAdd,
        addressString,
        config.google.GOOGLE_API_KEY,
      );
    } catch (e) {
      console.error(e);
    }
    addressData = { ...addressData, shippingDistance: shippingCost };
    const fetchUrlAddress = `${process.env.API_URL}/api/addresses?fields=id`;
    const requestAddress = await fetch(fetchUrlAddress, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ data: addressData }),
    });
    if (requestAddress.ok) {
      return res.status(200).json(statusText[200]);
    } else {
      return res.status(400).json(statusText[400]);
    }
  } else {
    return res.status(405).json(statusText[405]);
  }
}
