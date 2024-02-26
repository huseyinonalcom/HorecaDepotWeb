import { NextApiRequest, NextApiResponse } from "next";

import statusText from "../../../../api/statustexts";

export default async function postClient(
  req: NextApiRequest,
  res: NextApiResponse
) {
  function splitObject(obj) {
    // Clone the original object to avoid modifying it
    let clone = JSON.parse(JSON.stringify(obj));

    // Remove addresses from the clone
    let addresses = clone.client_info.addresses;
    delete clone.client_info.addresses;

    // The first object (without addresses)
    let objectWithoutAddresses = clone;

    // The second object (only the first address, assuming there is at least one address)
    let firstAddressObject = addresses.length > 0 ? addresses[0] : {};

    return [objectWithoutAddresses, firstAddressObject];
  }

  if (req.method === "POST") {
    const userData = JSON.parse(req.body as string)["clientToSend"];
    userData.role = 14;

    let [clientData, addressData] = splitObject(userData);
    clientData = clientData.client_info;

    clientData.establishment = 1;
    if (userData) {
      try {
        const fetchUrlClient = `${process.env.API_URL}/api/clients?fields=id`;
        const requestClient = await fetch(fetchUrlClient, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${process.env.API_KEY}`,
          },
          body: JSON.stringify({ data: clientData }),
        });
        if (requestClient.ok) {
          const answer = await requestClient.json();
          const clientID = answer["data"]["id"];
          addressData.client = clientID;

          const fetchUrlAddress = `${process.env.API_URL}/api/addresses?fields=id`;
          const requestAddress = await fetch(fetchUrlAddress, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Bearer ${process.env.API_KEY}`,
            },
            body: JSON.stringify({ data: addressData }),
          });
          if (requestAddress.ok) {
            // set client_info to clientID !AFTER! posting address because clientData and addressData are references to parts in the userData object, ergo changes in one, affect all
            userData.client_info = clientID;

            const fetchUrlUser = `${process.env.API_URL}/api/users?fields=id`;
            const requestUser = await fetch(fetchUrlUser, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `Bearer ${process.env.API_KEY}`,
              },
              body: JSON.stringify(userData),
            });
            if (requestUser.ok) {
              const userID = await requestUser.json()["id"];
              return res.status(200).json({ id: userID });
            } else {
              return res.status(500).json(statusText[500]);
            }
          } else {
            return res.status(500).json(statusText[500]);
          }
        } else {
          return res.status(500).json(statusText[500]);
        }
      } catch {
        return res.status(500).json(statusText[500]);
      }
    } else {
      return res.status(400).json(statusText[400]);
    }
  } else {
    return res.status(405).json(statusText[405]);
  }
}
