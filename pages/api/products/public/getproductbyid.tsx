export default async function getProductByID(req, res) {
  const productId = req.query.id;

  try {
    const fetchUrl = `${process.env.API_URL}/api/products/${productId}?fields[0]=name&fields[1]=depth&fields[2]=productLine&fields[3]=internalCode&fields[4]=priceBeforeDiscount&fields[5]=value&fields[6]=width&fields[7]=height&fields[8]=description&fields[9]=material&fields[10]=color&fields[11]=active&fields[12]=imageDirections&populate[shelves][populate][supplier_order_products][fields][0]=amountOrdered&populate[shelves][populate][supplier_order_products][fields][1]=amountDelivered&populate[images][fields][0]=url&populate[shelves][fields][0]=stock&populate[categories][fields][0]=name&populate[document_products][fields][0]=amount`;

    const response = await fetch(fetchUrl, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    });

    const answer = await response.json();

    const data = answer["data"];

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
