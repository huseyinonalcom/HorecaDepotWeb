import { apiUrl } from "../../../../api/api/constants";
import apiRoute from "../../../../api/api/apiRoute";

const endpointUrl = `${apiUrl}/api/projects`;

export async function getProjects({ id }: { id?: number } = {}) {
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

    const requestUrl = id
      ? `${endpointUrl}/${id}?${query}`
      : `${endpointUrl}?${query}`;

    const request = await fetch(requestUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    });

    if (request.ok) {
      const response = await request.json();
      return response.data;
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
        return { result: await getProjects({ id: Number(req.query.id) }) };
      },
    },
  },
});
