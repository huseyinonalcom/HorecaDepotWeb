import { apiUrl } from "../../../../api/api/constants";
import apiRoute from "../../../../api/api/apiRoute";

export async function getProductByID({ id }: { id: number }) {
  const fetchUrl = `${apiUrl}/api/products/${id}?fields[0]=name&fields[1]=depth&fields[2]=productLine&fields[3]=internalCode&fields[4]=priceBeforeDiscount&fields[5]=value&fields[6]=width&fields[7]=height&fields[8]=description&fields[9]=material&fields[10]=color&fields[11]=active&fields[12]=imageDirections&populate[shelves][populate][supplier_order_products][fields][0]=amountOrdered&populate[shelves][populate][supplier_order_products][fields][1]=amountDelivered&populate[images][fields][0]=url&populate[shelves][fields][0]=stock&populate[categories][fields][0]=localized_nam[c&populate[document_products][fields][0]=amount`;

  const response = await fetch(fetchUrl, {
    headers: {
      Authorization: `Bearer ${process.env.API_KEY}`,
    },
  });

  const answer = await response.json();

  const data = answer["data"];

  return { result: data };
}

export default apiRoute({
  endpoints: {
    GET: {
      func: async (req, res) => {
        return await getProductByID({ id: Number(req.query.id) });
      },
    },
  },
});
