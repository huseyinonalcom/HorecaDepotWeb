import statusText from "../../../../api/statustexts";
import { NextApiRequest } from "next";

const fetchUrl = `${process.env.API_URL}/api/products?filters[deleted][$eq]=false&fields[0]=name&fields[1]=supplierCode&fields[2]=internalCode&fields[3]=value&fields[4]=depth&fields[5]=width&fields[6]=height&fields[7]=material&fields[8]=color&fields[9]=priceBeforeDiscount&fields[10]=active&fields[11]=imageDirections&fields[12]=localized_name&populate[product_extra][fields][0]=weight&populate[product_extra][fields][1]=per_box&populate[product_extra][fields][2]=packaged_weight&populate[product_extra][fields][3]=packaged_dimensions&populate[product_extra][fields][4]=seat_height&populate[product_extra][fields][5]=diameter&populate[product_extra][fields][6]=surface_area&populate[product_extra][fields][7]=packaged_weight_net&populate[product_extra][fields][8]=barcode&populate[product_extra][fields][9]=armrest_height&populate[categories][fields][0]=localized_name&populate[categories][fields][1]=code&populate[shelves][fields][0]=stock&populate[shelves][populate][establishment][fields][0]=id&populate[reservations][fields][0]=client_name&populate[reservations][fields][1]=amount&populate[reservations][fields][2]=is_deleted&populate[images][fields][0]=url`;

export async function getAllProducts(req: NextApiRequest) {
  try {
    const cookies = req.cookies;
    const authToken = cookies.j;
    const page = "&pagination[page]=" + (req.query.page ?? 1);
    const sort = "&sort=" + req.query.sort;
    const pageSize = "&pagination[pageSize]=" + (req.query.count ?? 30);
    let supplier = "";
    let search = "";
    let category = "";

    if (req.query.search) {
      search = `&filters[$or][0][name][$containsi]=${req.query.search}&filters[$or][1][supplierCode][$containsi]=${req.query.search}&filters[$or][2][internalCode][$containsi]=${req.query.search}`;
    }

    if (req.query.category && req.query.category != "0") {
      category = `&filters[categories][id][$eq]=${req.query.category}`;
    }

    if (req.query.supplier && req.query.supplier != "0") {
      supplier = `&filters[supplier][id][$eq]=${req.query.supplier}`;
    }

    if (!authToken) {
      return null;
    }

    try {
      const request = await fetch(
        fetchUrl + category + page + sort + supplier + search + pageSize,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      );

      const response = await request.json();

      if (!request.ok) {
        return null;
      }

      return response;
    } catch (error) {
      return null;
    }
  } catch (error) {
    return null;
  }
}

export default async function handler(req, res) {
  try {
    const response = await getAllProducts(req);

    if (!response) {
      return res.status(500).json(statusText[500]);
    }

    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json(statusText[500]);
  }
}
