import { Image } from "./image";

export interface Category {
  image?: Image;
  id?: number;
  Name?: string;
  headCategory?: Category;
  subCategories?: Category[];
}

export class CategoryConversion {
  public static fromJson(json: string): Category {
    return json as Category;
  }

  public static toJson(value: Category): string {
    return JSON.stringify(value);
  }
}
