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
  if (req.method === "PUT") {
    const id = req.query.id;
    let config;
    try {
      config = await getConfig();
    } catch (e) {
      console.error(e);
    }
    // fetch the address
    let addressData;
    try {
      const addressReq = await fetch(
        `${process.env.API_URL}/api/addresses/${id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${process.env.API_KEY}`,
          },
        },
      );
      addressData = (await addressReq.json()).data;
    } catch (e) {
      console.error(e);
    }
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
    const fetchUrlAddress = `${process.env.API_URL}/api/addresses/${id}?fields=id`;
    let requestAddress;
    try {
      requestAddress = await fetch(fetchUrlAddress, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${process.env.API_KEY}`,
        },
        body: JSON.stringify({
          data: {
            shippingDistance: shippingCost,
          },
        }),
      });
      const answer = await requestAddress.json();
    } catch (e) {
      console.error(e);
    }
    if (requestAddress.ok) {
      return res.status(200).json(statusText[200]);
    } else {
      return res.status(400).json(statusText[400]);
    }
  } else {
    return res.status(405).json(statusText[405]);
  }
}
