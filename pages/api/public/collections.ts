import { apiUrl } from "../../../api/api/constants";
import apiRoute from "../../../api/api/apiRoute";

const fetchUrl = `${apiUrl}/api/product-collections`;
const fetchQuery = `?populate[products][fields][0]=name&populate[products][fields][1]=internalCode&populate[products][fields][2]=color&populate[products][populate][shelves][fields][0]=stock&populate[products][fields][4]=material&populate[products][fields][5]=priceBeforeDiscount&populate[products][fields][6]=value&populate[products][fields][7]=active&populate[products][fields][8]=imageDirections&populate[image][fields][0]=url&populate[products][populate][images][fields][0]=url&populate[products][populate][categories][fields][0]=localized_name&populate[products][populate][product_color][fields][0]=name`;

export async function getCollections({
  id,
  featured,
}: {
  id?: number;
  featured?: boolean;
}) {
  if (id) {
    featured = false;
  }
  const response = await fetch(
    `${fetchUrl}${id ? `/${id}` : ""}${fetchQuery}${
      featured ?? "&filters[featured][$eq]=true"
    }`,
    {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    },
  );

  const data = await response.json();
  return data.data;
}

export default apiRoute({
  endpoints: {
    GET: {
      func: async (req, res) => {
        if (req.query.id) {
          return await getCollections({
            id: Number(req.query.id),
          });
        }
        if (req.query.featured) {
          return await getCollections({
            featured: true,
          });
        } else {
          return await getCollections({});
        }
      },
    },
  },
});
