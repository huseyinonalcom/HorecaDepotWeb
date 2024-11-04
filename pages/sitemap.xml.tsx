import { getProducts } from "../api/calls/productCalls";
import { getAllCategoriesFlattened } from "./api/categories/public/getallcategoriesflattened";

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
          <loc>https://${URL}/shop/${cat.Name}?page=1</loc>
      </url>
    `;
        })
        .join("")}
     ${products
       .map((prd) => {
         return `
      <url>
          <loc>https://${URL}/products/${prd.categories.at(0).Name}/${prd.name}/${prd.id}</loc>
      </url>
    `;
       })
       .join("")}
       
   </urlset>
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
