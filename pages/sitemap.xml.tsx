import { getAllCategories } from "./api/public/categories/getallcategories";
import { getProducts } from "./api/public/products/getproducts";
import { sanitizeXml } from "../api/utils/sanitizexml";

const URL = "horecadepot.be";

function generateSiteMap(products, allCategoriesRaw) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
      <url><loc>https://${URL}</loc></url>
      <url><loc>https://${URL}/about</loc></url>
      <url><loc>https://${URL}/contact</loc></url>
      <url><loc>https://${URL}/legal</loc></url>
      <url><loc>https://${URL}/shop/tous</loc></url>
      <url><loc>https://${URL}/projects</loc></url>
      <url><loc>https://${URL}/references</loc></url>
      ${allCategoriesRaw
        .map((cat) => {
          return `
      <url>
          <loc>https://${URL}/shop/${sanitizeXml(cat.localized_name.en ?? "")}?page=1</loc>
      </url>
    `;
        })
        .join("")}
     ${products
       .map((prd) => {
         return `
      <url>
          <loc>https://${URL}/products/${sanitizeXml(prd.categories.at(0)?.localized_name?.en ?? "")}/${sanitizeXml(prd.name)}/${prd.id}</loc>
      </url>
    `;
       })
       .join("")}
       
   </urlset>
 `;
}

export async function getServerSideProps({ res }) {
  var products = (await getProducts({ query: { page: 1, count: 100000 } }))
    .sortedData;
  const allCategoriesRaw = await getAllCategories({ flat: true });
  const sitemap = generateSiteMap(products, allCategoriesRaw);
  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();
  return {};
}

export default function SiteMap() {}
