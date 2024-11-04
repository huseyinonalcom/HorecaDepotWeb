import statusText from "../../../../api/statustexts";

const API_URL = `${process.env.API_URL}/api/`;
const API_KEY = process.env.API_KEY;

// Function to fetch index slider images data from the API
export async function getAllProjectIDs(): Promise<number[]> {
  let page: number = 1;
  const fetchUrl = `${API_URL}projects?filters[featured][$eq]=true&fields[0]=id&pagination[pageSize]=100&pagination[page]=${page}`;

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

// API route handler for fetching projects
export default async function handler(req, res) {
  try {
    const indexSliderImagesData = await getAllProjectIDs();
    return res.status(200).json(indexSliderImagesData);
  } catch (error) {
    return res.status(500).json(statusText[500]);
  }
}
