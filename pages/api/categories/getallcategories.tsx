import { Category, CategoryConversion } from "../../../api/interfaces/category";
import statusText from "../../../api/statustexts";

let cache = {
  data: null,
  timestamp: Date.now(),
};

const CACHE_DURATION = 15 * 60 * 1000;
const fetchUrl = `${process.env.API_URL}/api/categories?populate[headCategory][fields][0]=localized_name&populate[subCategories][fields][0]=localized_name&fields[0]=localized_name&fields[1]=code&fields[2]=localized_name&populate[image][fields][0]=url&populate[products_multi_categories][fields][0]=id&populate[products_multi_categories][fields][1]=active&sort=priority&pagination[pageSize]=100`;

export async function getAllCategories() {
  if (cache.data && Date.now() - cache.timestamp < CACHE_DURATION) {
    return cache.data;
  }
  try {
    const response = await fetch(fetchUrl, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    const allCategories: Category[] = data["data"];

    const categoryMap = new Map(allCategories.map((cat) => [cat.id, cat]));

    allCategories.forEach((cat) => {
      cat.subCategories = [];
    });
    allCategories.forEach((cat) => {
      if (cat.headCategory) {
        const parent: Category = categoryMap.get(cat.headCategory.id);
        if (parent) {
          parent.subCategories.push(cat);
        }
      }
    });

    const mainCategories = allCategories.filter((cat) => !cat.headCategory);

    const answer = [];

    mainCategories.forEach((cat) => answer.push(cat));

    cache = {
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
    const response = await getAllCategories();

    if (!response) {
      return res.status(500).json(statusText[500]);
    }

    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json(statusText[500]);
  }
}
