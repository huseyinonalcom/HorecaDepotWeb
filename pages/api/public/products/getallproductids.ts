import { apiUrl } from "../../../../api/api/constants";

export async function getAllProductIDs(): Promise<number[]> {
  let page: number = 1;
  const fetchUrl = `${apiUrl}products?filters[active][$eq]=true&filters[deleted][$eq]=false&fields[0]=id&pagination[pageSize]=100&pagination[page]=${page}`;

  const response = await fetch(fetchUrl, {
    headers: {
      Authorization: `Bearer ${process.env.API_KEY}`,
    },
  });
  const data = await response.json();

  let allIDs: number[] = [];

  data["data"].forEach((element) => {
    allIDs.push(element.id);
  });

  if (data["meta"]["pagination"]["total"] > page) {
    for (let i: number = 2; i < data["meta"]["pagination"]["total"]; i++) {
      const fetchUrlP = `${apiUrl}products?filters[active][$eq]=true&filters[deleted][$eq]=false&fields[0]=id&pagination[pageSize]=100&pagination[page]=${i}`;
      const responseP = await fetch(fetchUrlP, {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
        },
      });
      const dataP = await responseP.json();
      dataP["data"].forEach((element) => {
        allIDs.push(element.id);
      });
    }
  }
  return allIDs;
}
