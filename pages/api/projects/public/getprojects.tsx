import statusText from "../../../../api/statustexts";

const cache = {
  data: null,
  lastFetch: 0,
};

const CATEGORY_CACHE_TTL = 1000 * 60 * 30;

// Function to fetch index slider images data from the API
export async function getProjects() {
  const now = Date.now();

  // Check if cached data is still valid
  if (cache.data && now - cache.lastFetch < CATEGORY_CACHE_TTL) {
    return cache.data;
  }

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

    const fetchImagesUrl = `${process.env.API_URL}/api/projects?${query}`;

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
      cache.lastFetch = now;
      cache.data = fetchImagesAnswer.data;
      return fetchImagesAnswer.data;
    } else {
      throw new Error("Failed to fetch projects data");
    }
  } catch (error) {
    console.error("Error fetching projects data:", error);
    throw error;
  }
}

// API route handler for fetching projects
export default async function handler(req, res) {
  try {
    const indexSliderImagesData = await getProjects();
    return res.status(200).json(indexSliderImagesData);
  } catch (error) {
    return res.status(500).json(statusText[500]);
  }
}
