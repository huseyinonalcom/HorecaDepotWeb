import statusText from "../../../../api/statustexts";

const fetchUrl = `${process.env.API_URL}/api/products/`;
const fetchUrl2 = `?fields[0]=name&fields[1]=supplierCode&fields[2]=internalCode&fields[3]=value&fields[4]=depth&fields[5]=width&fields[6]=height&fields[7]=material&fields[8]=color&fields[9]=priceBeforeDiscount&fields[10]=active&fields[11]=description&populate[product_extra][fields][0]=*&populate[category][fields][1]=name&populate[images][fields][0]=name&populate[images][fields][1]=url&populate[shelves][fields][0]=stock&populate[shelves][populate][establishment][fields][0]=id&populate[reservations][fields][0]=client_name&populate[reservations][fields][1]=amount&populate[reservations][fields][2]=is_deleted`;

export default async function getProductByID(req, res) {
  const cookies = req.cookies;
  const authToken = cookies.j;
  try {
    const response = await fetch(fetchUrl + req.query.id + fetchUrl2, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      res.status(400).json(statusText[400]);
    }

    const data = await response.json();
    res.status(200).json(data["data"]);
  } catch (error) {
    res.status(500).json(statusText[500]);
  }
}
