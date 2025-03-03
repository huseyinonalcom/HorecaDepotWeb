import { getConfig } from "../../config/private/getconfig";
import { NextApiRequest, NextApiResponse } from "next";
import statusText from "../../../../api/statustexts";
import { getShippingCostFromAddress } from "./getshippingcostfromaddress";

export default async function postNewAddress(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "POST") {
    const cookies = req.cookies;
    const authToken = cookies.cj;
    const clientID = req.query.client;
    let addressData = JSON.parse(req.body as string).newAddressExistingClient;
    addressData.client = Number(clientID);
    addressData.name = "Addresse";
    let shippingCost = 0;
    try {
      shippingCost = await getShippingCostFromAddress({
        address: addressData,
      });
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
