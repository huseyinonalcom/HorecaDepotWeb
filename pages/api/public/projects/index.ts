import { apiUrl } from "../../../../api/api/constants";
import apiRoute from "../../../../api/api/apiRoute";

const fetchUrl = `${apiUrl}/api/projects`;

export async function getProjects() {
  try {
    const qs = require("qs");
    const query = qs.stringify({
      filters: {
        featured: true,
      },
      pagination: { page: 1, pageSize: 5 },
      fields: ["title", "description"],
      populate: {
        images: {
          fields: ["url", "name"],
        },
        cover: {
          fields: ["url", "name"],
        },
      },
    });

    const fetchImagesUrl = `${fetchUrl}?${query}`;

    const fetchImagesRequest = await fetch(fetchImagesUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    });

    if (fetchImagesRequest.ok) {
      const fetchImagesAnswer = await fetchImagesRequest.json();
      return fetchImagesAnswer.data;
    } else {
      throw new Error("Failed to fetch projects data");
    }
  } catch (error) {
    console.error("Error fetching projects data:", error);
    throw error;
  }
}

export default apiRoute({
  endpoints: {
    GET: {
      func: async (req, res) => {
        return { result: await getProjects() };
      },
    },
  },
});
