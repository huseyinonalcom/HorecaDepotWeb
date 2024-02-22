import { Category, CategoryConversion } from "../../../api/interfaces/category";

let cache = {
  data: null,
  timestamp: Date.now(),
};

const CACHE_DURATION = 15 * 60 * 1000;
const fetchUrl = `${process.env.API_URL}/api/categories?populate[headCategory][fields][0]=name&populate[subCategories][fields][0]=name&fields[0]=name&populate[image][fields][0]=url&sort=priority`;

export default async function handler(req, res) {
  if (cache.data && Date.now() - cache.timestamp < CACHE_DURATION) {
    return res.status(200).json(cache.data);
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

    const allCategories: Category[] = data["data"].map(CategoryConversion.fromJson);

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

    return res.status(200).json(answer);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
