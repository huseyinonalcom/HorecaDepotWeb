import { Category } from "../../../../api/interfaces/category";
import statusText from "../../../../api/statustexts";

let cache = {
  0: {
    timeStamp: Date.now(),
    data: null,
  },
};

const CACHE_DURATION = 60 * 60 * 1000;

export async function getCategoryFromString({ string }: { string: string }) {
  if (cache[string] && Date.now() - cache[string].timestamp < CACHE_DURATION) {
    return cache[string].data;
  }
  try {
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

    const allCategories: Category[] = data["data"];

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
  try {
    const { string } = req.query;
    const response = await getCategoryFromString({ string });

    if (!response) {
      return res.status(500).json(statusText[500]);
    }

    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json(statusText[500]);
  }
}
