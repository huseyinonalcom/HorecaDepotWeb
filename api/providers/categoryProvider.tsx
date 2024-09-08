import  { createContext, useState, useEffect } from "react";
import { Category } from "../interfaces/category";

type CategoryContextType = {
  categories: Category[];
};

export const CategoryContext = createContext<CategoryContextType>({ categories: [] });

const cache = {
  categories: null,
  lastFetch: 0,
};

const CATEGORY_CACHE_TTL = 1000 * 60 * 30;

const fetchCategories = async () => {
  const now = Date.now();

  if (cache.categories && now - cache.lastFetch < CATEGORY_CACHE_TTL) {
    return cache.categories;
  }

  try {
    const response = await fetch("/api/categories/getallcategories?flat=false");
    const data = await response.json();
    cache.categories = data;
    cache.lastFetch = now;
    return data;
  } catch (error) {
  }
};

export const CategoryProvider = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories().then((fetchedCategories) => {
      if (fetchedCategories) {
        setCategories(fetchedCategories);
      }
    });
  }, []);

  return <CategoryContext.Provider value={{ categories }}>{children}</CategoryContext.Provider>;
};
