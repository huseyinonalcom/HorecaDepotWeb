import { getAllProductIDs } from "../api/calls/productCalls";

const URL = "horecadepot.be";

function generateSiteMap(productIDs: number[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
      <url><loc>https://${URL}</loc></url>
      <url><loc>https://${URL}/about</loc></url>
      <url><loc>https://${URL}/contact</loc></url>
      <url><loc>https://${URL}/legal</loc></url>
      <url><loc>https://${URL}/shop/tous</loc></url>
      <url><loc>https://${URL}/projects</loc></url>
      <url><loc>https://${URL}/references</loc></url>
     ${productIDs
       .map((ID) => {
         return `
      <url>
          <loc>https://${URL}/products/${ID}</loc>
      </url>
    `;
       })
       .join("")}
   </urlset>
 `;
}

export async function getServerSideProps({ res }) {
  var productIDs = await getAllProductIDs();
  const sitemap = generateSiteMap(productIDs);
  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();
  return {
    props: {},
  };
}

export default function SiteMap() {}
