import { Category } from "../../../../api/interfaces/category";
import statusText from "../../../../api/statustexts";

let cache = {
  0: {
    timeStamp: Date.now(),
    data: null,
  },
};

const CACHE_DURATION = 60 * 60 * 1000;

let categoryCache;

export async function getCategoryFromString({
  category,
}: {
  category: string;
}) {
  const string = decodeURIComponent(category);
  if (cache[string] && Date.now() - cache[string].timestamp < CACHE_DURATION) {
    return cache[string].data;
  }
  try {
    let allCategories = [];
    if (!categoryCache) {
      const response = await fetch(
        `${process.env.API_URL}/api/categories?fields[0]=localized_name&pagination[pageSize]=100`,
        {
          headers: {
            Authorization: `Bearer ${process.env.API_KEY}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      allCategories = data["data"];

      categoryCache = allCategories;

      setTimeout(
        () => {
          categoryCache = null;
        },
        1000 * 60 * 30,
      );
    } else {
      allCategories = categoryCache;
    }

    const answer = allCategories.find((cat) =>
      Object.values(cat.localized_name).includes(string),
    );

    cache[string] = {
      data: answer,
      timestamp: Date.now(),
    };

    return answer;
  } catch (error) {
    return null;
  }
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json(statusText[405]);
  }
  try {
    const { string } = req.query;

    const response = await getCategoryFromString({ category: string });

    if (!response) {
      return res.status(500).json(statusText[500]);
    }

    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json(statusText[500]);
  }
}
