import { apiUrl } from "../../../../api/api/constants";
import apiRoute from "../../../../api/api/apiRoute";

const fetchUrl = `${apiUrl}/api/products`;

const fetchParams =
  "fields[0]=name&fields[1]=supplierCode&fields[2]=internalCode&fields[3]=value&fields[4]=depth&fields[5]=width&fields[6]=height&fields[7]=material&fields[8]=color&fields[9]=priceBeforeDiscount&fields[10]=active&fields[11]=imageDirections&fields[12]=localized_name&fields[13]=tax&fields[14]=reserved&populate[product_extra][fields][0]=weight&populate[product_extra][fields][1]=per_box&populate[product_extra][fields][2]=packaged_weight&populate[product_extra][fields][3]=packaged_dimensions&populate[product_extra][fields][4]=seat_height&populate[product_extra][fields][5]=diameter&populate[product_extra][fields][6]=surface_area&populate[product_extra][fields][7]=packaged_weight_net&populate[product_extra][fields][8]=barcode&populate[product_extra][fields][9]=armrest_height&populate[categories][fields][0]=localized_name&populate[categories][fields][1]=code&populate[shelves][fields][0]=stock&populate[shelves][populate][establishment][fields][0]=id&populate[images][fields][0]=url&populate[product_color][fields][0]=name";

export const getProducts = async ({
  authToken,
  category,
  search,
  count,
  page,
  ean,
  id,
}: {
  category?: string;
  authToken: string;
  search?: string;
  count?: string;
  page?: number;
  ean?: string;
  id?: number;
}) => {
  try {
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
    const pageSize = `&pagination[pageSize]=${count ?? "15"}`;
    let searchString = "";
    let categoryString = "";

    if (search) {
      searchString = `&filters[$or][0][name][$containsi]=${search}&filters[$or][1][supplierCode][$containsi]=${search}&filters[$or][2][internalCode][$containsi]=${search}`;
    }

    if (category && category != "0" && category != "null") {
      categoryString = `&filters[categories][id][$eq]=${category}`;
    }

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
      throw "Failed to fetch products";
    }

    return response;
  } catch (error) {
    console.error(error);
    throw "Failed to fetch products";
  }
};

export async function deleteProduct({
  id,
  authToken,
}: {
  id: number;
  authToken: string;
}) {
  let body = {
    data: {
      deleted: true,
    },
  };
  const response = await fetch(`${fetchUrl}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify(body),
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error("Failed to delete product");
  } else {
    return { result: true };
  }
}

export async function updateProduct({
  id,
  authToken,
  data,
}: {
  id: number;
  authToken: string;
  data: any;
}) {
  if (!id) {
    throw "No id provided.";
  }
  const response = await fetch(`${fetchUrl}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${authToken}`,
    },
    body: JSON.stringify({ data: data }),
    redirect: "follow",
  });

  if (!response.ok) {
    const ans = await response.text();
    console.error(ans);
    throw new Error("Failed to update product");
  } else {
    return { result: true };
  }
}

export default apiRoute({
  authChallenge: async (req) => {
    if (!req.cookies.j) {
      return false;
    }
    return true;
  },
  endpoints: {
    GET: {
      func: async (req, res) => {
        return await getProducts({
          authToken: req.cookies.j,
          ean: req.query.ean as string,
          id: Number(req.query.id as string),
          page: Number(req.query.page as string),
          category: req.query.category as string,
          search: req.query.search as string,
          count: req.query.count as string,
        });
      },
    },
    PUT: {
      func: async (req, res) => {
        return await updateProduct({
          authToken: req.cookies.j,
          data: req.body,
          id: Number(req.query.id as string),
        });
      },
    },
    DELETE: {
      func: async (req, res) => {
        return await deleteProduct({
          authToken: req.cookies.j,
          id: Number(req.query.id as string),
        });
      },
    },
  },
});
