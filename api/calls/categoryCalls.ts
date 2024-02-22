import { CategoryConversion, Category } from "../interfaces/category";

const API_URL = process.env.API_URL + "/api/";
const API_KEY = process.env.API_KEY;

export async function getCategories(): Promise<Category[]> {
  const fetchUrl = `${API_URL}categories?populate[headCategory][fields][0]=name&populate[subCategories][fields][0]=name&fields[0]=name`;

  const response = await fetch(fetchUrl, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  const data = await response.json();

  const allCategories = data["data"].map(CategoryConversion.fromJson);
  // Create a map for quick access to categories by ID
  const categoryMap = new Map(allCategories.map((cat) => [cat.id, cat]));

  allCategories.forEach((cat) => {
    // Reset subcategories to avoid duplicates
    cat.subCategories = [];
  });
  allCategories.forEach((cat) => {
    // If the category has a headCategory, find the parent and add this category to its subCategories
    if (cat.headCategory) {
      const parent: Category = categoryMap.get(cat.headCategory.id);
      if (parent) {
        parent.subCategories.push(cat);
      }
    }
  });

  // Filter out main categories (those without a headCategory)
  const mainCategories = allCategories.filter((cat) => !cat.headCategory);

  return mainCategories;
}

export async function getAllCategories(): Promise<Category[]> {
  const fetchUrl = `${API_URL}categories?populate[headCategory][fields][0]=name&populate[subCategories][fields][0]=name&fields[0]=name`;

  const response = await fetch(fetchUrl, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  });

  const data = await response.json();

  const allCategories = data["data"].map(CategoryConversion.fromJson);

  return allCategories;
}
