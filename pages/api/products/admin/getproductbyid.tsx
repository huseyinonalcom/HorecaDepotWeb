import statusText from "../../../../api/statustexts";

const fetchUrl = `${process.env.API_URL}/api/products/`;
const fetchUrl2 = `?fields[0]=name&fields[1]=supplierCode&fields[2]=internalCode&fields[3]=value&fields[4]=depth&fields[5]=width&fields[6]=height&fields[7]=material&fields[8]=color&fields[9]=priceBeforeDiscount&fields[10]=active&fields[11]=description&fields[12]=imageDirections&fields[13]=localized_description&populate[product_extra][fields][0]=*&populate[categories][fields][0]=localized_name&populate[categories][fields][1]=code&populate[images][fields][0]=name&populate[images][fields][1]=url&populate[shelves][fields][0]=stock&populate[shelves][populate][establishment][fields][0]=id&populate[reservations][fields][0]=client_name&populate[reservations][fields][1]=amount&populate[reservations][fields][2]=is_deleted&populate[supplier][fields][0]=name&populate[product_color][fields][0]=name`;

export async function getProductByID(authToken, id) {
  try {
    if (authToken.startsWith("Bearer ")) {
      authToken = authToken.slice(7);
    }
  } catch {}
  try {
    const response = await fetch(fetchUrl + id + fetchUrl2, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return null;
    }
    return data["data"];
  } catch (error) {
    return null;
  }
}

export default async function handler(req, res) {
  try {
    const response = await getProductByID(req.cookies.j, req.query.id);

    if (!response) {
      return res.status(500).json(statusText[500]);
    }

    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json(statusText[500]);
  }
}
