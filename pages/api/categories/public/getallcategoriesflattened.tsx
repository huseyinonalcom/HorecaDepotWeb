import { CategoryConversion } from "../../../../api/interfaces/category";
import statusText from "../../../../api/statustexts";

const fetchUrl = `${process.env.API_URL}/api/categories?populate[headCategory][fields][0]=name&populate[subCategories][fields][0]=name&populate[subCategories][populate][image][fields][0]=url&fields[0]=name&fields[1]=priority&populate[image][fields][0]=url&sort=priority&pagination[pageSize]=100`;

export async function getAllCategoriesFlattened() {
  const response = await fetch(fetchUrl, {
    headers: {
      Authorization: `Bearer ${process.env.API_KEY}`,
    },
  });

  try {
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
