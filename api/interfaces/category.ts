import { Image } from "./image";
import { Product } from "./product";

export interface Category {
  image?: Image;
  id?: number;
  Name?: string;
  localized_name?: Record<string, string>;
  headCategory?: Category;
  subCategories?: Category[];
  products_multi_categories?: Product[];
}

export class CategoryConversion {
  public static fromJson(json: string): Category {
    return json as Category;
  }

  public static toJson(value: Category): string {
    return JSON.stringify(value);
  }
}
