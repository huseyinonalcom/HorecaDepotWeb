import { getShippingCostFromAddress } from "../../public/address/getshippingcostfromaddress";
import { NextApiRequest, NextApiResponse } from "next";
import statusText from "../../../../api/statustexts";
import { getConfig } from "../../private/config";

export default async function postNewAddress(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === "PUT") {
    const id = req.query.id;
    let config;
    try {
      config = (await getConfig({ authToken: req.cookies.j })).result;
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
    let shippingCost = 200;
    try {
      shippingCost = await getShippingCostFromAddress({ address: addressData });
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
