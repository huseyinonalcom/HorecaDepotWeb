import { getProducts } from "../api/calls/productCalls";
import { getAllCategoriesFlattened } from "./api/categories/public/getallcategoriesflattened";

const URL = "horecadepot.be";

function generateSiteMap(products, allCategoriesRaw) {
  return `<?xml version="1.0"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
<channel>
<title>HorecaDepot - Merchant Feed</title>
<link>https://www.horecadepot.be</link>
<description>Horeca Furniture</description>
${products
  .filter((prd) => prd.images && prd.images.length > 0)
  .map((prd) => {
    return `
<item>
<g:id>${prd.internalCode}</g:id>
<g:title>${prd.categories.at(0).Name + " " + prd.name}</g:title>
<g:description>${prd.description ?? prd.categories.map((c) => c.Name).join(", ")}</g:description>
<g:link>https://www.horecadepot.be/products/${prd.categories.at(0).Name}/${prd.name}/${prd.id}</g:link> <g:image_link>https://hdapi.huseyinonalalpha.com${prd.images.at(0).url}</g:image_link> <g:condition>new</g:condition>
<g:availability>in stock</g:availability>
<g:price>${prd.value} EUR</g:price>
<g:shipping>

<g:country>BE</g:country>
<g:service>Standard</g:service>
<g:price>20 EUR</g:price>

</g:shipping>
<g:brand>HorecaDepot</g:brand>

</item>
`;
  })
  .join("")}
</channel>
</rss>
 `;
}

export async function getServerSideProps({ res }) {
  var products = (await getProducts({ page: 1, count: 100000 }))[0];
  const allCategoriesRaw = await getAllCategoriesFlattened();
  const sitemap = generateSiteMap(products, allCategoriesRaw);
  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();
  return {};
}

export default function SiteMap() {}
