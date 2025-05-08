import { calculateProductStock } from "../api/utils/calculations/product";
import { getCoverImageUrl } from "../api/utils/getprodcoverimage";
import { sanitizeXml } from "../api/utils/sanitizexml";
import { getProducts } from "./api/products/public/getproducts";

function generateFeed(products) {
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
<g:id>${sanitizeXml(prd.internalCode)}</g:id>
<g:title>${sanitizeXml(prd.categories.at(0).localized_name.nl + " " + (prd.localized_name ? prd.localized_name.nl : prd.name))}</g:title>
<g:description>${sanitizeXml(prd.localized_name ? prd.localized_name.nl : prd.name) + " " + sanitizeXml(prd.localized_description?.nl ?? prd.categories.map((c) => c.localized_name.nl).join(", "))}</g:description>
<g:link>https://www.horecadepot.be/products/${sanitizeXml(prd.categories.at(0).localized_name.nl)}/${sanitizeXml(prd.name)}/${prd.id}</g:link> <g:image_link>https://hdcdn.hocecomv1.com${getCoverImageUrl(prd)}</g:image_link> <g:condition>new</g:condition>
<g:availability>in_stock</g:availability>
<g:price>${prd.value} EUR</g:price>
<g:gtin>${sanitizeXml(prd.supplierCode)}</g:gtin>
<g:quantity>${calculateProductStock(prd)}</g:quantity>

<g:shipping>
<g:country>BE</g:country>
<g:service>Standard</g:service>
<g:price>25 EUR</g:price>
<g:availability>in_stock</g:availability>
<g:quantity>${calculateProductStock(prd)}</g:quantity>
</g:shipping>

<g:shipping>
<g:country>FR</g:country>
<g:service>Standard</g:service>
<g:price>100 EUR</g:price>
<g:availability>in_stock</g:availability>
<g:quantity>${calculateProductStock(prd)}</g:quantity>
</g:shipping>

<g:shipping>
<g:country>NL</g:country>
<g:service>Standard</g:service>
<g:price>100 EUR</g:price>
<g:availability>in_stock</g:availability>
<g:quantity>${calculateProductStock(prd)}</g:quantity>
</g:shipping>

<g:shipping>
<g:country>DE</g:country>
<g:service>Standard</g:service>
<g:price>100 EUR</g:price>
<g:availability>in_stock</g:availability>
<g:quantity>${calculateProductStock(prd)}</g:quantity>
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
  var products = (await getProducts({ query: { page: 1, count: 100000 } }))
    .sortedData;
  const Feed = generateFeed(products);
  res.setHeader("Content-Type", "text/xml");
  res.write(Feed);
  res.end();
  return {};
}

export default function SiteMap() {}
