import { CategoryConversion } from "../../../../api/interfaces/category";
import statusText from "../../../../api/statustexts";

const fetchUrl = `${process.env.API_URL}/api/categories?populate[headCategory][fields][0]=localized_name&populate[subCategories][fields][0]=localized_name&populate[subCategories][populate][image][fields][0]=url&fields[0]=name&fields[1]=priority&fields[2]=localized_name&populate[image][fields][0]=url&populate[products_multi_categories][fields][0]=id&sort=priority&pagination[pageSize]=100`;

export async function getAllCategoriesFlattened() {
  try {
    const response = await fetch(fetchUrl, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
      },
    });

    if (!response.ok) {
      const answer = await response.json();
      return [];
    }

    const data = await response.json();
    const allCategories = data.data.map(CategoryConversion.fromJson);
    return allCategories;
  } catch (e) {
    return null;
  }
}

export default async function handler(req, res) {
  try {
    const response = await getAllCategoriesFlattened();

    if (!response) {
      return res.status(500).json(statusText[500]);
    }

    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json(statusText[500]);
  }
}
