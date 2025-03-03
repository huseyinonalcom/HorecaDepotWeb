import { Category } from "../../../../api/interfaces/category";
import statusText from "../../../../api/statustexts";

let cache = {
  0: {
    timeStamp: Date.now(),
    data: null,
  },
};

const CACHE_DURATION = 60 * 60 * 1000;

export async function getAllSubcategoriesOfCategory({ id }: { id: number }) {
  if (cache[id] && Date.now() - cache[id].timestamp < CACHE_DURATION) {
    return cache[id].data;
  }
  try {
    const response = await fetch(
      `${process.env.API_URL}/api/categories/${id}?populate[subCategories][fields][0]=localized_name&populate[subCategories][populate][subCategories][fields][0]=localized_name&fields[0]=localized_name&populate[products_multi_categories][fields][0]=id&populate[products_multi_categories][fields][1]=active&sort=priority&pagination[pageSize]=100`,
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

    const fetchedCategory: Category = data["data"];

    let answer = [];

    answer.push(fetchedCategory.id);
    answer = answer.concat(fetchedCategory.subCategories.map((cat) => cat.id));

    cache[id] = {
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
    const { id } = req.query;
    const response = await getAllSubcategoriesOfCategory({ id });

    if (!response) {
      return res.status(500).json(statusText[500]);
    }

    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json(statusText[500]);
  }
}
