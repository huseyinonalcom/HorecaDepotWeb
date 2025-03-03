import { NextApiRequest, NextApiResponse } from "next";
import statusText from "../../../../api/statustexts";

const fetchUrl = `${process.env.API_URL}/api/products`;

const fetchParams =
  "fields[0]=name&fields[1]=supplierCode&fields[2]=internalCode&fields[3]=value&fields[4]=depth&fields[5]=width&fields[6]=height&fields[7]=material&fields[8]=color&fields[9]=priceBeforeDiscount&fields[10]=active&fields[11]=imageDirections&populate[product_extra][fields][0]=weight&populate[product_extra][fields][1]=per_box&populate[product_extra][fields][2]=packaged_weight&populate[product_extra][fields][3]=packaged_dimensions&populate[product_extra][fields][4]=seat_height&populate[product_extra][fields][5]=diameter&populate[product_extra][fields][6]=surface_area&populate[product_extra][fields][7]=packaged_weight_net&populate[product_extra][fields][8]=barcode&populate[product_extra][fields][9]=armrest_height&populate[categories][fields][0]=localized_name&populate[categories][fields][1]=code&populate[shelves][fields][0]=stock&populate[shelves][populate][establishment][fields][0]=id&populate[reservations][fields][0]=client_name&populate[reservations][fields][1]=amount&populate[reservations][fields][2]=is_deleted&populate[images][fields][0]=url&populate[product_color][fields][0]=name";

export const getProducts = async ({
  authToken,
  page,
  search,
  category,
  ean,
  id,
}: {
  authToken: string;
  page?: number;
  search?: string;
  category?: string;
  ean?: string;
  id?: number;
}) => {
  try {
    if (!authToken) {
      return null;
    }

    if (id) {
      const request = await fetch(fetchUrl + "/" + id + "?" + fetchParams, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const response = await request.json();
      if (!request.ok) {
        return null;
      }
      return response;
    }

    if (ean) {
      const request = await fetch(
        fetchUrl + "?" + fetchParams + "&filters[supplierCode][$eq]=" + ean,
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
    }

    const pageString = "&pagination[page]=" + (page ?? 1);
    const sort = "&sort=name";
    const pageSize = "&pagination[pageSize]=20";
    let searchString = "";
    let categoryString = "";

    if (search) {
      searchString = `&filters[$or][0][name][$containsi]=${search}&filters[$or][1][supplierCode][$containsi]=${search}&filters[$or][2][internalCode][$containsi]=${search}`;
    }

    if (category && category != "0" && category != "null") {
      categoryString = `&filters[categories][id][$eq]=${category}`;
    }

    try {
      const request = await fetch(
        fetchUrl +
          "?filters[deleted][$eq]=false&" +
          fetchParams +
          categoryString +
          pageString +
          sort +
          searchString +
          pageSize,
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
      console.error(error);
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  try {
    const response = await getProducts({
      authToken: req.cookies.j,
      ean: req.query.ean as string,
      id: Number(req.query.id as string),
      page: Number(req.query.page as string),
      category: req.query.category as string,
      search: req.query.search as string,
    });

    if (!response) {
      return res.status(500).json(statusText[500]);
    }

    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json(statusText[500]);
  }
}
