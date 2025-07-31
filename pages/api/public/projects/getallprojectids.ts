import { apiUrl } from "../../../../api/api/constants";
import apiRoute from "../../../../api/api/apiRoute";

const fetchUrl = `${apiUrl}/api/projects`;
const API_KEY = process.env.API_KEY;

export async function getAllProjectIDs(): Promise<number[]> {
  const response = await fetch(fetchUrl, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  const data = await response.json();

  let allIDs: number[] = [];

  data["data"].forEach((element) => {
    allIDs.push(element.id);
  });

  return allIDs;
}

export default apiRoute({
  endpoints: {
    GET: {
      func: async (req, res) => {
        return { result: await getAllProjectIDs() };
      },
    },
  },
});
