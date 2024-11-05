import { CategoryConversion, Category } from "../interfaces/category";

const API_URL = process.env.API_URL + "/api/";
const API_KEY = process.env.API_KEY;

export async function getCategories(): Promise<Category[]> {
  const fetchUrl = `${API_URL}categories?populate[headCategory][fields][0]=localized_name&populate[subCategories][fields][0]=localized_name&fields[0]=localized_name&pagination[pageSize]=1000`;

  const response = await fetch(fetchUrl, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  const data = await response.json();

  const allCategories = data["data"].map(CategoryConversion.fromJson);
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

  return mainCategories;
}